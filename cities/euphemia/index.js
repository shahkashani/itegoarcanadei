const app = require('./server');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Euphemia running at http://localhost:${PORT}`)
);
