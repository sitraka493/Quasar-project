<template margin-left="20px">
  <q-card style="margin-top: 100px color: ;"
    ><h3 class="text-center">Gestion des utilisateurs</h3>
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
  <div>
    <q-page class="flex flex-center">
      <div id="pdf">
        <q-table
          flat
          bordered
          title="Liste des utilisateurs"
          :rows="users"
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
                  @click="handleInfoClick(props.row.id_clients_utilisateurs)"
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

              <q-th>modifier</q-th>
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
            <q-dialog v-model="update" persistent>
              <q-card style="min-width: 350px">
                <q-form @submit.stop="onModifUser" class="q-pa-md">
                  <q-card-section>
                    <div class="text-h6">Formulaire de modification</div>
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <q-input filled label="Login" v-model="login" />
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <q-input filled label="Mot de passe" v-model="mdp" />
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <q-input filled label="Civilité" v-model="civilite" />
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <q-input filled label="Nom " v-model="nom" />
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <q-input filled label="Prenom" v-model="prenom" />
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <q-input
                      filled
                      label="Adresse Email"
                      v-model="adresse_email"
                    />
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <q-input filled label="Niveau" v-model="niveau" />
                  </q-card-section>

                  <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Annuler" v-close-popup />
                    <q-btn
                      flat
                      label="Modifier"
                      @click="onModifUser"
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
import { useUserStore } from "src/stores/user-store.js";
import { getEmptyUser } from "src/utils/getEmptyUser.js";
import { useRouter } from "vue-router";
import * as XLSX from "xlsx";
import { useQuasar } from "quasar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default {
  props: {
    clients_utilisateurs: {
      type: Object,
      default: getEmptyUser(),
    },
  },

  setup() {
    const userStore = useUserStore();
    const computedRows = ref([]);
    const userItem = ref(getEmptyUser());
    const $q = useQuasar();
    const columns = [
      {
        name: "id_user",
        align: "center",
        label: "N°Utilisateurs",
        field: "id_clients_utilisateurs",
        sortable: true,
      },
      {
        name: "id_client",
        required: true,
        label: "Id_client",
        align: "center",
        format: (val) => `${val}`,
        sortable: true,
        field: (row) => {
          return row.clients_services && row.clients_services.client
            ? row.clients_services.client.id_client
            : "";
        },
        sortable: true,
      },
      {
        name: "client",
        align: "center",
        label: "Client",
        field: (row) => {
          return row.clients_services && row.clients_services.client
            ? row.clients_services.client.nomClient
            : "";
        },
        sortable: true,
      },

      {
        name: "login",
        align: "center",
        label: "Login",
        field: "login",
      },

      {
        name: "nom",
        align: "center",
        label: "nom",
        field: "nom",
      },
      {
        name: "prenom",
        align: "center",
        label: "prenom",
        field: "prenom",
      },
      {
        name: "mdp",
        align: "center",
        label: "Mot de passe",
        field: "mdp",
      },
    ];
    const router = useRouter();
    const users = computed(() => {
      return userStore.users;
    });

    const currentIdUser = ref();
    const clientsList = ref([]);
    const login = ref("");
    const mdp = ref("");
    const civilite = ref("");
    const nom = ref("");
    const prenom = ref("");
    const adresse_email = ref("");
    const niveau = ref("");
    const update = ref(false);

    async function handleInfoClick(Id) {
      try {
        const userdata = await userStore.getOneUser(Id);
        console.log("userdata:", userdata);
        currentIdUser.value = Id;
        login.value = userdata.data.login;
        mdp.value = userdata.data.mdp;
        console.log("debug", mdp.value, userdata.data.mdp);
        civilite.value = userdata.data.civilite;
        nom.value = userdata.data.nom;
        prenom.value = userdata.data.prenom;
        adresse_email.value = userdata.data.adresse_email;
        niveau.value = userdata.data.niveau;
        update.value = true;
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du user :",
          error
        );
      }
    }

    async function onModifUser() {
      try {
        const user = {
          login: login.value,
          mdp: mdp.value,
          nom: nom.value,
          prenom: prenom.value,
          civilite: civilite.value,
          niveau: niveau.value,
          adresse_email: adresse_email.value,
        };
        const Id = userItem.value.id_clients_utilisateurs; // avoir l'ID
        console.log("userItem", userItem.value);
        await userStore.updateUser(currentIdUser.value, user);
        update.value = false; // Fermez le modal après la mise à jour
        await userStore.listUser();
        $q.notify({
          message: "Utilisateur Modifié avec succès",
          color: "positive",
          position: "top",
          timeout: 3000,
        });
      } catch (error) {
        $q.notify({
          message: "Modification impossible",
          color: "negative",
          position: "bottom",
          timeout: 3000,
        });
      }
    }
    function getAllDataFromDataTable() {
      return users.value;
    }
    function exportToExcel() {
      const allData = getAllDataFromDataTable();
      const worksheet = XLSX.utils.json_to_sheet(allData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "users");
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
      a.download = "users.xlsx";
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
      pdf.text("Liste des utilisateurs", 10, 10);

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

      pdf.save("liste des utilisateurs.pdf");
    }

    onMounted(() => {
      userStore.listUser();
    });

    return {
      filter: ref(""),
      columns,
      login,
      mdp,
      civilite,
      adresse_email,
      prenom,
      nom,
      niveau,
      users,
      handleInfoClick,
      update,
      clientsList,
      onModifUser,
      getAllDataFromDataTable,
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
  margin-bottom: 350px;
  margin-right: 600px;
}
</style>
