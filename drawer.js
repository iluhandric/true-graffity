var curColor = '#000000';
var curWidth = 20;
var dropTime = 0;
var maxWidth = 50;
var minWidth = 4;

var preview = document.getElementById('circle');
var pallete = document.getElementById('pallete');
var widthRange = document.getElementById('widthRange');
var palleteColors = [];
curDrop = {
  X : -1,
  Y : -1,
  startX : -1,
  startY : -1,
  speed : 8
}
function update(picker) {
    setColor('#' + picker);
}

function setColor(color){
    curColor = color;
    // console.log('dsda');
    preview.style.background = color;
    // var picker = document.getElementById('picker');
    // picker.value = color.substr(1, 6);
    // picker.style.backgroundColor = color
    // console.log(picker);
    // picker = color;
}


function setWidth(w){
    curWidth = parseInt(w);
    preview.style.width = 2.4*w;
    preview.style.height = 2.4*w;
    preview.style.borderRadius = w*1.2 + 'px';
    preview.style.marginLeft = 100 -  w*1.2 + 'px'
    // console.log(curWidth);
    widthRange.value = curWidth;
}

function controlWidth (e) {
    if (e.keyCode === 87) {
        // console.log(curWidth, maxWidth);
        var neww = curWidth+1;
        // curWidth = Math.min(curWidth+1, maxWidth);
        setWidth(Math.min(curWidth+1, maxWidth));
    }
    if (e.keyCode === 83) {
        setWidth(Math.max(curWidth-1, minWidth));
    }
    widthRange.value = curWidth;
}

function createCan(color) {
    var newCan = document.createElement("div");
    newCan.style.border = "thick solid #999999";
    newCan.style.borderRadius = 30 + 'px';
    newCan.style.width = 50 + 'px';
    newCan.style.display = 'block';
    newCan.style.float = 'left';
    newCan.style.margin = '3px';
    newCan.style.height = 50 + 'px';
    newCan.style.background = color;
    newCan.style.boxShadow =  '5px 5px 0px #333333';
    var top = document.createElement("div");
    top.style.border = "thick solid #999999";
    top.style.borderRadius = 30 + 'px';
    top.style.borderWidth = 3 + 'px';
    top.style.width = 20 + 'px';
    top.style.display = 'block';
    top.style.float = 'left';
    top.style.margin = '11px';
    top.style.height = 20 + 'px';
    top.style.background = '#333333';
    // top.style.boxShadow =  '1px 1px 0px #333333';
    var whiteTop = document.createElement("div");
    // whiteTop.style.border = "thick solid #999999";
    whiteTop.style.borderRadius = 30 + 'px';
    // whiteTop.style.borderWidth = 3 + 'px';
    whiteTop.style.width = 8 + 'px';
    whiteTop.style.display = 'block';
    whiteTop.style.float = 'left';
    whiteTop.style.margin = '3px';
    whiteTop.style.height = 8 + 'px';
    whiteTop.style.background = '#ffffff';
    whiteTop.style.boxShadow =  '2px 2px 0px #000000';
    top.appendChild(whiteTop);
    newCan.appendChild(top);
    newCan.onclick = function () {
        setColor(color);
    }
    return newCan;
}

function addToPallete(color) {
    if (pallete.innerHTML == 'No saved cans! Click "Save color"!') {
        pallete.innerHTML = "";
    }
    if (palleteColors.indexOf(color) === -1) {
        pallete.appendChild(createCan(color));
        palleteColors.push(color);
    }
}
function emptyBar() {
    palleteColors = [];
    $( "#pallete" ).empty();
     pallete.innerHTML = 'No saved cans! Click "Save color"!';
}



function Gauss() {
  var ready = false;
  var second = 0.0;
  
  this.next = function(mean, dev) {
    mean = mean == undefined ? 0.0 : mean;
    dev = dev == undefined ? 1.0 : dev;
    
    if (this.ready) {
      this.ready = false;
      return this.second * dev + mean;
    }
    else {
      var u, v, s;
      do {
        u = 2.0 * Math.random() - 1.0;
        v = 2.0 * Math.random() - 1.0;
        s = u * u + v * v;
      } while (s > 1.0 || s == 0.0);
      
      var r = Math.sqrt(-2.0 * Math.log(s) / s);
      this.second = r * u;
      this.ready = true;
      return r * v * dev + mean;
    }
  };
}

$( document ).ready(function() {
    widthRange = document.getElementById('widthRange');

    var canvas = document.getElementById('canvasDiv');
    // canvas = document.createElement('canvas');
    canvasWidth = 300;
    canvasHeight = 300;
    var X, Y;   

    function draw (){
      if (paintSprayer) {
        canvas = document.createElement('canvas');

        // context.globalCompositeOperation = 'source-over';
        // console.log('paint', X, Y);
        context.beginPath();
        // console.log(curWidth);

        context.lineWidth = curWidth;

        context.fillStyle = curColor;

        context.globalAlpha = Math.max(0.0006 * curWidth, 0.02);

        context.arc(X + Math.random()*context.lineWidth/8 + context.lineWidth/8*(-1)*(Math.random() > 0.5),
                    Y + Math.random()*context.lineWidth/8 + context.lineWidth/8*(-1)*(Math.random() > 0.5), 
                    context.lineWidth, 0, Math.PI*2)

        context.fill();
        context.closePath()

        g  = new Gauss();

        
        for (i = 0; i < 50; i++) { //curWidth*curWidth/2
          context.beginPath();
          range = 1600;
          var randomAngle = Math.random() * 360;

          var randomRadius = g.next((Math.random()-0.5)*3, Math.sqrt(range * curWidth));

          // context.globalAlpha = 0.3 + (Math.random()-0.5)* Math.sqrt(curWidth/200)/randomRadius;
          

          while ((Math.abs(randomRadius) > curWidth*1)||(Math.abs(randomRadius) < curWidth/10 && Math.random() * 5 > 1)) {
             randomRadius = g.next((Math.random()-0.5)*3,  Math.sqrt(range * curWidth));
          }
          var x = Math.cos(randomAngle) * randomRadius;
          var y = Math.sin(randomAngle) * randomRadius;
          context.globalAlpha = 1 - Math.random() - 0.6*Math.abs(randomRadius/curWidth);
          // console.log(randomRadius, context.globalAlpha, 0.6 - Math.random()*0.1 - 0.6*Math.abs(randomRadius/curWidth));
          context.fillRect(X+x,Y+y,1,1);
          context.fill();
          context.closePath()
        }

        

        // console.log(curSpeed);
        if (dropTime && curSpeed <= 1.1 && (new Date()).getTime() - dropTime > 1100) {
            var newDrop = curDrop;
            if (Math.abs(X - curDrop.startX) > curWidth/2 || 
                Math.abs(Y - curDrop.startY) > curWidth/2) {
              dropTime = (new Date()).getTime();   
              // newDrop.startY = -1;
              newDrop.put = false;
              newDrop.startX = X;
              newDrop.startY = Y;
              newDrop.X = X;
                  newDrop.speed = 10;              

              newDrop.Y = Y + context.lineWidth;
            // }
            } else {
                // console.log(curDrop.startY);
                if (curDrop.startY === -1 || curDrop.startX === -1) {
                  newDrop.X = X;
                  newDrop.put = true;
                  newDrop.Y = Y + context.lineWidth;
                  newDrop.startX = X;
                  newDrop.startY = Y + context.lineWidth;
                  newDrop.speed = 10;              
                } else {
                  newDrop.X = curDrop.X + (Math.random() - 0.5) * newDrop.speed / 3;
                  newDrop.Y = curDrop.Y + (Math.random()) * newDrop.speed / 5;
                  newDrop.speed *= 0.99;
                  newDrop.put = true;
              //     newDrop.startX = X;
              // newDrop.startY = Y;
                  if (newDrop.speed < 1) {
                    newDrop.speed = 1;
                  }
                }
            }
            if ( newDrop.put) {
                context.beginPath();
                context.globalAlpha = 0.5;
                context.arc(newDrop.X, newDrop.Y, 
                            2, 0, Math.PI*2)
                context.fill();
                // console.log(newDrop.X, newDrop.Y);
                context.closePath();
                curDrop = newDrop;
            }
        } else {
          if (curSpeed <= 1.5 && dropTime === 0) {
            dropTime = (new Date()).getTime();
            // console.log("first");
            curDrop.startY = Y;
            curDrop.startX = X;
            curDrop.Y = Y;
            curDrop.X = X;

          }
        }
        curSpeed /= 2;
        }
    }

    // window.setInterval(function (){draw()}, 2);
    // window.setInterval(function (){draw()}, 3);
    window.setInterval(function (){draw()}, 1);

    // window.setInterval(function (){draw()}, 5);


    
    canvas.setAttribute('width', $(window).innerWidth());
    canvas.setAttribute('height', $(window).innerHeight()*0.5);
    canvas.setAttribute('id', 'canvas');
    if(typeof G_vmlCanvasManager != 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }
    context = canvas.getContext("2d");
    context.beginPath();
    context.fillStyle = '#ffffff';

    var clickX = new Array();
    var clickY = new Array();
    var colors = new Array();
    var widths = new Array();

    var clickDrag = new Array();
    var paintSprayer;
    var shift = 0;
    var oldshift = 0;
    var prevshift = 0;
    var curSpeed = 0;
    pallete = document.getElementById('pallete');
    preview = document.getElementById('circle');
    curWidth = 20;
    setWidth(curWidth);
    var background = new Image();
    background.src = "http://color-complect.ru/wp-content/uploads/2012/08/strukturnaia-shtukaturka-53.jpg";
    
    background.onload = function(){
        context.drawImage(background,0,0);   
    }

    function addClick(x, y, dragging)
    {
      clickX.push(x);
      clickY.push(y);
      clickDrag.push(dragging);
    }
    $('#canvas').mousedown(function(e){
        
        var button = e.which || e.button;
        if (button === 1 || e.isTouch) {
            // console.log("mousedown");
            paintSprayer = true;
            X = e.pageX - this.offsetLeft;
            Y = e.pageY - this.offsetTop;
        }
    });

    $('#canvas').mousemove(function(e){
        var button = e.which || e.button;
        // console.log('moved');
        if (button === 1 || e.isTouch) {
            curSpeed = shift;
            // console.log('moved');
            shift = Math.sqrt((X - e.pageX + this.offsetLeft)*(X - e.pageX + this.offsetLeft) + (Y - e.pageY + this.offsetTop)*(Y - e.pageY + this.offsetTop));
            curSpeed += shift + oldshift + prevshift;
            curSpeed /= 4;
            prevshift = oldshift; 
            oldshift = shift;
            X = e.pageX - this.offsetLeft;
            Y = e.pageY - this.offsetTop;
        }
    });
    $('#canvas').mouseup(function(e){
        var button = e.which || e.button;
        // console.log('mouseup');
        if (button === 1 || e.isTouch) {
            paintSprayer = false;
            dropTime = 0;
            curDrop.startY = -1;
        }
    });

    $('#canvas').mouseleave(function(e){
      paintSprayer = false;
      dropTime = 0;
      curDrop.startY = -1;
    });


    canvas.addEventListener("touchstart", function (e) {

          var touch = e.touches[0];
          var mouseEvent = new MouseEvent("mousedown", {
            pageX: touch.clientX,
            pageY: touch.clientY,
            which : 1,
            button : 1,
            isTouch : 1
          });
          canvas.dispatchEvent(mouseEvent);
        }, false);

canvas.addEventListener("touchend", function (e) {
    paintSprayer = false;

    var mouseEvent = new MouseEvent("mouseup", {isTouch : 1});
    canvas.dispatchEvent(mouseEvent);
}, false);

canvas.addEventListener("touchmove", function (e) {
    var touch = e.touches[0];
    curSpeed = shift;
    shift = Math.sqrt(  (X - touch.clientX + this.offsetLeft)*(X - touch.clientX + this.offsetLeft) + 
                        (Y - touch.clientY + this.offsetTop)*(Y - touch.clientY + this.offsetTop));
    curSpeed += shift + oldshift + prevshift;
    curSpeed /= 4;
    prevshift = oldshift; 
    oldshift = shift;
    X = touch.clientX - this.offsetLeft;
    Y = touch.clientY - this.offsetTop;
    console.log(X, Y)
    paintSprayer = true;
}, false);
});