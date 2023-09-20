<template>
  <q-page class="flex flex-center">
    <q-card class="my-card">
      <div></div>
      <q-card-section>
        <q-img src="/src/assets/Rhenus.jpg" alt="Description de l'image" />

        <div class="q-pa-md" style="max-width: 500px">
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input
              style="margin-left: 0px"
              filled
              v-model="username"
              label="Nom d'utilisateur "
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Veuillez remplir le champ vide',
              ]"
            />

            <q-input
              style="margin-left: 0px"
              filled
              type="password"
              v-model="password"
              label="Mot de passe"
              lazy-rules
              :rules="[
                (val) =>
                  (val !== null && val !== '') ||
                  'Veuillez remplir le champ vide',
              ]"
            />

            <div>
              <q-btn
                @click="login"
                style="margin-left: 100px"
                label="Se connecter"
                type="submit"
                color="primary"
              />
              <q-btn
                style="margin-left: 50px"
                label="Annuler"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useQuasar } from "quasar";
import { ref } from "vue";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Person";

export default {
  setup() {
    const $q = useQuasar();

    const username = ref(null);
    const password = ref(null);

    return {
      username,
      password,
      PersonIcon,
      LockIcon,
      onSubmit() {
        {
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Connexion réussie",
          });
        }
      },

      onReset() {
        username.value = null;
        password.value = null;
      },
    };
  },
};
</script>
