<template>
    <div class="custom">
        <div class="ch max-w-4xl mx-auto p-6 border-4 border-green-500 rounded-lg bg-white">
            <h1 class="text-3xl font-bold mb-8">Report a Problem with a Football Field</h1>
            
            <div class="pb-8 mb-8 border-2 border-green-500 rounded-lg">
                <h2 class="text-lg font-semibold mb-4">Seleziona una prenotazione:</h2>
                <div class="flex flex-wrap justify-center">
                    <div v-for="prenotazione in prenotazioniUtente" :key="prenotazione._id" class="border-2 border-green-500 rounded-lg text-gray-800 py-2 px-4 mb-2 cursor-pointer hover:bg-green-800 hover:text-white" @click="selectPrenotazione(prenotazione)">
                        <h1>{{ prenotazione.campo.nome }}</h1>
                        <p>{{ prenotazione.data }}</p>
                        <p>{{ prenotazione.orario }}</p>
                    </div>
                </div>
            </div>

            <div class="border-2 border-green-500 rounded-lg pb-8 mb-8">
                <h2 id="fieldToReport" class="text-lg font-semibold mb-4">Campo da segnalare:</h2>
                <p>{{ campoDaSegnalare.nome }}</p>
            </div>

            <div>
                <h2 class="text-lg font-semibold mb-4">Report a Problem:</h2>
                <form @submit.prevent="inviaSegnalazione">
                <div class="mb-4">
                    <label for="problemDescription" class="block text-sm font-medium text-gray-700">Problem Description</label>
                    <textarea id="problemDescription" rows="8" class="mt-1 block w-full border-2 border-green-500 rounded-lg shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                </div>
                <button type="submit" class="bg-green-900 text-white py-2 px-4 rounded-md">Submit</button>
                </form>
            </div>
        </div>
    </div>

</template>

<script> 

import { defineComponent } from 'vue'
import { config } from '@/config';
import store from '@/store/index';

export default defineComponent({
    name: 'ReportForm',
    data() {
        return {
            campoDaSegnalare: {nome: ""},
            prenotazioneDaSegnalare: {},

            prenotazioniUtente: [],
            utente: { email: store.getters.getEmail },
            nomeUser: store.getters.getUser
        };
    },
    methods: {
        async fetchPrenotazioni(){
            // Make HTTP request to fetch fields from the database
            try {
                console.log("stampa: " + this.utente.email);
                const res = await fetch(`${config.BASE_URL}/prenotazioni/getprenotazioni`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "utente": this.utente })
            });
                const data = await res.json();
                this.prenotazioniUtente = data.findPrenotazioni; // Imposta i dati dei campi disponibili nella proprietà dati del componente

                if(!data.success){
                    console.log("Errore nella ricezione delle prenotazioni: " + res.error);
                }
            } catch (error) {
                console.error(error);
            }
        },
        selectPrenotazione(prenotazione){
            this.campoDaSegnalare.nome = prenotazione.campo.nome;
            this.prenotazioneDaSegnalare = prenotazione;
        },
        async inviaSegnalazione(){
            const problemDescription = document.getElementById('problemDescription').value;

            // Check if the textarea is empty
            if (!problemDescription.trim()) {
                alert('Please enter a problem description.');
                return; // Prevent form submission if the textarea is empty
            }

            const newReport = {
                description: problemDescription,
                utente: this.utente,
                prenotazione: this.prenotazioneDaSegnalare,
                campo: this.campoDaSegnalare,
            }

            try {
                const res = await fetch(`${config.BASE_URL}/segnalazioni`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newReport)}
                );

                if(res.status === 200){
                    alert("SEGNALAZIONE EFFETTUATA");

                }
                else{
                    this.error.status = true;
                    this.error.message = "Unexpected error";
                }
            } catch (error) {
                console.error(error);
            }
        }
    },
    mounted() {
        this.fetchPrenotazioni();
    }
});

</script>

<style scoped>
    .custom{
        background-image: url("../images/sfondo.webp");
        background-size: cover;
        background-position:center;
        resize: both;
    }
    .ch{
        min-height: 90vh;
    }

</style>