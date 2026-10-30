export type PortfolioCard = {
  id: string;
  index: string;
  label: string;
  title: string;
  tone: "primary" | "paper" | "dark";
  glyph: string;
  intro: string;
  comingSoon?: boolean;
  items: { k: string; v: string; href?: string }[];
};

export const cards: PortfolioCard[] = [
  {
    id: "about",
    index: "01",
    label: "Player 1",
    title: "About Me",
    tone: "primary",
    glyph: "☻",
    intro:
      "First-year Physical Science undergraduate. Curious about how things work — from mathematical patterns to the stories hidden in data — and learning to build things with code along the way.",
    items: [
      { k: "Level", v: "Year 1 · B.Sc. Physical Science" },    
    
      { k: "Quest", v: "mathematics and statistics × computing" },
    ],
  },
  {
    id: "projects",
    index: "02",
    label: "Side Quests",
    title: "Projects",
    tone: "dark",
    glyph: "▲",
    intro: "Small builds and simulations. Every big project starts as a tiny one.",
    items: [
      { k: "Sim", v: "Comming soon" },
      { k: "Data", v: "Comming soon" },
      { k: "Web", v: "This portfolio" },
    ],
  },
  {
    id: "journal",
    index: "03",
    label: "Logbook",
    title: "Journal",
    tone: "primary",
    glyph: "✎",
    comingSoon: true,
    intro: "Weekly notes on what I'm learning, lab mishaps and ideas worth keeping. The scribe is still writing…",
    items: [
      { k: "Week 08", v: "Why the pendulum lied to me" },
      { k: "Week 06", v: "First time using LaTeX" },
      { k: "Week 03", v: "Starting university" },
    ],
  },
  {
    id: "skills",
    index: "04",
    label: "Inventory",
    title: "Skills",
    tone: "paper",
    glyph: "◆",
    intro: "Current loadout. Levelling up every week.",
    items: [
      { k: "LV 1", v: "Python" },
      { k: "LV 0", v: "statistical analysis" },
      { k: "LV 2", v: " scientific writing" },
      { k: "LV 3", v: "mathematical thinking" },
    ],
  },
  {
    id: "contact",
    index: "05",
    label: "Save Point",
    title: "Contact",
    tone: "dark",
    glyph: "✉",
    intro: "Open to study groups, research assistant roles and fun collaborations.",
    items: [
      { k: "Email", v: "alwiskavisha@gmail.com", href: "mailto:alwiskavisha@gmail.com" },
      { k: "GitHub", v: "github.com/kkkalwis", href: "https://github.com/kkkalwis" },
      { k: "LinkedIn", v: "linkedin.com/in/kavisha-alwis-342978368", href: "https://linkedin.com/in/kavisha-alwis-342978368" },
    ],
  },
];
