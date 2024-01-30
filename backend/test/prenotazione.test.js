const app = require('../server'); // Link to your server 
const request = require('supertest');
const mockData = require('./mockData');

describe('Test prenotazioni', () => {
  test('POST prenotazione campo inesistente', async () => {
    const registra = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.state.users.nome,
      email: mockData.state.users.email,
      password: mockData.state.users.password,
    });
    const registrazioneAdmin = await request(app).post('/auth/signin').set('Content-Type', 'application/json').send({
      nomeUtente: mockData.state.gestore.nome,
      password: mockData.state.gestore.password,
      email: mockData.state.gestore.email
    });
    const campo = await request(app).post('/campi/addcampo').set('Content-Type', 'application/json').send({
      nome: mockData.state.campo.nome,
      descrizione: mockData.state.campo.descrizione,
      posizione: mockData.state.campo.posizione,
      gestore: mockData.state.gestore
    });
    const res = await request(app).post('/prenotazioni').set('Content-Type', 'application/json').send({
      nome: "campo fasullo",
      data: mockData.state.prenotazione.data,
      orario: mockData.state.prenotazione.orario,
      utente: mockData.state.users
    });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, message: "Impossibile trovare il campo inserito. Ricontrollare" });
  });

  test('POST prenotazione utente fasullo', async () => {
    const campo = await request(app).post('/campi/addcampo').set('Content-Type', 'application/json').send({
      nome: mockData.state.campo.nome,
      descrizione: mockData.state.campo.descrizione,
      posizione: mockData.state.campo.posizione,
      gestore: { email: mockData.state.gestore.email }
    });
    const res = await request(app).post('/prenotazioni').set('Content-Type', 'application/json').send({
      nome: mockData.state.campo.nome,
      data: mockData.state.prenotazione.data,
      orario: mockData.state.prenotazione.orario,
      utente: { email: "email fasulla" }
    });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, message: "Impossibile creare la prenotazione: Utente non trovato" });
  });


  test('POST prenotazione ok', async () => {
    const res = await request(app).post('/prenotazioni').set('Content-Type', 'application/json').send({
      nome: mockData.state.campo.nome,
      data: mockData.state.prenotazione.data,
      orario: mockData.state.prenotazione.orario,
      utente: mockData.state.users
    });
    expect(res.status).toBe(200);
  });

  test('POST orari prenotazioni utente ok', async () => {
    const res = await request(app).post('/prenotazioni/getprenotazioni').set('Content-Type', 'application/json').send({
      utente: mockData.state.users
    });
    expect(res.status).toBe(200);
  });

  test('POST orari prenotazioni utente fasullo', async () => {
    const res = await request(app).post('/prenotazioni/getprenotazioni').set('Content-Type', 'application/json').send({
      utente: {email: "email fasulla"}
    });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ success: false, message: "Impossibile trovare l'utente" });
  });
});
