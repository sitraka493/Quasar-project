import { defineStore } from "pinia";
import axios, { apiSite } from "src/boot/axios";

export const useRayonStore = defineStore("rayon", {
  state: () => ({
    rayon: {},
    rayons: [],
    sites: [],
  }),
  getters: {
    getRayon: (state) => state.rayon,
    getRayons: (state) => state.rayons,
    getSites: (state) => state.sites,
  },
  actions: {
    listAllRayon() {
      apiSite.get("rayonnages").then((res) => {
        this.rayons = res.data;
        console.log(this.rayons);
      });
    },
    async listAllSite() {
      try {
        const response = await apiSite.get("sites");
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des sites", error);
        throw error;
      }
    },
    async getOnerayon(id) {
      try {
        const response = await apiSite.get("rayonnages/" + id);
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        throw error;
      }
    },

    async addRayon(rayon) {
      await apiSite.post("rayonnages", rayon).then((res) => {
        //this.contrats = res.data;
        console.log("nouveau rayon:", res);
      });
    },

    async updateRayon(id, rayon) {
      await apiSite.put("rayonnages/" + id, rayon).then((res) => {
        //this.services = res.data;
        console.log("Rayonnage modifié:", res);
      });
    },
  },
});
