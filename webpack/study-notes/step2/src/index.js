const foo = require('./others.js');

let app = document.getElementById('app');
for (let i = 0; i < 10; i++) {
    let p = document.createElement('p');
    foo(i).then(content => {
        p.innerText = content;
        app.appendChild(p);
    })
}