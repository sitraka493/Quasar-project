<template margin-left="20px">
    <q-page class="flex flex-center">
        <q-table
          flat bordered
          title="Liste des clients"
          :rows="clients"
          :columns="columns"
          row-key="name"
          :filter="filter"
          
        >
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
              </q-input>
          </template>
           <template v-slot:top>
            <q-btn color="primary" :disable="loading" label="Ajout" @click="addRow" />
            
            <q-space />
            <q-input borderless dense debounce="300" color="primary" v-model="filter">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

        </q-table>
    
        
    </q-page>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useClientStore } from 'src/stores/client-store';
const clientStore = useClientStore();



const clients = computed(() => {
    return clientStore.clients;
})

const columns = [
    {
        name: 'asc',
        required: true,
        label: 'id_client',
        align: 'center',
        field: row => row.id_client,
        format: val => `${val}`,
        sortable: true
    },
    { name: 'clients', align: 'center', label: 'nom', field: 'nomClient' },
    { name: 'calories', align: 'center', label: 'Date contrat', field: 'contrat_client', sortable: true },
    { name: 'codecompt_client', align: 'center', label: 'Code comptable', field: 'codecompt_client', sortable: true },
    { name: 'adresse_courrier', align: 'center', label: 'Adresse courrier', field: 'adresse_client' },
    { name: 'situation', align: 'center', label: 'Actif', field: 'etat_client' },
    { name: 'details', align: 'center', label: 'Détails', field: '' },
    { name: 'modifier', align: 'center', label: 'Modifier', field: '' }
]

const rows = [
    {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24
    },
    {
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0,
        
    },
    {
        name: 'Eclair',
        calories: 262,
        fat: 16.0,
        carbs: 23
    },
    {
        name: 'Cupcake',
        calories: 305,
        fat: 3.7,
        carbs: 67
    },
    {
        name: 'Gingerbread',
        calories: 356,
        fat: 16.0,
        carbs: 49
    },
    {
        name: 'Jelly bean',
        calories: 375,
        fat: 0.0,
        carbs: 94
    },
    {
        name: 'Lollipop',
        calories: 392,
        fat: 0.2,
        carbs: 98
    },
    {
        name: 'Honeycomb',
        calories: 408,
        fat: 3.2,
        carbs: 87
    },
    {
        name: 'Donut',
        calories: 452,
        fat: 25.0,
        carbs: 51
    },
    {
        name: 'KitKat',
        calories: 518,
        fat: 26.0,
        carbs: 65
    }
]

export default {
   
    setup() {

        onMounted(() => {
            clientStore.listAllClient();
        });

        return {
            filter: ref(''),
            columns,
            rows,
            clients
        }
    },
     methods: {
        addRow() {
            this.$router.push('/ajoutClient')
        }
    }
}
</script>
<style></style>