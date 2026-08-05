import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The design system defines its own `text-*` typography scale in `index.css`
 * (`text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body-lg`,
 * `text-label`, `text-caption`) alongside custom `text-*` colour utilities.
 *
 * Stock tailwind-merge classifies every unrecognised `text-*` token as a colour
 * and drops all but the last one, so `cn('text-h2', 'text-ink')` silently
 * resolved to just `text-ink` — which rendered every section heading at 16px.
 * Registering both groups explicitly keeps a size and a colour together.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display", "h1", "h2", "h3", "body", "body-lg", "label", "caption"] },
      ],
      "text-color": [
        {
          text: [
            "paper",
            "ink",
            "muted",
            "accent",
            "secondary",
            "brand-green",
            "brand-navy",
            "hair-accent",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
