import { INVENTORY_SHARD } from './types';

export default {
  enter: {
    dialog: [
      {
        character: 'them',
        text: ["I can't see you, but I know you're here."],
        pauseAfter: 1500,
      },
      {
        character: 'them',
        text: [
          'I feel it.',
          'I wish I could see your face.',
          'Just look into your eyes and tell you how good it is to be here.',
        ],
      },
      {
        character: 'them',
        text: [
          'To give you this shard.',
          'To hold the promise.',
          'Maybe in another universe, I did.',
        ],
        inventory: [INVENTORY_SHARD],
        once: true,
      },
    ],
    goto: 'next',
  },
  next: {
    dialog: [
      {
        character: 'them',
        text: [
          "But you're not here.",
          "I'm here.",
          'I wish you were here.',
          'I wish you could talk to me.',
          "'Cause I'm a friend.",
        ],
      },
      {
        character: 'them',
        text: ['Companero.'],
      },
    ],
    goto: 'exit',
  },
};
