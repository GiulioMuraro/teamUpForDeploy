const casual = require('casual');
const prenotazione = require('../models/prenotazione');
const moment = require('moment');

// Generate a random seed value
const randomSeed = Math.floor(Math.random() * 1000000); // Adjust range as needed

// Set the random seed value for casual
casual.seed(randomSeed);

const VAL_TEST = 5

casual.define('utente', () => {
    return {
        nome: casual.username,
        email: casual.email,
        password: casual.password
    }
})

casual.define('gestore',()=>{
    return{
        nome:casual.name,
        email:casual.email,
        password: casual.password
    }
})

casual.define('campo', () => {
    return {
        nome: casual.name,
        descrizione: casual.description,
        posizione: casual.string,
        prenotazioni: [],
        gestore:casual.gestore
    }
})
casual.define('prenotazione',()=>{
    return{
        data: casual.date((format='YYYY-MM-DD')),
        utente: casual.utente,
        durata: casual.integer(from=1, to=2),
        orario: casual.integer(from=0,to=23),
        campo: casual.campo
    }
})

casual.define('segnalazione', () => {
    return {
        description: casual.description,
        utente: casual.utente,
        prenotazione: casual.prenotazione,
        campo: casual.campo
    }
})

state = {
    user: {},
    gestore: {},
    campo: {},
    prenotazione: {},
    segnalazione: {}
}

// Function to redefine the state variable
const generateState = () => {
    const user = casual.utente;
    const gestore = casual.gestore;
    const campo = {
        nome: casual.name,
        descrizione: casual.description,
        posizione: casual.string,
        prenotazioni: [],
        gestore: gestore
    };
    const prenotazione = {
        data: casual.date('YYYY-MM-DD'),
        utente: user,
        durata: casual.integer(from = 1, to = 2 ).toString(),
        orario: casual.integer(from = 0, to = 23).toString(),
        campo: campo
    };
    const segnalazione = {
        description: casual.description,
        utente: user,
        prenotazione: prenotazione,
        campo: campo
    };

    return {
        user: user,
        gestore: gestore,
        campo: campo,
        prenotazione: prenotazione,
        segnalazione: segnalazione
    };
}

/**
 * Solo per retrocompatibilità con i test.
 * @deprecated
 */
const users = []
const main = () => {
    for(let i=0; i<VAL_TEST; ++i){
        users.push(casual.user)
    }
}

module.exports= {
    main,
    VAL_TEST,
    state,
    generateState
}