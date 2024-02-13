<template>
    <div class="">
        <div class="border-none">
            <button @click = "toggleMenu" type="button" class="gap-x-1.5 border-none px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-green-500" id="menu-button" aria-expanded="true" aria-haspopup="true">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 -mr-1 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" stroke="white" aria-hidden="true">
                    <path fill-rule="evenodd" clip-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
            </button>
        </div>
        <div id="menu" :class="{'hidden': isMenuHidden}" class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
            <div class="py-1 bg-green-500 rounded-xl text-center" role="none">
                <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
                <a href="#/profileView" class="bg-white rounded-2xl text-black block px-4 py-2 text-sm mx-5 w-10/12 ml-auto mr-auto my-1" role="menuitem" tabindex="1" id="menu-item-0">Profile</a>
                <a href="#/preffettuateView" class="bg-white rounded-2xl text-black block px-4 py-2 text-sm w-10/12 ml-auto mr-auto my-1" role="menuitem" tabindex="2" id="menu-item-1">Gestisci prenotazioni</a>
                <a href="#/reportView" class="bg-white rounded-2xl text-black block px-4 py-2 text-sm w-10/12 ml-auto mr-auto my-1" role="menuitem" tabindex="3" id="menu-item-2">Segnala</a>
                <button type="button" @click = "handleLogout" class="bg-white rounded-2xl text-black block px-4 py-2 text-center text-sm w-10/12 ml-auto mr-auto my-1" role="menuitem" tabindex="4" id="menu-item-3">Esci</button>
            </div>
        </div>
    </div>
</template>
    
<script>

export default {
    name: 'OptionsButton',
    data() {
        return {
        isMenuHidden: true,
        };
    },
    methods: {
        toggleMenu() {
            this.isMenuHidden = !this.isMenuHidden;
        },
        handleLogout() {
            // Clear the local token of the client
            this.$store.dispatch('logout');
            this.$router.push('/');
        }
    },
};

</script>
    