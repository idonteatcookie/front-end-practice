// 初始化 canvas
var body = document.getElementsByTagName('body')[0];
var width = body.clientWidth;
var height = body.clientHeight - 10;
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
canvas.width = width;
canvas.height = height;
// 定义全部变量
var strokeColor = 'black';      // 画笔颜色
var isMouseDown = false;        // 画笔落下了吗
var lastLoc = { x: 0, y: 0 };   // 画笔上一次的位置
var lastTimestamp = 0;          // 上一次的时间戳
var lastLineWidth = -1;         // 上一次的宽度
// 设置监听事件
canvas.onmousedown = function(e) {
    // 鼠标点击时画笔落下
    e.preventDefault();
    beginStroke( { x: e.clientX, y: e.clientY } );
}
canvas.onmouseup = function(e) {
    // 鼠标松开时画笔离开
    e.preventDefault();
    endStroke();
}
canvas.onmousemove = function(e) {
    // 鼠标移动的时候 如果画笔处于落下状态 就画线
    e.preventDefault();
    if (isMouseDown) {
        moveStroke( { x: e.clientX, y: e.clientY } );
    }
}
var colors = [ 
    [ 'rgba(67, 255, 0, 0.1)', 'rgba(67, 255, 0, 0.5)' ],
    [ 'rgba(255, 151, 151, 0.1)',  'rgba(255, 151, 151, 0.5)'],
    [ 'rgba(57, 139, 255, 0.1)', 'rgba(57, 139, 255, 0.5)' ],
    [ 'rgba(255, 213, 26, 0.1)', 'rgba(255, 213, 26, 0.5)' ],
    [ 'rgba(255, 64, 208, 0.1)', 'rgba(255, 64, 208, 0.5)' ]
]
var circles = [];
for (var i = 0; i < 20; i++) {
    var r = random(50, 100);
    var x = random(r, width - r);
    var y = random(r, height - r);
    var color = colors[i % colors.length];
    var grd = context.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, color[0]);
    grd.addColorStop(1, color[1]);
    var vx = random(-5, 5);
    var vy = random(-5, 5);
    let circle = { x, y, r, color: grd, vx, vy };
    circles.push(circle);
}

setInterval(
    function() {
        render(context);
        update();
    },
    20
);

function render() {
    for (let i = 0; i < circles.length; i++) {
        var circle = circles[i];
        context.fillStyle = circle.color;
        context.beginPath();
        context.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    }
}

// 画笔落下 设置画笔位置
function beginStroke(point) {
    isMouseDown = true;
    lastLoc = windowToCanvas(point);  
}
// 画笔抬起
function endStroke(point) {
    isMouseDown = false;
}
// 画笔移动 
function moveStroke(point) {
    var curLoc = windowToCanvas(point);
    var curTimestamp = new Date().getTime();
    var s = calcDistance(lastLoc, curLoc);  // 移动了多远距离
    var t = curTimestamp - lastTimestamp;   // 移动时间
    var lineWidth = calcLineWidth(s / t);    // 计算笔的宽度不仅要考虑速度 还要和之前的宽度不能差太远保证笔迹光滑
    // 画线
    context.beginPath();
    context.moveTo(lastLoc.x, lastLoc.y);
    context.lineTo(curLoc.x, curLoc.y);
    context.strokeStyle = strokeColor;
    context.lineWidth = lineWidth;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.stroke();
    // 记录当前状态
    lastLoc = curLoc;
    lastTimestamp = curTimestamp;
    lastLineWidth = lineWidth;
}

// 鼠标事件获取的是window的坐标 需要转换为canvas坐标
function windowToCanvas(point) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: Math.round(point.x - bbox.left),
        y: Math.round(point.y - bbox.top)
    };
}
// 获取两点之间距离
function calcDistance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}
// 根据当前画笔速度 算出宽度
function calcLineWidth(v) {
    var MAX_LINE_WIDTH = 10;
    var MIN_LINE_WIDTH = 1;
    var MAX_STROKE_V = 5;
    var MIN_STROKE_V = 0.1;

    var result;
    if (v <= MIN_STROKE_V) result = MAX_LINE_WIDTH;
    else if (v >= MAX_STROKE_V) result = MIN_LINE_WIDTH;
    else result = MAX_LINE_WIDTH - ( v - MIN_STROKE_V) / (MAX_STROKE_V - MIN_STROKE_V) * (MAX_LINE_WIDTH - MIN_LINE_WIDTH);
    if (lastLineWidth === -1) return result;
    return result * 1/4 + lastLineWidth * 3/4;
}
// 得到一个 [low, high) 的随机数
function random(low, high) {
    return Math.round(Math.random() * (high - low)) + low;
}




