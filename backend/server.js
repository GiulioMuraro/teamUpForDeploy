const express = require('express');
const cors = require('cors');
const config = require('./config');
const connectDB = require('./connectDB');

// connect to DB 
const db = require('./models');

// import all ROUTES
const authRoute = require('./routes/autenticazione');
const prenotazioniRouter = require('./routes/prenotazioni');
const campiRouter = require('./routes/campi');
const segnalazioniRouter = require('./routes/reports');

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use Controllers
app.use("/auth", authRoute);
app.use("/campi", campiRouter);
app.use("/prenotazioni", prenotazioniRouter);
app.use("/segnalazioni", segnalazioniRouter);

// Gestisci le pagine che non esistono
app.use('/*', (req, res) => {
  res.status(404).json({ success: false, message: "Route inesistente" });
});

let server

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports= app;
