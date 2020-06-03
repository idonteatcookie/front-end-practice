import { observe } from './observer.js';
import Dep from './dep.js';
import Watcher from './watcher.js';
import { isPlainObject } from './util.js';

// 一个空函数
function noop() {}

const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
}

function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}

export function initData(vm) {
    let data = vm.$options.data;
    vm._data = data;
    const keys = Object.keys(data);
    let i = keys.length;
    while (i--) {
        const key = keys[i];
        // 获取 vm[key] 实际操作的是 vm._data[key]
        proxy(vm, `_data`, key);
    }
    observe(data, true);
}

export function initState(vm) {
    vm._watchers = [];
    const opts = vm.$options;
    if (opts.data) {
        initData(vm);
    } else {
        observe(vm._data = {}, true /* asRootData */);
    }
    if (opts.computed) {
        initComputed(vm, opts.computed);
    }
    if (opts.watch) {
        initWatch(vm, opts.watch)
    }
}

// computed 的 Watcher 选项
const computedWatcherOptions = { lazy: true }

function initComputed(vm, computed) {
    const watchers = vm._computedWatchers = Object.create(null);

    for (const key in computed) {
        const userDef = computed[key];
        // 如果是一个函数 就作为getter 否则应该是一个有get属性的对象
        const getter = typeof userDef === 'function' ? userDef : userDef.get;
        // 每一个计算属性都是一个 Watcher
        watchers[key] = new Watcher(
            vm,
            getter || noop,
            noop,
            computedWatcherOptions
        );

        if (!(key in vm)) {
            defineComputed(vm, key, userDef);
        }
    }
}

export function defineComputed(target, key, userDef) {
    if (typeof userDef === 'function') {
        sharedPropertyDefinition.get = createComputedGetter(key);
    } else {
        sharedPropertyDefinition.get = userDef.get 
            ? createComputedGetter(key)
            : noop;
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
    return function computedGetter() {
        const watcher = this._computedWatchers && this._computedWatchers[key];
        if (watcher) {
            if (watcher.dirty) {
                watcher.evaluate();
            }
            if (Dep.target) {
                watcher.depend();
            }
            return watcher.value;
        }
    }
}

function initWatch(vm, watch) {
    for (const key in watch) {
        const handler = watch[key];
        if (Array.isArray(handler)) { // ???
            for (let i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i]);
            }
        } else {
            createWatcher(vm, key, handler);
        }
    }
}
/*
handler 可以是对象
vm.$watch('a.b', {
    handler: foo,
    immediate: true,
    deep: true
})
也可以是数组
watch: {
    watchKey: [
        function a(v) {
            console.log(111, v);
        },
        function b(v) {
            console.log(222, v);
        },
        function c(v) {
            console.log(333, v);
        },
    ]
},
 */
function createWatcher(vm, expOrFn, handler, options) {
    if (isPlainObject(handler)) {
        options = handler;
        handler = handler.handler;
    }
    if (typeof handler === 'string') {
        handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options);
}

export function stateMixin(Vue) {
    const dataDef = {};
    dataDef.get = function () { return this._data; };
    // 只有get 不能set
    Object.defineProperty(Vue.prototype, '$data', dataDef);
    
    Vue.prototype.$watch = function(expOrFn, cb, options) {
        const vm = this;
        if (isPlainObject(cb)) {
            return createWatcher(vm, expOrFn, cb, options);
        }
        options = options || {};
        options.user = true;
        const watcher = new Watcher(vm, expOrFn, cb, options);
        if (options.immediate) {
            try {
                cb.call(vm, watch.value);
            } catch (e) {
                
            }
        }

        return function unWatchFn() {
            watcher.teardown();
        }
    }
}