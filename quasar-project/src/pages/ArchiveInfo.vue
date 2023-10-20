<template>
  <div class="background-image q-px-lg q-mb-md">
    <div class="q-px-lg q-mb-md">
      <div class="text-h6 text-center q-py-md">Informations sur l'archive</div>
      <q-card>
        <div class="q-pa-md">
          <div class="q-gutter-md">
            <div class="row">
              <div class="col">
                <q-input
                  filled
                  v-model="archive.cle"
                  label="Clé"
                  margin-left="200px"
                  readonly
                />
              </div>

              <div class="col">
                <q-input
                  filled
                  v-model="archive.critere1"
                  label="Critère1"
                  readonly
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  filled
                  v-model="archive.critere1"
                  label="critère2"
                  readonly
                />
              </div>

              <div class="col">
                <q-input
                  filled
                  v-model="archive.critere3"
                  label="critère3"
                  readonly
                >
                  <template v-slot:append> </template>
                </q-input>
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-input
                  filled
                  v-model="archive.critere4"
                  label="Critère4"
                  readonly
                />
              </div>
              <div class="col">
                <q-input
                  filled
                  v-model="archive.critere5"
                  label="Critère5"
                  readonly
                />
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-select
                  filled
                  v-model="archive.critere6"
                  label="Critère6"
                  readonly
                />
              </div>

              <div class="col">
                <q-select
                  filled
                  v-model="archive.etat_stock"
                  label="stock"
                  readonly
                />
              </div>
            </div>

            <div class="col">
              <q-input
                filled
                v-model="archive.annee_reference"
                label="Année de référence"
                readonly
              />
            </div>
          </div>

          <p></p>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, defineProps } from "vue";
import { useArchiveStore } from "src/stores/archive-store.js";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default {
  setup() {
    const archiveStore = useArchiveStore();
    const route = useRoute();
    const router = useRouter();
    const Id = route.params.id;
    const $q = useQuasar();
    const archive = computed(() => {
      return archiveStore.archive;
    });

    onMounted(async () => {
      await archiveStore.getOneArchive(Id);
    });

    return {
      archive,

      date: ref("2023/11/01"),
    };
  },
};
</script>
<style>
.background-image {
  background-image: url("assets/archives.webp");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  min-height: 100vh;
}
</style>
