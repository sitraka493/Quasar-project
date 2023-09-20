
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }, 
      { path: '/Homepage', component: () => import('pages/Homepage.vue') },
      { path: '/Client', component: () => import('pages/ClientPage.vue') },
      { path: '/AjoutCLient', component: () => import('pages/AjoutClientPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
