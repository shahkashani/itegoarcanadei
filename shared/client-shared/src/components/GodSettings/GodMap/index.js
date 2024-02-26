import styled, { keyframes, css } from 'styled-components';
import { FadeImage, WithFade } from '../../../components';
import { contain } from 'intrinsic-scale';
import { useState } from 'react';
import { GodCity } from '../GodCity';

const MAP_WIDTH = 3000;
const MAP_HEIGHT = 2224;
const MARKER_SIZE = 34;
const MIN_MARKER_SIZE = 1;
const MAP_MIN_SCALE = 0.2;
const LINK_TARGET = '_blank';

const fade = keyframes`
  0% { opacity:0 }
`;

const MARKERS = [
  {
    name: 'Daphnis',
    x: 10,
    y: 10,
    url: 'https://enter.itegoarcanadei.com/',
  },
  {
    name: 'Tartahk',
    x: 190,
    y: 200,
    url: 'https://tartahk.itegoarcanadei.com/',
  },
  {
    name: 'Euphemia',
    number: 'I',
    description:
      'Proceeding eighty miles into the northwest wind, you reach the city of Euphemia, where the merchants of seven nations gather at every solstice and equinox. The boat that lands there with a cargo of ginger and cotton will set sail again, its hold filled with pistachio nuts and poppy seeds, and the caravan that has just unloaded sacks of nutmegs and raisins is already cramming its saddlebags with bolts of golden muslin for the return journey. But what drives men to travel up rivers and cross deserts to come here is not only the exchange of wares, which you could find, everywhere the same, in all the bazaars inside and outside the Great Khan\'s empire, scattered at your feet on the same yellow mats, in the shade of the same awnings protecting them from the flies, offered with the same lying reduction in prices. You do not come to Euphemia only to buy and sell, but also because at night, by the fires all around the market, seated on sacks or barrels or stretched out on piles of carpets, at each word that one man says—such as "wolf", "sister", "hidden treasure", "battle", "scabies", "lovers"—the others tell, each one, his tale of wolves, sisters, treasures, scabies, lovers, battles. And you know that in the long journey ahead of you, when to keep awake against the camel\'s swaying or the junk\'s rocking, you start summoning up your memories one by one, your wolf will have become another wolf, your sister a different sister, your battle other battles, on your return from Euphemia, the city where memory is traded at every solstice and at every equinox.',
    x: 680,
    y: 350,
    url: 'https://euphemia.itegoarcanadei.com/',
  },
  {
    name: 'Isaura',
    number: 'II',
    description:
      "Isaura, city of the thousand wells, is said to rise over a deep, subterranean lake. On all sides, wherever the inhabitants dig long vertical holes in the ground, they succeed in drawing up water, as far as the city extends, and no farther. Its green border repeats the dark outline of the buried lake; an invisible landscape conditions the visible one; everything that moves in the sunlight is driven by the lapping wave enclosed beneath the rock's calcareous sky.\n\nConsequently two forms of religion exist in Isaura.\n\nThe city's gods, according to some people, live in the depths, in the black lake that feeds the underground streams. According to others, the gods live in the buckets that rise, suspended from a cable, as they appear over the edge of the wells, in the revolving pulleys, in the windlasses of the norias, in the pump handles, in the blades of the windmills that draw the water up from the drillings, in the trestles that support the twisting probes, in the reservoirs perched on stilts over the roofs, in the slender arches of the aqueducts, in all the columns of water, the vertical pipes, the plungers, the drains, all the way up to the weathercocks that surmount the airy scaffoldings of Isaura, a city that moves entirely upward.",
    x: 1270,
    y: 150,
    url: 'https://isaura.itegoarcanadei.com/',
  },
  {
    name: 'Eudoxia',
    description:
      "In Eudoxia, which spreads both upward and down, with winding alleys, steps, dead ends, hovels, a carpet is preserved in which you can observe the city's true form. At first sight nothing seems to resemble Eudoxia less than the design of that carpet, laid out in symmetrical motives whose patterns are repeated along straight and circular lines, interwoven with brilliantly colored spires, in a repetition that can be followed throughout the whole woof. But if you pause and examine it carefully, you become convinced that each place in the carpet corresponds to a place in the city and all the things contained in the city are included in the design, arranged according their true relationship, which escapes your eye distracted by the bustle, the throngs, the shoving. All of Eudoxia's confusion, the mules' braying, the lampblack stains, the fish smell is what is evident in the incomplete perspective you grasp; but the carpet proves that there is a point from which the city shows its true proportions, the geometrical scheme implicit in its every, tiniest detail.\n\nIt is easy to get lost in Eudoxia: but when you concentrate and stare at the carpet, you recognize the street you were seeking in a crimson or indigo or magenta thread which, in a wide loop, brings you to the purple enclosure that is your real destination. Every inhabitant of Eudoxia compares the carpet's immobile order with his own image of the city, an anguish of his own, and each can find, concealed among the arabesques, an answer, the story of his life, the twists of fate.\n\nAn oracle was questioned about the mysterious bond between two objects so dissimilar as the carpet and the city. One of the two objects—the oracle replied—has the form the gods gave the starry sky and the orbits in which the worlds revolve; the other is an approximate reflection, like every human creation.\n\nFor some time the augurs had been sure that the carpet's harmonious pattern was of divine origin. The oracle was interpreted in this sense, arousing no controversy. But you could, similarly, come to the opposite conclusion: that the true map of the universe is the city of Eudoxia, just as it is, a stain that spreads out shapelessly, with crooked streets, houses that crumble one upon the other amid clouds of dust, fires, screams in the darkness.",
    number: 'III',
    x: 2220,
    y: 600,
    url: 'https://eudoxia.itegoarcanadei.com/',
  },
  {
    name: 'Maurilia',
    description:
      "In Maurilia, the traveler is invited to visit the city and, at the same time, to examine some old postcards that show it as it used to be: the same identical square with a hen in the place of the bus station, a bandstand in the place of the overpass, two young ladies with white parasols in the place of the munitions factory. If the traveler does not wish to disappoint the inhabitants, he must praise the postcard city and prefer it to the present one, though he must be careful to contain his regret at the changes within definite limits; admitting that the magnificence and prosperity of the metropolis Maurilia, when compared to the old, provincial Maurilia, cannot compensate for a certain lost grace, which, however, can be appreciated only now in the old postcards, whereas before, when that provincial Maurilia was before one's eyes, one saw absolutely nothing graceful and would see it even less today, if Maurilia had remained unchanged; and in any case the metropolis has the added attraction that, through what it has become, one can look back with nostalgia at what it was.\n\nBeware of saying to them that sometimes different cities follow one another on the same site and under the same name, born and dying without knowing one another, without communication among themselves. At time even the names of the inhabitants remain the same, and their voices' accent, and also the features of the faces; but the gods who live beneath names and above places have gone off without a word and outsiders have settled in their place. It is pointless to ask whether the new ones are better or worse than the old, since there is no connection between them, just as the old post cards do not depict Maurilia as it was, but a different city which, by chance, was called Maurilia, like this one.",
    number: 'IV',
    x: 2450,
    y: 1060,
    url: 'https://maurilia.itegoarcanadei.com/',
    urls: [
      {
        title: 'Travel to the past',
        url: 'https://web.archive.org/web/20220620144122/https://maurilia.itegoarcanadei.com/',
      },
    ],
  },
  {
    name: 'Procopia',
    description:
      "Each year in the course of my travels I stop at Procopia and take lodgings in the same room in the same inn. Ever since the first time I have lingered to contemplate the landscape to be seen by raising the curtain at the window: a ditch, a bridge, a little wall, a medlar, a field of corn, a bramble patch with blackberries, a chicken yard, the yellow hump of a hill, a white cloud, a stretch of blue sky shaped like a trapeze. The first time I am sure there was no one to be seen; it was only the following year that, at a movement among the leaves, I could discern a round, flat face, gnawing on an ear of corn. A year later there were three of them on the wall, and at my return I saw six, seated in a row, with their hands on their knees and some medlars in a dish. Each year, as soon as I entered the room, I raised the curtain and counted more faces: sixteen, including those down in the ditch; twenty-nine, of whom eight were perched in the medlar; forty-seven, besides those in the chicken house. They look alike, they seem polite, they have freckles on their cheeks, they smile, some have lips stained by blackberries. Soon I saw the whole bridge filled with round-faced characters, huddled, because they had no more room to move in; they chomped the kernels of corn, then they gnawed on the ears.\n\nAnd so, as year followed year, I saw the ditch vanish, the tree, the bramble patch, hidden by hedges of calm smiles, between round cheeks, moving, chewing leaves. You have no idea how many people can be contained in a confined space like that little field of corn, especially when they are seated, hugging their knees, motionless. They must have been many more than they seemed: I saw the hump of the hill become covered with a thicker and thicker crowd; but now that the ones on the bridge have got into the habit of straddling one another's shoulders, my gaze can no longer reach that far.\n\nThis year, finally, as I raise the curtain, the window frames only an expanse of faces: from one corner to the other, at all levels and all distances, those round, motionless, entirely flat faces are seen, with a hint of smile, and in their midst, many hands, grasping the shoulders of those in front. Even the sky has disappeared. I might as well leave the window.\n\nNot that it is easy for me to move. There are twenty-six of us lodged in my room: to shift my feet I have to disturb those crouching on the floor, I force my way among the knees of those seated on the chest of drawers and the elbows of those taking turns leaning on the bed: all very polite people, luckily.",
    number: 'V',
    x: 2090,
    y: 1500,
    url: 'https://procopia.itegoarcanadei.com/',
  },
  {
    name: 'Valdrada',
    description:
      "The ancients built Valdrada on the shores of a lake, with houses all verandas one above the other, and high streets whose railed parapets look out over the water. Thus the traveler, arriving, sees two cities: one erect above the lake, and the other reflected, upside down. Nothing exists or happens in the one Valdrada that the other Valdrada does not repeat, because the city was so constructed that its every point would be reflected in its mirror, and the Valdrada down in the water contains not only all the flutings and juttings of the facades that rise above the lake, but also the rooms' interiors with ceilings and floors, the perspective of the halls, the mirrors of the wardrobes.\n\nValdrada's inhabitants know that each of their actions is, at once, that action and its mirror-image, which possesses the special dignity of images, and this awareness prevents them from succumbing for a single moment to chance and forgetfulness. Even when lovers twist their naked bodies, skin against skin, seeking the position that will give one the most pleasure in the other, even when murderers plunge the knife into the black veins of the neck and more clotted blood pours out the more they press the blade that slips between the tendons, it is not so much their copulating or murdering that matters as the copulating or murdering of the images, limpid and cold in the mirror.\n\nAt times the mirror increases a thing's value, at times denies it. Not everything that seems valuable above the mirror maintains its force when mirrored. The twin cities are not equal, because nothing that exists or happens in Valdrada is symmetrical: every face and gesture is answered, from the mirror, by a face and gesture inverted, point by point. The two Valdradas live for each other, their eyes interlocked; but there is no love between them.",
    number: 'VI',
    x: 1620,
    y: 2000,
    url: 'https://valdrada.itegoarcanadei.com/',
    urls: [
      {
        title: 'Travel to Adardlav',
        url: 'https://adardlav.itegoarcanadei.com/',
      },
    ],
  },
  {
    name: 'Esmeralda',
    description:
      'In Esmeralda, city of water, a network of canals and a network of streets span and intersect each other. To go from one place to another you have always the choice between land and boat: and since the shortest distance between two points in Esmeralda is not a straight line but a zigzag that ramifies in tortuous optional routes, the ways that open to each passerby are never two, but many, and they increase further for those who alternate a stretch by boat with one on dry land.\n\nAnd so Esmeralda’s inhabitants are spared the boredom of following the same streets every day. And that is not all: the network of routes is not arranged on one level, but follows instead an up-and-down course of steps, landings, cambered bridges, hanging streets. Combining segments of the various routes, elevated or on ground level, each inhabitant can enjoy every day the pleasure of a new itinerary to reach the same places. The most fixed and calm lives in Esmeralda are spent without any repetition.\n\nSecret and adventurous lives, here as elsewhere, are subject to greater restrictions. Esmeralda’s cats, thieves, illicit lovers move along higher, discontinuous ways, dropping from a rooftop to a balcony, following gutterings with acrobats’ steps. Below, the rats run in the darkness of the sewers, one behind the other’s tail, along with conspirators and smugglers; they peep out of manholes and drainpipes, they slip through double bottoms and ditches, from one hiding place to another they drag crusts of cheese, contraband goods, kegs of gunpowder, crossing the city’s compactness pierced by the spokes of underground passages.\n\nA map of Esmeralda should include, marked in different coloured inks, all these routes, solid and liquid, evident and hidden. It is more difficult to fix on the map the routes of the swallows, who cut the air over the roofs, dropping long invisible parabolas with their still wings, darting to gulp a mosquito, spiralling upward, grazing a pinnacle, dominating from every point of their airy paths all the points of the city.',
    number: 'VII',
    x: 1370,
    y: 1800,
    url: 'https://esmeralda.itegoarcanadei.com/',
  },

  {
    name: 'Andria',
    description:
      "Andria was built so artfully that its every street follows a planet's orbit, and the buildings and the places of community life repeat the order of the constellations and the position of the most luminous stars: Antares, Alpheratz, Capricorn, the Cepheids. The city's calendar is so regulated that jobs and offices and ceremonies are arranged in a map corresponding to the firmament on that date: and thus the days on earth and the nights in the sky reflect each other.\n\nThough it is painstakingly regimented, the city's life flows calmly like the motion of the celestial bodies and it acquires the inevitability of phenomena not subject to human caprice. In praising Andria's citizens for their productive industry and their spiritual ease, I was led to say: I can well understand how you, feeling yourselves part of an unchanging heaven, cogs in a meticulous clockwork, take care not to make the slightest change in your city and your habits. Andria is the only city I know where it is best to remain motionless in time.\n\nThey looked at one another dumbfounded. \"But why? Whoever said such a thing?\" And they led me to visit a suspended street recently opened over a bamboo grove, a shadow-theater under construction in the place of the municipal kennels, now moved to the pavilions of the former lazaretto, abolished when the last plague victims were cured, and—just inaugurated—a river port, a statue of Thales, a toboggan slide.\n\n\"And these innovations do not disturb your city's astral rhythm?\" I asked.\n\n\"Our city and the sky correspond so perfectly,\" they answered, \"that any change in Andria involves some novelty among the stars.\" The astronomers, after each change takes place in Andria, peer into their telescopes and report a nova's explosion, or a remote point in the firmament's change of color from orange to yellow, the expansion of a nebula, the bending of a spiral of the Milky Way. Each change implies a sequence of other changes, in Andria as among the stars: the city and the sky never remain the same.\n\nAs for the character of Andria's inhabitants, two virtues are worth mentioning: self-confidence and prudence. Convinced that every innovation in the city influences the sky's pattern, before taking any decision they calculate the risks and advantages for themselves and for the city and for all worlds.",
    number: 'VIII',
    x: 300,
    y: 1200,
    url: 'https://andria.itegoarcanadei.com/',
  },
  {
    name: 'Moriana',
    description:
      "When you have forded the river, when you have crossed the mountain pass, you suddently find before you the city of Moriana, its alabaster gates transparent in the sunlight, its coral columns supporting pediments encrusted with serpentine, its villas all of glass like aquariums where the shadows of dancing girls with silvery scales swim beneath the medusa-shaped chandeliers. If this is not your first journey, you already know that cities like this have an obverse: you have only to walk a semi-circle and you will come into view of Moriana's hidden face, an expanse of rusting sheet metal, sackcloths, planks bristling with spikes, pipes black with soot, piles of tins, behind walls with fading signs, frames of staved-in straw chairs, ropes good only for hanging oneself from a rotten beam.\n\nFrom one part to the other, the city seems to continue, in perspective, multiplying its repretory of images: but instead it has no thickness, it consists only of a face and an obverse, like a sheet of paper, with a figure on either side, which can neither be seperated nor look at each other.",
    number: 'IX',
    x: 1650,
    y: 590,
    url: 'https://moriana.itegoarcanadei.com/',
  },
  {
    name: 'Leonia',
    description:
      "The city of Leonia refashions itself every day: every morning the people wake between fresh sheets, wash with just-unwrapped cakes of soap, wear brand-new clothing, take from the latest model refrigerator still unopened tins, listening to the last-minute jingles from the most up-to-date radio.\n\nOn the sidewalks, encased in spotless plastic bags, the remains of yesterday's Leonia await the garbage truck. Not only squeezed rubes of toothpaste, blown-out light bulbs, newspapers, containers, wrappings, but also boilers, encyclopedias, pianos, porcelain dinner services. It is not so much by the things that each day are manufactured, sold, bought that you can measure Leonia's opulence, but rather by the things that each day are thrown out to make room for the new. So you begin to wonder if Leonia's true passion is really, as they say, the enjoyment of new and different things, and not, instead, the joy of expelling, discarding, cleansing itself of a recurrent impurity. The fact is that street cleaners are welcomed like angels, and their task of removing the residue of yesterday's existence is surrounded by a respectful silence, like a ritual that inspires devotion, perhaps only because once things have been cast off nobody wants to have to think about them further.\n\nNobody wonders where, each day, they carry their load of refuse. Outside the city, surely; but each year the city expands, and the street cleaners have to fall farther back. The bulk of the outflow increases and the piles rise higher, become stratified, extend over a wider perimeter. Besides, the more Leonia's talent for making new materials excels, the more the rubbish improves in quality, resists time, the elements, fermentations, combustions. A fortress of indestructible leftovers surrounds Leonia, dominating it on every side, like a chain of mountains.\n\nThis is the result: the more Leonia expels goods, the more it accumulates them; the scales of its past are soldered into a cuirass that cannot be removed. As the city is renewed each day, it preserves all of itself in its only definitive form: yesterday's sweepings piled up on the sweepings of the day before yesterday and of all its days and years and decades.\n\nLeonia's rubbish little by little would invade the world, if, from beyond the final crest of its boundless rubbish heap, the street cleaners of other cities were not pressing, also pushing mountains of refuse in front of themselves. Perhaps the whole world, beyond Leonia's boundaries, is covered by craters of rubbish, each surrounding a metropolis in constant eruption. The boundaries between the alien, hostile cities are infected ramparts where the detritus of both support each other, overlap, mingle.\n\nThe greater its height grows, the more the danger of a landslide looms: a tin can, an old tire, an unraveled wine flask, if it rolls toward Leonia, is enough to bring with it an avalanche of unmated shoes, calendars of bygone years, withered flowers, submerging the city in its own past, which it had tried in vain to reject, mingling with the past of the neighboring cities, finally clean. A cataclysm will flatten the sordid mountain range, canceling every trace of the metropolis always dressed in new clothes. In the nearby cities they are all ready, waiting with bulldozers to flatten the terrain, to push into the new territory, expand, and drive the new street cleaners still farther out.",
    number: 'X',
    x: 2000,
    y: 1230,
    url: 'https://leonia.itegoarcanadei.com/',
  },
  {
    name: 'Hypatia',
    description:
      'Of all the changes of language a traveler in distant lands must face, none equals that which waits him in the city of Hypatia, because the change regards not words, but things. I entered Hypatia one morning, a magnolia garden was reflected in blue lagoons, I walked among the hedges, sure I would discover young and beautiful ladies bathing; but at the bottom of the water, crabs were biting the eyes of the suicides, stones tied around their necks, their hair green with seaweed.\n\nI felt cheated and I decided to demand justice of the sultan. I climbed the porphyry steps of the palace with the highest domes, I crossed six tiled courtyards with fountains. The central hall was barred by iron gratings: convicts with black chains on their feet were hauling up basalt blocks from a quarry that opened underground.\n\nI could only question the philosophers. I entered the great library, I became lost among shelves collapsing under the vellum bindings, I followed the alphabetical order of vanished alphabets, up and down halls, stairs, bridges. In the most remote papyrus cabinet, in a cloud of smoke, the dazed eyes of an adolescent appeared to me, as he lay on a mat, his lips glued to an opium pipe.\n\n"Where is the sage?"\n\nThe smoker pointed out of the window. It was a garden with children\'s games: ninepins, a swing, a top. The philosopher was seated on the lawn. He said: "Signs form a language, but not the one you think you know."\n\nI realized I had to free myself from the images which in the past had announced to me the things I sought: only then will I succeed in understanding the language of Hypatia.\n\nNow I have only to hear the neighing of horses and the cracking of whips and I am seized with amorous trepidation: in Hypatia you have to go to the stables and riding rings to see the beautiful women who mount the saddle, thighs naked, greaves on their calves, and as soon as a young foreigner approaches, they fling him on the piles of hay or sawdust and press their firm nipples against him.\n\nAnd when my spirit wants no stimulus or nourishment save music, I know it is to be sought in the cemeteries: the musicians hide in the tombs; from grave to grave flute trills, harp chords answer one another.\n\nTrue, also in Hypatia the day will come when my only desire will be to leave. I know I must not go down to the harbor then, but climb the citadel\'s highest pinnacle and wait for a ship to go by up there. But will it ever go by? There is no language without deceit.',
    number: 'XI',
    x: 1450,
    y: 1510,
    url: 'https://hypatia.itegoarcanadei.com/',
  },
  {
    name: 'Argia',
    description:
      'What makes Argia different from other cities is that it has earth instead of air. The streets are completely filled with dirt, clay packs the rooms to the ceiling, on every stair another stairway is set in negative, over the roofs of the houses hang layers of rocky terrain like skies with clouds. We do not know if the inhabitants can move about the city, widening the worm tunnels and the crevices where roots twist: the dampness destroys people\'s bodies, and they have scant strength; everyone is better off remaining still, prone; anyway, it is dark.\n\nFrom up here, nothing of Argia can be seen; some say "It\'s down below there," and we can only believe them. The place is deserted. At night, putting your ear to the ground, you can sometimes hear a door slam.',
    number: 'XII',
    x: 920,
    y: 1400,
    url: 'https://argia.itegoarcanadei.com/',
  },
  {
    name: 'Zobeide',
    description:
      "From there, after six days and seven nights, you arrive at Zobeide, the white city, well exposed to the moon, with streets wound about themselves as in a skein. They tell this tale of its foundation: men of various nations had an identical dream. They saw a woman running at night through an unknown city; she was seen from behind, with long hair, and she was naked. They dreamed of pursuing her. As they twisted and turned, each of them lost her. After the dream, they set out in search of that city; they never found it, but they found one another; they decided to build a city like the one in the dream. In laying out the streets, each followed the course of his pursuit; at the spot where they had lost the fugitive's trail, they arranged spaces and walls differently from the dream, so she would be unable to escape again.\n\nThis was the city of Zobeide, where they settled, waiting for that scene to be repeated one night. None of them, asleep or awake, ever saw the woman again. The city's streets were streets where they went to work every day, with no link any more to the dreamed chase. Which, for that matter, had long been forgotten.\n\nNew men arrived from other lands, having had a dream like theirs, and in the city of Zobeide, they recognized something from the streets of the dream, and they changed the positions of arcades and stairways to resemble more closely the path of the pursued woman and so, at the spot where she had vanished, there would remain no avenue of escape.\n\nThe first to arrive could not understand what drew these people to Zobeide, this ugly city, this trap.",
    number: 'XIII',
    x: 880,
    y: 1110,
    url: 'https://zobeide.itegoarcanadei.com/',
  },
  {
    name: 'Adelma',
    description:
      'Never in all my travels had I ventured as far as Adelma. It was dusk when I landed there. On the dock the sailor who caught the rope and tied it to the bollard resembled a man who had soldiered with me and was dead. It was the hour of the wholesale fish market. An old man was loading a basket of sea urchins onto a cart; I thought I recognised him; when I turned, he had disappeared down an alley, but I realised he looked like a fisherman who, already old when I was a child, could no longer be among the living. I was upset by the sight of a fever victim huddled on the ground, a blanket over his head: my father a few days before his death had yellow eyes and a growth of beard like this man. I turned my gaze aside; I no longer dared look anyone in the face.\n\nI thought: "If Adelma is a city I am seeing in a dream, where you encounter only the dead, the dream frightens me. If Adelma is a real city, inhabited by living people, I need only continue looking at them and the resemblances will dissolve, alien faces will appear, bearing anguish. In either case it is best for me not to insist on staring at them."\n\nA vegetable vendor was weighing a cabbage on a scales and put it in a basket dangling on a string a girl lowered from a balcony. The girl was identical with one in my village who had gone mad for love and killed herself. The vegetable vendor raised her face: she was my grandmother. I thought: "You reach a moment in life when, among the people you have known, the dead outnumber the living. And the mind refuses to accept more faces, more expressions: on every new face you encounter, it prints the old forms, for each one it finds the most suitable mask."\n\nThe stevedores climbed the steps in a line, bent beneath demijohns and barrels; their faces were hidden by sackcloth hoods; "Now they will straighten up and I will recognise them," I thought, with impatience and fear. But I could not take my eyes off them; if I turned my gaze just a little toward the crowd that crammed those narrow streets, I was assailed by unexpected faces, reappearing from far away, staring at me as if demanding recognition, as if to recognise me, as if they had already recognised me. Perhaps, for each of them, I also resembled someone who was dead. I had barely arrived at Adelma and I was already one of them, I had gone over to their side, absorbed in that kaleidoscope of eyes, wrinkles, grimaces.\n\nI thought: "Perhaps Adelma is the city where you arrive dying and where each finds again the people he has known. This means I, too, am dead." And I also thought: "This means the beyond is not happy."',
    number: 'XIV',
    x: 1400,
    y: 890,
    url: 'https://adelma.itegoarcanadei.com/',
  },
  {
    name: 'Labyrinthus',
    x: 1390,
    y: 1100,
    url: 'https://leonora.itegoarcanadei.com/',
    icon: (
      <svg viewBox="0 0 100 100">
        <path d="M16.77 23.23C24.72 10.09 39.81 1.02 55.2 4.1c24.02 5.22 43.82 30.27 36.75 55.14-3.56 12.53-11.29 24.04-23.57 30.17-12.38 6.19-28.19 8.3-39.22.95-3.68-2.47-2.68-9.38 1.71-10.58 2.64-.73 5.2 1.19 7.9 2.08C58.98 88.49 83.87 68.83 81 43.99c-1.86-16.22-19.08-30.22-33.96-28.62-20.93 2.26-34.63 33.5-12.28 46.9 4.35 2.6 9.65 4.06 14.7 2.7 11.74-3.14 20.6-19.52 8.26-28.65-4.22-3.13-10.42-4.41-14.9.92-3.23 3.85-.47 12.47 3.98 10.8 1.06-1.51.8-5 5.66-5.98 4.1-.82 8.27 3.78 6.64 7.92-2.34 6-8.8 11.45-16.55 9.63-8.85-2.08-14.96-12.2-13.1-21.25 2.2-10.76 13.75-18.04 24.41-16.22 15.55 2.64 26.51 21.99 19.22 37.12-5.6 11.62-18.7 19.5-31.47 17.79-20.11-2.7-35.75-24.46-28.77-44.83.62-2.15.86-2.68 1.39-3.96a40.94 40.94 0 0 1 2.54-5.04Z" />
      </svg>
    ),
  },
];

const Wrapper = styled.div``;

const MapWrapper = styled.div``;

const Img = styled(FadeImage)`
  position: absolute;
`;

const MapMarkerWrapper = styled.a`
  animation: ${fade} 1s ease-in-out;
  cursor: pointer;
  color: #ddd5d4;
  background: black;
  position: absolute;
  text-decoration: none;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  line-height: 1;

  ${({ $isActive }) =>
    $isActive &&
    css`
      color: #bb9a83;
    `};
`;

const MarkerNumber = styled.span`
  color: #888;
`;

const MarkerIcon = styled.span`
  fill: #888;
  font-size: 0;
  line-height: 1;
  ${({ $height }) =>
    $height &&
    css`
      svg {
        height: ${$height}px;
      }
    `};
`;

const CityWrapper = styled(WithFade)`
  background: rgba(0, 0, 0, 0.9);
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 11;
`;

const MapListWrapper = styled.div`
  animation: ${fade} 1s ease-in-out;
  color: white;
  font-size: 20px;
  padding: 0 50px;
  margin: 50px 0;
  max-height: 80vh;
  overflow-y: scroll;

  p {
    margin: 10px 0;
  }
`;

const MapListItemLink = styled.a`
  color: #ddd5d4;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  line-height: 1;

  ${({ $isActive }) =>
    $isActive &&
    css`
      color: #bb9a83;
    `};
`;

const MapMarker = ({ isActive, size, x, y, marker, ...props }) => {
  return (
    <MapMarkerWrapper
      $isActive={isActive}
      style={{ left: x, top: y, fontSize: size, padding: size * 0.5 }}
      target={LINK_TARGET}
      {...props}
    >
      {marker.name}{' '}
      {marker.number && <MarkerNumber>{marker.number}</MarkerNumber>}
      {marker.icon && <MarkerIcon $height={size}>{marker.icon}</MarkerIcon>}
    </MapMarkerWrapper>
  );
};

const MapListItem = ({ marker, isActive, ...props }) => {
  return (
    <MapListItemLink
      $isActive={isActive}
      href={marker.url}
      target={LINK_TARGET}
      {...props}
    >
      {marker.number && <MarkerNumber>{marker.number}</MarkerNumber>}
      {marker.name}
      {marker.icon && <MarkerIcon $height={16}>{marker.icon}</MarkerIcon>}
    </MapListItemLink>
  );
};

const MapList = ({ onSelect, city }) => {
  return (
    <MapListWrapper>
      {MARKERS.map((marker) => (
        <p key={marker.url}>
          <MapListItem
            marker={marker}
            isActive={marker.name === city}
            onClick={(e) => {
              if (marker.description) {
                e.preventDefault();
                onSelect?.(marker);
              }
            }}
          />
        </p>
      ))}
    </MapListWrapper>
  );
};

export const GodMap = ({ city, ...props }) => {
  const [currentMarker, setCurrentMarker] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isShowCity, setIsShowCity] = useState(false);

  const { x, y, width, height } = contain(
    props.width,
    props.height,
    MAP_WIDTH,
    MAP_HEIGHT
  );

  const scale = width / MAP_WIDTH;
  const size = Math.max(MIN_MARKER_SIZE, MARKER_SIZE * scale);

  return (
    <Wrapper>
      {scale > MAP_MIN_SCALE ? (
        <MapWrapper>
          <Img
            onLoaded={() => setIsMapLoaded(true)}
            src="/common/map.webp"
            style={{ top: y, left: x, width, height }}
          />
          {isMapLoaded &&
            MARKERS.map((marker) => (
              <MapMarker
                href={marker.url}
                isActive={marker.name === city}
                key={marker.name}
                onClick={(e) => {
                  if (marker.description) {
                    e.preventDefault();
                    setCurrentMarker(marker);
                    setIsShowCity(true);
                  }
                }}
                marker={marker}
                size={size}
                x={x + marker.x * scale}
                y={y + marker.y * scale}
              />
            ))}
        </MapWrapper>
      ) : (
        <MapList
          city={city}
          onSelect={(marker) => {
            setCurrentMarker(marker);
            setIsShowCity(true);
          }}
        />
      )}
      <CityWrapper isVisible={currentMarker && isShowCity}>
        <GodCity
          city={currentMarker}
          linkTarget={LINK_TARGET}
          onClose={() => setIsShowCity(false)}
        />
      </CityWrapper>
    </Wrapper>
  );
};
