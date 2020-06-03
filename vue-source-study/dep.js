import { remove } from './util.js';

// Dep 类 用于收集依赖
let uid = 0;
export default class Dep {
    constructor() {
        this.id = uid++; // 每一个实例都有一个id 用于去重
        this.subs = []; // 收集的依赖
    }
    // 收集依赖
    addSub(sub) {
        this.subs.push(sub);
    }
    // 删除依赖
    removeSub(sub) {
        remove(this.subs, sub);
    }
    // 将当前的Target放到依赖里 当前是Dep.target就是是一个Watcher
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    }
    // 修改时 通知所有的依赖更新
    notify() {
        for (let i = 0, l = this.subs.length; i < l; i++) {
            this.subs[i].update();
        }
    }
}
Dep.target = null;
// Dep.target 记录当前的 Watcher
const targetStack = [];

export function pushTarget(target) {
    targetStack.push(target);
    Dep.target = target;
}

export function popTarget() {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
}
