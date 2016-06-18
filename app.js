var objIdCounter = 1;
var Rectangle = function(x, y, w, h, options) {
    var circle = {
        id: objIdCounter++,
        type: "Rectangle",
        x: x,
        y: y,
        w: w,
        h: h,
        color: 'black'
    };

    for(var key in options){
        if(options[key] !== undefined){
            circle[key] = options[key];
        }
    }

    return circle;
};

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var drawShape = function(s) {
    ctx.beginPath();
    // ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI, false);
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x + s.w, s.y);
    ctx.lineTo(s.x + s.w, s.y + s.h);
    ctx.lineTo(s.x, s.y + s.h);
    ctx.lineTo(s.x, s.y);
    ctx.closePath();

    ctx.fillStyle = s.color;
    ctx.fill();
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = "1.5";
    ctx.stroke();
};

var rand = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

var entities = {};

var createAndAddRect = function(x, y, w, h){
    var thing = Rectangle(x, y, w, h, {
        color: randomColor()
    });
    drawShape(thing);
    entities[thing.id] = thing;

    return thing;
};

var componentToHex =function (c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};

var rgbToHex = function (r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

var randomColor = function(){
    var r = rand(0,50);
    var g = rand(0,100);
    var b = 255;
    return rgbToHex(r, g, b);
};

//add initial Rect
var height = 15;
var width = 300;
var movingShape = createAndAddRect((canvas.width / 2) - (width / 2), canvas.height - height, width, height);
var previousShape;
var score = 0;
var scoreDiv = document.getElementById('score');
var playing = true;
var reset = document.getElementById('reset');

var onClickOrSpaceBar = function(e) {
    var code = event.keyCode;
    if(playing && (code === 32 || e.type === 'click')){
        //adjust score
        score += 1;
        scoreDiv.innerHTML = score;

        if(previousShape !== undefined){
            var cond1 = movingShape.x >= previousShape.x && movingShape.x <= (previousShape.x + previousShape.w);
            var cond2 = (movingShape.x + movingShape.w) <= (previousShape.x + previousShape.w) && (movingShape.x + movingShape.w) >= previousShape.x;
            if(!cond1 && !cond2){
                playing = false;
                scoreDiv.innerHTML = "YOU LOSE! Score: " + score;
                reset.style.display = 'block';
            }else{
                if(movingShape.x < previousShape.x){
                    movingShape.w = movingShape.w - (previousShape.x - movingShape.x);
                    movingShape.x = previousShape.x;
                }else if(movingShape.x > previousShape.x){
                    movingShape.w = movingShape.w - (movingShape.x - previousShape.x);
                }
            }
        }
        if(playing === true){
            previousShape = movingShape;
            movingShape = createAndAddRect((rand(0, 2) === 0 ? 0 : (canvas.width - previousShape.w)), (previousShape.y - height), previousShape.w, height);
            if(Object.keys(entities).length >= 23){
                moveRectanglesDown();
            }
        }
    }
};

canvas.addEventListener('click', onClickOrSpaceBar);
window.addEventListener('keydown', onClickOrSpaceBar);

var moveRectanglesDown = function(){
    for(var k in entities){
        if(entities[k] !== undefined){
            entities[k].y += entities[k].h;
            if(entities[k].y > canvas.height){
                delete entities[k];
            }
        }
    }
};

// var gameTime;
var direction = 'right';
var update = function(dt) {
    if(playing === true){
        if(direction === 'right' ){
            if((movingShape.x + 4) < (canvas.width - movingShape.w)){
                movingShape.x += 4;
            }else{
                direction = 'left';
            }
        }else if(direction === 'left' ){
            if((movingShape.x - 4) > 0){
                movingShape.x -= 4;
            }else{
                direction = 'right';
            }
        }
    }

};

var render = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var e;
    for(e in entities){
        drawShape(entities[e]);
    }
};

//game loop
var lastTime;
var draw = function() {
    //update time
    var now = Date.now();
    if (lastTime) {
        var dt = (now - lastTime) / 1000.0;
        update(dt);
        render();
    }
    lastTime = now;

    //draw!
    window.requestAnimationFrame(draw);
};
draw();
