<template>
  <div class="q-px-lg q-mb-md">
    <div class="text-h6 text-center q-py-md">
      Formulaire d'ajout d'un client
    </div>
    <q-card>
      <div class="q-pa-md">
        <q-form @submit.stop="onSubmit" class="q-pa-md">
          <div class="q-gutter-md">
            <div class="row">
              <div class="col">
                <q-input
                  filled
                  v-model="clientItem.nomClient"
                  label="Nom du client"
                  margin-left="200px"
                  :rules="[(val) => !!val || 'Ce champ est obligatoire']"
                />
              </div>

              <div class="col">
                <q-input
                  filled
                  v-model="clientItem.tel_client"
                  label="Numéro de Téléphone"
                  :rules="[
                    (val) => !!val || 'Ce champ est obligatoire',
                    (val) =>
                      /^\d+$/.test(val) ||
                      'Veuillez entrer uniquement des chiffres',
                  ]"
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  filled
                  v-model="clientItem.adresse_client"
                  label="Adresse du client"
                  :rules="[(val) => !!val || 'Ce champ est obligatoire']"
                />
              </div>

              <div class="col">
                <q-input
                  filled
                  v-model="clientItem.date_contrat"
                  label="Selectionnez une date"
                  :rules="[(val) => !!val || 'Ce champ est obligatoire']"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="clientItem.date_contrat"
                          mask="DD-MM-YYYY "
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
                <q-input
                  filled
                  v-model="clientItem.email_client"
                  label="Email"
                  :rules="[(val) => !!val || 'Ce champ est obligatoire']"
                  @input="validateEmail"
                  :error="!emailIsValid"
                />
              </div>
              <div class="col">
                <q-input filled v-model="clientItem.fax_client" label="Fax" />
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-select
                  filled
                  v-model="clientItem.etat_client"
                  :options="options2"
                  label="Situation"
                  :rules="[(val) => !!val || 'Ce champ est obligatoire']"
                />
              </div>

              <div class="col">
                <q-select
                  filled
                  v-model="clientItem.règlement"
                  :options="options"
                  label="Règlement par"
                  :rules="[(val) => !!val || 'Ce champ est obligatoire']"
                />
              </div>
            </div>

            <div class="col">
              <q-input
                filled
                v-model="clientItem.codecompt_client"
                label="Code comptable"
                :rules="[(val) => !!val || 'Ce champ est obligatoire']"
              />
            </div>

            <p></p>

            <q-btn
              color="primary"
              label="Ajouter le client"
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
import { getEmptyClient } from "src/utils/getEmptyClient";
import router from "src/router";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default {
  props: {
    client: {
      type: Object,
      default: getEmptyClient(),
    },
  },
  setup(props) {
    const clientStore = useClientStore();
    const clientItem = ref(props.client);
    const router = useRouter();
    const $q = useQuasar();

    async function onSubmit() {
      console.log("essai", clientItem.value);
      await clientStore.addClient(clientItem.value);
      await clientStore.listAllClient();
      $q.notify({
        message: "Client ajouté avec succès",
        color: "positive",
        position: "bottom",
        timeout: 3000,
      });
      router.push("/Client");
    }

    /*const isAnyFieldEmpty = computed(() => {
      for (const key in client) {
        if (!client[key]) {
          return true; // Return true if any field is empty
        }
      }
      return false; // Return false if all fields are non-empty
    });*/
    const emailIsValid = ref(true);
    function validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(clientItem.value.email_client);

      if (!isValidEmail) {
        $q.notify({
          message: "Adresse e-mail invalide",
          color: "negative",
          position: "bottom",
          timeout: 3000,
        });
      }
    }
    return {
      filter: ref(""),
      clientItem,
      emailIsValid,
      onSubmit,
      date: ref("2023/11/01"),
      model: ref(null),
      validateEmail,
      options: [
        "Virement",
        "Chèque",
        "Prélèvement",
        "Traite",
        "Reception devis",
      ],
      model2: ref(null),
      options2: ["Actif", "Passif"],
    };
  },
};
</script>
