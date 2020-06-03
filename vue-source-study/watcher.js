import { pushTarget, popTarget } from './dep.js';

let uid = 0;
export default class Watcher {
    constructor(vm, expOrFn, isRenderWatcher) {
        this.vm = vm;
        if (isRenderWatcher) {
            vm._watcher = this;
        }
        vm._watchers.push(this);
        this.id = uid++;
        // 记录当前 Watcher 都依赖哪些 Dep
        // depIds记录当前 newDepIds 记录新一次的依赖
        this.deps = [];
        this.newDeps = [];
        this.depIds = new Set();
        this.newDepIds = new Set();
        // getter 更新时运行的函数
        this.getter = expOrFn;
        this.value = this.get();
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
    // 更新 当依赖的数据发生变化时进行更新
    update() {
        this.value = this.get();
    }
}