<template margin-left="20px">
  <q-card style="margin-top: 100px color: ;"
    ><h3 class="text-center">Gestion des services</h3>
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
  <div style="margin-bottom: 0px">
    <q-page class="flex flex-center">
      <div id="pdf">
        <q-table
          flat
          bordered
          title="Liste des services"
          :rows="services"
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
                  @click="handleInfoClick(props.row.id_service)"
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
                  @click="handleDeleteClick(props.row.id_service)"
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
              @click="addService = true"
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

            <q-dialog v-model="addService" @show="fetchFamilleList" persistent>
              <q-card style="min-width: 350px">
                <q-form @submit="onSubmit">
                  <q-card-section>
                    <div class="text-h6">Formulaire d'ajout d'un service</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <div class="q-mb-md">
                      <q-select
                        filled
                        v-model="model"
                        :options="familleList"
                        label="Veuillez choisir la famille du service"
                        emit-value
                        map-options
                      />
                    </div>
                    <div class="q-mb-md">
                      <q-input
                        filled
                        v-model="nom_service"
                        label="service"
                        autofocus
                        @keyup.enter="prompt = false"
                      />
                    </div>
                    <div class="q-mb-md">
                      <q-input
                        filled
                        v-model="codecompt_service"
                        label="code compte"
                        autofocus
                        @keyup.enter="prompt = false"
                      />
                    </div>

                    <div class="q-mb-md">
                      <q-input
                        filled
                        v-model="tva"
                        label="TVA"
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
              @show="fetchFamilleList"
              persistent
            >
              <q-card style="min-width: 350px">
                <q-form @submit.stop="onModifService" class="q-pa-md">
                  <q-card-section>
                    <div class="text-h6">Formulaire de modification</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-input
                      filled
                      label="Nom du service"
                      v-model="nom_service"
                    />
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <q-input
                      filled
                      label="code comptable du service"
                      v-model="codecompt_service"
                    />
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <q-input filled label="TVA" v-model="tva" />
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <div class="q-mb-md">
                      <q-select
                        filled
                        v-model="model"
                        :options="familleList"
                        label="Veuillez choisir la famille du service"
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
                      @click="onModifService"
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
                    @click="confirmDeleteService"
                    v-close-popup
                  />
                </q-card-actions>
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
import { useServiceStore } from "src/stores/service-store.js";
import { getEmptyService } from "src/utils/getEmptyService.js";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
export default {
  props: {
    service: {
      type: Object,
      default: getEmptyService(),
    },
  },

  setup() {
    const router = useRouter();
    const $q = useQuasar();

    const serviceStore = useServiceStore();
    const computedRows = ref([]);
    const handleDeleteModal = ref(false);
    const model = ref(null);
    const nom_service = ref("");
    const tva = ref("");
    const codecompt_service = ref(null);
    const serviceItem = ref({
      nom_service: "",
      codecompt_service: "",
      tva: "",
    });
    const addService = ref(false);
    const serviceData = ref(getEmptyService());
    const columns = [
      {
        name: "id_service",
        required: true,
        label: "Id_service",
        align: "center",
        field: "id_service",
        sortable: true,
      },
      {
        name: "nom",
        align: "center",
        label: "Client",
        field: "nom_service",
        sortable: true,
      },
      {
        name: "famille",
        align: "center",
        label: "famille",
        field: (row) =>
          row.familleService ? row.familleService.libelle_famille : "",
        sortable: true,
      },

      {
        name: "code",
        align: "center",
        label: "Code Comptable",
        field: "codecompt_service",
      },
      {
        name: "tva",
        align: "center",
        label: "TVA",
        field: "tva",
      },
    ];

    const services = computed(() => {
      return serviceStore.services;
    });
    async function onSubmit() {
      console.log("données:", model.value);
      const serviceData = {
        familleService: {
          id_famille: model.value,
        },
        nom_service: nom_service.value, //le nom de la propriété en fonction de votre API
        tva: tva.value,
        codecompt_service: codecompt_service.value,
      };

      try {
        console.log("avant submit", serviceData);
        await serviceStore.addService(serviceData);
        addService.value = false;
        await serviceStore.listAllService();
        $q.notify({
          message: "Service ajouté avec succès",
          color: "positive",
          position: "top",
          timeout: 3000,
        });
        // Fermez le modal après ajout
      } catch (error) {
        // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
        console.error("erreur de la navigation:", error);
      }
    }
    const familleList = ref([]);

    async function fetchFamilleList() {
      try {
        const familles = await serviceStore.listAllFamilles();
        console.log("familles:", familles);
        familleList.value = familles.map((famille) => ({
          label: famille.libelle_famille,
          value: famille.id_famille,
        }));
      } catch (error) {
        console.error(error);
      }
    }
    const handleUpdateModal = ref(false);

    async function handleInfoClick(Id) {
      try {
        const serviceData = await serviceStore.getOneService(Id);
        console.log("serviceData", serviceData);

        nom_service.value = serviceData.nom_service;
        codecompt_service.value = serviceData.codecompt_service;
        tva.value = serviceData.tva;
        if (serviceData.familleService) {
          model.value = serviceData.familleService.id_famille; // Mettez à jour model avec l'ID de la famille
        }
        serviceItem.value = {
          ...serviceData,
        };
        handleUpdateModal.value = true;
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du site :",
          error
        );
      }
    }

    async function onModifService() {
      try {
        const serviceId = serviceItem.value.id_service; // avoir l'ID du site

        const updatedServiceData = {
          nom_service: nom_service.value,
          codecompt_service: codecompt_service.value,
          tva: tva.value,
          familleService: {
            id_famille: model.value,
          },
          // ...
        };
        if (model.value !== serviceItem.value.familleService.id_famille) {
          updatedServiceData.familleService = {
            id_famille: model.value,
          };
        }
        await serviceStore.updateService(serviceId, updatedServiceData);
        handleUpdateModal.value = false; // Fermez le modal après la mise à jour
        await serviceStore.listAllService();
        $q.notify({
          message: "Service modifié avec succès",
          color: "positive",
          position: "top",
          timeout: 3000,
        });
        await router.push({ name: "Services" });
      } catch (error) {
        console.error("Erreur lors de la mise à jour du service :", error);
      }
    }

    function handleDeleteClick(id) {
      console.log(" id_service:", id);
      serviceItem.value.id = id;
      handleDeleteModal.value = true;
    }
    async function confirmDeleteService() {
      const id_serviceToDelete = serviceItem.value.id;

      await serviceStore.deleteService(id_serviceToDelete);

      handleDeleteModal.value = false;
      await serviceStore.listAllService();
      $q.notify({
        message: "Service supprimé avec succès",
        color: "positive",
        position: "top",
        timeout: 3000,
      });
    }

    function getAllDataFromDataTable() {
      return services.value;
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
      a.download = "Services.xlsx";
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
      pdf.text("Liste des services", 10, 10);

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

    onMounted(async () => {
      try {
        serviceStore.listAllService();
      } catch (error) {
        console.error("Erreur lors de l'appel à listAllService :", error);
      }
    });

    return {
      filter: ref(""),
      columns,
      date: ref("2023/11/01"),
      services,
      addService,
      handleDeleteModal,
      handleDeleteClick,
      confirmDeleteService,
      handleInfoClick,
      handleUpdateModal,
      onModifService,
      onSubmit,
      serviceItem,
      familleList,
      fetchFamilleList,
      model,
      tva,
      codecompt_service,
      nom_service,
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

#pdf-content {
  font-family: "Arial", sans-serif;
  color: #000; /* Couleur du texte */
  /* Ajoutez d'autres styles au besoin */
}
.custom-btn-style2 {
  margin-right: 10px;
}
.button-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 300px;
  margin-right: 600px;
}
</style>
