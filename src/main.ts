import './styling/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './composables/database'
import Handsontable from 'handsontable/base';
import { registerPlugin } from 'handsontable/plugins';
import { UndoRedo, ExportFile } from 'handsontable/plugins';
import { registerCellType, NumericCellType, DateCellType } from 'handsontable/cellTypes';

import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';


// Initialize Pinia
const pinia = createPinia()

// Create the Vue app
const app = createApp(App)


// Use Pinia, router, and VueFire
app.use(pinia)
app.use(router)
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()]
})
registerPlugin(UndoRedo);
registerPlugin(ExportFile);
registerCellType(NumericCellType);
registerCellType(DateCellType);
// Mount the app
app.mount('#app')
