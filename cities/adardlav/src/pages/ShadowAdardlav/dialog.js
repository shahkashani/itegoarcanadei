import { INVENTORY_SHARD } from './types';

export default {
  enter: {
    dialog: [
      {
        character: 'them',
        text: [
          "I can't see you, but I know you're here.",
          'Albino raven.',
          'Sing to the mask that once belonged to life.',
        ],
      },
      {
        character: 'them',
        text: [
          'In another world, I gave you this shard.',
          'In another place, I held the promise.',
        ],
        inventory: [INVENTORY_SHARD],
        once: true,
      },
    ],
    goto: 'exit',
  },
};
