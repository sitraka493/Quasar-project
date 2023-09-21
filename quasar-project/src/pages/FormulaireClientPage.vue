<template>
    <div class="q-px-lg q-mb-md">
      <div class="text-h6 text-center q-py-md">
        Formulaire d'ajout d'un client
      </div>
      <q-card>
        <div class="q-pa-md">
          <q-form @submit.stop="onSubmit" class="q-pa-md">
            <div class="q-gutter-md full-width">
              <div class="q-gutter-md">
                  <q-input
                    filled
                    v-model="clientItem.nomclient"
                    label="Nom du client"
                    margin-left="200px"
                  />
                  <q-input 
                    filled 
                    v-model="clientItem.tel" 
                    label="Numéro de Téléphone" 
                  />
                  <q-input 
                    filled 
                    v-model="clientItem.date" 
                    label="Date du contrat" 
                  />
                  <q-input 
                    filled 
                    v-model="clientItem.email" 
                    label="Email" 
                  />
                  <q-input 
                    filled 
                    v-model="clientItem.fax" 
                    label="Fax" 
                  />
              </div>
              <div>
                <q-btn
                  color="primary"
                  label="Ajouter le client"
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
              </div>
            </div>
          </q-form>
        </div>
      </q-card>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref,defineProps } from "vue";
import { useClientStore } from "src/stores/client-store";
import {getEmptyClient} from "src/utils/getEmptyClient";

export default {
    props: {
        client: {
            type: Object,
            default: getEmptyClient(),
        }
    },
    setup(props) {
        const clientStore = useClientStore();
        const clientItem = ref(props.client);
        function onSubmit() {
            if (isAnyFieldEmpty.value === false) {
                clientStore.ajoutClient(client);
            }
            else {
                console.log('veuillez remplir toutes les informations');
            }
        }
        const isAnyFieldEmpty = computed(() => {
            for (const key in client) {
                if (!client[key]) {
                    return true; // Return true if any field is empty
                }
            }
            return false; // Return false if all fields are non-empty
        });
        return {
            filter: ref(""),
            clientItem,
            onSubmit
        };
    }
};
</script>
