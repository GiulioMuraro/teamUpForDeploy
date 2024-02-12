const { app, startServer, closeServer } = require('../server');
const request = require('supertest')
const mongoose = require('mongoose')
const casual = require('casual')
const mockDataModule = require('./mockData')
const Utente = require('../models/utente');

beforeAll(async () => {
    // Ensure that the server is started before running the tests
    await startServer();
});
  
afterAll(async () => {
    // Delete documents created by the test
    await Utente.deleteMany({});

    // Ensure that the server is closed after running all tests
    await closeServer();
});
  

describe ('Test auth', ()=>{   
    test('POST /signup ok', async()=>{
        mockData = mockDataModule.generateState();
        const res= await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente: mockData.user.nome,
            email: mockData.user.email,
            password: mockData.user.password
        })
        expect(res.status).toBe(200)
    });

    test('POST /signup no password', async ()=>{
        mockData = mockDataModule.generateState();
        const res= await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente:mockData.user.nome,
            email:mockData.user.email
        })
        expect(res.status).toBe(400)
        expect(res.body).toEqual({ success:false ,message:"Compilare tutti i campi!"})
    });

    test('POST /signup no email', async ()=>{
        mockData = mockDataModule.generateState();
        const res = await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente:mockData.user.nome,
            password:mockData.user.password
        })
        expect(res.status).toBe(400)
        expect(res.body).toEqual({ success:false ,message:"Compilare tutti i campi!"})
    });

    test('POST /signup no nome', async ()=>{
        mockData = mockDataModule.generateState();
        const res= await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            password:mockData.user.password,
            email:mockData.user.email
        })
        expect(res.status).toBe(400)
        expect(res.body).toEqual({ success:false ,message:"Compilare tutti i campi!"})
    })

    test('Post /signup utente registrato', async ()=>{
        mockData = mockDataModule.generateState();

        // Find random user to try to sign up again with it
        const randomUtente = await Utente.findOne();

        const res=await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente: randomUtente.nome,
            email: randomUtente.email,
            password: randomUtente.password
        })
        expect(res.status).toBe(409);
        expect(res.body).toEqual({success:false, message: "Utente già registrato"})
    })

    test(('POST /login ok'), async () => {
        mockData = mockDataModule.generateState();
        const registra = await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente: mockData.user.nome,
            email: mockData.user.email,
            password: mockData.user.password
        })
        expect(registra.status).toBe(200);

        const res = await request(app).post('/auth/login').send({
            email: mockData.user.email,
            password: mockData.user.password
        })
        expect(res.status).toBe(200)
    });

    test(('POST /login email sbagliata'), async () => {
        mockData = mockDataModule.generateState();
        const res = await request(app).post('/auth/login').send({
            email: "pappo@gmail.com",
            password: mockData.user.password
        })
        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "Utente inesistente", success: false })
    });

    test(('POST /login password sbagliata'), async () => {
        mockData = mockDataModule.generateState();

        const registra = await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente: mockData.user.nome,
            email: mockData.user.email,
            password: mockData.user.password
        })
        expect(registra.status).toBe(200);

        const res = await request(app).post('/auth/login').set('Content-Type','application/json').send({
            email: mockData.user.email,
            password: "13"
        })

        expect(res.status).toBe(401)
        expect(res.body).toEqual({ message: "Password incorretta", success: false })
    });

    test(('POST /login email mancante'), async () => {
        const res = await request(app).post('/auth/login').set('Content-Type','application/json').send({
            password: mockData.user.password
        })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Compilare tutti i campi", success: false })
    });

    test(('POST /login password mancante'), async () => {
        const res = await request(app).post('/auth/login').set('Content-Type','application/json').send({
            email: mockData.user.email
        })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Compilare tutti i campi", success: false })
    });

    test(('POST modifica informazioni utente non trovato'), async () => {
        const res = await request(app).post('/auth/modifyinfo').set('Content-Type','application/json').send({
            oldName: mockData.user.nome,
            newName: "nome nuovo",
            oldEmail: "email fasulla",
            newEmail: "nuova.mail@gmail.com",
            oldPassword: mockData.user.password,
            newPassword: "passwordNuova1234"
        })
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ success: false, message: "Utente non trovato" });        
    });

    test(('POST modifica informazioni ok'), async () => {
        mockData = mockDataModule.generateState();

        const registra = await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente: mockData.user.nome,
            email: mockData.user.email,
            password: mockData.user.password,
            gestore: 0
        })
        expect(registra.status).toBe(200);

        const res = await request(app).post('/auth/modifyinfo').set('Content-Type','application/json').send({
            newName: "nome nuovo",
            oldEmail: mockData.user.email,
            newEmail: "nuova.mail@gmail.com",
            oldPassword: mockData.user.password,
            newPassword: "passwordNuova1234"
        })
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ success: true, message: "Campi dell'utente modificati correttamente" });
    });

    test(('POST get user info ok'), async () => {
        mockData = mockDataModule.generateState();

        const registra = await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente: mockData.user.nome,
            email: mockData.user.email,
            password: mockData.user.password,
            gestore: 0
        })
        expect(registra.status).toBe(200);

        const res = await request(app).post('/auth/getuserinfo').set('Content-Type','application/json').send({
            email: mockData.user.email
        })
        expect(res.status).toBe(200);
        expect(res.body.success).toEqual(true);
    });

    test(('POST get user info utente non trovato'), async () => {
        mockData = mockDataModule.generateState();

        const registra = await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente: mockData.user.nome,
            email: mockData.user.email,
            password: mockData.user.password,
            gestore: 0
        })
        expect(registra.status).toBe(200);

        const res = await request(app).post('/auth/getuserinfo').set('Content-Type','application/json').send({
            email: "email fasulla"
        })
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ success: false, message: "Utente non trovato" });
    });

    test(('POST modify user data a fake user'), async () => {
        mockData = mockDataModule.generateState();

        const res = await request(app).post('/auth/modifyinfo').set('Content-Type','application/json').send({
            newName: mockData.user.nome,
            oldEmail: "email fasulla",
            newEmail: "",
            oldPassword: mockData.user.password,
            newPassword: ""
        })
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ success: false, message: "Utente non trovato" });
    });

    test(('POST modify user data ok'), async () => {
        mockData = mockDataModule.generateState();

        const registra = await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente: mockData.user.nome,
            email: mockData.user.email,
            password: mockData.user.password,
            gestore: 0
        })
        expect(registra.status).toBe(200);

        const res = await request(app).post('/auth/modifyinfo').set('Content-Type','application/json').send({
            newName: mockData.user.nome,
            oldEmail: mockData.user.email,
            newEmail: "nuovamail@gmail.com",
            oldPassword: mockData.user.password,
            newPassword: ""
        })
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ success: true, message: "Campi dell'utente modificati correttamente" });
    });

})
