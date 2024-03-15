const app = require('./server');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Hall of the Gods running at http://localhost:${PORT}`)
);
