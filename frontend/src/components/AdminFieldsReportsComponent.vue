<template>
    <div class="custom">
        <div class="ch max-w-6xl mx-auto p-6 border-4 border-green-500 rounded-lg bg-white flex flex-wrap justify-center">
            <h1 class="text-3xl h-10 font-bold">Gestione dei campetti da calcio</h1>
            
            <div class="pb-8 mb-8 border-2 border-green-500 rounded-lg overflow-auto h-[600px] w-full">
                <div class="flex flex-wrap justify-center">
                    <div v-for="campo in campiInfo" :key="campo._id" class="h-48 w-full flex flex-row items-center border-2 border-green-500 rounded-lg text-gray-800 py-2 px-4 mb-2 cursor-pointer hover:bg-green-800 hover:text-white">
                        <h1 class="h-full flex-1 border-r border-gray-400 pl-4 pr-4">Nome campo: {{ campo.nome }}</h1>
                        <p class="h-full flex-1 border-r border-gray-400 pl-4 pr-4 overflow-auto">Posizione: {{ campo.posizione }}</p>
                        <p class="h-full flex-1 border-r border-gray-400 pl-4 pr-4 overflow-auto">Descrizione: {{ campo.descrizione }}</p>
                        <p class="h-full flex-1 border-r border-gray-400 pl-4 pr-4">Numero di prenotazioni: {{ campo.prenotazioni.length }}</p>
                        <p class="h-full flex-1 border-r border-gray-400 pl-4 pr-4">Nome gestore: {{ campo.gestore.nome }}</p>
                        <p class="h-full flex-1 border-r border-gray-400 pl-4 pr-4">Numero di segnalazioni: {{ campo.reports.length }}</p>
                        <button class="flex-none border-4 rounded-xl border-green-400 ml-5 p-6" @click="deleteCampo(campo.nome)">Delete Field</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="ch max-w-6xl mx-auto p-6 border-4 border-green-500 rounded-lg bg-white flex flex-wrap justify-center">
            <h1 class="text-3xl h-10 font-bold">Gestione delle segnalazioni degli utenti</h1>
            
            <div class="pb-8 mb-8 border-2 border-green-500 rounded-lg overflow-auto h-[600px] w-full">
                <div class="flex flex-wrap justify-center">
                    <div v-for="report in reports" :key="report._id" class="h-48 w-full flex flex-row items-center border-2 border-green-500 rounded-lg text-gray-800 py-2 px-4 mb-2 cursor-pointer hover:bg-green-800 hover:text-white">
                        <h1 class="h-full flex-1 border-r border-gray-400 pl-4 pr-4">Descrizione: {{ report.description }}</h1>
                        <p class="h-full flex-1 border-r border-gray-400 pl-4 pr-4 overflow-auto">Utente: {{ report.utente.nome }}<br>Email: {{ report.utente.email }}</p>
                        <p class="h-full flex-1 border-r border-gray-400 pl-4 pr-4 overflow-auto">Campo: {{ report.campo.nome }}</p>
                        <button class="flex-none border-4 rounded-xl border-green-400 ml-5 p-6">Delete Field</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import { config } from '@/config';
import store from '@/store';
import router from '@/router';

export default defineComponent({
    name: 'AdminFieldsReportsComponent',
    data() {
        return {
            utente: { email: store.getters.getEmail },
            campiInfo: [], // Store fields data here
            reports: []
        };
    },
    methods: {
        checkAdmin(){
            if(store.getters.getRuolo == 'Admin'){
                return true;
            }
            else return false;
        },
        async fetchFields() {
        // Make HTTP request to fetch fields from the database
        try {
            const res = await fetch(`${config.BASE_URL}/admin/getadminfieldsreports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "email": this.utente.email })
        });
            const data = await res.json();
            this.campiInfo = data.message; // Imposta i dati dei campi disponibili nella proprietà dati del componente
            if(!data.success){
                console.log("Errore nella ricezione dei campi: " + res.error);
            }
        } catch (error) {
            console.error(error);
        }
        },
        async fetchReports(){
            // The object campiInfo contains arrays of prenotazioni and reports. So we don't need to retrieve from the DB again
            this.campiInfo.forEach(campo => {
                campo.reports.forEach(report => {
                    this.reports.push({
                        description: report.description,
                        utente: report.utente,
                        prenotazione: report.prenotazione,
                        campo: report.campo
                    });
                });
            });
            console.log(this.reports);
        },
        async deleteCampo(nomeCampo){
            // Make HTTP request to delete field from the database
            try {
                const res = await fetch(`${config.BASE_URL}/admin/deletecampo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "nome": nomeCampo })
            });
                const data = await res.json();
                if(!data.success){
                    console.log("Errore nella ricezione dei campi: " + res.error);
                }
                else{
                    alert("Campo eliminato correttamente");
                    window.location.reload();
                }
            } catch (error) {
                console.error(error);
            }
        },
    },
    created() {
        if(!this.checkAdmin()){
            router.push('/dashboardView');
            return;
        }
        // Fetch fields data when the component is created
        this.fetchFields().then(() => {
            this.fetchReports();
        });
    },
});
</script>

<style scoped>
.custom{
background-image: url("../images/sfondo.webp");
background-size: cover;
background-position:center;
resize: both;
}
.ch {
min-height: 90vh;
}
</style>
