import { createApp } from "vue";
import App from "./App.vue";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import "quasar/dist/quasar.css";
import "@quasar/extras/material-icons/material-icons.css";
import { Quasar } from "quasar";

const app = createApp(App);
app.use(Quasar, {});
app.mount("#app");
