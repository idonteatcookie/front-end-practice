
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
