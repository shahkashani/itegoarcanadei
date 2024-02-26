const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { resolve } = require('path');

const PORT = process.env.PORT || 3000;

const PUBLIC_FOLDER = './dist/public';
const PUBLIC_PAGE = resolve(`${PUBLIC_FOLDER}/public.html`);

app.use(bodyParser.json());
app.use(express.static(PUBLIC_FOLDER));
app.use(express.static('./assets'));

app.get('/', async (_req, res) => {
  res.sendFile(PUBLIC_PAGE);
});

app.listen(PORT, async () => {
  console.log(`Arcadia running at http://localhost:${PORT}`);
});
