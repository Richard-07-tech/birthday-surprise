// ============================================================
//  EDIT EVERYTHING HERE — no code changes needed anywhere else.
//  Swap names, dates, words, photos and letter lines below.
// ============================================================

export const CONFIG = {
  // --- WHO ---
  herName: "Her Name", // ← EDIT: her name (as you want it in the headline)
  herNameShort: "love", // ← EDIT: pet name used in small copy
  yourName: "Your Name", // ← EDIT: your sign-off name

  // --- KEY DATES (YYYY-MM-DD) ---
  startDate: "2022-02-14", // ← EDIT: the day you got together
  birthday: "1999-06-15", // ← EDIT: her birthday (year doesn't matter, month+day does)

  // --- 1. SECRET GATE ---
  gate: {
    teaser: "Psst… someone built a little world for you.",
    teaserSub: "It only opens with one word.",
    secretWord: "forever", // ← EDIT: the secret word
    inputLabel: "The secret word",
    button: "Unlock",
    unlockedLine: "Welcome in, beautiful.",
    hints: [
      "Hint: it's the word you whisper at the end of a promise…",
      "Warmer: we say it to each other every single night.",
      "Okay okay — it starts with “fo…” and rhymes with “ever”.",
    ],
    stillStuck: "Take your time. I'd wait a thousand years at this door.",
  },

  // --- 2. HERO ---
  hero: {
    eyebrow: "A little universe, made for you",
    subline: "Every star on this page is a day you made brighter. Ready to look back with me?",
    togetherLabel: "Together since",
    untilLabel: "Sleeps until your day",
    todayLine: "It's your day. Make a wish.",
  },

  // --- 3. OUR STORY — 5-6 moments. Set photo to null for a text-only moment. ---
  timeline: [
    {
      date: "14 Feb 2022",
      title: "The day we met",
      caption: "Swap this with the story of the very first hello — where you were, what you wore, what I thought.",
      photo:
        "https://images.unsplash.com/photo-1624339389686-cfca209567df?crop=entropy&cs=srgb&fm=jpg&q=85",
    },
    {
      date: "Mar 2022",
      title: "Our first date",
      caption: "The nervous laughs, the dessert we shared, the walk that was too short.",
      photo:
        "https://images.unsplash.com/photo-1651005985573-cfbd0da9e01e?crop=entropy&cs=srgb&fm=jpg&q=85",
    },
    {
      date: "Jun 2022",
      title: "The first trip",
      caption: "Wrong turns, terrible playlists, the best two days.",
      photo:
        "https://images.unsplash.com/photo-1591969851586-adbbd4accf81?crop=entropy&cs=srgb&fm=jpg&q=85",
    },
    {
      date: "One rainy afternoon",
      title: "The afternoon it rained",
      caption: "No photo for this one — some moments live better in the heart.",
      photo: null,
    },
    {
      date: "Dec 2023",
      title: "The people who matter",
      caption: "The day our two worlds met and instantly got along.",
      photo:
        "https://images.unsplash.com/photo-1562232573-0305012a8818?crop=entropy&cs=srgb&fm=jpg&q=85",
    },
    {
      date: "Every day since",
      title: "Today",
      caption: "Still my favourite hello and my hardest goodbye.",
      photo: null,
    },
  ],

  // --- 4. MEMORY FLIP CARDS — tap to flip up. Photos lazy-load; any URL works. ---
  cards: [
    {
      title: "Your smile",
      note: "The one you do with your eyes before your lips catch up.",
      photo:
        "https://images.unsplash.com/photo-1598759310798-18f8497d9858?crop=entropy&cs=srgb&fm=jpg&q=85",
    },
    {
      title: "That night we danced",
      note: "No music needed. Terrible moves. Perfect night.",
      photo:
        "https://images.unsplash.com/photo-1651005985573-cfbd0da9e01e?crop=entropy&cs=srgb&fm=jpg&q=85",
    },
    {
      title: "Your sleepy voice",
      note: "Half a sentence, all the warmth. I'd wake up early just to hear it.",
      photo:
        "https://images.unsplash.com/photo-1624339389686-cfca209567df?crop=entropy&cs=srgb&fm=jpg&q=85",
    },
    {
      title: "The way you look at me",
      note: "Like I'm something worth keeping. I'll spend forever proving you right.",
      photo:
        "https://images.unsplash.com/photo-1591969851586-adbbd4accf81?crop=entropy&cs=srgb&fm=jpg&q=85",
    },
    {
      title: "Inside jokes",
      note: "A whole language with two speakers. Strangers will never understand.",
      photo:
        "https://images.unsplash.com/photo-1562232573-0305012a8818?crop=entropy&cs=srgb&fm=jpg&q=85",
    },
    {
      title: "Your heart",
      note: "Soft and stubborn all at once. The safest place I know.",
      photo:
        "https://images.unsplash.com/photo-1651005985573-cfbd0da9e01e?crop=entropy&cs=srgb&fm=jpg&q=85",
    },
  ],

  // --- 5. THE LETTER — one array item = one revealed line. ---
  letter: {
    heading: "The Letter",
    opening: "My dearest",
    lines: [
      "If you're reading this, you found the word — of course you did.",
      "I wanted to give you something no shop sells, so I built you a small universe instead.",
      "Every petal falling up there is a day you made softer.",
      "Every card you opened is a moment I replay when the world gets loud.",
      "You make ordinary Tuesdays feel like something worth remembering.",
      "You laugh at my worst jokes. You hold my hand in crowded rooms.",
      "You are my favourite notification, my calmest silence, my home.",
      "So here is my wish, on your day: more mornings, more terrible dancing, more you and me.",
    ],
    signOff: "Forever yours,",
  },

  // --- FINALE & EASTER EGG ---
  finale: {
    wishButton: "Make a wish",
    wishMessage: "Close your eyes. Whatever you just wished for — I'm on my way to help you get it.",
  },
  easterEgg: {
    message: "You found the hidden heart. Of course you did — you've always found the things I hide too well. I love you.",
  },
};

// Small helper labels you may want to tweak
export const LABELS = {
  timelineEyebrow: "Our Story",
  timelineTitle: "Six little moments",
  timelineSub: "The short version of forever — scroll slowly.",
  cardsEyebrow: "Memory Lane",
  cardsTitle: "Things I love about you",
  cardsSub: "Tap a card. It flips upward — like a page of us.",
};
