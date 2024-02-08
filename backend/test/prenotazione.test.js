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
  //Delete all the data created in the DB for the tests
  await Utente.deleteMany({});
  await Campo.deleteMany({});
  await Prenotazione.deleteMany({});

  // Ensure that the server is closed after running all tests
  await closeServer();
});

describe('Test prenotazioni', () => {
  test('POST prenotazione campo inesistente', async () => {
    mockData = mockDataModule.generateState();

    const registra = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.user.nome,
      email: mockData.user.email,
      password: mockData.user.password,
    });
    expect(registra.status).toBe(200);

    const registrazioneAdmin = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.gestore.nome,
      password: mockData.gestore.password,
      email: mockData.gestore.email
    });
    expect(registrazioneAdmin.status).toBe(200);

    // Retrieve the ObjectId of the user
    const findUtente = await Utente.findOne({ email: mockData.user.email });
    if (!findUtente) {
        return;
    }

    // Retrieve the ObjectId of the admin
    const findGestore = await Utente.findOne({ email: mockData.gestore.email });
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
      nome: "campo fasullo",
      data: mockData.prenotazione.data,
      orario: mockData.prenotazione.orario,
      utente: findUtente
    });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, message: "Impossibile creare la prenotazione: Campo non trovato" });
  });

  test('POST prenotazione utente fasullo', async () => {
    mockData = mockDataModule.generateState();

    const registrazioneAdmin = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.gestore.nome,
      password: mockData.gestore.password,
      email: mockData.gestore.email
    });
    expect(registrazioneAdmin.status).toBe(200);

    // Retrieve the ObjectId of the admin
    const findGestore = await Utente.findOne({ email: mockData.gestore.email });
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
      utente: { email: "email fasulla" }
    });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, message: "Impossibile creare la prenotazione: Utente non trovato" });
  });


  test('POST prenotazione ok', async () => {
    mockData = mockDataModule.generateState();

    const registra = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.user.nome,
      email: mockData.user.email,
      password: mockData.user.password,
    });
    expect(registra.status).toBe(200);

    const registrazioneAdmin = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.gestore.nome,
      password: mockData.gestore.password,
      email: mockData.gestore.email
    });
    expect(registrazioneAdmin.status).toBe(200);

    // Retrieve the ObjectId of the user
    const findUtente = await Utente.findOne({ email: mockData.user.email });
    if (!findUtente) {
        return;
    }

    // Retrieve the ObjectId of the admin
    const findGestore = await Utente.findOne({ email: mockData.gestore.email });
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

  /*test('POST orari prenotazioni utente ok', async () => {
    const res = await request(app).post('/prenotazioni/getprenotazioni').set('Content-Type', 'application/json').send({
      utente: mockData.user
    });
    expect(res.status).toBe(200);
  });

  test('POST orari prenotazioni utente fasullo', async () => {
    const res = await request(app).post('/prenotazioni/getprenotazioni').set('Content-Type', 'application/json').send({
      utente: {email: "email fasulla"}
    });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, message: "Impossibile trovare l'utente" });
  });*/
});
