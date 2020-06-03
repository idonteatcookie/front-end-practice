
const queue = [];
let has = {};
let waiting = false;
let flushing = false;
let index = 0;

function resetSchedulerState() {
    index = queue.length = 0;
    has = {};
    waiting = flushing = false;
}

function flushSchedulerQueue() {
    flushing = true;
    let watcher, id;

    queue.sort((a, b) => a.id - b.id);

    for (index = 0; index < queue.length; index++) {
        watcher = queue[index];
        if (watcher.before) {
            watcher.before();
        }
        id = watcher.id;
        has[id] = null;
        watcher.run();
    }

    resetSchedulerState();
}

export function queueWatcher(watcher) {
    const id = watcher.id;
    if (has[id] == null) { // 同一个watcher只需要更新一次 也就是说id=1 id=2 只会调用一次render
        has[id] = true;
        if (!flushing) {
            queue.push(watcher);
        } else {
            // 因为更新的时候按id排序的 插入到指定位置（二分查找是不是更快 :p
            let i = queue.length - 1;
            while (i > index && queue[i].id > watcher.id) {
                i--;
            }
            queue.splice(i + 1, 0, watcher);
        }
        // 记住这个 waiting ！！保证了更新只发生一次
        if (!waiting) {
            waiting = true;

            setTimeout(flushSchedulerQueue);
        }
    }
}


// export function queueWatcher(watcher) {
//     setTimeout(() => {
//         watcher.run();
//     });
// }