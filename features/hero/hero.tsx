import { site } from "@/lib/site";
import { HeroConstellation } from "./hero-constellation";
import { HeroConsole } from "./hero-console";

/**
 * S1 Hero - an "inference console". On load a model (default "Bilal Core")
 * answers "What do you build?"; then it becomes a guided tour - each model has
 * a series of scope-specific questions that auto-type into the input for the
 * visitor to send, with the answer streaming in as cards. Switching models
 * keeps the transcript but pulls the next questions from that model's scope.
 * The app-level boot overlay (BootWow) runs first; the tour starts once it
 * signals done. A hidden H1 keeps the page's semantic heading stable for SEO.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh scroll-mt-20 flex-col items-center justify-start px-6 pt-6 sm:pt-10"
    >
      <h1 className="sr-only">
        {site.person} - {site.title}
      </h1>
      <HeroConstellation />
      <HeroConsole />
    </section>
  );
}
