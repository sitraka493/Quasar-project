<template margin-left="20px">
  <q-card style="margin-top: 100px color: ;"
    ><h3 class="text-center">Gestion des contrats</h3>
  </q-card>
  <div class="q-pa-md q-gutter-y-md column items-start">
    <q-btn-group push>
      <q-btn
        push
        label="Gérer client"
        icon="person"
        to="/Client"
        title="Manage Clients"
      />

      <q-btn push label="Gérer Contrat" icon="mediation" to="Contrat" />
      <q-btn push label="Gérer utilisateurs" icon="people" to="/Users" />
    </q-btn-group>
  </div>
  <div style="margin-bottom: 0px">
    <q-page class="flex flex-center">
      <div id="pdf">
        <q-table
          flat
          bordered
          title="Liste des contrats"
          :rows="contrats"
          :columns="columns"
          row-key="name"
          :filter="filter"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.value }}
              </q-td>
              <q-td auto-width>
                <q-btn
                  flat
                  size="sm"
                  round
                  dense
                  @click="handleInfoClick(props.row.id_contrat)"
                  icon="task"
                  text-color="primary"
                />
              </q-td>
              <q-td auto-width>
                <q-btn
                  flat
                  size="sm"
                  round
                  dense
                  @click="handleDeleteClick(props.row.id_contrat)"
                  icon="delete"
                  text-color="primary"
                />
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  This is expand slot for row above: {{ props.row.name }}.
                </div>
              </q-td>
            </q-tr>
          </template>
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
              <q-th>Télécharger</q-th>
              <q-th>Supprimer</q-th>
            </q-tr>
          </template>
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:item="props">
            <div
              class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
              :style="props.selected ? 'transform: scale(0.95);' : ''"
            >
              <q-td auto-width>
                <q-toggle
                  v-model="props.expand"
                  checked-icon="add"
                  unchecked-icon="remove"
                  :label="`Index: ${props.row.index}`"
                />
              </q-td>
              <q-card
                bordered
                flat
                :class="
                  props.selected
                    ? $q.dark.isActive
                      ? 'bg-grey-9'
                      : 'bg-grey-2'
                    : ''
                "
              >
                <q-card-section>
                  <q-checkbox
                    dense
                    v-model="props.selected"
                    :label="props.row.name"
                  />
                </q-card-section>
                <q-separator />
                <q-list dense>
                  <q-item
                    v-for="col in props.cols.filter(
                      (col) => col.name !== 'desc'
                    )"
                    :key="col.name"
                  >
                    <q-item-section>
                      <q-item-label>{{ col.label }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label caption>{{ col.value }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </div>
          </template>

          <template v-slot:top>
            <q-btn
              color="primary"
              icon="add"
              label=""
              @click="addContrat = true"
            />
            <q-space />
            <q-input
              borderless
              dense
              debounce="300"
              color="primary"
              v-model="filter"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>

            <q-dialog v-model="addContrat" @show="fetchClientsList" persistent>
              <q-card style="min-width: 350px">
                <q-form @submit="onSubmit">
                  <q-card-section>
                    <div class="text-h6">Formulaire d'ajout d'un contrat</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <div class="q-mb-md">
                      <q-select
                        filled
                        v-model="model"
                        :options="clientsList"
                        label="Veuillez choisir le client"
                        emit-value
                        map-options
                      />
                    </div>
                    <div class="q-mb-md">
                      <q-input
                        filled
                        v-model="Intitulé"
                        label="Intitulé"
                        autofocus
                        @keyup.enter="prompt = false"
                      />
                    </div>
                    <div class="q-mb-md">
                      <q-input
                        filled
                        v-model="description"
                        label="Description"
                        autofocus
                        @keyup.enter="prompt = false"
                      />
                    </div>

                    <q-card-actions align="right" class="text-primary">
                      <q-btn flat label="Annuler" v-close-popup />
                      <q-btn flat label="Ajouter" type="submit" v-close-popup />
                    </q-card-actions>
                  </q-card-section>
                </q-form>
              </q-card>
            </q-dialog>

            <q-dialog v-model="handleDeleteModal" persistent>
              <q-card>
                <q-card-section class="row items-center">
                  <q-avatar icon="warning" color="warning" text-color="white" />
                  <span class="q-ml-sm">Veuillez confirmer la suppression</span>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat label="Annuler" color="primary" v-close-popup />
                  <q-btn
                    flat
                    label="Confirmer"
                    color="primary"
                    @click="confirmDeleteContrat"
                    v-close-popup
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </template>
        </q-table>
      </div>
    </q-page>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useContratStore } from "src/stores/contrat-store.js";
import { getEmptyContrat } from "src/utils/getEmptyContrat.js";
import { useRouter } from "vue-router";
export default {
  props: {
    contrat: {
      type: Object,
      default: getEmptyContrat(),
    },
  },

  setup() {
    const contratStore = useContratStore();
    const computedRows = ref([]);
    const handleDeleteModal = ref(false);
    const model = ref(null);
    const Intitulé = ref("");
    const description = ref("");
    const contratItem = ref({ id_contrat: null });
    const addContrat = ref(false);
    const contratData = ref(getEmptyContrat());

    const columns = [
      {
        name: "id_client",
        required: true,
        label: "Id_client",
        align: "center",
        format: (val) => `${val}`,
        sortable: true,
        field: (row) =>
          row.client ? row.client.id_client : "Client non défini",
      },
      {
        name: "nom",
        align: "center",
        label: "Client",
        field: (row) => {
          console.log("data", row);
          return row.client ? row.client.nomClient : "";
        },
        sortable: true,
      },
      {
        name: "date_contrat",
        align: "center",
        label: "Date contrat",
        field: (row) => (row.client ? row.client.date_contrat : ""),
        sortable: true,
      },

      {
        name: "intitulé",
        align: "center",
        label: "Intitulé",
        field: "intitulé",
      },
    ];
    const router = useRouter();
    const contrats = computed(() => {
      return contratStore.contrats;
    });
    async function onSubmit() {
      console.log("données:", model.value);
      const contratData = {
        client: {
          id_client: model.value,
        }, //le nom de la propriété en fonction de votre API
        intitulé: Intitulé.value,
        description: description.value,
      };

      try {
        console.log("avant submit", contratData);
        await contratStore.addContrat(contratData);
        addContrat.value = false;
        await contratStore.listAllContrat(); // Fermez le modal après ajout
      } catch (error) {
        // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
        console.error(error);
      }
    }
    const clientsList = ref([]);

    async function fetchClientsList() {
      try {
        const clients = await contratStore.listAllClients();
        console.log("Clients:", clients);
        clientsList.value = clients.map((client) => ({
          label: client.nomClient,
          value: client.id_client,
        }));
      } catch (error) {
        console.error(error);
      }
    }

    async function handleInfoClick(Id) {
      await contratStore.getOnecontrat(Id);
      router.push("/ContratClient/" + Id);
      console.log("Identifiant du contrat cliqué :", Id);
    }

    function handleDeleteClick(id_contrat) {
      console.log(" id_contrat:", id_contrat);
      contratItem.value.id_contrat = id_contrat;
      handleDeleteModal.value = true;
    }
    async function confirmDeleteContrat() {
      const id_contratToDelete = contratItem.value.id_contrat;

      await contratStore.deleteContrat(id_contratToDelete);

      handleDeleteModal.value = false;
      await contratStore.listAllContrat();
    }

    onMounted(() => {
      contratStore.listAllContrat();
    });

    return {
      filter: ref(""),
      columns,
      date: ref("2023/11/01"),
      contrats,
      handleDeleteModal,
      handleDeleteClick,
      confirmDeleteContrat,
      handleInfoClick,
      onSubmit,
      contratItem,
      addContrat,
      clientsList,
      fetchClientsList,
      Intitulé,
      description,
      model,
      getEmptyContrat,
    };
  },
};
</script>

<style>
.text-center {
  text-align: center;
}
.custom-btn-style {
  margin-bottom: 400px;
  margin-right: 750px;
}
#pdf-content {
  font-family: "Arial", sans-serif;
  color: #000; /* Couleur du texte */
  /* Ajoutez d'autres styles au besoin */
}
</style>
