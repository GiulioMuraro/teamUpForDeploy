const app = require('../server');
const request = require('supertest')
const mongoose = require('mongoose')
const casual = require('casual')
const mockData = require('./mockData')


describe ('Test auth', ()=>{   
    test('POST /signup ok', async()=>{
        const res= await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente: mockData.state.users.nome,
            email: mockData.state.users.email,
            password: mockData.state.users.password
        })
        expect(res.status).toBe(200)
    });

    test('POST /signup no password', async ()=>{
        const res= await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente:mockData.state.users.nome,
            email:mockData.state.users.email
        })
        expect(res.status).toBe(400)
        expect(res.body).toEqual({ success:false ,message:"Compilare tutti i campi!"})
    });

    test('POST /signup no email', async ()=>{
        const res= await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente:mockData.state.users.nome,
            password:mockData.state.users.password
        })
        expect(res.status).toBe(400)
        expect(res.body).toEqual({ success:false ,message:"Compilare tutti i campi!"})
    });

    test('POST /signup no nome', async ()=>{
        const res= await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            password:mockData.state.users.password,
            email:mockData.state.users.email
        })
        expect(res.status).toBe(400)
        expect(res.body).toEqual({ success:false ,message:"Compilare tutti i campi!"})
    })

    test('Post /signup utente registrato', async ()=>{
        const res=await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente: mockData.state.users.nome,
            email: mockData.state.users.email,
            password: mockData.state.users.password
        })
        expect(res.status).toBe(409);
        expect(res.body).toEqual({success:false, message: "Utente già registrato"})
    })

    test(('POST /login ok'), async () => {
        const res = await request(app).post('/auth/login').send({
            email: mockData.state.users.email,
            password: mockData.state.users.password
        })
        expect(res.status).toBe(200)
    });

    test(('POST /login email sbagliata'), async () => {
        const res = await request(app).post('/auth/login').send({
            email: "pappo@gmail.com",
            password: mockData.state.users.password
        })
        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: "Utente inesistente", success: false })
    });

    test(('POST /login password sbagliata'), async () => {
        const res = await request(app).post('/auth/login').send({
            email: mockData.state.users.email,
            password: "13"
        })

        expect(res.status).toBe(401)
        expect(res.body).toEqual({ message: "Password incorretta", success: false })
    });

    test(('POST /login email mancante'), async () => {
        const res = await request(app).post('/auth/login').send({
            password: mockData.state.users.password
        })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Compilare tutti i campi", success: false })
    });

    test(('POST /login password mancante'), async () => {
        const res = await request(app).post('/auth/login').send({
            email: mockData.state.users.email
        })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ message: "Compilare tutti i campi", success: false })
    });

})
