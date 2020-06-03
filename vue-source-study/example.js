import Vue from "./index.js";

let vm = new Vue({
    data: {
        // number: {
        //     val: 1
        // },
        number: 1,
        title: 'Vue响应式',
        arr: [1,2]
    },
    computed: {
        numberPlusOne() {
            return this.number + 1;
        }
    },
    watch: {
        numberPlusOne(newVal, oldVal) {
            return console.log('watch inner: numberPlusOne', newVal, oldVal);
        },
        title: {
            handler(newVal, oldVal) {
                return console.log('watch inner: title', newVal, oldVal);
            }
        }
    },
    render() {
        console.log('render', this.title, this.number, this.numberPlusOne, this.arr);
    }
});

const unWatch = vm.$watch('numberPlusOne', function(newVal, oldVal) {
    return console.log('watch outer: numberPlusOne', newVal, oldVal);
});

// vm.title = '测试修改';
// vm.number = 233;
// vm.number = 2333;

// setTimeout(() => {
//     unWatch();
//     vm.number = 23333;
// });

vm.arr.push(2);