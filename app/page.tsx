import { JoinForm } from "@/components/JoinForm";
import { ConfigWarning } from "@/components/ConfigWarning";
import { Logo } from "@/components/Logo";
import { BoltIcon, CardsIcon, KeyIcon } from "@/components/Icons";
import { isConfigured } from "@/lib/supabase";

const HIGHLIGHTS = [
  { Icon: BoltIcon, title: "Temps réel", text: "Les votes arrivent instantanément, sans rechargement." },
  { Icon: CardsIcon, title: "Deck réglable", text: "Fibonacci, T-shirt, jours… ou tes propres valeurs." },
  { Icon: KeyIcon, title: "Zéro compte", text: "Un pseudo suffit. Rien à installer, rien à créer." },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-6xl flex-col px-4 py-8 sm:px-6">
      <header className="flex items-center justify-between">
        <Logo />
        <a
          href="https://github.com/Sweek-Adam/scrum-poker"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-white/45 transition hover:text-white/80"
        >
          GitHub
        </a>
      </header>

      <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.1fr_minmax(0,0.9fr)] lg:gap-16">
        <section>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1
            text-xs font-medium uppercase tracking-[0.14em] text-accent-300">
            <span className="size-1.5 rounded-full bg-mint-400" />
            Planning poker en ligne
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Estimez ensemble,
            <br />
            <span className="bg-gradient-to-r from-accent-400 via-accent-300 to-sky-cyan bg-clip-text text-transparent">
              révélez d&apos;un geste.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/55">
            Un pseudo, un code de salle, et toute l&apos;équipe vote en même temps. Chacun peut révéler,
            réinitialiser ou vider la salle — personne n&apos;attend après un animateur.
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {HIGHLIGHTS.map(({ Icon, ...item }) => (
              <li key={item.title} className="glass rounded-2xl p-4">
                <span className="grid size-9 place-items-center rounded-xl bg-accent-500/15 text-accent-300">
                  <Icon />
                </span>
                <p className="mt-3 font-display font-semibold">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/50">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass grain rounded-3xl p-6 shadow-2xl shadow-black/40 sm:p-8">
          <h2 className="font-display text-2xl font-semibold">Rejoindre la table</h2>
          <p className="mt-1 mb-6 text-sm text-white/45">
            Partage ensuite l&apos;URL de la salle à ton équipe.
          </p>
          {isConfigured ? null : (
            <div className="mb-6">
              <ConfigWarning />
            </div>
          )}
          <JoinForm />
        </section>
      </div>

      <footer className="border-t border-white/5 pt-6 text-sm text-white/30">
        Aucun compte, aucune donnée stockée — tout vit le temps de la session.
      </footer>
    </main>
  );
}
