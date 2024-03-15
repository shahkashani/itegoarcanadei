const app = require('./server');
const { LEONIA_ADMIN_ROUTE } = process.env;
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Leonia running at http://localhost:${PORT}`);
  console.log(`Admin page running at http://localhost:${PORT}${LEONIA_ADMIN_ROUTE}`);
});
