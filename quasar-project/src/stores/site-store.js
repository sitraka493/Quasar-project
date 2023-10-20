import { defineStore } from "pinia";
import axios, { apiSite } from "src/boot/axios";

export const useSiteStore = defineStore("site", {
  state: () => ({
    site: {},
    sites: [],
  }),
  getters: {
    getSite: (state) => state.site,
    getSites: (state) => state.sites,
  },
  actions: {
    listAllSite() {
      apiSite.get("sites").then((res) => {
        this.sites = res.data;

        console.log("liste", this.sites);
      });
    },
    async addSite(site) {
      await apiSite.post("sites", site).then((res) => {
        this.clients = res.data;
        console.log(res.data);
      });
    },
    async getOnesite(id) {
      try {
        const reponse = await apiSite.get("sites/" + id);
        return reponse.data;
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du site :",
          error
        );
        throw error;
      }
    },
    async updateSite(id, site) {
      await apiSite.put("sites/" + id, site).then((res) => {
        this.sites = res.data;
        console.log(this.sites);
      });
    },
    async deleteSite(id) {
      await apiSite.delete("sites/" + id);
      console.log(this.sites);
    },
  },
});
