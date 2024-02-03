const app = require('../server'); // Link to your server 
const request = require('supertest');
const mockData = require('./mockData');

describe('Test segnalazioni', () => {
  test('POST segnalazione utente inesistente', async () => {
    const registrazioe = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.state.utente.nome,
      password: mockData.state.utente.password,
      email: mockData.state.utente.email,
      gestore: 0
    });

    const registrazioneAdmin = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.state.gestore.nome,
      password: mockData.state.gestore.password,
      email: mockData.state.gestore.email,
      gestore: 1
    });

    const campo = await request(app).post('/campi/addcampo').set('Content-Type', 'application/json').send({
      nome: mockData.state.campo.nome,
      descrizione: mockData.state.campo.descrizione,
      posizione: mockData.state.campo.posizione,
      gestore: { email: mockData.state.gestore.email }
    });
    const prenotazione = await request(app).post('/prenotazioni').set('Content-Type', 'application/json').send({
      campo: mockData.state.campo,
      data: mockData.state.prenotazione.data,
      orario: mockData.state.prenotazione.orario,
      utente: mockData.state.utente,
      // the report value is undefined 
    });
    const res = await request(app).post('/segnalazioni').set('Content-Type', 'application/json').send({
      description: mockData.state.segnalazione.description,
      utente: { email: "utente fasullo"},
      prenotazione: mockData.state.prenotazione,
      campo: mockData.state.campo
    });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, message: "Impossibile creare la segnalazione: Utente non trovato" });
  });
  
  test('POST segnalazione con prenotazione inesistente', async () => {
    const registra = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.state.user.nome,
      email: mockData.state.user.email,
      password: mockData.state.user.password,
      gestore: 0
    });
    const registrazioneAdmin = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.state.gestore.nome,
      password: mockData.state.gestore.password,
      email: mockData.state.gestore.email,
      gestore: 1
    });
    const campo = await request(app).post('/campi/addcampo').set('Content-Type', 'application/json').send({
      nome: mockData.state.campo.nome,
      descrizione: mockData.state.campo.descrizione,
      posizione: mockData.state.campo.posizione,
      gestore: mockData.state.gestore
    });
    const res = await request(app).post('/segnalazioni').set('Content-Type', 'application/json').send({
      description: mockData.state.segnalazione.description,
      utente: mockData.state.user,
      prenotazione: { campo: mockData.state.campo, data: mockData.prenotazione.data, orario: mockData.prenotazione.orario, utente: mockData.utente },
      campo:  mockData.state.campo
      //report field is left undefined
    });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, message: "Impossibile creare la segnalazione: Prenotazione non trovata" });
  })

  test('POST segnalazione campo inesistente', async () => {
    const registra = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.state.user.nome,
      email: mockData.state.user.email,
      password: mockData.state.user.password,
      gestore: 0
    });
    const registrazioneAdmin = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.state.gestore.nome,
      password: mockData.state.gestore.password,
      email: mockData.state.gestore.email,
      gestore: 1
    });
    const campo = await request(app).post('/campi/addcampo').set('Content-Type', 'application/json').send({
      nome: mockData.state.campo.nome,
      descrizione: mockData.state.campo.descrizione,
      posizione: mockData.state.campo.posizione,
      gestore: mockData.state.gestore
    });
    const prenotazione = await request(app).post('/prenotazioni').set('Content-Type', 'application/json').send({
      campo: mockData.state.campo,
      data: mockData.state.prenotazione.data,
      orario: mockData.state.prenotazione.orario,
      utente: mockData.state.user,
      // the report value is undefined 
    });
    const res = await request(app).post('/segnalazioni').set('Content-Type', 'application/json').send({
      description: mockData.state.segnalazione.description,
      utente: mockData.state.user,
      prenotazione: mockData.state.prenotazione,
      campo:  { nome: "Campo fasullo" }
    });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, message: "Impossibile creare la segnalazione: Campo non trovato" });
  });

  test('POST segnalazione ok', async () => {
    const registra = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.state.user.nome,
      email: mockData.state.user.email,
      password: mockData.state.user.password,
      gestore: 0
    });
    const registrazioneAdmin = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.state.gestore.nome,
      password: mockData.state.gestore.password,
      email: mockData.state.gestore.email,
      gestore: 1
    });
    const campo = await request(app).post('/campi/addcampo').set('Content-Type', 'application/json').send({
      nome: mockData.state.campo.nome,
      descrizione: mockData.state.campo.descrizione,
      posizione: mockData.state.campo.posizione,
      gestore: mockData.state.gestore
    });
    const prenotazione = await request(app).post('/prenotazioni').set('Content-Type', 'application/json').send({
      campo: mockData.state.campo,
      data: mockData.state.prenotazione.data,
      orario: mockData.state.prenotazione.orario,
      utente: mockData.state.user,
      // the report value is undefined 
    });
    const res = await request(app).post('/segnalazioni').set('Content-Type', 'application/json').send({
      description: mockData.state.segnalazione.description,
      utente: mockData.state.user,
      prenotazione: mockData.state.prenotazione,
      campo:  mockData.state.campo
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, message: "Nuova segnalazione creata" });
  });

});