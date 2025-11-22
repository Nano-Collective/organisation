/**
 * Contributors Data Structure
 *
 * To add yourself as a contributor:
 * 1. Add your photo to /public/contributors/ directory (recommended: 400x400px)
 * 2. Add your entry to the CONTRIBUTORS array below
 * 3. Follow the Contributor type structure
 * 4. Submit a pull request!
 */

export interface Contributor {
  /** Your full name or preferred display name */
  name: string;

  /** Path to your photo in /public/contributors/ directory (e.g., "yourname.jpg") */
  photo: string;

  /** Your GitHub username (without the @ symbol) */
  github?: string;

  /** Your personal website URL (optional, full URL including https://) */
  website?: string;

  /** Brief description of your contributions (optional) */
  bio?: string;
}

/**
 * Contributors Array
 *
 * Add your entry here in alphabetical order by first name.
 * Make sure your photo exists in /public/contributors/ before submitting!
 */
export const CONTRIBUTORS: Contributor[] = [
  // Example entry (remove this and add real contributors):
  // {
  //   name: "Jane Doe",
  //   photo: "janedoe.jpg",
  //   github: "janedoe",
  //   website: "https://janedoe.com",
  //   bio: "Full-stack developer passionate about open source AI tools"
  // },
  {
    name: "Will Lamerton",
    photo: "will-lamerton.jpg",
    github: "will-lamerton",
    bio: "Founder of the Nano Collective, building open-source AI tools for everyone.",
  },
  {
    name: "Matthew Spence",
    photo: "matthew-spence.jpg",
    github: "mrspence",
    bio: "Founder of the Nano Collective, building open-source AI tools for everyone.",
  },
  {
    name: "Alexandru Spînu",
    photo: "alexandru-spinu.jpg",
    website: "https://alexspinu.eu/",
    bio: "Software Engineer, leveraging 12 years of full-stack experience for the web & developer tooling. Passionate about AI/ML",
  },
  {
    name: "Deniz Okcu",
    photo: "deniz.png",
    github: "DenizOkcu",
    bio: "Deniz is working on mobile and browser games. In his free time he enjoys building AI-powered productivity tools.",
  },
  {
    name: "Brijesh K R",
    photo: "brijesh-k-r.png",
    github: "Avtrkrb",
    bio: "Co-founder & Technology Head at Kashylitics, passionate about building production-grade AI systems and developer tooling."
  }
];
