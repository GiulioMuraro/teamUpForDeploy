const { app, startServer, closeServer } = require('../server'); // Link to your server 
const request = require('supertest');
const mockDataModule = require('./mockData.js');
const Utente = require('../models/utente.js');
const Campo = require('../models/campo.js');
const Prenotazione = require('../models/prenotazione.js');
const Segnalazione = require('../models/report.js');
const { mongoose } = require('../models/index.js');

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

describe('Test admin', () => {
    test('POST get admin info Admin non trovato', async () => {
      mockData = mockDataModule.generateState();
      
      const res = await request(app).post('/admin/getadminfieldsreports').set('Content-Type', 'application/json').send({
        email: "email fasulla"
      });
  
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ success: false, message: "Admin non trovato" });
    });
  
    test('POST get admin info con user normale', async () => {
      mockData = mockDataModule.generateState();
      const registra = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
        nomeUtente: mockData.user.nome,
        email: mockData.user.email,
        password: mockData.user.password,
        gestore: 0
      });
      expect(registra.status).toBe(200);

      const res = await request(app).post('/admin/getadminfieldsreports').set('Content-Type', 'application/json').send({
        email: mockData.user.email
      });
  
      expect(res.status).toBe(409);
      expect(res.body).toEqual({ success: false, message: "L'utente trovato non ha dei privilegi da amministratore" });
    })

    test('POST get admin info ok', async () => {
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
            nome: mockData.campo.nome,
            data: mockData.prenotazione.data,
            orario: mockData.prenotazione.orario,
            utente: findUtente
            });
        expect(prenotazione.status).toBe(200);
        expect(prenotazione.body).toEqual({ success: true, message: "Nuova prenotazione creata" });

        const findPrenotazione = await Prenotazione.findOne({ campo: findCampo, data: mockData.prenotazione.data, orario: mockData.orario, utente: findUtente });
        if(!findPrenotazione){
            return;
        }

        const report = await request(app).post('/segnalazioni').set('Content-Type', 'application/json').send({
            description: mockData.segnalazione.description,
            utente: findUtente,
            prenotazione: findPrenotazione,
            campo:  findCampo
          });
          expect(report.status).toBe(200);
  
        const res = await request(app).post('/admin/getadminfieldsreports').set('Content-Type', 'application/json').send({
          email: mockData.user.email
        });
    
        expect(res.status).toBe(200);
        expect(res.body.success).toEqual(true);
    })

    test('POST admin delete field campo non trovato', async () => {
        mockData = mockDataModule.generateState();
        
        const res = await request(app).post('/admin/deletecampo').set('Content-Type', 'application/json').send({
            nome: "nome fasullo"
        });
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ success: false, message: "Campo da eliminare non trovato"});
    })

    test('POST admin delete field ok', async () => {
        mockData = mockDataModule.generateState();
        
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

        const res = await request(app).post('/admin/deletecampo').set('Content-Type', 'application/json').send({
            nome: mockData.campo.nome
        });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ success: true, message: "Campo eliminato correttamente"});
    })

});