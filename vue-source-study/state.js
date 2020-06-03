import { observe } from './observer.js';
import Dep from './dep.js';
import Watcher from './watcher.js';

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