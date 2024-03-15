const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { resolve } = require('path');
const { routes } = require('@itegoarcanadei/server-shared');
const getSvg = require('./utils/svg');
const { readFileSync } = require('fs');
const md5 = require('fast-md5').default;

const PUBLIC_FOLDER = resolve(__dirname, './dist/public');
const ASSETS_PUBLIC = resolve(__dirname, './assets');
const PUBLIC_PAGE = resolve(PUBLIC_FOLDER, './public.html');

const NEXT_CITY = 'https://moriana.itegoarcanadei.com/';

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(PUBLIC_FOLDER));
app.use(express.static(ASSETS_PUBLIC));

const CONSTELLATIONS = [
  { name: 'Orion' },
  { name: 'Pisces' },
  { name: 'Ara' },
  { name: 'Boetes', alias: ['Boötes', 'Bootes'] },
  { name: 'Equuleus' },
  { name: 'Lyra' },
  { name: 'Hydra' },
  { name: 'Delphin', alias: ['Delphinus'] },
  { name: 'Cepheus' },
  { name: 'Phyllirides' },
].map((constellation) => ({
  ...constellation,
  file: constellation.name.toLowerCase() + '.svg',
  id: md5(constellation.name),
  names: [constellation.name, ...(constellation.alias || [])],
}));

const getConstellationById = (searchId) =>
  CONSTELLATIONS.find(({ id }) => id === searchId);

const getConstellationIndex = (searchId) =>
  CONSTELLATIONS.findIndex(({ id }) => id === searchId);

const isCorrectAnswer = (names, name) =>
  !!names.find((n) => n.toLowerCase() === name.toLowerCase());

const getConstellation = async (file, isHidden = true) => {
  const raw = readFileSync(
    resolve(__dirname, './constellations', file)
  ).toString();
  const SVG = await getSvg();
  const svg = new SVG(raw);
  let numStar = 0;
  svg.children().forEach((child, i) => {
    if (child.fill().toLowerCase() !== '#fff') {
      if (isHidden) {
        child.remove();
      } else {
        child.attr({ fill: null, data: 'constellation' });
      }
    } else {
      child
        .attr({ fill: null, data: 'star' })
        .css({ 'animation-delay': `${numStar * 300}ms` });
      numStar += 1;
    }
  });
  return svg.svg();
};

app.get('/constellation', async (_req, res) => {
  const { file, name, id } = CONSTELLATIONS[0];
  const svg = await getConstellation(file);
  res.json({
    id,
    name,
    constellation: svg,
  });
});

app.post('/constellation', async (req, res) => {
  const { id, name } = req.body;
  if (!id || !name) {
    return res.sendStatus(500);
  }
  const constellation = getConstellationById(id);
  if (!constellation) {
    return res.sendStatus(500);
  }
  if (!isCorrectAnswer(constellation.names, name)) {
    return res.sendStatus(403);
  }
  const index = getConstellationIndex(id);
  let next = {};
  if (index < CONSTELLATIONS.length - 1) {
    const nextConstellation = CONSTELLATIONS[index + 1];
    next = {
      id: nextConstellation.id,
      name: nextConstellation.name,
      constellation: await getConstellation(nextConstellation.file),
    };
  } else {
    next = {
      portal: NEXT_CITY,
    };
  }
  res.send({
    next,
    current: {
      id,
      name,
      constellation: await getConstellation(constellation.file, false),
    },
  });
});

app.get('/', (_req, res) => res.sendFile(PUBLIC_PAGE));

routes.addCommonAssetsRoute(app);

module.exports = app;
