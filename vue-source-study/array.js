import { def } from './util.js';

const arrayProto = Array.prototype;
// Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
export const arrayMethods = Object.create(arrayProto);

const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
];

methodsToPatch.forEach(function (method) {
    const original = arrayProto[method];
    def(arrayMethods, method, function mutator(...args) {
        const result = original.apply(this, args);
        const ob = this.__ob__;
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
        }
        if (inserted) ob.observeArray(inserted);
        ob.dep.notify();
        return result;
    })
})


/*
let a = {
    log() {
        console.log('a');
    },
    log1() {
        console.log('a1');
    },
    log2() {
        console.log('a2');
    },
}

let b = Object.create(a);

b.log = () => console.log('b');
b.log1 = () => console.log('b1');

let c = Object.create(b);

c.log = () => console.log('c');

c.log();//c
c.log1();//b1
c.log2();//a2
*/