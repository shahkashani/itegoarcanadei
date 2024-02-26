const express = require('express');
const app = express();
const { resolve } = require('path');
const { routes } = require('@itegoarcanadei/server-shared');

const PORT = process.env.PORT || 3000;

const PUBLIC_FOLDER = './dist/public';

app.use(express.static(PUBLIC_FOLDER));
app.use(express.static('./assets'));

routes.addCommonAssetsRoute(app);

app.get('/', async (_req, res) => {
  res.sendFile(resolve(`${PUBLIC_FOLDER}/public.html`));
});

app.listen(PORT, () => {
  console.log(`Eudoxia running at http://localhost:${PORT}`);
});
