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
  speed : 5
}
function update(picker) {
    setColor('#' + picker);
}

function showControls(event) {
    $("#controls").slideToggle({
      direction: "up"
    }, 300);
    event.stopPropagation();

}

function setColor(color){
    curColor = color;
    preview.style.background = color;
}

function toggleShare(color){
    console.log('share');
    $("#shareButtons").slideToggle({}, 1000);
    event.stopPropagation();
}


function setWidth(w){
    curWidth = parseInt(w);
    preview.style.width = 2.4*w;
    preview.style.height = 2.4*w;
    preview.style.borderRadius = w*1.2 + 'px';
    preview.style.marginLeft = 100 -  w*1.2 + 'px'
    widthRange.value = curWidth;
}

function controlWidth (e) {
    if (e.keyCode === 87) {
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
    var whiteTop = document.createElement("div");
    whiteTop.style.borderRadius = 30 + 'px';
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

function emptyDraft() {
    var cnvs = document.getElementById('smallDraft');
    cnvs.getContext('2d').beginPath();
    cnvs.getContext('2d').globalAlpha = 1;
    cnvs.getContext('2d').clearRect(0, 0, cnvs.width, cnvs.height);
    var draftBg = new Image();
    draftBg.src = "http://allfreedesigns.com/wp-content/uploads/2013/01/cardboard-textures-3.jpg";
    draftBg.onload = function(){
        cnvs.getContext('2d').drawImage(draftBg,0,0);  
    }
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

    var X, Y;   

    // document.getElementById('vkShare').href = "http://vkontakte.ru/share.php?url=" + 

    function draw (canvas, context, drawing){
      if (drawing) {
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

        
        for (i = 0; i < 50; i++) { //curWidth*curWidth/2
          context.beginPath();
          range = 1600;
          var randomAngle = Math.random() * 360;

          var randomRadius = g.next((Math.random()-0.5)*3, Math.sqrt(range * curWidth));

          // context.globalAlpha = 0.3 + (Math.random()-0.5)* Math.sqrt(curWidth/200)/randomRadius;
          

          while ((Math.abs(randomRadius) > curWidth*1.1)||(Math.abs(randomRadius) < curWidth/10 && Math.random() * 5 > 1)) {
             randomRadius = g.next((Math.random()-0.5)*3,  Math.sqrt(range * curWidth));
          }

          var x = Math.cos(randomAngle) * randomRadius;
          var y = Math.sin(randomAngle) * randomRadius;
          context.globalAlpha = 1 - Math.random() - 0.6*Math.abs(randomRadius/curWidth);
          context.fillRect(X+x,Y+y,1,1);
          context.fill();
          context.closePath()
        }

        
        if (dropTime && curSpeed <= 1.1 && (new Date()).getTime() - dropTime > 1300) {
            var newDrop = curDrop;
            if (Math.abs(X - curDrop.startX) > curWidth/2 || 
                Math.abs(Y - curDrop.startY) > curWidth/2) {
                dropTime = (new Date()).getTime();   
                newDrop.put = false;
                newDrop.startX = X;
                newDrop.startY = Y;
                newDrop.X = X;
                newDrop.speed = 10;              
                newDrop.Y = Y + context.lineWidth*1.1;
            } else {
                // console.log(curDrop.startY);
                if (curDrop.startY === -1 || curDrop.startX === -1) {
                    newDrop.X = X;
                    newDrop.put = true;
                    newDrop.Y = Y + context.lineWidth;
                    newDrop.startX = X;
                    newDrop.startY = Y + context.lineWidth*1.1 - newDrop.speed / 5;
                    newDrop.speed = 10;              
                } else {
                    newDrop.X = curDrop.X + (Math.random() - 0.5) * newDrop.speed / 3;
                    newDrop.Y = curDrop.Y + (Math.random()) * newDrop.speed / 5;
                    newDrop.speed *= 0.985;
                    newDrop.put = true;
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
                context.closePath();
                curDrop = newDrop;
            }
        } else {
          if (curSpeed <= 1.5 && dropTime === 0) {
            dropTime = (new Date()).getTime();
            curDrop.startY = Y;
            curDrop.startX = X;
            curDrop.Y = Y + context.lineWidth*1.1;
            curDrop.X = X;
          }
        }
        curSpeed /= 2;
        }
    }

    var canvas = document.getElementById('canvasDiv');
    var smallDraft = document.getElementById('smallDraft');
    var smallContext = smallDraft.getContext("2d");
    var canvas = document.getElementById('canvasDiv');
    var context = canvas.getContext("2d");
    window.setInterval(function (){draw(canvas, context, paintSprayer)}, 1);
    var draftSprayer = false;
    window.setInterval(function (){draw(smallDraft, smallContext, draftSprayer)}, 1);
    
    canvas.setAttribute('width', $(window).innerWidth());
    canvas.setAttribute('height', $(window).innerHeight()-34);

    smallDraft.setAttribute('width', 218);
    smallDraft.setAttribute('height', 190);

    canvas.setAttribute('id', 'canvas');
    if(typeof G_vmlCanvasManager != 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }

    if(typeof G_vmlCanvasManager != 'undefined') {
        smallDraft = G_vmlCanvasManager.initElement(smallDraft);
    }
    
    context.beginPath();
    smallContext.beginPath();
    
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
    background.src = "http://previews.123rf.com/images/eugenesergeev/eugenesergeev1310/eugenesergeev131000315/23310840-Light-gray-rough-concrete-wall-Seamless-background-photo-texture-Stock-Photo.jpg";

    emptyDraft();

    background.onload = function(){
        context.drawImage(background,0,0);   
    }
    canvasURL = canvas.toDataURL();
    $('#canvas').mousedown(function(e){
        
        var button = e.which || e.button;
        if (button === 1 || e.isTouch) {
            // console.log("mousedown");
            paintSprayer = true;
            X = e.pageX - this.offsetLeft;
            Y = e.pageY - this.offsetTop;
            console.log(X, Y);

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

$('#smallDraft').mousedown(function(e){
            console.log("mousedown");
        
        var button = e.which || e.button;
        if (button === 1 || e.isTouch) {
            // console.log("mousedown");
            draftSprayer = true;
            X = e.pageX - this.offsetLeft;
            Y = e.pageY - $('#smallDraft').offset().top;
            console.log(X, Y);
            console.log(e.pageY);
            console.log(this.offsetTop);


        }
    });

    $('#smallDraft').mousemove(function(e){
        var button = e.which || e.button;
        // console.log('moved');
        if (button === 1 || e.isTouch) {
            curSpeed = shift;
            // console.log('moved');
            shift = Math.sqrt((X - e.pageX + this.offsetLeft)*(X - e.pageX + this.offsetLeft) + (Y - e.pageY + this.offsetTop)*(Y - e.pageY + this.offsetTop + 263));
            curSpeed += shift + oldshift + prevshift;
            curSpeed /= 4;
            prevshift = oldshift; 
            oldshift = shift;
            X = e.pageX - this.offsetLeft;
            Y = e.pageY - $('#smallDraft').offset().top;
        }
    });
    $('#smallDraft').mouseup(function(e){
        var button = e.which || e.button;
        // console.log('mouseup');
        if (button === 1 || e.isTouch) {
            draftSprayer = false;
            dropTime = 0;
            curDrop.startY = -1;
        }
    });

    $('#smallDraft').mouseleave(function(e){
      draftSprayer = false;
      dropTime = 0;
      curDrop.startY = -1;
    });


    smallDraft.addEventListener("touchstart", function (e) {

          var touch = e.touches[0];
          var mouseEvent = new MouseEvent("mousedown", {
            pageX: touch.clientX,
            pageY: touch.clientY,
            which : 1,
            button : 1,
            isTouch : 1
          });
          smallDraft.dispatchEvent(mouseEvent);
        }, false);

smallDraft.addEventListener("touchend", function (e) {
    draftSprayer = false;

    var mouseEvent = new MouseEvent("mouseup", {isTouch : 1});
    smallDraft.dispatchEvent(mouseEvent);
}, false);

smallDraft.addEventListener("touchmove", function (e) {
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
    draftSprayer = true;
}, false);
});