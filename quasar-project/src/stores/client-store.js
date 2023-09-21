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
        addClient(client) {
            api.post("clients",client).then((res) => {
                this.clients = res.data
                console.log(this.clients)
            })
        },
        updateClient(id,client) {
            api.put("clients/"+id,client).then((res) => {
                this.clients = res.data
                console.log(this.clients)
            })
             
        },
        deleteClient(id) {
            api.delete("clients/"+id).then((res) => {
                this.clients = res.data
                console.log(this.clients)
            })
             
        },
    },
});