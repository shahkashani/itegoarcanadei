const apps = [
  ['Gods', 3000],
  ['Daphnis', 3001],
  ['Tartahk', 3002],
  ['Euphemia', 3003],
  ['Isaura', 3004],
  ['Eudoxia', 3005],
  ['Maurilia', 3006],
  ['Procopia', 3007],
  ['Valdrada', 3008],
  ['Adardlav', 3009],
  ['Esmeralda', 3010],
];

apps.forEach(([name, port]) => {
  try {
    const app = require(`@itegoarcanadei/${name.toLowerCase()}/server`);
    app.listen(port, () => {
      console.log(`${name} running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
  }
});
