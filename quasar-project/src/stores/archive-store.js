import { defineStore } from "pinia";
import axios, { apiArch } from "src/boot/axios";

export const useArchiveStore = defineStore("archive", {
  state: () => ({
    archive: {},
    archives: [],
  }),
  getters: {
    getArchive: (state) => state.archive,
    getArchives: (state) => state.archives,
  },
  actions: {
    async listAllArchives() {
      await apiArch.get("archives").then((res) => {
        this.archives = res.data;
        console.log(this.archives);
      });
    },

    async getOneArchive(id) {
      await apiArch.get("archives/full/" + id).then((res) => {
        this.archive = res.data;
        console.log(this.archive);
      });
    },
    async deleteArchive(id) {
      await apiArch.delete("archives/" + id);
      console.log(this.archives);
    },
  },
});
