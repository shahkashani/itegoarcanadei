const apps = [
  ['Gods', 3000],
  ['Daphnis', 3001],
  ['Tartahk', 3002],
  ['Esmeralda', 3003],
  ['Isaura', 3004],
];

apps.forEach(([name, port]) => {
  const app = require(`@itegoarcanadei/${name.toLowerCase()}/server`);
  app.listen(port, () => {
    console.log(`${name} running at http://localhost:${port}`);
  });
});
