const express = require('express');
const app = express();
const { resolve } = require('path');
const { routes } = require('@itegoarcanadei/server-shared');

const PORT = process.env.PORT || 3000;

const PUBLIC_FOLDER = './dist/public';
const PUBLIC_PAGE = resolve(`${PUBLIC_FOLDER}/public.html`);
const NEXT_CITY = 'https://leonia.itegoarcanadei.com/';

app.use(express.static(PUBLIC_FOLDER));
app.use(express.static('./assets'));

app.post('/gate', async (_req, res) => {
  res.json({
    portal: NEXT_CITY,
  });
});

app.get('/', async (_req, res) => {
  res.sendFile(PUBLIC_PAGE);
});

routes.addCommonAssetsRoute(app);

app.listen(PORT, async () => {
  console.log(`Moriana running at http://localhost:${PORT}`);
});
