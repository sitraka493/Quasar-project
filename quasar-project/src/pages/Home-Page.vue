<template>
  <h2 align="center">Bienvenue sur votre espace d'administration</h2>
  <div class="q-pa-md">
    <q-carousel
      animated
      v-model="slide"
      navigation
      infinite
      :autoplay="autoplay"
      arrows
      transition-prev="slide-right"
      transition-next="slide-left"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = true"
    >
      <q-carousel-slide :name="1" img-src="src/assets/Rhenus.jpg" />

      <q-carousel-slide :name="2" img-src="src/assets/Rhenusbat.jpg" />
      <q-carousel-slide
        :name="3"
        img-src="src/assets/Qualitätsmanagement.webp"
      />
      <q-carousel-slide :name="4" img-src="src/assets/Managementsystem.webp" />
    </q-carousel>
  </div>
</template>
<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      slide: ref(1),
      autoplay: ref(true),
    };
  },
};
</script>
<style>
.full-screen-image {
  width: 100vw; /* 100% de la largeur de la vue (viewport width) */
  height: 100vh; /* 100% de la hauteur de la vue (viewport height) */
  overflow: hidden; /* Cachez tout ce qui dépasse de la fenêtre */
}
.full-screen-image img {
  width: 100%; /* 100% de la largeur du parent (.full-screen-image) */
  height: 100%; /* 100% de la hauteur du parent (.full-screen-image) */
  object-fit: cover; /* L'image remplira la zone sans déformer sa forme */
}
</style>
