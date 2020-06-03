import { initState, stateMixin } from './state.js';
import Watcher from './watcher.js';

let uid = 0;
function noop() {}

function Vue (options) {
    this._init(options)
}

function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        const vm = this;
        vm._uid = uid++;
        vm._isVue = true;
        vm._render = options.render;
        vm.$options = options;
        initState(vm);

        new Watcher(vm, vm._render, noop, {}, true /* isRenderWatcher */ );
    }
}

initMixin(Vue);
stateMixin(Vue);

export default Vue;