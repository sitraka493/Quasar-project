<template>
  <q-page class="background-image flex flex-center">
    <div class="q-pa-md q-flex-center q-vh-100">
      <q-card flat bordered class="my-card max-w-xl text-align">
        <q-card-section class="text-center">
          <div class="text-h6">{{ contrat.intitulé }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none"> </q-card-section>

        <q-separator inset />

        <q-card-section>
          Le présent contrat est signé et prend effet à compter du
          <strong> {{ contrat.client.date_contrat }}</strong
          >. <br />
          <br />Entre le client
          <strong>{{ contrat.client.nomClient }} </strong>, qui est une
          <strong>{{ contrat.description }}</strong> et siège à
          <strong>{{ contrat.client.adresse_client }}</strong
          >et <strong>la société RHENUS SYSTEM </strong> spécialisé dans
          l'archivage de documents.<br /><br />
          Avec le contrat numéro:
          <strong>{{ contrat.id_contrat }} </strong> formulé à la date intitulé:
          <strong>{{ contrat.intitulé }}</strong>
          <br />D'autres part,
          <br />
          <br />
          <strong>PREAMBULE</strong>
          <br />
          <br />
          A. Considérant que les parties désirent s'associer pour poursuivre les
          objectifs d'affaires communs.<br />
          B. Considérant que les parties ont étudié différentes formes
          d'entreprises à exploiter commune pour leurs activités
          commerciales.<br />
          C.Considérant que les parties envisagent le présent contrat de société
          comme étant le meilleur moyen pour réaliser leurs objectifs
          communs.<br />
          D. les parties s'engagent par la présente à constituer un
          {{ contrat.intitulé }} conformément aux lois en vigueur.<br />
          <br />

          Signature du PDG de RHENUS
          <div class="signature">
            Signature du PDG de
            <strong>{{ contrat.client.nomClient }}</strong>
          </div>
        </q-card-section>
      </q-card>
      <br />
      <div>
        <q-btn color="primary" label="Imprimer" @click="imprimer" />
        <q-btn label="Annuler" to="Contrat" style="margin-left: 20px" />
      </div>
    </div>
  </q-page>
</template>
<script>
import { computed, onMounted, reactive, ref, defineProps } from "vue";
import { useContratStore } from "src/stores/contrat-store.js";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import html2canvas from "html2canvas";

export default {
  setup() {
    const contratStore = useContratStore();
    const route = useRoute();
    const router = useRouter();
    const Id = route.params.id;
    const $q = useQuasar();
    const contrat = computed(() => {
      return contratStore.contrat;
    });

    function imprimer() {
      const element = document.querySelector(".my-card");
      html2canvas(element).then((canvas) => {
        const imageData = canvas.toDataURL("image/png");
        const windowContent = `<img src="${imageData}" style="width:100%;">`;
        const printWindow = window.open("", "", "width=600,height=600");
        printWindow.document.open();
        printWindow.document.write(`
      <html>
        <head>
          <title>Impression de Contrat</title>
        </head>
        <body>
          ${windowContent}
        </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.print();
      });
    }

    onMounted(async () => {
      await contratStore.getOnecontrat(Id);
    });

    return {
      lorem: "",
      contrat,
      imprimer,
    };
  },
};
</script>
<style>
.my-card {
  max-width: 500px; /* Définissez la largeur maximale que vous souhaitez pour le card */
  width: 100%; /* Assurez-vous que le card s'adapte à la largeur maximale */
  margin: auto;
}
.signature {
  margin-left: 250px;
  /* Ajustez la valeur selon vos besoins */
}
</style>
