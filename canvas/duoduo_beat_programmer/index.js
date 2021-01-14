let width, height, canvas, context, progImg, startBtn, dividingHeight;
let moneyList, knifeList;
let duoduo, programmer;
let lastTime, drag, score, gameover, timer;

class BasicShape {
    constructor(x, y, w, h, dir = { x:0, y: 0}) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dir = dir;
    }
    /**
     * 判断相交
     * @param {BasicShape} other 
     */
    intersect(other) {
        let x1 = this.x, y1 = this.y,
            x2 = this.x + this.w, y2 = this.y + this.h;
        let x3 = other.x, y3 = other.y,
            x4 = other.x + other.w, y4 = other.y + other.h;

        return !(x2 < x3 || x1 > x4 || y2 < y3 || y1 > y4);
    };
}
class Money extends BasicShape {
    constructor(x, y, w = 60, h = 20, dir = { x: 0, y: random(2, 4) }) {
        super(x, y, w, h, dir);
    }
    render(ctx) {
        let { x, y, w, h } = this;

        let grd = ctx.createLinearGradient(0, 0, 0, h);
        grd.addColorStop(0, '#f4cbd3');
        grd.addColorStop(1, '#eb627f'); 
        ctx.fillStyle = grd;
        ctx.fillRect(x, y, w, h);

        ctx.font = '15px Arial bold';
        ctx.fillStyle = '#ffc24f';
        ctx.textAlign= 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('￥100', x + w / 2, y + h / 2);
    }
    update() {
        this.x += this.dir.x;
        this.y += this.dir.y;
        if (this.intersect(programmer)) {
            this.remove();
            score += 100;
        }
        // 下落移除边界就删除
        else if (this.y >= height) {
            this.remove();
        }
    }
    remove() { // 在 moneyList 删除
        let index = moneyList.findIndex(item => item === this);
        moneyList.splice(index, 1);
    }
}
class Knife extends BasicShape {
    constructor(x, y, w = 60, h = 20, dir = { x: 0, y: random(3, 6) }) {
        super(x, y, w, h, dir);
    }
    render(ctx) {
        let { x, y, w, h } = this;

        ctx.fillStyle = '#561d00';
        ctx.fillRect(x, y, w / 3, h / 2);

        ctx.fillStyle = 'silver';
        ctx.fillRect(x + w / 3, y, w * 2 / 3, h);
    }
    update() {
        this.x += this.dir.x;
        this.y += this.dir.y;
        if (this.intersect(programmer)) {
            gameover = true;
        }
        // 下落移除边界就删除
        else if (this.y >= height) {
            this.remove();
        }
    }
    remove() { // 在 knifeList 删除
        let index = knifeList.findIndex(item => item === this);
        knifeList.splice(index, 1);
    }
}
class Duoduo extends BasicShape {
    constructor(x, y, w = 10, h = 0, dir = { x: 1, y: 0 }) {
        super(x, y, w, h, dir);
    }
    render(ctx) {
        let { x, y, w } = this;
        let path = [[w, 0], [2 * w, w], [3 * w, 0], [4 * w, w], [2 * w, 3 * w]];
        ctx.beginPath();
        ctx.moveTo(x, y + w);
        for (let i = 0; i < path.length; i++) {
            ctx.lineTo(x + path[i][0], y + path[i][1]);
        }
        ctx.closePath();
        ctx.fillStyle = 'red';
        ctx.fill();
    }
    update() {
        this.x += this.dir.x;
        let { dir, x, w } = this;
        if (dir.x > 0 && x + 4 * w >= width || dir.x < 0 && x <= 0) {
            dir.x *= -1;
        }
    }
}
class Programmer extends BasicShape {
    render(ctx) {
        ctx.fillStyle = '#000';
        let { x, y, w, h } = this;
        ctx.drawImage(progImg, x, y, w, h);
    }
}
function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;
    progImg = document.getElementById('progImg');
    startBtn = document.getElementById('startBtn');
    dividingHeight = height * 2 / 3;
    initEvent();

    start();
}
function start() {
    moneyList = [];
    knifeList = [];
    
    lastTime = 0;
    drag = false;
    score = 0;
    gameover = false;

    duoduo = new Duoduo(0, 0);
    programmer = new Programmer(width / 2 - 20, height - 40, 40, 40);
    startBtn.style.display = 'none';
    if (timer) {
        cancelAnimationFrame(timer);
    }
    animation();
}
function animation() {
    timer = requestAnimationFrame(animation);
    context.clearRect(0, 0, width, height);
    render();
    update();
}
function initEvent() {
    canvas.onmousedown = (evt) => {
        let { offsetX, offsetY } = evt;
        let { x, y, w, h } = programmer;
        if (offsetX >= x && offsetX <= x + w && offsetY >= y && offsetY <= y + h) {
            drag = true;
        }
    }
    canvas.onmousemove = (evt) => {
        let {offsetX, offsetY} = evt;
        if (drag) {
            if (offsetX + programmer.w <= width) {
                programmer.x = offsetX;
            }
            if (offsetY + programmer.h <= height && offsetY >= dividingHeight) {
                programmer.y = offsetY;
            }
        }
    }
    document.onmouseup = () => drag = false;
}
function update() {
    if (gameover) {
        endGame();
        return;
    }
    duoduo.update();
    moneyList.forEach(money => money.update());
    knifeList.forEach(knife => knife.update());
    if (Date.now() - lastTime > 1000) { // 每 1s 扔个东西
        lastTime = Date.now();
        if (Math.random() < 0.3) { // 30%概率是刀
            knifeList.push(new Knife(duoduo.x, duoduo.y));
        } else {            
            moneyList.push(new Money(duoduo.x, duoduo.y));
        }
    }
}
function endGame() {
    alert(`恭喜你！一共获得了 ${score} 软妹币！`);
    cancelAnimationFrame(timer);
    timer = null;
    startBtn.style.display = 'initial';
}
function render() {
    drawDividingLine();
    duoduo.render(context);
    programmer.render(context);
    moneyList.forEach(money => money.render(context));
    knifeList.forEach(knife => knife.render(context));
    document.getElementById('score_num').innerHTML = score;
}
function drawDividingLine() {
    context.moveTo(0, dividingHeight);
    context.lineTo(400, dividingHeight);
    context.stroke();
}
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.onload = init;
