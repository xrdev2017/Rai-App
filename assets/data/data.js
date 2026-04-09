// export const onboardingInfo = [
//   {
//     id: 1,
//     title: "Get Started with Smarter Style",
//     subtitle:
//       "Organize your wardrobe, discover AI curated outfits, and shop the latest trends all in one app",
//     image: require("../images/onboarding1.webp"),
//     showLoginButtons: false,
//     isFinal: true,
//   },
//   {
//     id: 2,
//     title: "Your AI Stylist & Personal Shopper",
//     subtitle: "Outfit ideas and smart shopping made just for you.",
//     image: require("../images/onboarding2.webp"),
//     showLoginButtons: false,
//     isAI: true,
//   },

//   {
//     id: 3,
//     title: "Style It, Shop It, Share It",
//     subtitle:
//       "Plan outfits, shop new pieces, and connect with the style community.",
//     image: require("../images/onboarding3.webp"),

//     showLoginButtons: true,
//   },
// ];

import i18n from "../../src/utils/languageSetup"
export const onboardingInfo = [
  {
    id: 1,
    titleKey: "onboarding.title1",
    subtitleKey: "onboarding.subtitle1",
    image: require("../images/onboarding1.png"),
    showLoginButtons: false,
    isFinal: true
  },
  {
    id: 2,
    titleKey: "onboarding.title2",
    subtitleKey: "onboarding.subtitle2",
    image: require("../images/onboarding2.png"),
    showLoginButtons: false,
    isAI: true
  },
  {
    id: 3,
    titleKey: "onboarding.title3",
    subtitleKey: "onboarding.subtitle3",
    image: require("../images/onboarding3.png"),
    showLoginButtons: true
  }
]

// export const colorData = [
//   [
//     { hex: "#3B82F6", name: "Blue-500" },
//     { hex: "#10B981", name: "Emerald-500" },
//     { hex: "#F59E0B", name: "Amber-500" },
//     { hex: "#EF4444", name: "Red-500" },
//   ],
//   [
//     { hex: "#8B5CF6", name: "Violet-500" },
//     { hex: "#4F46E5", name: "Indigo-600" },
//     { hex: "#06B6D4", name: "Cyan-500" },
//     { hex: "#F97316", name: "Orange-500" },
//   ],
//   [
//     { hex: "#059669", name: "Green-600" },
//     { hex: "#EC4899", name: "Pink-500" },
//     { hex: "#84CC16", name: "Lime-500" },
//     { hex: "#A855F7", name: "Purple-500" },
//   ],
//   [
//     { hex: "#DC2626", name: "Red-600" },
//     { hex: "#6366F1", name: "Indigo-500" },
//     { hex: "#14B8A6", name: "Teal-500" },
//     { hex: "#22C55E", name: "Green-500" },
//   ],
//   [
//     { hex: "#0EA5E9", name: "Sky-500" },
//     { hex: "#D946EF", name: "Fuchsia-500" },
//     { hex: "#64748B", name: "Slate-500" },
//     { hex: "#F43F5E", name: "Rose-500" },
//   ],
// ];

export const colorData = [
  [
    { hex: "#3B82F6", nameKey: "colors.blue500" },
    { hex: "#10B981", nameKey: "colors.emerald500" },
    { hex: "#F59E0B", nameKey: "colors.amber500" },
    { hex: "#EF4444", nameKey: "colors.red500" }
  ],
  [
    { hex: "#8B5CF6", nameKey: "colors.violet500" },
    { hex: "#4F46E5", nameKey: "colors.indigo600" },
    { hex: "#06B6D4", nameKey: "colors.cyan500" },
    { hex: "#F97316", nameKey: "colors.orange500" }
  ],
  [
    { hex: "#059669", nameKey: "colors.green600" },
    { hex: "#EC4899", nameKey: "colors.pink500" },
    { hex: "#84CC16", nameKey: "colors.lime500" },
    { hex: "#A855F7", nameKey: "colors.purple500" }
  ],
  [
    { hex: "#DC2626", nameKey: "colors.red600" },
    { hex: "#6366F1", nameKey: "colors.indigo500" },
    { hex: "#14B8A6", nameKey: "colors.teal500" },
    { hex: "#22C55E", nameKey: "colors.green500" }
  ],
  [
    { hex: "#0EA5E9", nameKey: "colors.sky500" },
    { hex: "#D946EF", nameKey: "colors.fuchsia500" },
    { hex: "#64748B", nameKey: "colors.slate500" },
    { hex: "#F43F5E", nameKey: "colors.rose500" }
  ]
]

export const contacts = [
  {
    id: "1",
    name: "Jerome Bell",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    emoji: "😍"
  },
  {
    id: "2",
    name: "Annette Black",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b37c?w=50&h=50&fit=crop&crop=face",
    emoji: "😂"
  },
  {
    id: "3",
    name: "Esther Howard",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    emoji: "😍"
  },
  {
    id: "4",
    name: "Jane Cooper",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face",
    emoji: "😍"
  },
  {
    id: "5",
    name: "Courtney Henry",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    emoji: "🤢"
  },
  {
    id: "6",
    name: "Darrell Steward",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
    emoji: "🤢"
  },
  {
    id: "7",
    name: "Jacob Jones",
    avatar:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=50&h=50&fit=crop&crop=face",
    emoji: "🤢"
  },
  {
    id: "8",
    name: "Jerome Bell",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face",
    emoji: "🤢"
  },
  {
    id: "9",
    name: "Courtney Henry",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    emoji: "🤢"
  },
  {
    id: "10",
    name: "Jane Cooper",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b37c?w=50&h=50&fit=crop&crop=face",
    emoji: "🤢"
  }
]

export const reportReasons = [
  "I just don't like it",
  "Hate or exploitation",
  "Selling or promoting restricted items",
  "Nudity or sexual activity",
  "Violence or dangerous organizations",
  "It's spam",
  "Bullying or harassment",
  "False information",
  "Intellectual property violation",
  "Something else"
]

export const outfits = [
  {
    id: "1",
    name: "Outfit Name",
    time: "8:00 AM | Jan 1, 2025"
  },
  {
    id: "2",
    name: "Outfit Name",
    time: "9:00 AM | Jan 2, 2025"
  },
  {
    id: "3",
    name: "Outfit Name",
    time: "10:00 AM | Jan 3, 2025"
  },
  {
    id: "4",
    name: "Outfit Name",
    time: "11:00 AM | Jan 4, 2025"
  },
  {
    id: "5",
    name: "Outfit Name",
    time: "12:00 PM | Jan 5, 2025"
  },
  {
    id: "6",
    name: "Outfit Name",
    time: "1:00 PM | Jan 6, 2025"
  },
  {
    id: "7",
    name: "Outfit Name",
    time: "2:00 PM | Jan 7, 2025"
  },
  {
    id: "8",
    name: "Outfit Name",
    time: "3:00 PM | Jan 8, 2025"
  },
  {
    id: "9",
    name: "Outfit Name",
    time: "4:00 PM | Jan 9, 2025"
  },
  {
    id: "10",
    name: "Outfit Name",
    time: "5:00 PM | Jan 10, 2025"
  },
  {
    id: "11",
    name: "Outfit Name",
    time: "6:00 PM | Jan 11, 2025"
  }
]

export const categories = [
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Footwear",
  "Accessories",
  "Activewear",
  "Lingerie & Sleepwear",
  "Swimwear",
  "Formalwear",
  "Casualwear",
  "Ethnic Wear",
  "Denim",
  "Suits & Blazers",
  "Handbags & Wallets",
  "Jewelry",
  "Hats & Caps",
  "Scarves & Gloves",
  "Socks & Hosiery",
  "Kids’ Fashion"
]

export const seasons = [
  "seasons.fall",
  "seasons.summer",
  "seasons.spring",
  "seasons.all"
]

export const stylesList = [
  "Casual",
  "Formal",
  "Streetwear",
  "Bohemian",
  "Vintage",
  "Athleisure",
  "Chic",
  "Preppy",
  "Gothic",
  "Minimalist",
  "Punk",
  "Romantic",
  "Business Casual",
  "Sporty",
  "Retro"
]

export const centralModalOption = [
  { id: 1, title: "centralModal.addItem", path: "AddItem" },
  {
    id: 2,
    title: "centralModal.createOutfit",
    path: "CreateOutfitStack"
  },
  {
    id: 3,
    title: "centralModal.createLookbook",
    path: "CreateLookbook"
  }
]

export const gender = [
  { id: 1, title: i18n.t("gender.male"), value: "male" },
  { id: 2, title: i18n.t("gender.female"), value: "female" },
  { id: 3, title: i18n.t("gender.others"), value: "others" }
]

export const locations = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "Charlotte",
  "Seattle",
  "Denver",
  "Boston",
  "Nashville",
  "Baltimore"
]
