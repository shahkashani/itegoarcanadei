import { INVENTORY_BOOK } from './types';

export default {
  enter: {
    dialog: [
      {
        character: 'them',
        text: 'Hello.',
      },
      {
        character: 'you',
        text: ['Hi.', 'Have we met?'],
      },
      {
        character: 'them',
        text: ['I think so.', 'But it feels like it was in a dream.'],
        pauseAfter: 1500,
      },
      {
        character: 'them',
        text: [
          'I think I am supposed to give you something.',
          "But I can't remember.)",
        ],
        condition: {
          cormorants: false,
        },
      },
      {
        character: 'them',
        text: [
          'I think I am supposed to give you this book.',
          "But I can't remember why.",
        ],
        inventory: [INVENTORY_BOOK],
        condition: {
          cormorants: true,
          givenBook: undefined,
        },
        effects: {
          givenBook: true,
        },
      },
    ],
    goto: 'exit',
  },
};
