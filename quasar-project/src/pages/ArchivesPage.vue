<template margin-left="20px">
  <q-card><h3 class="text-center">Gestion des archives</h3> </q-card>
  <q-page class="flex flex-center">
    <q-table
      flat
      bordered
      title="Liste des archives"
      :rows="archives"
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
              @click="handleInfoClick(props.row.cab)"
              icon="info"
              text-color="primary"
            />
          </q-td>
          <q-td auto-width>
            <q-btn
              flat
              size="sm"
              round
              dense
              @click="handleUpdateClick(props.row.cab)"
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
          <q-th>Détails</q-th>
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
      <template v-slot:top>
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
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useArchiveStore } from "src/stores/archive-store.js";
import jsPDF from "jspdf";
import { useRouter } from "vue-router";
import html2canvas from "html2canvas";
const archiveStore = useArchiveStore();
const router = useRouter();

export default {
  setup() {
    const archiveStore = useArchiveStore();
    const columns = [
      {
        name: "cab",
        align: "center",
        label: "Cab",
        field: "cab",
        sortable: true,
      },

      {
        name: "asc",
        required: true,
        label: "id_client",
        align: "center",
        field: (row) => row.client.id,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "nom_client",
        align: "center",
        label: "Nom du client",
        field: (row) => row.client.nom_client,

        sortable: true,
      },
      {
        name: "creation",
        align: "center",
        label: "Date de création",
        field: "date_numerisation",
        sortable: true,
      },
      {
        name: "rayonnage",
        align: "center",
        label: "Rayonnage",
        field: (row) =>
          `${row.rayonnage.allee} - ${row.rayonnage.colonne} - ${row.rayonnage.niveau} - ${row.rayonnage.position}`,
        sortable: true,
      },
      {
        name: "nombre de boîte",
        align: "center",
        label: "Nombre de boite",
        field: "fin_boite",
      },
      {
        name: "destruction",
        align: "center",
        label: "Date de destruction",
        field: "date_destruction",
        sortable: true,
      },
    ];
    const router = useRouter();
    const archives = computed(() => {
      return archiveStore.archives;
    });

    onMounted(() => {
      archiveStore.listAllArchives();
    });

    async function handleInfoClick(id) {
      await archiveStore.getOneArchive(id);
      console.log("Identifiant archive cliquée :", id);
      if (router && router.push) {
        router.push("ArchiveInfo/" + id);
      } else {
        console.error('Le routeur ou la méthode "push" ne sont pas définis.');
      }
    }
    function getAllDataFromDataTable() {
      return archives.value;
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
      pdf.text("Liste des archives", 10, 10);

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

      pdf.save("listeArchives.pdf");
    }

    return {
      filter: ref(""),
      columns,
      handleInfoClick,
      archives,
      exportToPDF,
    };
  },
};
</script>
<style>
.custom-btn-style2 {
  margin-right: 10px;
}
.button-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 350px;
  margin-right: 800px;
}
</style>
