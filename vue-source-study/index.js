import { initState } from './state.js';
import Watcher from './watcher.js';

let uid = 0;

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

        new Watcher(vm, vm._render, true /* isRenderWatcher */ );
    }
}

initMixin(Vue);

let vm = new Vue({
    data: {
        number: {
            val: 1
        },
        title: 'Vue响应式'
    },
    render() {
        console.log(this.title, this.number.val);
    }
});

vm.title = '测试修改';
vm.number.val = 233;