const { app, startServer, closeServer } = require('../server');
const request = require('supertest')
const mongoose = require('mongoose')
const casual = require('casual')
const mockDataModule = require('./mockData');
const Utente = require('../models/utente');
const Campo = require('../models/campo');
const Prenotazione = require('../models/prenotazione');

beforeAll(async () => {
    // Ensure that the server is started before running the tests
    await startServer();
  });
  
afterAll(async () => {
    // Delete all the data saved in the DB for the tests
    await Utente.deleteMany({});
    await Campo.deleteMany({});
    await Prenotazione.deleteMany({});

    // Ensure that the server is closed after running all tests
    await closeServer();
});
  

describe('Test campi', ()=>{    
    test('POST creazione campo con admin inesistente', async()=>{
        mockData = mockDataModule.generateState();
        const res= await request(app).post('/campi/addcampo').set('Content-Type','application/json').send({
            nome: mockData.campo.nome,
            descrizione: mockData.campo.descrizione,
            posizione: mockData.campo.posizione,
            gestore:{email:"paolo@gmail.com"}
        })
        expect(res.status).toBe(404);
        expect(res.body).toEqual({success:false, message:'Impossibile trovare il gestore indicato'})
    })
    test('POST creazione campo ok', async()=>{
        mockData = mockDataModule.generateState();
        const registrazioneAdmin= await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente: mockData.gestore.nome,
            password: mockData.gestore.password,
            email: mockData.gestore.email
        })
        const res= await request(app).post('/campi/addcampo').set('Content-Type','application/json').send({
            nome: mockData.campo.nome,
            descrizione: mockData.campo.descrizione,
            posizione: mockData.campo.posizione,
            gestore:{email:mockData.gestore.email}

         })
         expect(res.status).toBe(200);
    })
    test('POST creazione campo già esistente', async()=>{
        mockData = mockDataModule.generateState();
        const registrazioneAdmin= await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente: mockData.gestore.nome,
            password: mockData.gestore.password,
            email: mockData.gestore.email
        })

        // Retrieve the ObjectId of the admin
        const findGestore = await Utente.findOne({ email: mockData.gestore.email });
        if(!findGestore){
            return;
        }

        const campo = await request(app).post('/campi/addcampo').set('Content-Type','application/json').send({
            nome: mockData.campo.nome,
            descrizione: mockData.campo.descrizione,
            posizione: mockData.campo.posizione,
            gestore: findGestore

         })
        const campoCopia = await request(app).post('/campi/addcampo').set('Content-Type','application/json').send({
            nome: mockData.campo.nome,
            descrizione: mockData.campo.descrizione,
            posizione: mockData.campo.posizione,
            gestore:{email:mockData.gestore.email}

         })
         expect(campoCopia.status).toBe(409);
         expect(campoCopia.body).toEqual({success:false, message: "Il campo esiste già"})
    })

    test('POST get orari campo ok', async()=>{
        mockData = mockDataModule.generateState();
        
        const registra = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
            nomeUtente: mockData.user.nome,
            email: mockData.user.email,
            password: mockData.user.password,
          });
          expect(registra.status).toBe(200);

        const registrazioneAdmin = await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente: mockData.gestore.nome,
            password: mockData.gestore.password,
            email: mockData.gestore.email
        })
        expect(registrazioneAdmin.status).toBe(200);

        // Retrieve ObjectId of the user
        const findUtente = await Utente.findOne({email: mockData.gestore.email});
        if(!findUtente){
            return;
        }

        // Retrieve ObjectId of the admin
        const findGestore = await Utente.findOne({email: mockData.gestore.email});
        if(!findGestore){
            return;
        }

        const creaCampo = await request(app).post('/campi/addcampo').set('Content-Type','application/json').send({
            nome: mockData.campo.nome,
            descrizione: mockData.campo.descrizione,
            posizione: mockData.campo.posizione,
            gestore: findGestore

        })
        expect(creaCampo.status).toBe(200);

        // Retrieve ObjectId of the field
        const findCampo = await Campo.findOne({ nome: mockData.campo.nome });
        if(!findCampo){
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

        const res = await request(app).post('/campi/getorari').set('Content-Type','application/json').send({
            nome: mockData.campo.nome,
            data: mockData.prenotazione.data
        })
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    })
    test('POST prenotazioni campo inesistente', async()=>{
        mockData = mockDataModule.generateState();
        const res=await request(app).post('/campi/getorari').set('Content-Type','application/json').send({
            nome: "nome fasullo",
            data:mockData.prenotazione.data
        })
        expect(res.status).toBe(404);
        expect(res.body).toEqual({success:false, message:"Campo non trovato!"});
    })

})