import { notFound } from "next/navigation";
import { RoomView } from "@/components/RoomView";
import { normalizeRoomCode } from "@/lib/room-code";

export const metadata = { title: "Salle · Scrum Poker" };

export default async function RoomPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const normalized = normalizeRoomCode(decodeURIComponent(code));
  if (!normalized) notFound();
  return <RoomView code={normalized} />;
}
