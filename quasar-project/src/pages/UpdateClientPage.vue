<template>
  <div class="q-px-lg q-mb-md">
    <div class="text-h6 text-center q-py-md">
      Formulaire de modification d'un client
    </div>
    <q-card>
      <div class="q-pa-md">
        <q-form @submit.stop="onModif" @reset="onReset2" class="q-pa-md">
          <div class="q-gutter-md">
            <div class="row">
              <div class="col">
                <q-input
                  filled
                  v-model="client.nomClient"
                  label=""
                  margin-left="200px"
                />
              </div>

              <div class="col">
                <q-input
                  filled
                  v-model="client.tel_client"
                  label="Numéro de Téléphone"
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  filled
                  v-model="client.adresse_client"
                  label="Adresse du client"
                />
              </div>

              <div class="col">
                <q-input
                  filled
                  v-model="client.date_contrat"
                  label="Selectionnez une date"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="client.date_contrat"
                          mask="YYYY-MM-DD "
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>

                  <template v-slot:append> </template>
                </q-input>
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-input filled v-model="client.email_client" label="Email" />
              </div>
              <div class="col">
                <q-input filled v-model="client.fax_client" label="Fax" />
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-select
                  filled
                  v-model="client.etat_client"
                  :options="options2"
                  label="Situation"
                />
              </div>

              <div class="col">
                <q-select
                  filled
                  v-model="client.règlement"
                  :options="options"
                  label="Règlement par"
                />
              </div>
            </div>

            <div class="col">
              <q-input
                filled
                v-model="client.codecompt_client"
                label="Code comptable"
              />
            </div>
          </div>

          <p></p>
          <div>
            <q-btn
              color="primary"
              label="Modifier le client"
              type="submit"
              style="margin-left: 1000px"
            />
            <q-btn
              to="Client"
              style="margin-left: 50px"
              label="Annuler"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </div>
    </q-card>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, defineProps } from "vue";
import { useClientStore } from "src/stores/client-store";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default {
  setup() {
    const clientStore = useClientStore();
    const route = useRoute();
    const router = useRouter();
    const clientId = route.params.id;
    const $q = useQuasar();
    const client = computed(() => {
      return clientStore.client;
    });
    async function onModif() {
      console.log("essai2", client.value);
      await clientStore.updateClient(clientId, client.value);
      $q.notify({
        message: "Client modifié succès",
        color: "positive",
        position: "bottom",
        timeout: 3000,
      });
      router.push("/Client");
    }

    onMounted(async () => {
      await clientStore.getOneclient(clientId);
    });

    return {
      client,
      onModif,
      date: ref("2023/11/01"),
      model: ref(null),
      options: [
        "Virement",
        "Chèque",
        "Prélèvement",
        "Traite",
        "Reception devis",
      ],
      model2: ref(null),
      options2: ["Actif", "Passif"],
      onReset2() {
        username.value = null;
        password.value = null;
      },
    };
  },
};
</script>
