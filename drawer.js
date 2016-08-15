var curColor = '#000000';
var curWidth = 50;
var dropTime = 0;
var preview = document.getElementById('circle');
curDrop = {
  X : -1,
  Y : -1,
  startX : -1,
  startY : -1,
  speed : 8
}
function update(picker) {
    setColor('#' + picker);
    console.log(picker);
}
function setColor(color){
    curColor = color;
    preview.style.background = color;
    console.log(curColor);
}
function setWidth(w){
    curWidth = w;
    preview.style.width = w;
    preview.style.height = w;
    preview.style.borderRadius = w/2 + 'px';
    console.log(preview.style);
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
    
    var canvas = document.getElementById('canvasDiv');
    // canvas = document.createElement('canvas');
    canvasWidth = 300;
    canvasHeight = 300;
    var X, Y;   

    
    window.setInterval(function(){
      if (paintSprayer) {
        canvas = document.createElement('canvas');

        // context.globalCompositeOperation = 'source-over';
        
        context.beginPath();

        context.lineWidth = curWidth;

        context.fillStyle = curColor;

        context.globalAlpha = Math.max(0.0006 * curWidth, 0.02);

        context.arc(X + Math.random()*context.lineWidth/8 + context.lineWidth/8*(-1)*(Math.random() > 0.5),
                    Y + Math.random()*context.lineWidth/8 + context.lineWidth/8*(-1)*(Math.random() > 0.5), 
                    context.lineWidth, 0, Math.PI*2)

        context.fill();
        context.closePath()

        g  = new Gauss();

        
        for (i = 0; i < curWidth*curWidth/2; i++) {
          context.beginPath();
          range = 1600;
          var randomAngle = Math.random() * 360;

          var randomRadius = g.next((Math.random()-0.5)*3, Math.sqrt(range * curWidth));

          // context.globalAlpha = 0.3 + (Math.random()-0.5)* Math.sqrt(curWidth/200)/randomRadius;
          

          while ((Math.abs(randomRadius) > curWidth*1.2)||(Math.abs(randomRadius) < curWidth/10 && Math.random() * 5 > 1)) {
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
        if (dropTime && curSpeed <= 1.1 && (new Date()).getTime() - dropTime > 1800) {
            var newDrop = curDrop;
            if (Math.abs(X - curDrop.X) > curWidth/2) {
              dropTime = (new Date()).getTime();   
              curDrop.startY = -1;           
            }
            if (curDrop.startY === -1 || curDrop.startX === -1) {
              newDrop.X = X;
              newDrop.Y = Y + context.lineWidth;
              newDrop.startX = X;
              newDrop.startY = Y + context.lineWidth;
              newDrop.speed = 10;
              // dropTime = (new Date()).getTime();              
            } else {
              newDrop.X = curDrop.X + (Math.random() - 0.5) * newDrop.speed / 3;
              newDrop.Y = curDrop.Y + (Math.random()) * newDrop.speed / 5;
              newDrop.speed *= 0.99;
              if (newDrop.speed < 1) {
                newDrop.speed = 1;
              }
            }
            context.beginPath();
            context.globalAlpha = 0.5;
            context.arc(newDrop.X, newDrop.Y, 
                        3, 0, Math.PI*2)
            context.fill();
            // console.log('drop!');
            context.closePath();
            curDrop = newDrop;
        } else {
          if (curSpeed <= 1.5 && dropTime === 0) {
            dropTime = (new Date()).getTime();
          }
        }
        curSpeed /= 2;
    }

    }, 1);
    canvas.setAttribute('width', $(window).innerWidth());
    canvas.setAttribute('height', $(window).innerHeight()*0.7);
    canvas.setAttribute('id', 'canvas');
    if(typeof G_vmlCanvasManager != 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }
    context = canvas.getContext("2d");

        context.beginPath();
        context.fillStyle = '#ffffff';
        // context.rect(0,0,canvas.width, canvas.height);context.closePath();context.fill();
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
    preview = document.getElementById('circle');
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
        if (button === 1) {
            paintSprayer = true;
            curSpeed = shift;
            shift = Math.sqrt((X - e.pageX + this.offsetLeft)*(X - e.pageX + this.offsetLeft) + (Y - e.pageY + this.offsetTop)*(Y - e.pageY + this.offsetTop));
            curSpeed += shift + oldshift + prevshift;
            curSpeed /= 4;
            prevshift = oldshift; 
            oldshift = shift;
            // }
            X = e.pageX - this.offsetLeft;
            Y = e.pageY - this.offsetTop;
        }
    });

    $('#canvas').mousemove(function(e){
        var button = e.which || e.button;
        if (button === 1) {
            curSpeed = shift;
            shift = Math.sqrt((X - e.pageX + this.offsetLeft)*(X - e.pageX + this.offsetLeft) + (Y - e.pageY + this.offsetTop)*(Y - e.pageY + this.offsetTop));
            curSpeed += shift + oldshift + prevshift;
            curSpeed /= 4;
            prevshift = oldshift; 
            oldshift = shift;
            X = e.pageX - this.offsetLeft;
            Y = e.pageY - this.offsetTop;
        }
    });
    // $('#canvas').click(function(e){
    //     var button = e.which || e.button;
    //     if (button === 1) {
    //         curSpeed = shift;
    //         shift = Math.sqrt((X - e.pageX + this.offsetLeft)*(X - e.pageX + this.offsetLeft) + (Y - e.pageY + this.offsetTop)*(Y - e.pageY + this.offsetTop));
    //         curSpeed += shift + oldshift + prevshift;
    //         curSpeed /= 4;
    //         prevshift = oldshift; 
    //         oldshift = shift;
    //         X = e.pageX - this.offsetLeft;
    //         Y = e.pageY - this.offsetTop;
    //     }
    // });
    $('#canvas').on('touchmove',function(e){
            curSpeed = shift;
            shift = Math.sqrt((X - e.pageX + this.offsetLeft)*(X - e.pageX + this.offsetLeft) + (Y - e.pageY + this.offsetTop)*(Y - e.pageY + this.offsetTop));
            curSpeed += shift + oldshift + prevshift;
            curSpeed /= 4;
            prevshift = oldshift; 
            oldshift = shift;
            X = e.pageX - this.offsetLeft;
            Y = e.pageY - this.offsetTop;

   }); 
    // $('#canvas').touchmove(function(e){
           
    // });
    $('#canvas').mouseup(function(e){
        var button = e.which || e.button;
        if (button === 1) {
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
});