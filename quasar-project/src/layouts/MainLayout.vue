<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated v-if="!$route.meta.hideNavbar">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> ARCHIBOX </q-toolbar-title>

        <div class="q-pa-md q-gutter-sm">
          <q-btn to="/" color="primary" icon="logout" label="Déconnexion" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      v-if="!$route.meta.hideSidebar"
    >
      <q-list>
        <q-item-label header>Les fonctionnalités disponibles </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Accueil",

    icon: "home",
    link: " #/Home-page",
  },
  {
    title: "Clients",

    icon: "person",
    link: " #/Client",
  },

  {
    title: "Sites",

    icon: "place",
    link: " #/SitePage",
  },
  {
    title: "Archives",

    icon: "archive",
    link: "#/Archives",
  },
  {
    title: "Services et tarifications",

    icon: "assignment",
    link: "#/FamilleServices",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
