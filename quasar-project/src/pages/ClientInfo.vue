<template margin-left="20px">
  <q-page class="background-image flex flex-center">
    <div class="q-pa-md">
      <div class="q-pa-md text-center">
        <h2 class="text-style">Informations sur le client</h2>
      </div>

      <q-card class="my-card">
        <q-card-section class="q-pa-md info-container">
          <div class="input-group">
            <div class="q-mb-md italic-white-text">
              <strong>Id:</strong>
              <q-input v-model="client.id_client" class="my-input" />
            </div>
            <div class="q-mb-md italic-white-text">
              <strong>Nom:</strong>
              <q-input v-model="client.nomClient" class="my-input" />
            </div>
            <div class="q-mb-md italic-white-text">
              <strong>Adresse:</strong
              ><q-input v-model="client.adresse_client" class="my-input" />
            </div>
            <div class="q-mb-md italic-white-text">
              <strong>Fax:</strong
              ><q-input v-model="client.fax_client" class="my-input" />
            </div>
            <div class="q-mb-md italic-white-text">
              <strong>Situation:</strong
              ><q-input
                v-model="client.etat_client"
                class="my-input"
                style="color: white"
              />
            </div>
            <div class="q-mb-md italic-white-text">
              <strong>Règlement par:</strong
              ><q-input v-model="client.règlement" class="my-input" />
            </div>
            <div class="q-mb-md italic-white-text">
              <strong>Date du contrat:</strong
              ><q-input v-model="client.date_contrat" class="my-input" />
            </div>
            <div class="q-mb-md italic-white-text">
              <strong>Email:</strong
              ><q-input v-model="client.email_client" class="my-input" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { useClientStore } from "src/stores/client-store";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    const clientStore = useClientStore();
    const route = useRoute();
    const clientId = route.params.id;
    const client = computed(() => {
      return clientStore.client;
    });

    onMounted(async () => {
      await clientStore.getOneclient(clientId);
    });

    return {
      client,
    };
  },
};
</script>

<style scoped>
.my-input {
  width: 80%; /* Ajustez la largeur selon vos besoins */
  padding: 8px; /* Ajustez le rembourrage selon vos besoins */
  border: 1px solid #ccc; /* Ajoute une bordure */
  border-radius: 5px; /* Ajoute des coins arrondis */
  color: white !important;
}

.background-image {
  background-image: url("assets/Clients.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 100vh; /* Ajustez selon vos besoins */
}

.text-style {
  color: white; /* Couleur du texte */
  font-size: 50px; /* Taille de la police */
  /* Autres styles de texte ici */
}
.input-group {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Deux colonnes avec largeur égale */
  grid-gap: 20px; /* Espacement entre les champs d'entrée */
}

.my-card {
  border-radius: 20px; /* Ajoute des coins arrondis */
  border: 6px solid #ccc; /* Ajoute une bordure */
  background-color: bg-grey-2; /* Change la couleur de fond */
  margin: 20px; /* Ajoute une marge autour du card */
}

.info-container {
  border-bottom: 3px solid #ccc; /* Bordure en bas de l'info-container */
}
.white-text {
  color: white; /* Couleur du texte en blanc */
}
.italic-white-text {
  color: black; /* Couleur du texte en blanc */
  font-style: italic; /* Texte en italique */
}
</style>
