import { defineStore } from "pinia";
import axios, { apiTarif } from "src/boot/axios";

export const useServiceStore = defineStore("service", {
  state: () => ({
    service: {},
    services: [],
    familles: [],
  }),
  getters: {
    getService: (state) => state.service,
    getService: (state) => state.services,
    getFamilles: (state) => state.familles,
  },
  actions: {
    listAllService() {
      apiTarif.get("services").then((res) => {
        this.services = res.data;
        console.log(this.services);
      });
    },
    async listAllFamilles() {
      try {
        const response = await apiTarif.get("familles");
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des familles", error);
        throw error;
      }
    },

    async getOneService(id) {
      try {
        const response = await apiTarif.get("services/" + id);
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        throw error;
      }
    },

    async updateService(id, service) {
      await apiTarif.put("services/" + id, service).then((res) => {
        this.services = res.data;
        console.log(this.services);
      });
    },

    async addService(service) {
      try {
        const res = await apiTarif.post("services", service);
        this.services = res.data;
        console.log("nouveau service:", this.services);
      } catch (error) {
        console.error("Erreur lors de l'ajout du service:", error);
      }
    },

    async deleteService(id) {
      await apiTarif.delete("services/" + id).then((res) => {
        this.services = res.data;
        console.log(this.services);
      });
    },
  },
});
