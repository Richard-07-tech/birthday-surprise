// ============================================================
//  SURPRISE CONFIGURATION FOR MIRU
//  Edit everything here — names, dates, words, photos, notes.
// ============================================================

export const CONFIG = {
  // --- WHO ---
  herName: "MIRU", // Her name
  herNameShort: "Miru", // Pet name used in small copy
  yourName: "RICHY", // Your sign-off name

  // --- KEY DATES & TIMING ---
  // Birthday: 3 November 2007 (turning 19 on 3 Nov 2026), Asia/Kolkata timezone
  birthday: "2007-11-03",
  birthdayLabel: "3 November 2007",
  timezone: "Asia/Kolkata",

  // Lock Page unlock threshold: 00:00 IST on 3 November 2026
  unlockAt: "2026-11-03T00:00:00+05:30",

  // "Since we met" counter: met on 3 November 2025
  metOn: "2025-11-03",

  // Private preview bypass: visit the site with ?preview=miru-preview-2026 to skip the lock page early
  previewEnabled: true,
  previewKey: "miru-preview-2026",

  // Test unlock time — set to a near-future IST timestamp to test the countdown locally.
  // Leave empty string "" to use unlockAt instead.
  testUnlockAt: "", // e.g. "2026-11-02T23:55:00+05:30"

  // --- 1. LOCK / LANDING PAGE ---
  lock: {
    title: "Something special is waiting for you, MIRU 💫",
    subtitle: "Opens at midnight on 3 November",
    countdownLabel: "Opens at midnight on 3 November",
    teaser: "Come back on your birthday 🎂",
    lockedTapMessage: "Not yet, birthday girl 😏",
    gotoButton: "Go to Surprise ✨",
    tapMessages: [
      "Not yet, birthday girl 😏",
      "Almost there! ✨",
      "Patience is cute on you 💖",
      "Something magical is waiting for you 💫",
      "Made with all my love, just for you 🌸",
    ],
    unlockedButton: "Open your surprise ✨",
    unlockedHeading: "Your surprise is unlocked! ✨",
    unlockedSub: "Step inside, birthday girl 🌸",
  },

  // --- 2. PASSWORD PAGE (Secret password gate) ---
  gate: {
    teaser: "Psst… someone built a little world for you.",
    teaserSub: "It only opens with the secret password.",
    secretWord: "120310112007", // The secret password to enter
    inputLabel: "Enter the password",
    button: "Unlock ✨",
    unlockedLine: "Welcome in, beautiful.",
    hints: [
      "Hint: a special combination of our dates… 💫",
      "Warmer: special numbers from our story 💗",
      "Pssst: 120310112007 ✨",
    ],
    stillStuck: "Take your time. I'd wait a thousand years at this door.",
  },

  // --- 3. HERO ---
  hero: {
    eyebrow: "A little universe, made for you",
    subline: "Every star on this page is a day you made brighter. Ready to look back with me?",
    sinceMetLabel: "Since we met",
    sinceMetCaption: "tap to see us ✨",
    talkTimeLabel: "OUR TALK TIME",
    talkTimeCaption: "of just us talking · tap ✨",
    turningAge: 19,
    turningLabel: "Happy 19th",
    todayLine: "Today is the day 🎉",
    birthdaySpecialLine: "One year since we met. The best birthday gift I ever got was you.",
  },

  // --- SINCE WE MET STORY POPUP CONFIG ---
  sinceMetStory: {
    beat1Date: "3 November 2025…",
    beat1Line: "the day my life got a little brighter.",
    beat6Line: "Most things don't last. Some things only grow stronger.",
    finaleLine: "One year of you, MIRU. And I'd choose you again.",
    finaleBirthdayLine: "Happy 1 year, and happy 19th, MIRU 🎂",
  },

  // --- OUR TALK TIME & STATS (Our Numbers experience) ---
  talkStats: {
    daysTalked: 310,
    avgHoursPerDay: 1.2,
    maxHoursInADay: 3,
    longestStreakDays: 24,
    closingLine: "And I'd still say I'm not done talking to you.",
  },

  // --- 4. THE MIRU FULL-FORM REVEAL ---
  acronym: {
    eyebrow: "The meaning behind your name",
    tagline: "Every letter is another reason I fall for you",
    letters: [
      {
        letter: "M",
        word: "Mine",
        note: "still how many days we have nu therla... but naa irrukeno illayo... you will always be my miru kutyy😋😋",
      },
      {
        letter: "I",
        word: "Independent uhh....",
        note: "na irrukeno illaya nee epayumee strong haaa mass haa gethu haa irrukanum, college hee NCC SW MIrudhula keela than😋",
      },
      {
        letter: "R",
        word: "Radiant uhhh",
        note: "ofcouse enna siripu enna alagu neega majja vaa irrupiga neega always, big fan uhh madom😋😋",
      },
      {
        letter: "U",
        word: "Unique",
        note: "nee always unique than seriya... nee un mela neriyaa kora irruku nu sollite irrupa, irrukatum... enaku athuvum pidikum unta seriyaaa",
      },
    ],
    conclusion: "girl 💫",
    conclusionSub: "today, tomorrow, and forever.",
  },

  // --- 5. OUR STORY ---
  timeline: [
    {
      date: "3 Nov 2025",
      title: "The day we met",
      caption: "The start of everything. When an ordinary day turned into the most important day of my year.",
      photo: "/images/first-met.jpg",
    },
    {
      date: "28 DECEMBER 2025 · 4:08 PM",
      title: "The day I told you",
      caption:
        "I still remember it perfectly: 28 December, 4:08 in the afternoon, on a call with you. My heart was racing, my words were shaking, and I finally said what I'd been carrying for so long. I told you I liked you. Of everything I've ever done, that is the thing I'm happiest I did. Thank you for being the person I found the courage for. 💗",
      photo: null,
      isCallHighlight: true,
      timeDisplay: "4:08 PM",
      timeSubtext: "28 December · the day my heart spoke first",
    },
    {
      date: "Mid 2026",
      title: "Through every quiet evening",
      caption:
        "A lot happened between us. We fought, a lot. Misunderstandings in the daytime, arguments deep into the night, words we never really meant. But every single time, when the storm passed, we stayed. it was never about never falling apart. It was about choosing each other again, every time. And I'd choose you again. 💗",
      photo: null,
      highlightEnding: "And I'd choose you again. 💗",
    },
    {
      date: "3 Nov 2026",
      title: "Exactly one year today",
      caption: "365 days of knowing you, and a lifetime more to go.",
      photo:
        "https://images.unsplash.com/photo-1562232573-0305012a8818?crop=entropy&cs=srgb&fm=jpg&q=85",
    },
  ],

  // --- 6. THINGS I LIKE ABOUT YOU (Cinematic chapters) ---
  // Each chapter: id (matches signature), title, note, photo path, photoAlt, focalPoint.
  // Personality chapter also has `chips` array (editable word chips).
  // Drop images into frontend/public/images/ with the matching filename.
  reasons: [
    {
      id: "smile",
      title: "Your smile",
      note: "The one that starts in your eyes and takes the whole room with it.",
      photo: "/images/smile.jpg",        // replace with your photo
      photoAlt: "Her smile",
      focalPoint: "50% 30%",
      // "contain" = show the full collage uncropped; "cover" = crop to fill the frame (default)
      photoFit: "contain",
    },
    {
      id: "hair",
      title: "Your hair",
      note: "Every strand a different shade of perfect. I notice it every time.",
      photo: "/images/hair.jpg",         // replace with your photo
      photoAlt: "Her hair",
      focalPoint: "50% 20%",
      photoFit: "cover",
    },
    {
      id: "personality",
      title: "Your personality",
      note: "Soft and fierce. Funny and deep. Wonderfully, entirely you.",
      photo: "/images/personality.jpg",  // replace with your photo
      photoAlt: "Her personality",
      focalPoint: "50% 30%",
      photoFit: "cover",
      chips: ["kind", "funny", "caring", "strong", "real", "warm"], // editable word chips
    },
  ],

  // Loading bar captions (shown while the bar fills)
  reasonsLoading: {
    cap0to30: "Counting everything I love about you…",
    cap30to60: "Adding your laugh… your kindness… the way you care…",
    cap60to90: "This is taking longer than expected…",
    cap99: "Wait… there's too much 🥹",
    transitionLine: "…and that's just the beginning.",
  },

  // Finale text + collage image
  reasonsFinale: {
    bigWord: "Everything.",
    sub: "I love everything about you, MIRU. 💗",
    replay: "Replay ✨",
    collage: {
      path: "/images/collage.jpg", // drop your collage here; falls back to placeholder until uploaded
      alt: "A collage of MIRU",
    },
  },

  // --- 7. MEMORY FLIP CARDS (Kept for backward compatibility — not currently rendered) ---
  cards: [
    {
      title: "Your smile",
      note: "The one you do with your eyes before your lips catch up.",
      photo:
        "https://images.unsplash.com/photo-1598759310798-18f8497d9858?crop=entropy&cs=srgb&fm=jpg&q=85",
    },
    {
      title: "That night we talked forever",
      note: "No hurry, no worries. Just you and me under the stars.",
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
      title: "Our inside jokes",
      note: "A whole language with two speakers. Strangers will never understand.",
      photo:
        "https://images.unsplash.com/photo-1562232573-0305012a8818?crop=entropy&cs=srgb&fm=jpg&q=85",
    },
    {
      title: "Your heart",
      note: "Soft, stubborn, and wonderfully kind. The safest place I know.",
      photo:
        "https://images.unsplash.com/photo-1651005985573-cfbd0da9e01e?crop=entropy&cs=srgb&fm=jpg&q=85",
    },
  ],

  // --- 7. THE LETTER (Line-by-line fade-in reveal at the end) ---
  letter: {
    heading: "The Letter",
    opening: "Soo vanakamm,",
    lines: [
      "Happy Birthday di alagii🥳🥳🥳, it's been a year since we got together and yen nu therlaa unaya vida unoda birthday ikku na than romba happy haa irrukenn, nalla enjoy pannu life haaa, nee lifee laa unaku pudichaa maari oru nalla nelamaiku varuvaa seriyaaa,naa always un kuuda irruthuu support pannitee irrupen....",
      "You are the most perfect imperfect girl i ever seen✨✨,",
      "But yen nu therlaa I even like you flaws and imperfections tooo..... Nee apa apaa thugurathu, sometimes joke puriyama oru maari stun aagi yosipaa😪🤣🤣... I like every bit of itt😁😋.....",
      "Soo you are the most prettiest girl i ever knownnn uhh,still many years too goo maa, soo i promise I will always stay by your side and do my best for you toooo....",
      "And vera ennaa..... i am really happy we are growing together dii, epa than college la first day unaya paatha maari irruku....athu kulla evalo days poiduchu paaru",
      "Next year nampa epa irrukuratha vidaa better haa and innum close ha irrupom,nee vitalum na unaya vida maaten too don't worry 😋",
      "Thanks for always staying by my side dii algaii, unaya vida entha lifetime laa enaku perfect ha, understanding haaa and evalo alaga oru ponnu kedaikaave maata,you will always be the best gift i ever had " +
      "I always wished the best for youuu okiee vaa nee life laa super haa varuvaa.... Once again wishing you all the very besttt.....",
      "Happy 19 my Miru Kutty😋😋😋😋😋",
      "you will always be my greatest gift😋😋😋😋😋 ",
      "and thanks for being mine😋😋😋 ",
    ],
    // Indices (0-based) of lines that get the SpecialLine treatment
    highlightLines: [7, 8, 9],
    signOff: "Forever yours,",
  },

  // --- FINALE & EASTER EGG ---
  finale: {
    wishButton: "Make a wish",
    wishMessage: "Close your eyes. Whatever you just wished for — I'm on my way to help you get it.",
    wishEasterEgg: {
      emoji: "😏",
      caption: "I know exactly what you wished for 😏",
      mobileParticleCount: 35,
      desktopParticleCount: 55,
      cooldownMs: 3000,
    },
  },
  wishEasterEgg: {
    emoji: "😏",
    caption: "I know exactly what you wished for 😏",
    mobileParticleCount: 35,
    desktopParticleCount: 55,
    cooldownMs: 3000,
  },
  easterEgg: {
    message: "You found the hidden heart. Of course you did — you've always found the things I hide too well. I love you, MIRU.",
  },
};

// Small helper labels
export const LABELS = {
  timelineEyebrow: "Our Story",
  timelineTitle: "Moments of Us",
  timelineSub: "The short version of forever — scroll slowly.",
  cardsEyebrow: "Just a few things…",
  cardsTitle: "Things I like about you",
  cardsSub: "Scroll slowly. Each one is real.",
};

/**
 * Computes talk time statistics from CONFIG.talkStats
 */
export function getComputedTalkStats() {
  const stats = CONFIG.talkStats || {};
  const daysTalked = stats.daysTalked ?? 310;
  const avgHoursPerDay = stats.avgHoursPerDay ?? 1.2;
  const maxHoursInADay = stats.maxHoursInADay ?? 3;
  const longestStreakDays = stats.longestStreakDays ?? 24;
  const closingLine =
    stats.closingLine || "And I'd still say I'm not done talking to you.";

  const totalHours = Math.round(daysTalked * avgHoursPerDay); // 372
  const continuousDays = Math.floor(totalHours / 24); // 15
  const remainingHours = Math.round(totalHours % 24); // 12
  const totalMinutes = Math.round(totalHours * 60); // 22,320
  const minutesFormatted = (Math.floor(totalMinutes / 1000) * 1000).toLocaleString(); // "22,000"

  return {
    daysTalked,
    avgHoursPerDay,
    maxHoursInADay,
    longestStreakDays,
    closingLine,
    totalHours,
    continuousDays,
    remainingHours,
    totalMinutes,
    minutesFormatted,
  };
}
