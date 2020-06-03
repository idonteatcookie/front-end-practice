import { pushTarget, popTarget } from './dep.js';
import { isObject, parsePath, remove } from './util.js';
import { queueWatcher } from './scheduler.js';

let uid = 0;
export default class Watcher {
    constructor(vm, expOrFn, cb, options, isRenderWatcher) {
        this.vm = vm;
        if (isRenderWatcher) {
            vm._watcher = this;
        }
        vm._watchers.push(this);
        if (options) {
            this.deep = !!options.deep;
            this.user = !!options.user;
            this.lazy = !!options.lazy;
            this.sync = !!options.sync;
            this.before = options.before;
        } else {
            this.deep = this.user = this.lazy = this.sync = false;
        }
        this.cb = cb;
        this.id = uid++;
        this.active = true;
        this.dirty = this.lazy;
        // 记录当前 Watcher 都依赖哪些 Dep
        // depIds记录当前 newDepIds 记录新一次的依赖
        // 记录两份就是为了对比少了哪些依赖 然后在对应的依赖内部删除 Watcher
        this.deps = [];
        this.newDeps = [];
        this.depIds = new Set();
        this.newDepIds = new Set();
        this.expression = '';
        if (typeof expOrFn === 'function') {
            // getter 更新时的求值函数
            this.getter = expOrFn;
        } else {
            // 比如 'a.b' 就是 () => this.a.b
            this.getter = parsePath(expOrFn);
        }
        this.value = this.lazy ? undefined : this.get();
    }
    get() {
        pushTarget(this);
        let value;
        const vm = this.vm;
        try {
            // 先把this赋值给 Dep.target 然后运行getter 则getter用到的数据会把 Dep.target（this）收集起来
            value = this.getter.call(vm, vm);
        } finally {
            popTarget();
            this.cleanupDeps();
        }
        return value;
    }
    addDep(dep) {
        const id = dep.id;
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id);
            this.newDeps.push(dep);
            if (!this.depIds.has(id)) {
                // Dep中增加当前Watcher
                dep.addSub(this);
            }
        }
    }
    cleanupDeps() {
        let i = this.deps.length;
        // 把之前存在的 现在不需要的依赖删除 在对应Dep中删除当前Watcher 然后把 newDeps 赋值到 deps
        while (i--) {
            const dep = this.deps[i];
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this);
            }
        }
        let tmp = this.depIds;
        this.depIds = this.newDepIds;
        this.newDepIds = tmp;
        this.newDepIds.clear();
        tmp = this.deps;
        this.deps = this.newDeps;
        this.newDeps = tmp;
        this.newDeps.length = 0;
    }
    // 更新 当依赖的数据发生变化时进行更新
    update() {
        if (this.lazy) {
            this.dirty = true;
        } else if (this.sync) {
            this.run();
        } else {
            // 其他更新是同步的 但是render更新是异步的
            queueWatcher(this);
        }
    }
    run() {
        if (this.active) {
            const value = this.get();
            if (value !== this.value || isObject(value) || this.deep) {
                const oldValue = this.value;
                this.value = value;
                this.cb.call(this.vm, value, oldValue)
            }
        }
    }
    // lazy watcher 计算
    evaluate() {
        this.value = this.get();
        this.dirty = false;
    }
    // computed Watcher 求值时调用 
    // 把computed的每个依赖都加入计算computed时的Watcher
    depend() {
        let i = this.deps.length;
        while (i--) {
            this.deps[i].depend();
        }
    }
    // 删除该Watcher
    teardown() {
        if (this.active) {
            if (!this.vm._isBeingDestroyed) {
                remove(this, this.vm._watcher, this);
            }
            let i = this.deps.length;
            while (i--) {
                this.deps[i].removeSub(this);
            }
            this.active = false;
        }
    }
}