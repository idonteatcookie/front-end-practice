import { observe } from './observer.js';

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
}