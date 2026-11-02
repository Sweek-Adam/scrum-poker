"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { DEFAULT_DECK } from "./deck";

export type Participant = {
  id: string;
  name: string;
  vote: string | null;
  joinedAt: number;
};

export type RoomState = {
  revealed: boolean;
  deck: string[];
};

export type Status = "connecting" | "live" | "error";

const DEFAULT_STATE: RoomState = { revealed: false, deck: DEFAULT_DECK };

type Broadcast =
  | { event: "room_state"; payload: RoomState & { at: number } }
  | { event: "reset"; payload: Record<string, never> }
  | { event: "clear"; payload: Record<string, never> }
  | { event: "request_state"; payload: { from: string } };

export function useRoom(code: string, name: string) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [state, setState] = useState<RoomState>(DEFAULT_STATE);
  const [status, setStatus] = useState<Status>("connecting");
  const [myVote, setMyVote] = useState<string | null>(null);

  const clientId = useMemo(
    () => (typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).slice(2)),
    [],
  );
  const joinedAt = useMemo(() => Date.now(), []);

  const channelRef = useRef<RealtimeChannel | null>(null);
  // Refs keep the broadcast handlers free of stale closures without re-subscribing.
  const nameRef = useRef(name);
  const voteRef = useRef<string | null>(null);
  const stateRef = useRef(state);
  const participantsRef = useRef(participants);
  const stateAtRef = useRef(0);

  nameRef.current = name;
  stateRef.current = state;
  participantsRef.current = participants;

  const track = useCallback(
    (vote: string | null) => {
      voteRef.current = vote;
      setMyVote(vote);
      void channelRef.current?.track({ id: clientId, name: nameRef.current, vote, joinedAt });
    },
    [clientId, joinedAt],
  );

  /** No host: the longest-connected member answers a newcomer's state request. */
  const isStateKeeper = useCallback(() => {
    const ordered = [...participantsRef.current].sort(
      (a, b) => a.joinedAt - b.joinedAt || a.id.localeCompare(b.id),
    );
    return ordered.length === 0 || ordered[0]?.id === clientId;
  }, [clientId]);

  const publishState = useCallback((next: RoomState) => {
    const at = Date.now();
    stateAtRef.current = at;
    setState(next);
    void channelRef.current?.send({ type: "broadcast", event: "room_state", payload: { ...next, at } });
  }, []);

  useEffect(() => {
    if (!code) return;

    const channel = supabase.channel(`poker:${code}`, {
      config: { presence: { key: clientId }, broadcast: { self: false } },
    });
    channelRef.current = channel;

    channel.on("presence", { event: "sync" }, () => {
      const presence = channel.presenceState<Participant>();
      const people = Object.values(presence)
        .map((entries) => entries[0])
        .filter((entry): entry is Participant & { presence_ref: string } => Boolean(entry?.id))
        .map(({ id, name: who, vote, joinedAt: at }) => ({ id, name: who, vote, joinedAt: at }))
        .sort((a, b) => a.joinedAt - b.joinedAt);
      setParticipants(people);
    });

    channel.on("broadcast", { event: "room_state" }, ({ payload }) => {
      const incoming = payload as RoomState & { at: number };
      // Last write wins, so two simultaneous reveals cannot leave clients split.
      if (incoming.at < stateAtRef.current) return;
      stateAtRef.current = incoming.at;
      setState({ revealed: incoming.revealed, deck: incoming.deck });
    });

    channel.on("broadcast", { event: "reset" }, () => {
      stateAtRef.current = Date.now();
      setState((prev) => ({ ...prev, revealed: false }));
      track(null);
    });

    channel.on("broadcast", { event: "clear" }, () => {
      stateAtRef.current = Date.now();
      setState(DEFAULT_STATE);
      track(null);
    });

    channel.on("broadcast", { event: "request_state" }, () => {
      if (!isStateKeeper()) return;
      void channel.send({
        type: "broadcast",
        event: "room_state",
        payload: { ...stateRef.current, at: stateAtRef.current || Date.now() },
      });
    });

    channel.subscribe((channelStatus) => {
      if (channelStatus === "SUBSCRIBED") {
        setStatus("live");
        void channel.track({ id: clientId, name: nameRef.current, vote: null, joinedAt });
        void channel.send({ type: "broadcast", event: "request_state", payload: { from: clientId } });
      } else if (channelStatus === "CHANNEL_ERROR" || channelStatus === "TIMED_OUT") {
        setStatus("error");
      }
    });

    return () => {
      channelRef.current = null;
      void supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, clientId, joinedAt]);

  // Renaming mid-session should show up for everyone.
  useEffect(() => {
    if (status !== "live") return;
    void channelRef.current?.track({ id: clientId, name, vote: voteRef.current, joinedAt });
  }, [name, status, clientId, joinedAt]);

  const vote = useCallback((value: string) => track(voteRef.current === value ? null : value), [track]);

  const toggleReveal = useCallback(() => {
    publishState({ ...stateRef.current, revealed: !stateRef.current.revealed });
  }, [publishState]);

  const resetVotes = useCallback(() => {
    stateAtRef.current = Date.now();
    setState((prev) => ({ ...prev, revealed: false }));
    track(null);
    void channelRef.current?.send({ type: "broadcast", event: "reset", payload: {} });
  }, [track]);

  const clearRoom = useCallback(() => {
    stateAtRef.current = Date.now();
    setState(DEFAULT_STATE);
    track(null);
    void channelRef.current?.send({ type: "broadcast", event: "clear", payload: {} });
  }, [track]);

  const setDeck = useCallback(
    (deck: string[]) => publishState({ revealed: false, deck }),
    [publishState],
  );

  return {
    clientId,
    participants,
    revealed: state.revealed,
    deck: state.deck,
    myVote,
    status,
    vote,
    toggleReveal,
    resetVotes,
    clearRoom,
    setDeck,
  };
}
