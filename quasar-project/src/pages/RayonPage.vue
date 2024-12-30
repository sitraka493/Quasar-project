<template margin-left="20px">
  <q-card style="margin-top: 100px color: ;"
    ><h3 class="text-center">Gestion des rayonnages</h3></q-card
  >
  <div class="q-pa-md q-gutter-y-md column items-start">
    <q-btn-group push>
      <q-btn
        push
        label="Gérer les sites"
        icon="place"
        to="/SitePage"
        title="Manage Clients"
      />

      <q-btn push label="Gérer les les rayonnages" icon="map" to="RayonPage" />
    </q-btn-group>
  </div>

  <div>
    <q-page class="flex flex-center">
      <div id="pdf">
        <q-table
          flat
          bordered
          title="Liste des rayons"
          :rows="rayons"
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
                  @click="handleInfoClick(props.row.id_rayonnage)"
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
                  @click="handleDeleteClick(props.row.id_site)"
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
            <q-btn color="primary" icon="add" @click="prompt = true" />
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

            <q-dialog v-model="prompt" @show="fetchSiteList" persistent>
              <q-card style="min-width: 350px">
                <q-form @submit="onSubmit">
                  <q-card-section>
                    <div class="text-h6">Formulaire d'ajout</div>
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <div class="q-mb-md">
                      <q-select
                        filled
                        v-model="site"
                        :options="siteList"
                        label="Veuillez choisir le site"
                        emit-value
                        map-options
                      />
                    </div>

                    <div class="q-mb-md">
                      <q-input
                        filled
                        label="Allée "
                        v-model="allee"
                        :rules="[(val) => !!val || 'Ce champ est obligatoire']"
                        autofocus
                        @keyup.enter="prompt = false"
                      />
                    </div>
                    <div class="q-mb-md">
                      <q-input
                        filled
                        v-model="colonne"
                        label="Colonne"
                        autofocus
                        @keyup.enter="prompt = false"
                      />
                    </div>
                    <div class="q-mb-md">
                      <q-input
                        filled
                        v-model="niveau"
                        label="Niveau"
                        :rules="[(val) => !!val || 'Ce champ est obligatoire']"
                        autofocus
                        @keyup.enter="prompt = false"
                      />
                    </div>

                    <div class="q-mb-md">
                      <q-input
                        filled
                        v-model="position"
                        label="Position"
                        :rules="[
                          (val) => !!val || 'Ce champ est obligatoire',
                          (val) =>
                            /^\d+$/.test(val) ||
                            'Veuillez entrer uniquement des chiffres',
                        ]"
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
              @show="fetchSiteList"
              persistent
            >
              <q-card style="min-width: 350px">
                <q-form @submit.stop="onModifRayon" class="q-pa-md">
                  <q-card-section>
                    <div class="text-h6">Formulaire de modification</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <div class="q-mb-md">
                      <q-select
                        filled
                        v-model="site"
                        :options="siteList"
                        label="Veuillez choisir le site"
                        emit-value
                        map-options
                        readonly
                      />
                    </div>
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <div class="q-mb-md">
                      <q-input
                        filled
                        label="Allée "
                        v-model="allee"
                        :rules="[(val) => !!val || 'Ce champ est obligatoire']"
                        autofocus
                        @keyup.enter="prompt = false"
                      />
                    </div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <div class="q-mb-md">
                      <q-input
                        filled
                        label="Colonne"
                        v-model="colonne"
                        :rules="[(val) => !!val || 'Ce champ est obligatoire']"
                        autofocus
                        @keyup.enter="prompt = false"
                      />
                    </div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <div class="q-mb-md">
                      <q-input
                        filled
                        label="Niveau"
                        v-model="niveau"
                        :rules="[(val) => !!val || 'Ce champ est obligatoire']"
                        autofocus
                        @keyup.enter="prompt = false"
                      />
                    </div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <div class="q-mb-md">
                      <q-input
                        filled
                        label="Position "
                        v-model="position"
                        :rules="[(val) => !!val || 'Ce champ est obligatoire']"
                        autofocus
                        @keyup.enter="prompt = false"
                      />
                    </div>
                  </q-card-section>

                  <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Annuler" v-close-popup />
                    <q-btn
                      flat
                      label="Modifier"
                      @click="onModifRayon"
                      v-close-popup
                    />
                  </q-card-actions>
                </q-form>
              </q-card>
            </q-dialog>
          </template>
        </q-table>
      </div>
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
    </q-page>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useRayonStore } from "src/stores/Rayon-store";
import { getEmptyRayon } from "src/utils/getEmptyRayon";
import { useQuasar } from "quasar";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

export default {
  props: {
    rayon: {
      type: Object,
      default: getEmptyRayon(),
    },
  },

  setup(props) {
    const rayonStore = useRayonStore();
    const rayonItem = ref({ id_rayonnage: null });
    const addRayon = ref(false);
    const site = ref(null);
    const router = useRouter();
    const $q = useQuasar();
    const rayonData = ref(getEmptyRayon());
    const allee = ref("");
    const colonne = ref("");
    const niveau = ref("");
    const position = ref("");

    async function onSubmit() {
      console.log(
        "Valeurs du formulaire : ",
        site.value,
        allee.value,
        colonne.value,
        niveau.value,
        position.value
      );
      const rayonData = {
        site: {
          id_site: site.value,
        },
        allee: allee.value,
        colonne: colonne.value,
        niveau: niveau.value,
        position: position.value,
      };
      try {
        console.log("avant submit", rayonData);
        await rayonStore.addRayon(rayonData);
        console.log("resultat", rayonData);
        addRayon.value = false;
        await rayonStore.listAllRayon();
        $q.notify({
          message: "Rayonnage ajouté avec succès",
          color: "positive",
          position: "top",
          timeout: 3000,
        });
        await router.push("/RayonPage");
      } catch (error) {
        console.error("Une erreur s'est produite :", error);
        $q.notify({
          message: "Ajout impossible",
          color: "negative",
          position: "bottom",
          timeout: 3000,
        });
      }
    }

    const columns = [
      {
        name: "id_rayonnage",
        align: "center",
        label: "id_rayonnage",
        field: "id_rayonnage",
        sortable: true,
      },
      {
        name: "site",
        align: "center",
        label: "site",
        field: (row) => {
          console.log("data", row);
          return row.site ? row.site.site : "";
        },
        sortable: true,
      },
      {
        name: "rayonnage",
        align: "center",
        label: "Rayonnage",
        field: (row) =>
          `${row.allee} - ${row.colonne} - ${row.niveau} - ${row.position}`,
        sortable: true,
      },
    ];

    const siteList = ref([]);

    async function fetchSiteList() {
      try {
        const sites = await rayonStore.listAllSite();
        console.log("Sites:", sites);
        siteList.value = sites.map((site) => ({
          label: site.site,
          value: site.id_site,
        }));
      } catch (error) {
        console.error(error);
      }
    }

    const handleUpdateModal = ref(false);

    async function handleInfoClick(Id) {
      try {
        const rayonData = await rayonStore.getOnerayon(Id);
        console.log("rayonData", rayonData);
        if (rayonData && rayonData.allee) {
          console.log("rayonData", rayonData);

          allee.value = rayonData.allee;
          colonne.value = rayonData.colonne;
          niveau.value = rayonData.niveau;
          position.value = rayonData.position;
          if (rayonData.site) {
            site.value = rayonData.site.id_site; // Mettez à jour model avec l'ID de la famille
          }
          rayonItem.value = {
            ...rayonData,
          };
          handleUpdateModal.value = true;
        } else {
          console.error(
            "Les données du rayon ne contiennent pas la propriété 'allee'."
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du site :",
          error
        );
      }
    }

    async function onModifRayon() {
      try {
        const rayonId = rayonItem.value.id_rayonnage; // avoir l'ID du site
        console.log("rayonId", rayonId);
        console.log("Valeur de site.value :", site.value);
        console.log("Valeur de rayonItem.value.site :", rayonItem.value.site);
        const updatedRayonData = {
          allee: allee.value,
          colonne: colonne.value,
          niveau: niveau.value,
          position: position.value,
          site: {
            id_site: site.value,
          },
          // ...
        };
        if (
          rayonItem.value.site &&
          site.value !== rayonItem.value.site.id_site
        ) {
          updatedRayonData.site = {
            id_site: site.value,
          };
        }
        await rayonStore.updateRayon(rayonId, updatedRayonData);
        handleUpdateModal.value = false; // Fermez le modal après la mise à jour
        await rayonStore.listAllRayon();
        $q.notify({
          message: "Rayonnage modifié avec succès",
          color: "positive",
          position: "top",
          timeout: 3000,
        });
      } catch (error) {
        console.error("Erreur lors de la mise à jour du rayonnage :", error);
      }
    }

    function getAllDataFromDataTable() {
      return rayons.value;
    }
    function exportToExcel() {
      const allData = getAllDataFromDataTable();
      const worksheet = XLSX.utils.json_to_sheet(allData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "rayons");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = url;
      a.download = "rayons.xlsx";
      a.click();
      document.body.removeChild(a);
    }
    function generateFullHTML(data) {
      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const tbody = document.createElement("tbody");

      // Créer l'en-tête de tableau
      const headerRow = document.createElement("tr");
      for (const key in data[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
      }
      thead.appendChild(headerRow);

      // Remplir les lignes de tableau avec les données
      data.forEach((item) => {
        const tr = document.createElement("tr");
        for (const key in item) {
          const td = document.createElement("td");
          td.textContent = item[key];
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      });

      table.appendChild(thead);
      table.appendChild(tbody);

      const container = document.createElement("div");
      container.appendChild(table);

      return container;
    }
    function generateTableHTML(data) {
      let html = "<table>";
      // Générer les en-têtes
      html += "<tr>";
      for (const key in data[0]) {
        html += `<th>${key}</th>`;
      }
      html += "</tr>";

      // Générer les lignes de données
      data.forEach((item) => {
        html += "<tr>";
        for (const key in item) {
          html += `<td>${item[key]}</td>`;
        }
        html += "</tr>";
      });

      html += "</table>";
      return html;
    }
    async function exportToPDF() {
      const allData = getAllDataFromDataTable();
      const pdfWidth = 612;
      const pdfHeight = 792;

      const pdf = new jsPDF({
        unit: "mm",
        format: [pdfWidth, pdfHeight], // Définir la taille de la page
      });
      pdf.text("Liste des rayonnages", 10, 10);

      // Position de départ pour les données du tableau
      let y = 20;

      // Ajouter les en-têtes
      const headers = Object.keys(allData[0]);
      pdf.setFontSize(14);
      headers.forEach((header, index) => {
        pdf.text(header, 10 + index * 40, y);
      });

      y += 10;
      const incrementY = 7;
      // Ajouter les données
      pdf.setFontSize(10);
      allData.forEach((row, rowIndex) => {
        y += incrementY;
        Object.values(row).forEach((value, colIndex) => {
          const textValue =
            value !== null && value !== undefined ? value.toString() : "";
          pdf.text(textValue, 10 + colIndex * 40, y + rowIndex * 10);
        });
      });

      pdf.save("liste des rayonnages.pdf");
    }

    const rayons = computed(() => {
      return rayonStore.rayons;
    });

    onMounted(() => {
      rayonStore.listAllRayon();
    });

    return {
      filter: ref(""),
      prompt: ref(false),
      onSubmit,
      columns,
      rayonData,
      site,
      rayons,
      rayonItem,
      fetchSiteList,
      handleInfoClick,
      handleUpdateModal,
      siteList,
      addRayon,
      allee,
      colonne,
      position,
      niveau,
      onModifRayon,
      exportToExcel,
      exportToPDF,
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
.button-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 350px;
  margin-right: 750px;
}
</style>
