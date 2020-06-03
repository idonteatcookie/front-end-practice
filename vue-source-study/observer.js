import Dep from './dep.js';
import { isObject, hasOwn, def } from './util.js';
import { arrayMethods } from './array.js';

const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

export function observe(value, asRootData) {
    if (!isObject(value)) {
        return
    }
    let ob;
    if (hasOwn(value, '__ob__' && value.__ob__ instanceof Observer)) {
        ob = value.__ob__;
    } else {
        ob = new Observer(value);
    }
    if (asRootData && ob) {
        ob.vmCount++;
    }
    return ob;
}
// * 实现响应式 get 时收集依赖 set时通知依赖更新
export function defineReactive(obj, key) {
    const dep = new Dep();
    let val = obj[key];
    let childOb = observe(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = val;
            if (Dep.target) {
                dep.depend();
                if (childOb) {
                    childOb.dep.depend();
                    if (Array.isArray(value)) {
                        dependArray(value);
                    }
                }
            }
            return value;
        },
        set: function reactiveSetter(newVal) {
            const value = val;
            if (newVal === value || (newVal !== newVal && value !== value)) {
                return
            }
            val = newVal;
            childOb = observe(newVal);
            dep.notify();
        }
    });
}
// 观察类 为观察的对象增加__ob__属性 并把当前对象设置为响应式
export class Observer {
    constructor(value) {
        this.value = value;
        this.dep = new Dep();
        this.vmCount = 0; // number of vms that have this object as root $data
        // 把当前 Observer 类挂载到对象的 __ob__ 属性上
        def(value, '__ob__', this);
        if (Array.isArray(value)) {
            protoAugment(value, arrayMethods);
            this.observeArray(value);
        } else {
            this.walk(value);
        }
    }
    walk(obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i]);
        }
    }
    observeArray(items) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i])
        }
    }
}

function protoAugment(target, src) {
    target.__proto__ = src;
}

function dependArray(value) {
    for (let e, i = 0, l = value.length; i < l; i++) {
        e = value[i];
        e && e.__ob__ && e.__ob__.dep.depend();
        if (Array.isArray(e)) {
            dependArray(e);
        }
    }
}