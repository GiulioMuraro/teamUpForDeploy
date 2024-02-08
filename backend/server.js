const express = require('express');
const cors = require('cors');
const config = require('./config');
const { connectDB, closeDB } = require('./connectDB');

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
  try {
    await connectDB();

    const PORT = process.env.PORT;
    console.log("Starting server...")

    return new Promise((resolve, reject) => {
      server = app.listen(PORT, (error) => {
        if (error) {
          console.error('Error starting the server:', error);
          reject(error);
        } else {
          console.log(`Server is running on port ${PORT}`);
          resolve(server);
        }
      });
    })
  }catch (error) {
    console.error('Error starting server: ', error);
    throw error;
  }
}

const closeServer = async () => {
  // Close the Express app server
  try{ 
    console.log("Trying to stop the server...");
    if(server){
      await new Promise((resolve) => server.close(resolve));
      console.log("Server stopped!")
    }

    await closeDB();
  }catch(error){
    console.log("Error stopping the server: " + error);
    throw error;
  }
};

// Only start the server if this script is executed directly
if (require.main === module) {
  startServer().catch(error => {
    process.exit(1); // Exit with a non-zero exit code to indicate failure
  });
}

module.exports = { app, startServer, closeServer };
