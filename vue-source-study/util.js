const _toString = Object.prototype.toString

// 工具函数 删除数组中指定的一项元素
export function remove(arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item);
        if (index > -1) {
            return arr.splice(index, 1);
        }
    }
}
// 工具函数 判断一个函数是不是对象
export function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}
// 简单对象 如Array Promise 等对象不符合要求
export function isPlainObject (obj) {
    return _toString.call(obj) === '[object Object]';
}

export function parsePath(path) {
    const segments = path.split('.');
    return function(obj) {
        for (let i = 0; i < segments.length; i++) {
            if (!obj) return;
            obj = obj[segments[i]];
        }
        return obj;
    }
}
export function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}