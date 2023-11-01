<template>
  <div class="flex-container">
    <q-card class="q-card-custom">
      <q-card-section>
        <div class="total-clients" v-if="totalClients !== null">
          Nombre total des Clients:
          <span v-if="showAnimation">{{ animatedTotal }}</span>
          <span v-else>{{ totalClients }}</span>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-card-custom">
      <q-card-section>
        <div class="total-archives" v-if="totalArchives !== null">
          Nombre total des archives:
          <span v-if="showAnimation">{{ archiveCount }}</span>
          <span v-else>{{ totalArchives }}</span>
        </div>
      </q-card-section>
    </q-card>
  </div>

  <div>
    <canvas id="myChart" style="width: 600px; height: 400px"></canvas>
  </div>
  <div class="pie-chart-container">
    <canvas id="myPieChart" style="max-width: 800px; height: 400px"></canvas>
  </div>
</template>

<script>
import axios from "axios";
import Chart from "chart.js/auto";
export default {
  data() {
    return {
      clientsStats: [],
      totalClients: null,
      showAnimation: false,
      animatedTotal: 0,
      archiveCount: 0,
      totalArchives: null,
      chartData: null,
    };
  },
  mounted() {
    this.getTotalClients();
    this.getTotalArchives();
  },
  created() {
    axios
      .get("http://localhost:8083/archives/topClients")
      .then((response) => {
        this.clientsStats = response.data;
        this.plotBarChart();
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("http://localhost:8088/tarif/countService")
      .then((response) => {
        this.chartData = response.data;
        this.plotPieChart();
      })
      .catch((error) => {
        console.error(error);
      });
  },
  methods: {
    plotBarChart() {
      const ctx = document.getElementById("myChart").getContext("2d");

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.clientsStats.map((client) => client.clientId),
          datasets: [
            {
              label: "Top 5 des clients ayant le plus d'archives",
              data: this.clientsStats.map((client) => client.archiveCount),
              backgroundColor: "#b0e3f7",
              borderColor: "#b0e3f7",
              borderWidth: 1,
              barPercentage: 0.5, // Adjust this value to change the width of the bars
              categoryPercentage: 0.8,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1, // L'espacement entre chaque tick sur l'axe Y
                maxTicksLimit: 6, // Le nombre maximum de ticks à afficher
              },
            },
          },
        },
      });
    },
    getTotalClients() {
      axios
        .get("http://localhost:8081/clients/total") // Assurez-vous d'ajuster l'URL en fonction de votre endpoint Quarkus
        .then((response) => {
          this.totalClients = response.data;
        })
        .catch((error) => {
          console.error("Error fetching total clients:", error);
        });
    },
    getTotalArchives() {
      axios
        .get("http://localhost:8083/archives/totalArch") // Assurez-vous d'ajuster l'URL en fonction de votre endpoint Quarkus
        .then((response) => {
          this.totalArchives = response.data;
        })
        .catch((error) => {
          console.error("Error fetching total archives:", error);
        });
    },
    animateTotal() {
      this.showAnimation = true;
      const total = this.totalClients;

      let counter = 0;
      const interval = setInterval(() => {
        if (counter >= total) {
          clearInterval(interval);
        } else {
          this.archiveCount = counter++;
        }
      }, 20);
    },
    animateArchiveCount() {
      this.showAnimation = true;
      const totalArchives = this.totalArchives;

      let counter = 0;
      const interval = setInterval(() => {
        if (counter >= totalArchives) {
          clearInterval(interval);
        } else {
          this.animatedTotalArch = counter++;
        }
      }, 20);
    },
    plotPieChart() {
      const ctx = document.getElementById("myPieChart").getContext("2d");

      new Chart(ctx, {
        type: "pie",
        data: {
          labels: this.chartData.map((item) => item[0]),
          datasets: [
            {
              label: "Nombre de tarifications",
              data: this.chartData.map((item) => item[1]), // Les pourcentages correspondant à chaque catégorie
              backgroundColor: [
                "#ffcd56",
                "#36a2eb",
                "#ff6384",
                "#ACC8E5",
                "#ACE6B7",
                "#112A46",
                "#FF9514",
                "#000000",
                "#C43333",
                "#23D10F",
              ],
              borderColor: [
                "#ffcd56",
                "#36a2eb",
                "#ff6384",
                "#ACC8E5",
                "#ACE6B7",
                "#112A46",
                "#FF9514",
                "#000000",
                "#C43333",
                "#23D10F",
              ],
              borderWidth: 1,
            },
          ],
        },
      });
    },
  },
};
</script>

<style scoped>
.flex-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap; /* Pour espacer les éléments */
}
.total-clients {
  font-size: 24px;
  font-weight: bold;
}
.total-archives {
  font-size: 24px;
  font-weight: bold;
}
.q-card-custom {
  max-width: 300px;
  margin: 20px; /* Ajustez la taille selon vos préférences */
}
.pie-chart-container {
  display: absolute;
  top: 10px; /* Ajustez la valeur selon vos préférences */
  right: 10px;
}
canvas {
  display: block;
}
.chart-container {
  flex-basis: calc(
    50% - 10px
  ); /* Prend 50% de l'espace avec 10px de marge entre les graphiques */
  max-width: calc(
    50% - 10px
  ); /* Prend 50% de la largeur disponible avec 10px de marge entre les graphiques */
  margin-bottom: 20px;
}
.chart-container canvas {
  display: block;
  max-width: 100%; /* Assure que le graphique prend toute la largeur de son conteneur */
}
#myChart,
#myPieChart {
  max-width: 800px !important;
  height: 400px !important;
}
</style>
