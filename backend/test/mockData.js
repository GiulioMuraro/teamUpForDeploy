const casual = require('casual')

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
        data:casual.date((format='YYYY-MM-DD')),
        utente: casual.utente,
        durata: casual.integer(from=1, to=2),
        orario: casual.integer(from=0,to=23),
        campo: casual.campo
    }
})
 /**
     * @param nome
     * @param email
     * @param password
     */
const state = {
    users: casual.utente,
    campo: casual.campo,
    gestore: casual.gestore,
    prenotazione: casual.prenotazione
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
    users,
    VAL_TEST,
    state
}