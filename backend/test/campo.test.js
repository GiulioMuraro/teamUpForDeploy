const  app = require('../server');
const request = require('supertest')
const mongoose = require('mongoose')
const casual = require('casual')
const mockData = require('./mockData')


describe('Test campi', ()=>{    
    test('POST creazione campo con admin inesistente', async()=>{
        const res= await request(app).post('/campi/addcampo').set('Content-Type','application/json').send({
            nome: mockData.state.campo.nome,
            descrizione: mockData.state.campo.descrizione,
            posizione: mockData.state.campo.posizione,
            gestore:{email:"paolo@gmail.com"}
        })
        expect(res.status).toBe(404);
        expect(res.body).toEqual({success:false, message:'Impossibile trovare il gestore indicato'})
    })
    test('POST creazione campo ok', async()=>{
        const registrazioneAdmin= await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente: mockData.state.gestore.nome,
            password: mockData.state.gestore.password,
            email: mockData.state.gestore.email
        })
        const res= await request(app).post('/campi/addcampo').set('Content-Type','application/json').send({
            nome: mockData.state.campo.nome,
            descrizione: mockData.state.campo.descrizione,
            posizione: mockData.state.campo.posizione,
            gestore:{email:mockData.state.gestore.email}

         })
         expect(res.status).toBe(200);
    })
    test('POST creazione campo già esistente', async()=>{
        const registrazioneAdmin= await request(app).post('/auth/signin').set('Content-Type','application/json').send({
            nomeUtente: mockData.state.gestore.nome,
            password: mockData.state.gestore.password,
            email: mockData.state.gestore.email
        })
        const res= await request(app).post('/campi/addcampo').set('Content-Type','application/json').send({
            nome: mockData.state.campo.nome,
            descrizione: mockData.state.campo.descrizione,
            posizione: mockData.state.campo.posizione,
            gestore:{email:mockData.state.gestore.email}

         })
         expect(res.status).toBe(409);
         expect(res.body).toEqual({success:false, message: "Il campo esiste già"})
    })

    test('POST prenotazioni campo ok', async()=>{
        const res=await request(app).post('/campi/getorari').set('Content-Type','application/json').send({
            nome:mockData.state.campo.nome,
            data:mockData.state.prenotazione.data
        })
        expect(res.status).toBe(200)
    })
    test('POST prenotazioni campo inesistente', async()=>{
        const res=await request(app).post('/campi/getorari').set('Content-Type','application/json').send({
            nome:"nome fasullo",
            data:mockData.state.prenotazione.data
        })
        expect(res.status).toBe(404)
        expect(res.body).toEqual({success:false, message:"Campo non trovato!"})
    })

})