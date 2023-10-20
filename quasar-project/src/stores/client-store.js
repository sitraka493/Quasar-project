import { defineStore } from "pinia";
import axios, { api } from "src/boot/axios";

export const useClientStore = defineStore("client", {
  state: () => ({
    client: {},
    clients: [],
  }),
  getters: {
    getClient: (state) => state.client,
    getClients: (state) => state.clients,
  },
  actions: {
    async listAllClient() {
      await api.get("clients").then((res) => {
        this.clients = res.data;
        console.log(this.clients);
      });
    },

    async getOneclient(id) {
      await api.get("clients/" + id).then((res) => {
        this.client = res.data;
        console.log(this.client);
      });
    },
    async addClient(client) {
      await api.post("clients", client).then((res) => {
        this.clients = res.data;
        console.log(this.clients);
      });
    },
    async updateClient(id, client) {
      await api.put("clients/" + id, client).then((res) => {
        this.clients = res.data;
        console.log(this.clients);
      });
    },
    deleteClient(id) {
      api.delete("clients/" + id).then((res) => {
        this.clients = res.data;
        console.log(this.clients);
      });
    },
  },
});
