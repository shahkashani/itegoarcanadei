import {
  DIALOG_STATE_BOOK,
  DIALOG_STATE_MAP,
  EFFECTS_CORMORANTS,
  INVENTORY_BOOK,
  INVENTORY_MAP,
} from './types';

export default {
  enter: {
    dialog: [
      {
        character: 'them',
        text: ['Hello, stranger.'],
        condition: {
          greetedStranger: undefined,
          greetedTraveller: undefined,
        },
        effects: {
          greetedStranger: true,
        },
      },
      {
        character: 'them',
        text: 'Hello again, stranger.',
        condition: {
          greetedStranger: true,
          greetedTraveller: undefined,
        },
      },
      {
        character: 'them',
        text: ['Hello again, Traveller.'],
        condition: {
          greetedTraveller: true,
        },
      },
      {
        character: 'you',
        text: 'Hello...',
        once: true,
      },
    ],
    goto: 'main',
  },
  main: {
    choices: [
      {
        text: 'I am the Traveller.',
        once: true,
        goto: 'traveller',
        condition: {
          hasIntroduced: true,
        },
        effects: {
          greetedTraveller: true,
        },
      },
      {
        text: 'How did I get here?',
        goto: 'arrival',
        condition: {
          hasIntroduced: true,
          greetedTraveller: true,
        },
        effects: {
          hasAskedArrival: true,
        },
      },
      {
        text: 'How do I leave Valdrada?',
        goto: 'departure',
        condition: {
          hasAskedArrival: true,
        },
      },
      {
        text: 'You searched the books for a way to escape?',
        goto: 'answers',
        once: true,
        condition: {
          storyKeeperBooks: true,
        },
        effects: {
          mysteriousLanguages: true,
        },
      },
      {
        text: 'Mysterious alphabets?',
        goto: 'mystery',
        once: true,
        condition: {
          mysteriousLanguages: true,
        },
        effects: {
          theBook: true,
        },
      },
      {
        text: 'Could I see this book?',
        goto: 'book',
        condition: {
          theBook: true,
          hasBook: undefined,
        },
        effects: {
          hasBook: true,
        },
      },
      {
        text: 'The twin city?',
        condition: {
          twinCity: true,
        },
        once: true,
        goto: 'twin',
        effects: {
          hasIntroduced: true,
        },
      },
      {
        text: 'Where am I?',
        goto: 'valdrada',
        condition: {
          twinCity: undefined,
        },
        effects: {
          twinCity: true,
        },
      },
      {
        text: "Some of the cities on the map don't have names.",
        condition: {
          [DIALOG_STATE_MAP]: true,
        },
        goto: 'map',
      },
      {
        text: "I don't understand this book.",
        condition: {
          [DIALOG_STATE_BOOK]: true,
          askStoryKeeper: undefined,
        },
        effects: {
          askStoryKeeper: true,
        },
        goto: 'understandBook',
      },
      {
        text: 'How would you ask the Story Keeper?',
        condition: {
          askStoryKeeper: true,
          cormorants: false,
        },
        effects: {
          [EFFECTS_CORMORANTS]: true,
        },
        goto: 'cormorantsIntro',
      },
      {
        text: 'Bye.',
        goto: 'exit',
      },
    ],
  },
  cormorantsIntro: {
    dialog: [
      {
        character: 'them',
        text: [
          'I would send them the book.',
          'Or a letter.',
          'Cormorants can travel anywhere.',
          'They can bring anything.',
        ],
        pauseAfter: 1000,
      },
      {
        character: 'them',
        text: [
          'If you know anyone who might be able to read this book...',
          'Anyone at all.',
          'Feel free to seek the aid of the cormorants.',
          'The book is yours, do as you wish.',
        ],
        pauseAfter: 1000,
      },
      {
        character: 'them',
        text: [
          'I know what you are thinking.',
          'The Story Keeper can translate the book.',
          'But I am no longer sure the Story Keeper still exists.',
          'So you have to choose someone else.',
          'Just give the cormorants an address and they will do the rest.',
        ],
        pauseAfter: 2000,
      },
      {
        character: 'them',
        text: ['Choose wisely.', 'I can feel the importance of this book.'],
      },
    ],
    goto: 'main',
  },
  understandBook: {
    dialog: [
      {
        character: 'them',
        text: [
          "It's intriguing.",
          'But neither do I.',
          'I wish I knew where the Story Keeper was.',
          'I would ask if they are able to help me read it.',
        ],
      },
    ],
    goto: 'main',
  },
  arrival: {
    dialog: [
      {
        character: 'them',
        text: 'You do not know?',
      },
      {
        character: 'you',
        text: 'I do not.',
      },
      {
        character: 'them',
        text: [
          'That is really a shame.',
          'Because I wanted to ask you the same question.',
        ],
      },
      {
        character: 'you',
        text: 'Oh.',
      },
      {
        character: 'them',
        text: 'Do you remember where you were before Valdrada?',
      },
      {
        character: 'you',
        text: ['In a hotel.', 'Somewhere.'],
      },
      {
        character: 'them',
        text: 'What do you remember from this place?',
      },
      {
        character: 'you',
        text: ['Spirits.', 'A key.', 'Music.'],
      },
      {
        character: 'you',
        text: 'There was always music in the air.',
        audioBefore: '/e060f71aecc0bb69fc660ac583634bb7.mp3',
        audioVolume: 1,
        pauseAfter: 1500,
      },
      {
        character: 'you',
        text: ['A bright light.', 'An unexpected passage through a kitchen.'],
        pauseAfter: 1500,
      },
      {
        character: 'you',
        text: 'This is all I know.',
        pauseAfter: 1500,
      },
      {
        character: 'them',
        text: ['A passage through a kitchen.', 'How curious.'],
        pauseAfter: 1500,
      },
      {
        character: 'them',
        text: [
          'I am sorry.',
          'I do not understand these things.',
          'I do not know how you arrived in Valdrada.',
          'But I am here to help if I can.',
        ],
      },
    ],
    goto: 'main',
  },
  departure: {
    dialog: [
      {
        character: 'them',
        text: 'Hopefully the book I gave you will help in some way.',
        condition: {
          hasBook: true,
        },
      },
      {
        character: 'them',
        text: 'Your fate is now in the hands of the cormorants.',
        condition: {
          cormorants: true,
          hasBook: true,
        },
      },
      {
        character: 'them',
        text: "As far as I know, you can't.",
        condition: {
          hasBook: undefined,
        },
      },
      {
        character: 'them',
        text: "I don't know how much I should tell you.",
        condition: {
          askedBooks: undefined,
          hasBook: undefined,
        },
      },
      {
        character: 'them',
        text: [
          "You can't leave until your reflection does.",
          "And you can't talk to your own reflection.",
          "Trust me, I've tried.",
        ],
        condition: {
          askedNeverLeft: true,
          hasBook: undefined,
        },
      },
      {
        character: 'them',
        text: [
          "I even looked for ... some way to escape ... in the Story Keeper's books.",
        ],
        condition: {
          storyKeeperLeft: true,
          askedNeverLeft: true,
          askedBooks: true,
          hasBook: undefined,
        },
        effects: {
          storyKeeperBooks: true,
        },
      },
    ],
    goto: 'main',
  },
  map: {
    dialog: [
      {
        character: 'them',
        text: 'This is true.',
        condition: {
          mapReasonExplained: undefined,
        },
      },
      {
        character: 'them',
        text: 'This map was given to me.',
      },
      {
        character: 'you',
        text: 'Given to you?',
        condition: {
          mapReasonExplained: undefined,
        },
      },
      {
        character: 'them',
        text: 'A traveller like you came to Valdrada and recounted their journey here.',
        condition: {
          mapReasonExplained: undefined,
        },
      },
      {
        character: 'you',
        text: 'So they only knew the names of the places leading here?',
        condition: {
          mapReasonExplained: undefined,
        },
      },
      {
        character: 'them',
        text: 'Yes.',
        condition: {
          mapReasonExplained: undefined,
        },
      },
      {
        character: 'them',
        text: 'I, myself, have never left Valdrada.',
      },
      {
        character: 'them',
        text: ['I do not know what lies beyond this city.'],
        condition: {
          mapReasonExplained: undefined,
        },
        effects: {
          mapReasonExplained: true,
        },
      },
    ],
    goto: 'cities',
  },
  cities: {
    choices: [
      {
        text: 'You have never left Valdrada?',
        goto: 'left',
        effects: {
          askedNeverLeft: true,
        },
      },
      {
        text: 'Who was this other traveller?',
        goto: 'storykeeper',
        once: true,
        effects: {
          storyKeeperIntroduced: true,
          items: 1,
        },
      },
      {
        text: 'What kind of tools?',
        condition: {
          items: 1,
        },
        effects: {
          items: 2,
        },
        goto: 'tools',
      },
      {
        text: 'What kind of maps?',
        condition: {
          items: 2,
        },
        effects: {
          items: 3,
        },
        goto: 'maps',
      },
      {
        text: 'What kind of books?',
        condition: {
          items: 3,
        },
        effects: {
          items: 4,
          askedBooks: true,
        },
        goto: 'books',
      },
      {
        text: 'Is the Story Keeper still in Valdrada?',
        goto: 'storykeeperValdrada',
        condition: {
          storyKeeperIntroduced: true,
        },
        effects: {
          storyKeeperLeft: true,
        },
      },
      {
        text: 'I have another question.',
        goto: 'main',
      },
    ],
  },
  tools: {
    dialog: [
      {
        character: 'them',
        text: 'Frankly, I did not understand any of them.',
      },
      {
        character: 'them',
        text: 'Tools they claimed worked across time and space.',
      },
    ],
    goto: 'cities',
  },
  maps: {
    dialog: [
      {
        character: 'them',
        text: [
          'Maps from all over.',
          'Including the one I gave to you of our world.',
          'Places stranger than anything I could ever comprehend.',
          'I asked, repeatedly, if these maps were imaginary.',
          'The Story Keeper claimed they were real.',
          'Even the map to paradise.',
        ],
      },
    ],
    goto: 'cities',
  },
  books: {
    dialog: [
      {
        character: 'them',
        text: [
          'Books from faraway places.',
          'Books that hypnotized you and drew you in.',
          'Even though you did not understand a word of them.',
          'The Story Keeper told me entire universes existed between the pages of these books.',
          'All the answers we could possibly need.',
          'I did not understand at the time.',
        ],
        pauseAfter: 500,
      },
      {
        character: 'them',
        text: ["I still don't."],
      },
    ],
    goto: 'cities',
  },
  storykeeper: {
    dialog: [
      {
        character: 'them',
        text: 'A fascinating character.',
        pauseAfter: 1000,
      },
      {
        character: 'them',
        text: 'The Story Keeper.',
      },
      {
        character: 'you',
        text: ['The Story Keeper...'],
      },
      {
        character: 'them',
        text: [
          'Yes.',
          'That is the name they gave me.',
          'I am not sure how they found their way here.',
          "Let's just say we don't get a lot of visitors.",
        ],
        pauseAfter: 1500,
      },
      {
        character: 'them',
        text: [
          'Anyway.',
          'We spent some time together during their short stay.',
          'They had a lot of interesting items in tow.',
        ],
        pauseAfter: 750,
      },
      {
        character: 'them',
        text: ['Tools.', 'Maps.', 'Books.', 'Lots and lots of books.'],
        pauseAfter: 500,
      },
      {
        character: 'them',
        text: [
          'A curious creature.',
          'I enjoyed their company.',
          'I hope they come back.',
        ],
      },
    ],
    goto: 'cities',
  },
  storykeeperValdrada: {
    dialog: [
      {
        character: 'them',
        text: [
          'Sadly, no.',
          'We would spend the evenings together, talking.',
          'One night, they did not show up.',
        ],
        pauseAfter: 2000,
      },
      {
        character: 'them',
        text: [
          'I was surprised.',
          'They did not seem in a hurry to leave.',
          'I have no idea how they found a way out.',
          'One of many things I would like to ask them.',
        ],
      },
    ],
    goto: 'cities',
  },
  left: {
    dialog: [
      {
        character: 'them',
        text: ['I cannot leave until my reflection does.'],
      },
      {
        character: 'them',
        text: ['We are bound together.'],
      },
      {
        character: 'them',
        text: ['Eternally haunting each other.'],
      },
      {
        character: 'them',
        text: [
          'Like a shadow that does not fade... even in the absence of light.',
        ],
      },
    ],
    goto: 'cities',
  },
  valdrada: {
    dialog: [
      {
        character: 'them',
        text: 'Where are you?',
      },
      {
        character: 'you',
        text: 'Yes...',
      },
      {
        character: 'them',
        text: ['This is Valdrada.', 'The twin city.'],
      },
    ],
    goto: 'main',
  },
  twin: {
    dialog: [
      {
        character: 'them',
        text: ['Our entire city is reflected in this river.', 'Look down.'],
      },
      {
        character: 'you',
        text: 'I see it.',
      },
      {
        character: 'them',
        text: 'Nothing happens or exists that is not mirrored by the other city.',
      },
      {
        character: 'you',
        text: 'The other city?',
      },
      {
        character: 'them',
        text: 'The city in the reflection.',
      },
      {
        character: 'you',
        text: 'Do people live in the reflection?',
      },
      {
        character: 'them',
        text: 'Yes.',
      },
      {
        character: 'them',
        text: 'We live in imperfect symmetry.',
      },
      {
        character: 'you',
        text: 'Imperfect how?',
      },
      {
        character: 'them',
        text: [
          'Our worlds are not the same.',
          'Our ideas, our intentions, our values.',
          'Every decision is made knowing it will be repeated and distorted.',
          'Like a broken reflection you cannot look away from.',
          'We are always watching each other.',
          'Living for the other.',
          "We are each other's gods.",
          'Cursed gods.',
        ],
        pauseAfter: 1500,
      },
      {
        character: 'them',
        text: [
          'But how rude of me, I have not even introduced myself.',
          'My name is Adrogué.',
        ],
        pronunciations: {
          ['Adrogué']: 'adɹoɡeː',
        },
      },
    ],
    goto: 'main',
  },
  traveller: {
    dialog: [
      {
        character: 'them',
        text: [
          'It is nice to meet you, Traveller.',
          'What is your destination?',
        ],
      },
      {
        character: 'you',
        text: ['I -', 'I do not know.', 'I think I am going home.'],
      },
      {
        character: 'them',
        inventory: [INVENTORY_MAP],
        text: [
          'Then I hope you will get there safely.',
          'Perhaps this map can somehow help you.',
          'Perhaps not.',
        ],
      },
    ],
    goto: 'main',
  },
  answers: {
    dialog: [
      {
        character: 'them',
        text: [
          'The Story Keeper had a lot of interesting books.',
          'They were happy to let me read them.',
          'I never told the Story Keeper, but...',
          'I scoured the books in hopes of finding an answer.',
          'How to talk to my reflection.',
          'How to reach across the divide.',
          'How to leave Valdrada.',
        ],
        pauseAfter: 2000,
      },
      {
        character: 'them',
        text: [
          'At any rate...',
          'I did not find anything.',
          'Most of the books were written in strange languages.',
          'Mysterious alphabets.',
          'Like nothing I had ever seen.',
        ],
      },
    ],
    goto: 'main',
  },
  mystery: {
    dialog: [
      {
        character: 'them',
        text: [
          'Like something from another world.',
          'The night before the Story Keeper left, they gave me a book.',
          'A book to keep.',
          'Told me it held the answers I seeked.',
        ],
        pauseAfter: 1000,
      },
      {
        character: 'them',
        text: [
          'How did they know I was searching?',
          'I suppose I will never know.',
          'I am only left with questions.',
          'And the book.',
        ],
      },
    ],
    goto: 'main',
  },
  book: {
    dialog: [
      {
        character: 'them',
        text: ['Hmm.'],
        pauseAfter: 3000,
      },
      {
        character: 'them',
        inventory: [INVENTORY_BOOK],
        text: ['Why not?', 'Maybe you will fare better than me.'],
      },
    ],
    goto: 'main',
  },
};
