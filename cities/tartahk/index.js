const app = require('./server');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Tartahk running at http://localhost:${PORT}`)
);
