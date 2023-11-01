<template margin-left="20px">
  <q-card style="margin-top: 100px color: ;"
    ><h3 class="text-center">Gestion des sites</h3></q-card
  >
  <div>
    <q-page class="flex flex-center">
      <q-table
        flat
        bordered
        title="Liste des sites"
        :rows="sites"
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
                @click="openUpdateModal(props.row.id_site)"
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
                  v-for="col in props.cols.filter((col) => col.name !== 'desc')"
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
                      label="Nom du site"
                      v-model="siteItem.site"
                      :rules="[(val) => !!val || 'Ce champ est obligatoire']"
                      autofocus
                      @keyup.enter="prompt = false"
                    />
                  </div>
                  <div class="q-mb-md">
                    <q-input
                      filled
                      v-model="siteItem.notation"
                      label="Notation"
                      autofocus
                      @keyup.enter="prompt = false"
                    />
                  </div>
                  <div class="q-mb-md">
                    <q-input
                      filled
                      v-model="siteItem.ipImpression"
                      label="Ip Impression"
                      :rules="[(val) => !!val || 'Ce champ est obligatoire']"
                      autofocus
                      @keyup.enter="prompt = false"
                    />
                  </div>

                  <div class="q-mb-md">
                    <q-input
                      filled
                      v-model="siteItem.port"
                      label="Port"
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

          <q-dialog v-model="handleDelete" persistent>
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
                  @click="confirmDelete"
                  v-close-popup
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-dialog v-model="handleUpdateModal" persistent>
            <q-card style="min-width: 350px">
              <q-form @submit.stop="onModifSite" class="q-pa-md">
                <q-card-section>
                  <div class="text-h6">Formulaire de modification</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <q-input filled label="Nom du site" v-model="siteItem.site" />
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <q-input
                    filled
                    label="Notation"
                    v-model="siteItem.notation"
                  />
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <q-input
                    filled
                    label="Ip Impression"
                    v-model="siteItem.ipImpression"
                  />
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <q-input filled label="Port" v-model="siteItem.port" />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                  <q-btn flat label="Annuler" v-close-popup />
                  <q-btn
                    flat
                    label="Modifier"
                    @click="onModifSite"
                    v-close-popup
                  />
                </q-card-actions>
              </q-form>
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
    </q-page>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useSiteStore } from "src/stores/site-store";
import { getEmptySite } from "src/utils/getEmptySite";
import * as XLSX from "xlsx";
import { useQuasar } from "quasar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default {
  props: {
    site: {
      type: Object,
      default: getEmptySite(),
    },
  },

  setup(props) {
    const siteStore = useSiteStore();
    const siteItem = ref(getEmptySite());
    const handleDelete = ref(false);
    const router = useRouter();
    const $q = useQuasar();

    async function onSubmit() {
      console.log("essai", siteItem.value);
      await siteStore.addSite(siteItem.value);
      await siteStore.listAllSite();
      $q.notify({
        message: "Site ajouté avec succès",
        color: "positive",
        position: "top",
        timeout: 3000,
      });
      await router.push("/SitePage");
    }
    function handleDeleteClick(id_site) {
      console.log(" id_site:", id_site);
      siteItem.value.id_site = id_site;
      handleDelete.value = true;
    }
    async function confirmDelete() {
      const id_siteToDelete = siteItem.value.id_site;

      await siteStore.deleteSite(id_siteToDelete);

      handleDelete.value = false;
      await siteStore.listAllSite();
      $q.notify({
        message: " Suppression effectuée avec succès",
        color: "positive",
        position: "top",
        timeout: 3000,
      });
      await router.push("/SitePage");
    }

    const columns = [
      {
        name: "id_site",
        required: true,
        label: "N°",
        align: "center",
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
        field: "id_site",
      },
      {
        name: "site",
        align: "center",
        label: "Site",
        field: "site",
        sortable: true,
      },
      {
        name: "Notation",
        align: "center",
        label: "Notation",
        field: "notation",
        sortable: true,
      },
      {
        name: "ipImpression",
        align: "center",
        label: "Ip Impression Etiquette",
        field: "ipImpression",
        sortable: true,
      },
      {
        name: "port",
        align: "center",
        label: "Port",
        field: "port",
        sortable: true,
      },
    ];

    const sites = computed(() => {
      return siteStore.sites;
    });

    const handleUpdateModal = ref(false);
    async function openUpdateModal(Id) {
      try {
        const siteData = await siteStore.getOnesite(Id);
        siteItem.value = { ...siteData };
        handleUpdateModal.value = true;
        console.log("siteData", siteData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du site :",
          error
        );
      }
    }
    async function onModifSite() {
      try {
        const siteId = siteItem.value.id_site; // avoir l'ID du site
        await siteStore.updateSite(siteId, siteItem.value);

        handleUpdateModal.value = false; // Fermez le modal après la mise à jour

        await siteStore.listAllSite();
        $q.notify({
          message: "Site Modifié avec succès",
          color: "positive",
          position: "top",
          timeout: 3000,
        });
      } catch (error) {
        console.error("Erreur lors de la mise à jour du site :", error);
      }
    }
    function getAllDataFromDataTable() {
      return sites.value;
    }
    function exportToExcel() {
      const allData = getAllDataFromDataTable();
      const worksheet = XLSX.utils.json_to_sheet(allData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sites");
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
      a.download = "sites.xlsx";
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
      pdf.text("Liste des clients", 10, 10);

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

      pdf.save("listeSites.pdf");
    }

    onMounted(() => {
      siteStore.listAllSite();
    });

    return {
      filter: ref(""),
      prompt: ref(false),
      siteItem,
      onSubmit,
      columns,
      sites,
      handleDelete,
      handleDeleteClick,
      confirmDelete,
      openUpdateModal,
      handleUpdateModal,
      onModifSite,
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
  margin-right: 600px;
}
</style>
