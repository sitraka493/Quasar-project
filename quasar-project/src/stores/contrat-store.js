import { defineStore } from "pinia";
import axios, { api } from "src/boot/axios";

export const useContratStore = defineStore("contrat", {
  state: () => ({
    contrat: {},
    contrats: [],
    clients: [],
  }),
  getters: {
    getContrat: (state) => state.contrat,
    getContrats: (state) => state.contrats,
    getClients: (state) => state.clients,
  },
  actions: {
    listAllContrat() {
      api.get("contrats").then((res) => {
        this.contrats = res.data;
        console.log(this.contrats);
      });
    },
    async listAllClients() {
      try {
        const response = await api.get("clients/api");
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des clients", error);
        throw error;
      }
    },

    async getOnecontrat(id) {
      await api.get("contrats/" + id).then((res) => {
        this.contrat = res.data;
        console.log(this.contrat);
      });
    },
    async addContrat(contrat) {
      try {
        const res = await api.post("contrats", contrat);
        this.contrats = res.data;
        console.log("nouveau contrat:", this.contrats);
      } catch (error) {
        console.error("Erreur lors de l'ajout du contrat:", error);
      }
    },

    async deleteContrat(id) {
      await api.delete("contrats/" + id).then((res) => {
        this.contrats = res.data;
        console.log(this.contrats);
      });
    },
  },
});
