# ScrumPoker

Planning poker en temps réel. Un pseudo, un code de salle, et toute l'équipe estime ensemble.

- **Temps réel** via Supabase Realtime — les votes apparaissent instantanément.
- **Aucun compte, aucune base** : les participants vivent dans un canal *Presence*, l'état de la salle
  transite par *Broadcast*. Il n'y a **aucune table SQL à créer** et rien n'est persisté côté serveur.
- **Pas d'animateur** : tout le monde peut révéler, cacher, relancer un tour ou vider la salle.
- **Deck paramétrable** : presets Fibonacci / T-shirt / jours / puissances de 2, ou tes propres valeurs.
  Les cartes `?` (je ne sais pas) et `☕` (pause) sont incluses par défaut et comptées comme abstentions —
  elles n'entrent pas dans la moyenne ni dans l'écart.
- **Thème clair et sombre**, suivant le réglage du système, avec un bouton pour forcer l'un ou l'autre.
- **Code QR** dans l'en-tête de la salle : les collègues scannent et arrivent sur la table, sans rien taper.

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

   > **Project URL = l'origine seule**, par ex. `https://abcdefgh.supabase.co`. Le bouton *Connect* du
   > dashboard propose aussi l'endpoint REST (`.../rest/v1`) : collé tel quel, il enverrait le WebSocket
   > Realtime sur `/rest/v1/realtime/v1/...` et la connexion serait refusée. L'app ramène désormais
   > l'URL à son origine, donc les deux formes passent.

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

## Accessibilité

Les deux thèmes respectent **WCAG 2.1 niveau AA** : 4.5:1 pour le texte, 3:1 pour les contours de champs
et les anneaux de focus. Les couleurs ne vivent pas dans les composants mais dans une couche de tokens
(`app/globals.css`) : `--fg`, `--fg-muted`, `--panel`, `--field`… redéfinis une fois par thème. Pour
ajouter une couleur, vérifie le ratio d'abord — quelques labels se promenaient à 3.21:1 et personne ne
l'avait vu.

Au-delà du contraste :

- Aucune information n'est portée par la couleur seule — la carte choisie a une pastille ✓, la valeur
  majoritaire a une étiquette « majorité », chaque siège annonce son état en texte pour les lecteurs
  d'écran.
- Le graphe des votes est `aria-hidden` et doublé d'une liste lisible.
- Le code QR est toujours noir sur blanc, dans les deux thèmes : un QR inversé est refusé par beaucoup
  de scanners. Il est doublé du code de salle et de l'URL en clair, parce qu'un lecteur d'écran ne peut
  pas lire un QR et que tout le monde n'a pas un téléphone sous la main.
- `prefers-reduced-motion` coupe les auroras animées et le retournement des cartes ;
  `prefers-contrast: more` raffermit les bordures et supprime les nuances de gris.
- La perte de connexion est annoncée via `aria-live`, pas seulement recolorée.

Le thème est posé par un script inline dans `<head>` (voir `lib/theme.ts`), donc la bonne palette est
peinte dès la première image — sans choix enregistré, c'est `prefers-color-scheme` qui décide.

## Scripts

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Sert le build |
| `npm run typecheck` | `tsc --noEmit` |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · `@supabase/supabase-js`
