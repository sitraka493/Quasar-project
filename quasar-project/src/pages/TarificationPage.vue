<template margin-left="20px">
  <q-card style="margin-top: 100px color: ;"
    ><h3 class="text-center">Gestion des Tarifications</h3>
  </q-card>
  <div class="q-pa-md q-gutter-y-md column items-start">
    <q-btn-group push>
      <q-btn
        push
        label="Gérer famille"
        icon="group"
        to="/FamilleServices"
        title="Manage Family"
      />

      <q-btn push label="Gérer Service" icon="assignment" to="Services" />
      <q-btn
        push
        label="Gérer Tarifications"
        icon="margin"
        to="Tarifications"
      />
    </q-btn-group>
  </div>
  <div>
    <q-page class="flex flex-center">
      <div id="pdf">
        <q-table
          flat
          bordered
          title="Liste des tarifications"
          :rows="tarifs"
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
                  @click="handleInfoClick(props.row.id_tarification)"
                  icon="update"
                  text-color="primary"
                />
              </q-td>
              <q-td auto-width>
                <q-btn
                  flat
                  size="sm"
                  round
                  dense
                  @click="handleDeleteClick(props.row.id_tarification)"
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
              <q-th>Modifier</q-th>
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
              @click="addTarif = true"
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

            <q-dialog v-model="addTarif" @show="AddTarifDialog" persistent>
              <q-card style="min-width: 350px">
                <q-form @submit="onSubmit">
                  <q-card-section>
                    <div class="text-h6">Formulaire d'ajout d'un tarif</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <div class="q-mb-md">
                      <q-select
                        filled
                        v-model="model"
                        :options="serviceList"
                        label="Veuillez choisir le service"
                        emit-value
                        map-options
                      />
                    </div>
                    <div class="q-mb-md">
                      <q-select
                        filled
                        v-model="periode"
                        :options="periodeList"
                        label="Veuillez choisir la periode"
                        emit-value
                        map-options
                      />
                    </div>
                    <div class="q-mb-md">
                      <q-select
                        filled
                        v-model="unite"
                        :options="uniteList"
                        label="Veuillez choisir l'unite"
                        emit-value
                        map-options
                      />
                    </div>
                    <div class="q-mb-md">
                      <q-input
                        filled
                        v-model="id_client"
                        label="Id Client"
                        autofocus
                        @keyup.enter="prompt = false"
                      />
                    </div>

                    <div class="q-mb-md">
                      <q-input
                        filled
                        v-model="prix"
                        label="Prix"
                        autofocus
                        @keyup.enter="prompt = false"
                      />
                    </div>

                    <div class="q-mb-md">
                      <q-input
                        filled
                        v-model="coefficient"
                        label="Coefficient"
                        autofocus
                        @keyup.enter="prompt = false"
                      />
                    </div>
                    <div class="q-mb-md">
                      <q-input
                        filled
                        v-model="libelle"
                        label="Libelle"
                        autofocus
                        @keyup.enter="prompt = false"
                      />
                    </div>
                    <div class="q-mb-md">
                      <q-input
                        filled
                        v-model="quantité1"
                        label="Quantité1"
                        autofocus
                        @keyup.enter="prompt = false"
                      />
                    </div>
                    <div class="q-mb-md">
                      <q-input
                        filled
                        v-model="getQuantité2"
                        label="Quantité2"
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

            <q-dialog
              v-model="handleUpdateModal"
              @show="AddTarifDialog"
              persistent
            >
              <q-card style="min-width: 350px">
                <q-form @submit.stop="onModifTarif" class="q-pa-md">
                  <q-card-section>
                    <div class="text-h6">Formulaire de modification</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-input filled label="Id Client" v-model="id_client" />
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-input filled label="prix" v-model="prix" />
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <q-input filled label="Quantité2" v-model="getQuantité2" />
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-input filled label="Quantité1" v-model="quantité1" />
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <q-input filled label="libelle" v-model="libelle" />
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <div class="q-mb-md">
                      <q-select
                        filled
                        v-model="model"
                        :options="serviceList"
                        label="Veuillez choisir le service"
                        emit-value
                        map-options
                      />
                    </div>
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <div class="q-mb-md">
                      <q-select
                        filled
                        v-model="periode"
                        :options="periodeList"
                        label="Veuillez choisir la famille une période"
                        emit-value
                        map-options
                      />
                    </div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <div class="q-mb-md">
                      <q-select
                        filled
                        v-model="unite"
                        :options="uniteList"
                        label="Veuillez choisir l'unité du service"
                        emit-value
                        map-options
                      />
                    </div>
                  </q-card-section>

                  <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Annuler" v-close-popup />
                    <q-btn
                      flat
                      label="Modifier"
                      @click="onModifTarif"
                      v-close-popup
                    />
                  </q-card-actions>
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
                    @click="confirmDeleteTarif"
                    v-close-popup
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </template>
        </q-table>
        <div class="button-container">
          <q-btn
            class="q-mt-md custom-btn-style2"
            color="green"
            label="Exporter en Excel"
            @click="exportToExcel"
          />
          <q-btn
            class="q-mt-md custom-btn-style"
            color="warning"
            label="Exporter en PDF"
            @click="exportToPDF"
          />
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useTarifStore } from "src/stores/tarif-store.js";
import { getEmptyTarif } from "src/utils/getEmptyTarif.js";
import { useRouter } from "vue-router";
export default {
  props: {
    tarif: {
      type: Object,
      default: getEmptyTarif(),
    },
  },

  setup() {
    const tarifStore = useTarifStore();
    const computedRows = ref([]);
    const handleDeleteModal = ref(false);
    const model = ref(null);
    const periode = ref(null);
    const unite = ref(null);
    const nom_service = ref("");
    const tarifItem = ref({});
    const addTarif = ref(false);
    const tarifData = ref(getEmptyTarif());
    const id_client = ref("");
    const coefficient = ref("");
    const prix = ref("");
    const libelle = ref("");
    const quantité1 = ref("");
    const getQuantité2 = ref("");

    async function onSubmit() {
      console.log("données:", model.value);
      const tarifData = {
        service: {
          id_service: model.value,
        },
        periode: {
          id_periode: periode.value,
        },
        unite: {
          id_unite: unite.value,
        },
        id_client: id_client.value,
        prix: prix.value, //le nom de la propriété en fonction de votre API
        coefficient: coefficient.value,
        libelle: libelle.value,
        quantité1: quantité1.value,
        getQuantité2: getQuantité2.value,
      };

      try {
        console.log("avant submit", tarifData);
        await tarifStore.addTarif(tarifData);
        addTarif.value = false;
        await tarifStore.listAllTarif(); // Fermez le modal après ajout
      } catch (error) {
        // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
        console.error(error);
      }
    }
    function AddTarifDialog() {
      fetchServiceList();
      fetchPeriodeList();
      fetchUniteList();
    }

    const serviceList = ref([]);

    async function fetchServiceList() {
      try {
        const services = await tarifStore.listAllServices();
        console.log("services:", services);
        serviceList.value = services.map((service) => ({
          label: service.nom_service,
          value: service.id_service,
        }));
      } catch (error) {
        console.error(error);
      }
    }
    const periodeList = ref([]);

    async function fetchPeriodeList() {
      try {
        const periodes = await tarifStore.listAllPeriodes();
        console.log("periode:", periodes);
        periodeList.value = periodes.map((periode) => ({
          label: periode.intitule_periode,
          value: periode.id_periode,
        }));
      } catch (error) {
        console.error(error);
      }
    }
    const uniteList = ref([]);

    async function fetchUniteList() {
      try {
        const unites = await tarifStore.listAllUnites();
        console.log("unite:", unites);
        uniteList.value = unites.map((unite) => ({
          label: unite.libelle_unite,
          value: unite.id_unite,
        }));
      } catch (error) {
        console.error(error);
      }
    }

    const handleUpdateModal = ref(false);
    async function handleInfoClick(Id) {
      try {
        const tarifData = await tarifStore.getOneTarif(Id);
        console.log("tarifData", tarifData);
        if (tarifData) {
          id_client.value = tarifData.id_client;
          prix.value = tarifData.prix;
          quantité1.value = tarifData.quantité1;
          getQuantité2.value = tarifData.quantité2;
          libelle.value = tarifData.libelle;
          model.value = tarifData.service.id_service; // Mettez à jour model avec l'ID de la famille
          periode.value = tarifData.periode.id_periode;
          unite.value = tarifData.unite.id_unite;
        }
        tarifItem.value = {
          ...tarifData,
        };
        handleUpdateModal.value = true;
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du tarif :",
          error
        );
      }
    }

    async function onModifTarif() {
      try {
        const tarifId = tarifItem.value.id_tarification; // avoir l'ID du site

        const updatedTarifData = {
          prix: prix.value,
          libelle: libelle.value,
          coefficient: coefficient.value,
          quantité1: quantité1.value,
          getQuantité2: getQuantité2.value,
          id_client: id_client.value,
          service: {
            id_service: model.value,
          },
          periode: {
            id_periode: periode.value,
          },
          unite: {
            id_unite: unite.value,
          },
        };
        if (model.value !== tarifItem.value.service.id_service) {
          updatedTarifData.service = {
            id_famille: model.value,
          };
        }
        if (periode.value !== tarifItem.value.periode.id_periode) {
          updatedTarifData.periode = {
            id_periode: periode.value,
          };
          if (unite.value !== tarifItem.value.unite.id_unite) {
            updatedTarifData.unite = {
              id_unite: unite.value,
            };
          }
        }
        await tarifStore.updateTarif(tarifId, updatedTarifData);
        handleUpdateModal.value = false; // Fermez le modal après la mise à jour
        await tarifStore.listAllTarif();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du service :", error);
      }
    }

    const columns = [
      {
        name: "id_client",
        required: true,
        label: "Id Client",
        align: "center",
        field: "id_client",
        sortable: true,
      },
      {
        name: "nom",
        align: "center",
        label: "Nom Client",
        field: (row) => (row.client ? row.client.nomClient : ""),

        sortable: true,
      },
      {
        name: "service",
        align: "center",
        label: "Service",
        field: (row) => (row.service ? row.service.nom_service : ""),

        sortable: true,
      },

      {
        name: "unite",
        align: "center",
        label: "Unité",
        field: (row) => (row.unite ? row.unite.libelle_unite : ""),
      },
      {
        name: "Periode",
        align: "center",
        label: "Périodicité",
        field: (row) => (row.periode ? row.periode.intitule_periode : ""),
      },

      {
        name: "Prix",
        required: true,
        label: "Prix",
        align: "center",
        field: "prix",
        sortable: true,
      },

      {
        name: "coefficient",
        required: true,
        label: "Coefficient",
        align: "center",
        field: "coefficient",
        sortable: true,
      },
      {
        name: "libelle",
        required: true,
        label: "Libelle",
        align: "center",
        field: "libelle",
        sortable: true,
      },

      {
        name: "quantité1",
        required: true,
        label: "Quantité1",
        align: "center",
        field: "quantité1",
        sortable: true,
      },

      {
        name: "quantité2",
        required: true,
        label: "Quantité2",
        align: "center",
        field: "getQuantité2",
        sortable: true,
      },
    ];
    const router = useRouter();
    const tarifs = computed(() => {
      return tarifStore.tarifs;
    });

    function handleDeleteClick(id) {
      console.log(" id_tarification:", id);
      tarifItem.value.id = id;
      handleDeleteModal.value = true;
    }
    async function confirmDeleteTarif() {
      const id_tarifToDelete = tarifItem.value.id;

      await tarifStore.deleteTarif(id_tarifToDelete);

      handleDeleteModal.value = false;
      await tarifStore.listAllTarif();
    }

    onMounted(() => {
      tarifStore.listAllTarif();
      fetchPeriodeList();
    });

    return {
      filter: ref(""),
      columns,
      tarifItem,
      AddTarifDialog,
      handleInfoClick,
      uniteList,
      tarifData,
      onModifTarif,
      addTarif,
      model,
      periode,
      unite,
      quantité1,
      getQuantité2,
      serviceList,
      periodeList,
      fetchUniteList,
      fetchServiceList,
      fetchPeriodeList,
      handleDeleteClick,
      handleDeleteModal,
      handleUpdateModal,
      confirmDeleteTarif,
      onSubmit,
      tarifs,
      coefficient,
      prix,
      libelle,
      id_client,
    };
  },
};
</script>

<style>
.text-center {
  text-align: center;
}

#pdf-content {
  font-family: "Arial", sans-serif;
  color: #000; /* Couleur du texte */
  /* Ajoutez d'autres styles au besoin */
  .custom-btn-style2 {
    margin-left: 20px;
  }
  .button-container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 350px;
    margin-right: 600px;
  }
}
</style>
