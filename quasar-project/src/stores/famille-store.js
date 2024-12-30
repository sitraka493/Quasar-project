import { defineStore } from "pinia";
import axios, { apiTarif } from "src/boot/axios";

export const useFamilleStore = defineStore("famille", {
  state: () => ({
    famille: {},
    familles: [],
  }),
  getters: {
    getFamille: (state) => state.famille,
    getFamilles: (state) => state.familles,
  },
  actions: {
    listAllFamille() {
      apiTarif.get("familles").then((res) => {
        this.familles = res.data;

        console.log("liste", this.familles);
      });
    },
    async addFamille(famille) {
      await apiTarif.post("familles", famille).then((res) => {
        //this.familles = res.data;
        console.log(res);
      });
    },
    async getOneFamille(id) {
      try {
        const reponse = await apiTarif.get("familles/" + id);
        return reponse.data;
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données familles :",
          error
        );
        throw error;
      }
    },
    async updateFamille(id, famille) {
      await apiTarif.put("familles/" + id, famille).then((res) => {
        this.familles = res.data;
        console.log(this.familles);
      });
    },
    async deleteFamille(id) {
      await apiTarif.delete("familles/" + id);
      console.log(this.familles);
    },
  },
});
