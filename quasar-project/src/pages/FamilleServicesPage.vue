<template margin-left="20px">
  <q-card style="margin-top: 100px color: ;"
    ><h3 class="text-center">Gestion des familles de service</h3>
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
        to="/Tarifications"
      />
    </q-btn-group>
  </div>
  <div style="margin-top: 0px">
    <q-page class="flex flex-center">
      <div id="pdf">
        <q-table
          flat
          bordered
          title="Liste des familles"
          :rows="familles"
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
                  @click="handleUpdateClick(props.row.id_famille)"
                  icon="update"
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
            <q-btn color="primary" icon="add" label="" @click="prompt = true" />
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
            <q-dialog v-model="prompt" persistent>
              <q-card style="min-width: 350px">
                <q-form @submit="onSubmit">
                  <q-card-section>
                    <div class="text-h6">Formulaire d'ajout</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <div class="q-mb-md">
                      <q-input
                        filled
                        label="Nom de la famille service"
                        v-model="familleItem.libelle_famille"
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
            <q-dialog v-model="openUpdateModal" persistent>
              <q-card style="min-width: 350px">
                <q-form @submit.stop="onModifSite" class="q-pa-md">
                  <q-card-section>
                    <div class="text-h6">Formulaire de modification</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-input
                      filled
                      label="Nom du libellé"
                      v-model="familleItem.libelle_famille"
                    />
                  </q-card-section>

                  <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Annuler" v-close-popup />
                    <q-btn
                      flat
                      label="Modifier"
                      @click="onModifFamille"
                      v-close-popup
                    />
                  </q-card-actions>
                </q-form>
              </q-card>
            </q-dialog>
          </template>
        </q-table>
        <div class="button-container"></div>
      </div>
    </q-page>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useFamilleStore } from "src/stores/famille-store.js";
import { useRouter } from "vue-router";
import { getEmptyFamille } from "src/utils/getEmptyFamille.js";
import { useQuasar } from "quasar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
export default {
  props: {
    famille: {
      type: Object,
      default: getEmptyFamille(),
    },
  },

  setup() {
    const familleStore = useFamilleStore();
    const $q = useQuasar();
    const columns = [
      {
        name: "Numéro",
        required: true,
        label: "N°",
        align: "center",
        field: "id_famille",
        sortable: true,
      },
      {
        name: "libellé",
        align: "center",
        label: "libellé",
        field: "libelle_famille",
        sortable: true,
      },
    ];
    const router = useRouter();
    const familles = computed(() => {
      return familleStore.familles;
    });
    const familleItem = ref(getEmptyFamille());
    async function onSubmit() {
      console.log("essai", familleItem.value);
      await familleStore.addFamille(familleItem.value);
      await familleStore.listAllFamille();
      $q.notify({
        message: "Famille service ajoutée avec succès",
        color: "positive",
        position: "top",
        timeout: 3000,
      });
      router.push("/FamilleServices");
    }
    const openUpdateModal = ref(false);
    async function handleUpdateClick(Id) {
      try {
        const familleData = await familleStore.getOneFamille(Id);
        familleItem.value = { ...familleData };
        openUpdateModal.value = true;
        console.log("familleData", familleData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du site :",
          error
        );
      }
    }
    async function onModifFamille() {
      try {
        const Id = familleItem.value.id_famille; // avoir l'ID du site
        await familleStore.updateFamille(Id, familleItem.value);
        openUpdateModal.value = false; // Fermez le modal après la mise à jour
        await familleStore.listAllFamille();
        $q.notify({
          message: "Famille service modifiée avec succès",
          color: "positive",
          position: "top",
          timeout: 3000,
        });
      } catch (error) {
        console.error("Erreur lors de la mise à jour du site :", error);
      }
    }

    onMounted(() => {
      familleStore.listAllFamille();
    });

    return {
      filter: ref(""),
      prompt: ref(false),
      columns,
      familles,
      handleUpdateClick,
      familleItem,
      onSubmit,
      onModifFamille,
      openUpdateModal,
    };
  },
};
</script>

<style>
.text-center {
  text-align: center;
}
.custom-btn-style2 {
  margin-right: 10px;
}
#pdf-content {
  font-family: "Arial", sans-serif;
  color: #000; /* Couleur du texte */
  /* Ajoutez d'autres styles au besoin */
}
.button-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 350px;
  margin-right: 700px;
}
</style>
