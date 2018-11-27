function foo(idx) {
    return new Promise(function (resolve, reject) {
        resolve(`the ${idx + 1}th row`);
    })
}

module.exports = foo;