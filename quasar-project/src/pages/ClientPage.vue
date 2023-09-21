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
                <q-btn color="primary" label="Ajout" @click="addRow" />
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
import { useRouter } from 'vue-router';

export default {
    setup() {
        const clientStore = useClientStore();
        const router = useRouter()
        const clients = computed(() => {
            return clientStore.clients;
        })

        function addRow(){
            router.push('/ajoutClient')
        }

        function onReset(){
            router.push('/ajoutClient')
        }

        onMounted(() => {
            clientStore.listAllClient();
        });

        return {
            filter: ref(''),
            columns,
            rows,
            clients,
            addRow,
            onReset
        }
    },
}
</script>

<style>

</style>