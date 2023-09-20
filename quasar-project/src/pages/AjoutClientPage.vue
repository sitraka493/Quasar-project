<template>
  <h2 class="text-center">Formulaire d'ajout d'un client</h2>
  <q-card>
    <div class="q-pa-md">
      <q-form style="width: 60%" @submit.stop="onSubmit" @reset="onReset">
        <div class="q-gutter-md" style="max-width: 200px">
          <q-input
            filled
            v-model="client.nomclient"
            label="Nom du client"
            margin-left="200px"
          />
          <q-input filled v-model="client.tel" label="Numéro de Téléphone" />
          <q-input filled v-model="client.date" label="Date du contrat" />
          <q-input filled v-model="client.email" label="Email" />
          <q-input filled v-model="client.fax" label="Fax" />

          <q-space />
        </div>

        <q-btn
          color="primary"
          :disable="loading"
          label="Ajouter le client"
          @click="addRow"
          type="submit"
        />
        <q-btn
          style="margin-left: 50px"
          label="Annuler"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </q-form>
    </div>
  </q-card>
</template>

<script>
import { computed, onMounted, reactive, ref } from "vue";
import { useClientStore } from "src/stores/client-store";
const clientStore = useClientStore();

const nomclient = ref("");
const tel = ref("");
const date = ref("");
const email = ref("");
const fax = ref("");

const client = reactive({
  nomclient: "",
  tel: "",
  date: "",
  email: "",
  fax: "",
});

const clients = computed(() => {
  return clientStore.clients;
});

export default {
  setup() {
    onMounted(() => {
      clientStore.listAllClient();
    });

    return {
      filter: ref(""),
      nomclient,
      client,
      tel,
      date,
      email,
      fax,

      clients,
    };
  },
};
</script>
