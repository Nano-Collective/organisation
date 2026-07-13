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

  /** Set to true if you're a member of the core team. Displays an emerald "Core Team" badge. */
  coreTeam?: boolean;

  /**
   * Areas you focus on, shown as small tags on your card. These describe what you
   * help with, not a job title or rank: the Nano Collective has no formal hierarchy.
   * Mainly used by the core team so people know who to approach about what. Keep
   * them short and functional, e.g. ["Engineering", "Community", "Writing"].
   */
  focus?: string[];
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
    coreTeam: true,
    focus: ["Engineering", "Direction"],
  },
  {
    name: "Matthew Spence",
    photo: "matthew-spence.jpg",
    github: "mrspence",
    bio: "First core team member of the Nano Collective, building open-source AI tools for everyone.",
    coreTeam: true,
    focus: ["Engineering"],
  },
  {
    name: "Ben Parry",
    photo: "ben-parry.jpeg",
    website: "https://substack.com/@followbenparry",
    bio: "I write about sovereignty, decentralisation, and the revolt against cloud-controlled intelligence.",
    coreTeam: true,
    focus: ["Community", "Advocacy"],
  },
  {
    name: "Sk Akram",
    photo: "sk-akram.jpg",
    github: "akramcodez",
    website: "https://www.akramcodez.tech/",
    bio: "19 y/o Software Developer ッ",
    coreTeam: true,
    focus: ["Engineering"],
  },
  {
    name: "Lottie Oxford",
    photo: "lottie-oxford.JPEG",
    bio: "Helps with the community behind the Nano Collective. Passionate about building in open source and AI.",
    coreTeam: true,
    focus: ["Community"],
  },
  {
    name: "Brijesh K R",
    photo: "brijesh-k-r.png",
    github: "Avtrkrb",
    bio: "Co-founder & Technology Head at Kashylitics, passionate about building production-grade AI systems and developer tooling.",
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
    name: "Dhirender Choudhary",
    photo: "dhirender-choudhary.png",
    github: "Dhirenderchoudhary",
    website: "https://dhirenderchoudhary.com/",
    bio: "Building scalable backends & cloud systems ⚙️ Node.js • APIs • DevOps • Open Source",
  },
  {
    name: "EntropyParadigm",
    photo: "entropyparadigm.png",
    github: "EntropyParadigm",
    bio: "Contributing to Nanocoder and open-source AI developer tooling.",
  },
  {
    name: "Caleb Grenko",
    photo: "grenko_caleb.jpg",
    github: "grenkoca",
    bio: "MD-PhD trainee/computational biologist with a dream of democratized AI and a love of exploring the unknown.",
  },
  {
    name: "Nassim Amar",
    photo: "nassim-amar.jpg",
    github: "namar0x0309",
    website: "https://blog.namar0x0309.com/",
    bio: "Founder @PoezInc and @GoAIX, passionate about technically advanced tools that also feel and look good like Nanocoder!",
  },
  {
    name: "Ragini Pandey",
    photo: "ragini-pandey.jpg",
    github: "ragini-pandey",
    website: "https://ragini-pandey.github.io/",
  },
  {
    name: "cleyesode",
    photo: "cleyesode.jpg",
    github: "cleyesode",
    bio: "Local-first, eyes closed, open development.",
  },
  {
    name: "lordoski",
    photo: "lordoski.jpg",
    github: "lordoski",
    bio: "I write colorful text on dark screens for a living.",
  },
  {
    name: "Tionne Smith",
    photo: "tionne-smith.png",
    github: "electricwolfemarshmallowhypertext/",
    website: "https://electricwolfemarshmallowhypertext.xyz",
    bio: "Creative Technologist and Solutions Architect",
  },
  {
    name: "Aravind Induri",
    photo: "aravind_induri.jpeg",
    github: "aravindinduri",
    website: "https://builtbyaravind.vercel.app/",
    bio: "just a curious developer",
  },
  {
    name: "Indigo Karasu",
    photo: "indigo-karasu.jpg",
    github: "indigokarasu",
    website: "https://indigokarasu.com",
    bio: "Open-source contributor. Built with purpose, maintained with care.",
    focus: ["Engineering", "AI"],
  },
  {
    name: "Om Yewale",
    photo: "om.jpg",
    github: "OMEE-Y",
    website: "https://omeey.vercel.app/",
    bio: "Full Stack Developer",
  },
  {
    name: "Rakshith N",
    photo: "rakshithn.jpg",
    github: "rakshith1928",
    bio: "Learning, building, and contributing.",
  },
  {
    name: "Ishant Gupta",
    photo: "ishant-gupta.jpg",
    github: "itsishant",
    website: "https://www.modakk.tech/",
    bio: "Software Engineer",
  },
  {
    name: "Jianzhou Xu",
    photo: "jianzhou-xu.jpeg",
    github: "2409324124",
    bio: "Contributor focused on Chinese developer communities and the Chinese LLM ecosystem, with hands-on knowledge of major Chinese model providers and their strengths.",
  },
  {
    name: "Ravi Arnan",
    photo: "ravi-arnan.jpg",
    github: "ravi-arnan",
    website: "https://github.com/ravi-arnan",
    bio: "Full-stack dev who daily-drives Zorin OS and contributes to open source.",
    focus: ["Linux", "AI"],
  },
];
