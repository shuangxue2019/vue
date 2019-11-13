import Vue from 'vue';
import ViewUI from 'view-design';
import VueRouter from 'vue-router';
import Routers from './router';
import Util from './libs/util';
import App from './app.vue';
import 'view-design/dist/styles/iview.css';
import UsCom from './components/uscom'
import { codemirror } from 'vue-codemirror'
import VueClipboard from 'vue-clipboard2'
import 'codemirror/lib/codemirror.css'

if (process.env.NODE_ENV !== 'production') require('./mock/index.js')

Vue.use(VueRouter);
Vue.use(ViewUI);
Vue.use(codemirror);
Vue.use(VueClipboard);
Vue.use(UsCom);

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    ViewUI.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach((to, from, next) => {
    ViewUI.LoadingBar.finish();
    window.scrollTo(0, 0);
});

new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});
