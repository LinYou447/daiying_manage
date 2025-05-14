import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/index"
import ViewUIPlus from 'view-ui-plus'
import 'view-ui-plus/dist/styles/viewuiplus.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

const app = createApp(App);
app.use(router);
app.use(ElementPlus)
app.use(ViewUIPlus);


app.mount('#app');
