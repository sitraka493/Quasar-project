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
    <h2>Historique</h2>
    <div>
      <q-card-section>
        <p>
          Rhenus est un groupe allemand de services logistiques. Employant 37
          500 salariés, Rhenus a un chiffre d'affaires de 7 milliards d'euros.
          Fondée en 1912, l'entreprise est présente sur 970 sites tout autour de
          la planète1. Rhenus fait partie du groupe.
        </p>
      </q-card-section>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      slide: ref(4),
      autoplay: ref(true),
    };
  },
};
</script>
