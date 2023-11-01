import { defineStore } from "pinia";
import axios, { api } from "src/boot/axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {},
    users: [],
    clients: [],
  }),
  getters: {
    getUser: (state) => state.user,
    getUsers: (state) => state.users,
    getClients: (state) => state.clients,
  },
  actions: {
    listUser() {
      api.get("client_utilisateurs").then((res) => {
        console.log(res.data);
        this.users = res.data;
      });
    },

    async getOneUser(id) {
      try {
        const reponse = await api.get("client_utilisateurs/" + id);
        return reponse;
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur :",
          error
        );
      }
    },

    async updateUser(id, user) {
      console.log("updating...", id, user);
      await api.put("client_utilisateurs/" + id, user).then((res) => {
        // this.users = res.data;

        console.log("Modification", res);
      });
    },
  },
});
