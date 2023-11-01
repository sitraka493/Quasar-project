const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        meta: { hideNavbar: true, hideSidebar: true },
      },
      { path: "/home-page", component: () => import("pages/Home-Page.vue") },
      { path: "/Client", component: () => import("pages/ClientPage.vue") },
      {
        path: "/client/info/:id",
        component: () => import("pages/ClientInfo.vue"),
      },

      {
        path: "/AjoutCLient",
        component: () => import("pages/FormulaireClientPage.vue"),
      },
      {
        path: "Client/ModifCLient/:id",
        component: () => import("pages/UpdateClientPage.vue"),
      },
      { path: "/SitePage", component: () => import("pages/SitePage.vue") },

      { path: "/Contrat", component: () => import("pages/ContratPage.vue") },
      {
        path: "/ContratClient/:id",
        component: () => import("pages/ContratClient.vue"),
      },
      { path: "/Users", component: () => import("pages/UtilisateursPage.vue") },
      { path: "/Archives", component: () => import("pages/ArchivesPage.vue") },
      {
        path: "/ArchiveInfo/:id",
        component: () => import("pages/ArchiveInfo.vue"),
      },
      {
        path: "/FamilleServices",
        component: () => import("pages/FamilleServicesPage.vue"),
      },
      {
        path: "/Services",
        name: "Services",
        component: () => import("pages/ServicesPage.vue"),
      },
      {
        path: "/Tarifications",
        component: () => import("pages/TarificationPage.vue"),
      },

      {
        path: "/Stats",
        component: () => import("pages/Stats-Page.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
