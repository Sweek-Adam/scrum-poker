# ScrumPoker

Planning poker en temps réel. Un pseudo, un code de salle, et toute l'équipe estime ensemble.

- **Temps réel** via Supabase Realtime — les votes apparaissent instantanément.
- **Aucun compte, aucune base** : les participants vivent dans un canal *Presence*, l'état de la salle
  transite par *Broadcast*. Il n'y a **aucune table SQL à créer** et rien n'est persisté côté serveur.
- **Pas d'animateur** : tout le monde peut révéler, cacher, relancer un tour ou vider la salle.
- **Deck paramétrable** : presets Fibonacci / T-shirt / jours / puissances de 2, ou tes propres valeurs.
  Les cartes `?` (je ne sais pas) et `☕` (pause) sont incluses par défaut et comptées comme abstentions —
  elles n'entrent pas dans la moyenne ni dans l'écart.

## Démarrer en local

```bash
npm install
cp .env.example .env.local   # puis renseigne les deux variables
npm run dev
```

Sans les variables d'environnement l'app démarre quand même, mais affiche un bandeau et le temps réel
est inactif.

## Configurer Supabase (2 minutes)

1. Crée un projet gratuit sur [supabase.com](https://supabase.com/dashboard) (connexion GitHub possible).
2. Va dans **Settings → API Keys**
   (`https://supabase.com/dashboard/project/<ton-projet>/settings/api-keys`) et récupère deux valeurs :

   | Valeur | Où exactement |
   | --- | --- |
   | **Project URL** | Onglet *Data API*, champ « Project URL » |
   | **Publishable key** | Onglet *API Keys*, section « Publishable key » — commence par `sb_publishable_` |

   > **Tu cherches la clé `anon` et tu ne la trouves pas ?** Elle a été déplacée : elle vit désormais
   > sous l'onglet **« Legacy API Keys »**. La *publishable key* la remplace et fonctionne à l'identique
   > ici. Si aucune publishable key n'existe encore, clique sur **Create new API keys**.

3. Renseigne-les dans `.env.local` :

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxx
   ```

Rien d'autre : pas de table, pas de policy RLS. Cette clé est **publique par conception** — elle est
livrée dans le bundle JavaScript envoyé au navigateur, donc la voir n'est pas une fuite. Ne jamais
confondre avec la *secret key* / `service_role`, qui ne doit jamais sortir d'un serveur.

> Realtime est actif par défaut sur les nouveaux projets. Si les votes ne circulent pas, vérifie dans
> **Project Settings → Realtime** que la fonctionnalité est activée.

## Déployer sur Vercel

1. Importe le dépôt sur [vercel.com/new](https://vercel.com/new).
2. Ajoute les deux variables `NEXT_PUBLIC_SUPABASE_*` dans **Settings → Environment Variables**
   (Production, Preview et Development).
3. Déploie. Aucune autre configuration n'est nécessaire.

## Comment ça marche

| Mécanisme | Rôle |
| --- | --- |
| Supabase **Presence** | La liste des participants et leur vote. Un onglet fermé disparaît tout seul — c'est pourquoi aucune session fantôme ne persiste. |
| Supabase **Broadcast** | L'état partagé de la salle : votes révélés ou non, valeurs du deck. |
| Handshake `request_state` | À l'arrivée, un client demande l'état courant ; le participant connecté depuis le plus longtemps répond. Il n'y a donc pas de serveur ni d'hôte désigné. |

Chaque message d'état porte un horodatage et le dernier écrit l'emporte, pour que deux « Révéler »
simultanés ne laissent personne désynchronisé.

### Les trois actions partagées

- **Révéler / Cacher les votes** — bascule l'affichage pour tout le monde.
- **Nouveau tour** — efface les votes et re-cache les cartes, le deck est conservé.
- **Vider la salle** — remise à zéro complète : votes effacés **et** deck remis aux valeurs par défaut.
  Demande une confirmation.

## Scripts

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Sert le build |
| `npm run typecheck` | `tsc --noEmit` |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · `@supabase/supabase-js`
