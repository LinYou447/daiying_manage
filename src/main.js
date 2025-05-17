import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/index"
import ViewUIPlus from 'view-ui-plus'
import 'view-ui-plus/dist/styles/viewuiplus.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import axios from 'axios';
import apiClient from './plugins/axios';
import ApiConfig from './plugins/apiConfig';

const app = createApp(App);

app.provide('tokenFix', 'Daiying ');
app.use(apiClient);
app.use(ApiConfig);
app.use(router);
app.use(ElementPlus)
app.use(ViewUIPlus);
app.use(VueQuillEditor);
app.use(axios);

app.mount('#app');
