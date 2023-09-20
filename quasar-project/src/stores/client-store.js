import { defineStore } from 'pinia';
import axios, { api } from 'src/boot/axios';

export const useClientStore = defineStore('client', {
    state: () => ({
        client: {},
        clients:[]
    }),
    getters: {
        getClient: (state) => state.client,
        getClients:(state) =>state.clients
    },
    actions: {
        listAllClient() {
            api.get("clients").then((res) => {
                this.clients = res.data
                console.log(this.clients)
            })
             
        },
    },
});