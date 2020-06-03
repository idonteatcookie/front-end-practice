import Dep from './dep.js';
import { isObject } from './util.js';


export function observe(value, asRootData) {
    if (!isObject(value)) {
        return
    }

    let ob = new Observer(value);

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
        Object.defineProperty(value, '__ob__', {
            value: this,
            enumerable: false,
            writable: true,
            configurable: true
        });
        
        this.walk(value);
    }
    walk(obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i]);
        }
    }
}