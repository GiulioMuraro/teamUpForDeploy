const { app, startServer, closeServer } = require('../server'); // Link to your server 
const request = require('supertest');
const mockDataModule = require('./mockData.js');
const Utente = require('../models/utente.js');
const Campo = require('../models/campo.js');
const Prenotazione = require('../models/prenotazione.js');
const Segnalazione = require('../models/report.js');

beforeAll(async () => {
  // Ensure that the server is started before running the tests
  await startServer();
});

afterAll(async () => {
  // Delete all the data saved in the DB for the tests
  await Utente.deleteMany({});
  await Campo.deleteMany({});
  await Prenotazione.deleteMany({});
  await Segnalazione.deleteMany({});

  // Ensure that the server is closed after running all tests
  await closeServer();
});

describe('Test segnalazioni', () => {
  test('POST segnalazione user inesistente', async () => {
    mockData = mockDataModule.generateState();
    const registrazione = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.user.nome,
      password: mockData.user.password,
      email: mockData.user.email,
      gestore: 0
    });
    expect(registrazione.status).toBe(200);

    const registrazioneAdmin = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.gestore.nome,
      password: mockData.gestore.password,
      email: mockData.gestore.email,
      gestore: 1
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

    //Retrieve the ObjectId of the field
    const findCampo = await Campo.findOne({ nome: mockData.campo.nome });
    if (!findCampo) {
        return;
    }
    //Retrieve the ObjectId of the user
    const findUtente = await Utente.findOne({ email: mockData.user.email });
    if (!findUtente) {
        return;
    }

    const prenotazione = await request(app).post('/prenotazioni').set('Content-Type', 'application/json').send({
      nome: findCampo.nome,
      data: mockData.prenotazione.data,
      orario: mockData.prenotazione.orario,
      utente: findUtente,
      // the report value is undefined 
    });
    expect(prenotazione.status).toBe(200);

    //Retrieve the ObjectId of the booking
    const findPrenotazione = await Prenotazione.findOne({ campo: findCampo._id, data: mockData.prenotazione.data, orario: mockData.prenotazione.orario, utente: findUtente._id });
    if(!findPrenotazione){
      return;
    }

    const res = await request(app).post('/segnalazioni').set('Content-Type', 'application/json').send({
      description: mockData.segnalazione.description,
      utente: { email: "user fasullo"},
      prenotazione: findPrenotazione,
      campo: findCampo
    });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, message: "Impossibile creare la segnalazione: Utente non trovato" });
  });

  test('POST segnalazione con prenotazione inesistente', async () => {
    mockData = mockDataModule.generateState();
    const registra = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.user.nome,
      email: mockData.user.email,
      password: mockData.user.password,
      gestore: 0
    });
    expect(registra.status).toBe(200);

    const registrazioneAdmin = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.gestore.nome,
      password: mockData.gestore.password,
      email: mockData.gestore.email,
      gestore: 1
    });
    expect(registrazioneAdmin.status).toBe(200);

    // Retrieve the ObjectId of the admin
    const findGestore = await Utente.findOne({ email: mockData.gestore.email });
    if (!findGestore) {
        return;
    }

    const campo = await request(app).post('/campi/addcampo').set('Content-Type', 'application/json').send({
      nome: mockData.campo.nome,
      posizione: mockData.campo.posizione,
      descrizione: mockData.campo.descrizione,
      gestore: findGestore
    });
    expect(campo.status).toBe(200);
    expect(campo.body).toEqual({ success: true, message: "Campo creato correttamente" });

    //Retrieve the ObjectId of the field
    const findCampo = await Campo.findOne({ nome: mockData.campo.nome });
    if (!findCampo) {
        return;
    }
    //Retrieve the ObjectId of the user
    const findUtente = await Utente.findOne({ email: mockData.user.email });
    if (!findUtente) {
        return;
    } 

    const res = await request(app).post('/segnalazioni').set('Content-Type', 'application/json').send({
      description: mockData.segnalazione.description,
      utente: findUtente,
      prenotazione: { campo: "Fasullo", utente: "Fasullo"},
      campo: findCampo
      //report field is left undefined
    });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, message: "Impossibile creare la segnalazione: Prenotazione non trovata" });
  })

  test('POST segnalazione campo inesistente', async () => {
    mockData = mockDataModule.generateState();
    const registra = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.user.nome,
      email: mockData.user.email,
      password: mockData.user.password,
      gestore: 0
    });
    expect(registra.status).toBe(200);

    const registrazioneAdmin = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.gestore.nome,
      password: mockData.gestore.password,
      email: mockData.gestore.email,
      gestore: 1
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

    //Retrieve the ObjectId of the field
    const findCampo = await Campo.findOne({ nome: mockData.campo.nome });
    if (!findCampo) {
        return;
    }
    //Retrieve the ObjectId of the user
    const findUtente = await Utente.findOne({ email: mockData.user.email });
    if (!findUtente) {
        return;
    }

    const prenotazione = await request(app).post('/prenotazioni').set('Content-Type', 'application/json').send({
      nome: findCampo.nome,
      data: mockData.prenotazione.data,
      orario: mockData.prenotazione.orario,
      utente: findUtente,
      // the report value is undefined 
    });
    expect(prenotazione.status).toBe(200);

    //Retrieve the ObjectId of the booking
    const findPrenotazione = await Prenotazione.findOne({ campo: findCampo, data: mockData.prenotazione.data, orario: mockData.prenotazione.orario, utente: findUtente });
    if(!findPrenotazione){
      return;
    }

    const res = await request(app).post('/segnalazioni').set('Content-Type', 'application/json').send({
      description: mockData.segnalazione.description,
      utente: findUtente,
      prenotazione: findPrenotazione,
      campo:  { nome: "campo fasullo" }
    });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, message: "Impossibile creare la segnalazione: Campo non trovato" });
  });

  test('POST segnalazione ok', async () => {
    mockData = mockDataModule.generateState();
    const registra = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.user.nome,
      email: mockData.user.email,
      password: mockData.user.password,
      gestore: 0
    });
    expect(registra.status).toBe(200);

    const registrazioneAdmin = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.gestore.nome,
      password: mockData.gestore.password,
      email: mockData.gestore.email,
      gestore: 1
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

    //Retrieve the ObjectId of the field
    const findCampo = await Campo.findOne({ nome: mockData.campo.nome });
    if (!findCampo) {
        return;
    }
    //Retrieve the ObjectId of the user
    const findUtente = await Utente.findOne({ email: mockData.user.email });
    if (!findUtente) {
        return;
    }

    const prenotazione = await request(app).post('/prenotazioni').set('Content-Type', 'application/json').send({
      nome: findCampo.nome,
      data: mockData.prenotazione.data,
      utente: findUtente,
      orario: mockData.prenotazione.orario,
      // the report value is undefined 
    });
    expect(prenotazione.status).toBe(200);

    //Retrieve the ObjectId of the booking
    const findPrenotazione = await Prenotazione.findOne({ campo: findCampo, data: mockData.prenotazione.data, orario: mockData.prenotazione.orario, utente: findUtente });
    if(!findPrenotazione){
      return;
    }

    const res = await request(app).post('/segnalazioni').set('Content-Type', 'application/json').send({
      description: mockData.segnalazione.description,
      utente: findUtente,
      prenotazione: findPrenotazione,
      campo: findCampo
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, message: "Nuova segnalazione creata" });
  });

});