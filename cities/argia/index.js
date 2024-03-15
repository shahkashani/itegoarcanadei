const app = require('./server');
const { ARGIA_ADMIN_ROUTE } = process.env;
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Argia running at http://localhost:${PORT}`);
  console.log(`Admin page running at http://localhost:${PORT}${ARGIA_ADMIN_ROUTE}`);
});
