const apiBaseUrl = 'http://localhost:8090';

export default {
    install(app) {
        app.config.globalProperties.$apiBaseUrl = apiBaseUrl;
    }
}