const foo = require('./others.js');

let app = document.getElementById('app');
for (let i = 0; i < 10; i++) {
    let p = document.createElement('p');
    p.innerText = foo(i);
    app.appendChild(p);
}