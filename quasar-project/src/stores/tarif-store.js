import { createPinia, defineStore } from "pinia";
import axios, { apiTarif, api } from "src/boot/axios";

export const useTarifStore = defineStore("tarif", {
  state: () => ({
    tarif: {},
    tarifs: [],
    clients: [],
    services: [],
    periodes: [],
    unites: [],
  }),
  getters: {
    getTarif: (state) => state.tarif,
    getTarifs: (state) => state.tarifs,
  },
  actions: {
    listAllTarif() {
      apiTarif.get("tarif").then((res) => {
        this.tarifs = res.data;
        console.log(this.tarifs);
      });
    },

    async listAllServices() {
      try {
        const response = await apiTarif.get("services");
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des services", error);
        throw error;
      }
    },

    async listAllClient() {
      try {
        const response = await api.get("clients/api");
        console.log("response.data:", response.data);
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des clients", error);
        throw error;
      }
    },

    async listAllPeriodes() {
      try {
        const response = await apiTarif.get("periode");
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des périodes", error);
        throw error;
      }
    },
    async listAllUnites() {
      try {
        const response = await apiTarif.get("unite");
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des unités", error);
        throw error;
      }
    },

    async getOneTarif(id) {
      try {
        const response = await apiTarif.get("tarif/" + id);
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        throw error;
      }
    },

    async updateTarif(id, tarif) {
      await apiTarif.put("tarif/" + id, tarif).then((res) => {
        //this.tarifs = res.data;
        console.log("tarifs:", res);
      });
    },

    async addTarif(tarif) {
      try {
        const res = await apiTarif.post("tarif", tarif);
        //this.tarifs = res.data;
        console.log("nouveau tarif client:", res);
      } catch (error) {
        console.error("Erreur lors de l'ajout du tarif:", error);
      }
    },

    async deleteTarif(id) {
      await apiTarif.delete("tarif/" + id).then((res) => {
        //this.tarifs = res.data;
        console.log("suppression", res);
      });
    },
  },
});
