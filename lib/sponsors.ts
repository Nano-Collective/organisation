export interface SponsorLink {
  label: string;
  href: string;
  primary?: boolean;
}

export interface Sponsor {
  name: string;
  url: string;
  // White wordmark for dark mode, black wordmark for light mode.
  logoLight: string;
  logoDark: string;
  // Shown in the dialog that opens when the logo is clicked.
  description: string;
  promo?: string;
  links: SponsorLink[];
}

// Builder tier displays 3 slots on the sponsor page, Supporter tier 4. Real
// sponsors fill from the start; remaining slots render as open placeholders.
export const builderSponsors: Sponsor[] = [];

export const supporterSponsors: Sponsor[] = [];

// All sponsors, highest tier first, for surfaces that list everyone together
// (e.g. the homepage "Supported by" section).
export const allSponsors: Sponsor[] = [
  ...builderSponsors,
  ...supporterSponsors,
];
