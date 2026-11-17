// =====================================================================
// VANSHU'S LITTLE WORLD 🎀 - CENTRAL CONTENT CONFIGURATION
// =====================================================================
// Edit this file to customize all messages, photos, and dates on the website.
// You can also edit these values using the visual editor at: /admin

export const siteContent = {
  // 1. Personal Information
  girlfriendName: "Vanshika Handoo",
  nickname: "Vanshu",
  siteTitle: "Vanshu's Little World ♡",
  siteSubtitle: "A little scrapbook made with lots of love by your tushant ♡",

  // 2. Welcome Screen Text
  welcomeScreen: {
    heading: "Hey, Vanshu! ♡",
    subtitle: "Someone made a little world just for you...",
    supportingText: "A tiny place filled with love, memories and little surprises.",
    buttonText: "Open your little world ♡",
  },

  // 3. Love Letter (Card 1)
  loveLetter: {
    id: "card-1-letter",
    title: "A Little Love Letter 💌",
    subtitle: "Tap to unfold my heart",
    envelopeLabel: "For My Vanshu",
    message: `Dear Vanshu,

I don't think you realize how special you are to me. You make ordinary days feel a little more beautiful, and even the smallest moments with you mean so much.

I made this little corner of the internet just for you, because you deserve something as special as you are.

Always remember that you are loved, appreciated and very precious to me.

With lots of love,
Your favourite person ♡`,
  },

  // 4. When You Miss Me Message (Card 2)
  whenYouMissMe: {
    id: "card-2-hug",
    title: "When You Miss Me 🐧",
    subtitle: "Press anytime you need warmth",
    message: `Hey Vanshu!

If you're missing me right now, imagine this little penguin giving you the biggest hug ever.

Consider this your virtual hug until I can give you a real one.

I'm probably thinking about you too. ♡`,
    buttonLabel: "Send me another hug ♡",
  },

  // 5. Reasons I Love You (Card 3)
  reasonsILoveYou: {
    id: "card-3-reasons",
    title: "Reasons I Love You 🎀",
    subtitle: "Tap all 10 hearts to reveal each little secret",
    reasons: [
      "1. Your smile.",
      "2. The way you make me happy.",
      "3. Your adorable little expressions.",
      "4. The way you care.",
      "5. Your laugh.",
      "6. The little things you do.",
      "7. The memories we make.",
      "8. The way you make ordinary days special.",
      "9. Your beautiful personality.",
      "10. Simply because you're you.",
    ],
  },

  // 6. Open When Sad Message (Card 4)
  openWhenSad: {
    id: "card-4-comfort",
    title: "Open When You're Sad 🐰",
    subtitle: "A warm comforting embrace for your soul",
    message: `Hey, my Vanshu.

First of all, take a deep breath.

Whatever is bothering you right now, remember that you don't have to be happy every second.

You are allowed to have bad days.

I wish I could be there to hold your hand and make everything feel a little lighter.

Please smile when you can, take care of yourself, and remember how precious you are.

Sending you the biggest hug. ♡`,
    affirmationText: "Breathe in peace... breathe out stress... You are so loved.",
  },

  // 7. Photo Gallery Captions & Image Paths (Card 5)
  // To add your own photos: drop files into public/images/ (e.g. photo1.jpg)
  // and set image path to "/images/photo1.jpg"
  photoGallery: {
    id: "card-5-memories",
    title: "Our Little Memories 📸",
    subtitle: "Sweet moments frozen in time",
    description: "Every snapshot holds a heartbeat of ours. Click any photo to see it up close!",
    photos: [
      {
        id: "photo-1",
        title: "Our Sweet Beginning",
        date: "Special Moment",
        caption: "Where our sweetest chapter started. I still remember how my heart raced! ✨",
        image: "/images/photo-1.jpg",
        rotation: "-rotate-2",
        tapeColor: "bg-pastel-pink/60",
      },
      {
        id: "photo-2",
        title: "Together With You",
        date: "Cherished Day",
        caption: "Warm smiles, soft laughs, and the happiest moments with you. 🌸",
        image: "/images/photo-2.jpg",
        rotation: "rotate-2",
        tapeColor: "bg-pastel-lavender/60",
      },
      {
        id: "photo-3",
        title: "My Favorite Smile",
        date: "Unforgettable",
        caption: "You make my entire world feel safe, warm, and bright. 🌙",
        image: "/images/photo-3.jpg",
        rotation: "-rotate-1",
        tapeColor: "bg-pastel-peach/60",
      },
      {
        id: "photo-4",
        title: "Forever & Always",
        date: "With All My Heart",
        caption: "Walking beside you, wishing every second with you would last forever. 🎀",
        image: "/images/photo-4.jpg",
        rotation: "rotate-3",
        tapeColor: "bg-pastel-blue/60",
      },
    ],
  },

  // 8. Surprise Gift Message (Card 6)
  surpriseGift: {
    id: "card-6-surprise",
    title: "A Little Surprise 🎁",
    subtitle: "Something sweet tucked inside",
    openPrompt: "Open your gift ♡",
    message: `Surprise, Vanshu!

If I could give you one thing, it would be the ability to see yourself through my eyes, just so you could understand how special you really are.

You deserve all the happiness in this world.

And this little website is just a tiny reminder of that. ♡`,
  },

  // 9. Anniversary Information & Special Dates
  anniversaryInfo: {
    title: "Our Anniversary",
    date: "2024-05-18", // Format: YYYY-MM-DD
    caption: "The best day ever. Counting down to our next milestone! ✨",
    type: "countdown",
  },

  specialDates: [
    {
      id: "date-first-meet",
      title: "The Day We First Met",
      date: "2023-11-20",
      caption: "The moment that changed everything for the better.",
    },
    {
      id: "date-first-date",
      title: "Our Very First Date",
      date: "2023-12-05",
      caption: "Butterflies, blushing smiles, and pure happiness.",
    },
    {
      id: "date-special-mem",
      title: "The Day I Knew",
      date: "2024-02-14",
      caption: "When I realized home isn't a place, it's you.",
    },
  ],

  // 10. Final Secret Surprise Message
  finalSecretSurprise: {
    sectionTitle: "One Last Thing For You...",
    lockedHeading: "A Secret Love Note is Hidden Here",
    lockedDescription: "Explore all 6 scrapbook memories above to unlock this final surprise ♡",
    unlockedHeading: "You Unlocked The Secret Surprise! 🎀",
    unlockedPrompt: "Tap to read my final message ♡",
    fullScreenTitle: "To My Dearest Vanshu ♡",
    message: `Vanshu, if you have made it all the way here, I just want you to know one thing...

You are one of the most beautiful parts of my life.

Thank you for being you.

This little world may be made of pixels, pictures and words, but every little detail was created with you in mind.

I hope this made you smile.

I love you, Vanshu. ♡`,
  },

  // 11. Background Music Settings
  musicSettings: {
    title: "The Neighbourhood - Reflections",
    artist: "The Neighbourhood",
    customAudioUrl: "/music.mp3",
    volume: 0.35,
    hasCustomAudio: true,
  },
};

// Aliases for seamless component compatibility
siteContent.card1Letter = siteContent.loveLetter;
siteContent.card2Hug = siteContent.whenYouMissMe;
siteContent.card3Reasons = siteContent.reasonsILoveYou;
siteContent.card4Comfort = siteContent.openWhenSad;
siteContent.card5Memories = siteContent.photoGallery;
siteContent.card6Surprise = siteContent.surpriseGift;
siteContent.secretSurprise = siteContent.finalSecretSurprise;

export default siteContent;
