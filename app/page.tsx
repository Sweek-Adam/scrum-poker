import { JoinForm } from "@/components/JoinForm";
import { ConfigWarning } from "@/components/ConfigWarning";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
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
      <header className="flex items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Sweek-Adam/scrum-poker"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-fg-muted underline-offset-4 transition hover:text-fg hover:underline"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </header>

      <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.1fr_minmax(0,0.9fr)] lg:gap-16">
        <section>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1
            text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            <span className="size-1.5 rounded-full bg-success" />
            Planning poker en ligne
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Estimez ensemble,
            <br />
            <span className="bg-gradient-to-r from-grad-from to-grad-to bg-clip-text text-transparent">
              révélez d&apos;un geste.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">
            Un pseudo, un code de salle, et toute l&apos;équipe vote en même temps. Chacun peut révéler,
            réinitialiser ou vider la salle — personne n&apos;attend après un animateur.
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {HIGHLIGHTS.map(({ Icon, ...item }) => (
              <li key={item.title} className="glass rounded-2xl p-4">
                <span className="grid size-9 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon />
                </span>
                <p className="mt-3 font-display font-semibold">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-fg-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass grain rounded-3xl p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold">Rejoindre la table</h2>
          <p className="mt-1 mb-6 text-sm text-fg-muted">
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

      <footer className="border-t border-line pt-6 text-sm text-fg-subtle">
        Aucun compte, aucune donnée stockée — tout vit le temps de la session.
      </footer>
    </main>
  );
}
