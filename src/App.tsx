import { useState, useRef } from 'react';
import './styles.css';

// Define Card type with meanings for each category
type Meanings = {
  upright: { love: string; work: string; life: string };
  reversed: { love: string; work: string; life: string };
};

type Card = {
  name: string;
  image?: string;
  meanings?: Meanings;
  suit?: 'Wands' | 'Cups' | 'Swords' | 'Pentacles';
  rank?:
    | 'Ace'
    | 'Two'
    | 'Three'
    | 'Four'
    | 'Five'
    | 'Six'
    | 'Seven'
    | 'Eight'
    | 'Nine'
    | 'Ten'
    | 'Page'
    | 'Knight'
    | 'Queen'
    | 'King';
};

// Upright-only Rider–Waite (major arcana subset)
const DECK: Card[] = [
  {
    name: 'The Fool',
    image: '/assets/tarot/fool.jpg',
    meanings: {
      upright: {
        love: "Fresh starts, playful chemistry; stay open to surprises.",
        work: "New opportunity; take a calculated leap.",
        life: "Adventure and faith; trust the path ahead."
      },
      reversed: {
        love: "Hesitation or foolish risks.",
        work: "Rash choices; lack of planning.",
        life: "Fear of the unknown; missteps."
      }
    }
  },
  {
    name: 'The Magician',
    image: '/assets/tarot/magician.jpg',
    meanings: {
      upright: {
        love: "Intentional connection; communicate clearly.",
        work: "Skill, focus, and manifesting results.",
        life: "You have the tools—align thought and action."
      },
      reversed: {
        love: "Mixed signals; manipulation.",
        work: "Scattered focus; misuse of skill.",
        life: "Self-doubt blocks action."
      }
    }
  },
  {
    name: 'The High Priestess',
    image: '/assets/tarot/high_priestess.jpg',
    meanings: {
      upright: {
        love: "Listen to intuition; not everything needs words.",
        work: "Research quietly; read between the lines.",
        life: "Inner wisdom, dreams, and subtle cues guide you."
      },
      reversed: {
        love: "Secrets; ignoring intuition.",
        work: "Hidden info; misread cues.",
        life: "Noise drowns inner voice."
      }
    }
  },
  {
    name: 'The Empress',
    image: '/assets/tarot/empress.jpg',
    meanings: {
      upright: {
        love: "Nurturing affection; sensuality and growth.",
        work: "Creativity bears fruit; prioritize comfort and flow.",
        life: "Abundance and self-care; tend your garden."
      },
      reversed: {
        love: "Smothering or neglect.",
        work: "Creative block; burnout.",
        life: "Depletion—practice self-care."
      }
    }
  },
  {
    name: 'The Emperor',
    image: '/assets/tarot/emperor.jpg',
    meanings: {
      upright: {
        love: "Stability and boundaries; protect what matters.",
        work: "Leadership, structure, and strategy win the day.",
        life: "Discipline anchors progress; set clear rules."
      },
      reversed: {
        love: "Control issues; rigidity.",
        work: "Chaos from poor structure.",
        life: "Rebellion without plan."
      }
    }
  },
  {
    name: 'The Hierophant',
    image: '/assets/tarot/hierophant.jpg',
    meanings: {
      upright: {
        love: "Shared values; traditions and commitment.",
        work: "Mentorship, standards, and proven methods.",
        life: "Seek guidance; align with your principles."
      },
      reversed: {
        love: "Challenge norms; nonconformity.",
        work: "Stifling rules—innovate.",
        life: "Question tradition; find your way."
      }
    }
  },
  {
    name: 'The Lovers',
    image: '/assets/tarot/lovers.jpg',
    meanings: {
      upright: {
        love: "Aligned choices; honest vulnerability deepens bonds.",
        work: "Partnerships and values-based decisions.",
        life: "Choose with heart and integrity."
      },
      reversed: {
        love: "Misalignment; indecision.",
        work: "Values clash; shaky partnership.",
        life: "Choice made from fear."
      }
    }
  },
  {
    name: 'The Chariot',
    image: '/assets/tarot/chariot.jpg',
    meanings: {
      upright: {
        love: "Forward momentum; align goals to move together.",
        work: "Drive, focus, and victory after effort.",
        life: "Willpower harnessed; steer with intention."
      },
      reversed: {
        love: "Push–pull; no direction.",
        work: "Delays; scattered drive.",
        life: "Losing focus—regain control."
      }
    }
  },
  {
    name: 'Strength',
    image: '/assets/tarot/strength.jpg',
    meanings: {
      upright: {
        love: "Gentle courage and patience heal and bond.",
        work: "Steady resilience over brute force.",
        life: "Compassion tames fear; inner strength grows."
      },
      reversed: {
        love: "Insecurity; impatience.",
        work: "Self-doubt; forcing outcomes.",
        life: "Fear dominates—be gentle."
      }
    }
  },
  {
    name: 'The Hermit',
    image: '/assets/tarot/hermit.jpg',
    meanings: {
      upright: {
        love: "Space to reflect; depth over noise.",
        work: "Solo focus; insight from quiet study.",
        life: "Seek your inner light; wisdom in stillness."
      },
      reversed: {
        love: "Isolation; withdrawal.",
        work: "Over-isolation; analysis rut.",
        life: "Loneliness—time to reconnect."
      }
    }
  },
];

// Remaining Major Arcana (names only)
const MAJORS_REST = [
  'Wheel of Fortune',
  'Justice',
  'The Hanged Man',
  'Death',
  'Temperance',
  'The Devil',
  'The Tower',
  'The Star',
  'The Moon',
  'The Sun',
  'Judgement',
  'The World',
];

// Generate Minor Arcana (56 cards)
const SUITS = ['Wands', 'Cups', 'Swords', 'Pentacles'] as const;
const RANKS = [
  'Ace',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Page',
  'Knight',
  'Queen',
  'King',
] as const;

const MINORS: Card[] = [];
for (const suit of SUITS) {
  for (const rank of RANKS) {
    MINORS.push({ name: `${rank} of ${suit}`, suit, rank });
  }
}

// Full Rider–Waite deck
const FULL_DECK: Card[] = [
  ...DECK,
  ...MAJORS_REST.map((n) => ({ name: n })),
  ...MINORS,
];

function getCardImage(c: Card) {
  return c.image || '/assets/tarot/placeholder.svg';
}

function meaningForMinor(
  suit: Card['suit'],
  orientation: 'upright' | 'reversed',
  category: 'love' | 'work' | 'life'
) {
  const base = {
    Wands: {
      upright: 'Inspiration and momentum.',
      reversed: 'Delays and scattered energy.',
    },
    Cups: {
      upright: 'Emotions and connection.',
      reversed: 'Emotional blocks or moodiness.',
    },
    Swords: {
      upright: 'Clarity and truth.',
      reversed: 'Overthinking or miscommunication.',
    },
    Pentacles: {
      upright: 'Material growth and care.',
      reversed: 'Instability or neglect of basics.',
    },
  } as const;
  const tail = {
    love: {
      upright: ' in relationships.',
      reversed: ' affecting relationships.',
    },
    work: {
      upright: ' in career/finances.',
      reversed: ' impacting work/finances.',
    },
    life: {
      upright: ' in personal life.',
      reversed: ' in daily life.',
    },
  } as const;
  const key = orientation;
  return base[suit!][key] + tail[category][key];
}

function meaningForMajorGeneric(
  orientation: 'upright' | 'reversed',
  category: 'love' | 'work' | 'life'
) {
  const u = 'Archetypal shift—lean into the lesson';
  const r = 'Blocked archetype—reexamine the lesson';
  const byCat = {
    love: ' of the heart.',
    work: ' at work.',
    life: ' in your path.',
  } as const;
  return (orientation === 'upright' ? u : r) + byCat[category];
}

function getMeaning(
  c: Card,
  orientation: 'upright' | 'reversed',
  category: 'love' | 'work' | 'life'
) {
  if (c.meanings) return c.meanings[orientation][category];
  if (c.suit) return meaningForMinor(c.suit, orientation, category);
  return meaningForMajorGeneric(orientation, category);
}

export default function App() {
  const [card, setCard] = useState<Card | null>(null);
  const [category, setCategory] = useState<'love' | 'work' | 'life' | null>(null);
  const [orientationMode, setOrientationMode] = useState<'upright' | 'reversed' | 'random'>('random');
  const [drawnOrientation, setDrawnOrientation] = useState<'upright' | 'reversed' | null>(null);

  function drawCard() {
    let idx: number;
    if (
      typeof window !== 'undefined' &&
      window.crypto &&
      window.crypto.getRandomValues
    ) {
      const arr = new Uint32Array(1);
      window.crypto.getRandomValues(arr);
      idx = arr[0] % FULL_DECK.length;
    } else {
      idx = Math.floor(Math.random() * FULL_DECK.length);
    }
    // determine orientation
    let orientation: 'upright' | 'reversed';
    if (orientationMode === 'random') {
      const rand = (typeof window !== 'undefined' && window.crypto?.getRandomValues)
        ? (window.crypto.getRandomValues(new Uint32Array(1))[0] % 2)
        : Math.floor(Math.random() * 2);
      orientation = rand === 0 ? 'upright' : 'reversed';
    } else {
      orientation = orientationMode;
    }
    setCard(FULL_DECK[idx]);
    setDrawnOrientation(orientation);
  }

  function chooseCategory(cat: 'love' | 'work' | 'life') {
    setCategory(cat);
    setCard(null);
    setDrawnOrientation(null);
  }

  // Reset back to category selection
  function resetToCategories() {
    setCard(null);
    setCategory(null);
    setDrawnOrientation(null);
  }

  /* --- robust mascot photo handling across common extensions --- */
  const photoList = [
    '/assets/user/atia.jpeg',
    '/assets/user/atia.png',
    '/assets/user/atia.jpg',
    '/assets/user/atia.webp',
  ];
  const photoIdx = useRef(0);
  // render
  return (
    <main className="container">
      {/* Use the high-resolution Factory logo */}
      {/* Use the authentic Factory star logo */}
      {/* Display official favicon logo from live Factory app */}
      {/* Display authentic Factory SVG logo */}
      {/* (Factory branding removed) */}

      {/* === App Title & Mascot === */}
      <h1 className="app-title">Atia&apos;s Reading</h1>
      <div className="cat-photo-wrap" aria-hidden="true">
        <img
          className="cat-photo"
          src={photoList[0]}
          alt=""
          onError={(e) => {
            if (photoIdx.current < photoList.length - 1) {
              photoIdx.current += 1;
              (e.currentTarget as HTMLImageElement).src =
                photoList[photoIdx.current];
            } else {
              (e.currentTarget as HTMLImageElement).src =
                '/assets/tarot/placeholder.svg';
            }
          }}
        />
      </div>

      {/* === Tarot Pull === */}
      <section className="tarot">
        {/* (mascot image now shown above; bubble removed) */}
        {/* inspirational quote */}
        <p className="tarot-quote">
          “Find your inner universe, for the stars reside within.”
        </p>
        <p className="tarot-subnote">
          {category && !card
            ? "Center yourself, and find your intuition. When your mind is open, click below."
            : "Welcome to Atia's Daily Reading! Please select a category below."}
        </p>

        {/* pick button (orientation randomized internally) */}
        {category && !card && (
          <button className="cta tarot-cta" onClick={drawCard}>
            ✨ Pick a Card ✨
          </button>
        )}

        {/* category list (shown while picking) */}
        {category === null && (
          <div className="category-list">
            <button
              className="cta category-btn"
              onClick={() => chooseCategory('love')}
            >
              Love &amp; Relationships
            </button>
            <button
              className="cta category-btn"
              onClick={() => chooseCategory('work')}
            >
              Work &amp; Finance
            </button>
            <button
              className="cta category-btn"
              onClick={() => chooseCategory('life')}
            >
              Life &amp; Wellness
            </button>
          </div>
        )}

        {/* card result with meaning */}
        {card && category && (
          <>
            <div className="tarot-result">
              <img
                className={`tarot-image${
                  drawnOrientation === 'reversed' ? ' reversed' : ''
                }`}
                src={getCardImage(card)}
                alt={card.name}
                width={200}
              />
              <p className="tarot-name">
                {card.name}
                {drawnOrientation === 'reversed' ? ' (Reversed)' : ''}
              </p>
              <p className="tarot-meaning">
                {getMeaning(card, drawnOrientation!, category)}
              </p>
            </div>
            <button className="cta tarot-cta" onClick={resetToCategories}>
              Pull Another Card
            </button>
          </>
        )}

        {/* deck illustration */}
        {/* deck illustration removed as requested */}

        {/* tail illustration removed as requested */}
      </section>

    </main>
  );
}
