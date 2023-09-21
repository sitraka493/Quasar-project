const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "/home-page", component: () => import("pages/Home-Page.vue") },
      { path: "/Client", component: () => import("pages/ClientPage.vue") },
      {
        path: "/AjoutCLient",
        component: () => import("pages/AjoutClientPage.vue"),
      },
      { path: "/Archives", component: () => import("pages/ArchivesPage.vue") },
      { path: "/Services", component: () => import("pages/ServicesPage.vue") },
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
