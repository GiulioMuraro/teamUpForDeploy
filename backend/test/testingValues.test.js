const { app, startServer, closeServer } = require('../server'); // Link to your server 
const request = require('supertest');
const mockDataModule = require('./mockData');
const Campo = require('../models/campo');
const Utente = require('../models/utente');
const Prenotazione = require('../models/prenotazione');

beforeAll(async () => {
  // Ensure that the server is started before running the tests
  await startServer();
});

afterAll(async () => {
  // Ensure that the server is closed after running all tests
  await closeServer();
});

describe('Test prenotazioni', () => {
    test('POST prenotazione ok', async () => {
        mockData = mockDataModule.generateState();

        const registra = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
            nomeUtente: "Giulio",
            email: "giuliomuraro97@gmail.com",
            password: "ciao2001",
            gestore : 0
        });

        const registrazioneAdmin = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
            nomeUtente: "Carlo",
            password: "ciao2001",
            email: "carlo.rigoni@gmail.com",
            gestore: 1
        });

        // Retrieve the ObjectId of the user
        const findUtente = await Utente.findOne({ email: "giuliomuraro97@gmail.com" });
        if (!findUtente) {
            return;
        }

        // Retrieve the ObjectId of the admin
        const findGestore = await Utente.findOne({ email: "carlo.rigoni@gmail.com" });
        if (!findGestore) {
            return;
        }

        const campo = await request(app).post('/campi/addcampo').set('Content-Type', 'application/json').send({
        nome: mockData.campo.nome,
        descrizione: mockData.campo.descrizione,
        posizione: mockData.campo.posizione,
        gestore: findGestore
        });
        expect(campo.status).toBe(200);

        const res = await request(app).post('/prenotazioni').set('Content-Type', 'application/json').send({
        nome: mockData.campo.nome,
        data: mockData.prenotazione.data,
        orario: mockData.prenotazione.orario,
        utente: findUtente
        });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ success: true, message: "Nuova prenotazione creata" });
    });
});