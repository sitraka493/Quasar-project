<template>
  <q-page
    class="flex flex-center"
    style="background-image: url('/src/assets/fond.jpg')"
  >
    <q-card class="my-card">
      <div></div>
      <q-card-section>
        <q-img src="/src/assets/Rhenus.jpg" alt="Description de l'image" />

        <div class="q-pa-md ml-4" style="max-width: 500px">
          <q-form @submit="login" @reset="onReset" class="q-gutter-md">
            <q-input
              filled
              v-model="username"
              label="Nom d'utilisateur"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Veuillez remplir le champ vide',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>

            <q-input
              filled
              v-model="password"
              label="Mot de passe"
              lazy-rules
              :rules="[
                (val) =>
                  (val !== null && val !== '') ||
                  'Veuillez remplir le champ vide',
              ]"
              :type="showPassword ? 'text' : 'password'"
            >
              <template v-slot:prepend>
                <q-icon name="key" />
              </template>

              <template v-slot:append>
                <q-icon
                  name="visibility"
                  class="eye-icon"
                  @click="toggleShowPassword"
                />
              </template>
            </q-input>

            <div>
              <q-btn
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
import { useRouter } from "vue-router";

export default {
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const username = ref(null);
    const password = ref(null);
    const showPassword = ref(false);
    function onReset() {
      username.value = null;
      password.value = null;
    }
    function toggleShowPassword() {
      showPassword.value = !showPassword.value;
    }
    return {
      username,
      password,
      showPassword,
      toggleShowPassword,
      onReset,

      login() {
        if (username.value === "admin" && password.value === "admin") {
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Connexion réussie",
          });
          router.push("/home-page");
        } else {
          $q.notify({
            color: "red-4",
            textColor: "white",
            icon: "report_problem",
            message: "Identifiants incorrects",
          });
        }
      },
    };
  },
};
</script>
<style>
.eye-icon {
  cursor: pointer;
}
</style>
