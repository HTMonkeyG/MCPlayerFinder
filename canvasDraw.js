var Anim = window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function (callback) {
             window.setTimeout(callback, 1000 / 60);
           };

var C   = document.getElementById("canvas");
var CTX = C.getContext('2d');           

function getWindowSize(){
  var a, b;
  if(window.innerWidth){
    a = window.innerWidth;
  }else if((document.body) && (document.body.clientWidth)){
    a = document.body.clientWidth;
  }
    
  if(window.innerHeight){
    b = window.innerHeight;
  }else if((document.body) && (document.body.clientHeight)){
    b = document.body.clientHeight;
  }
  
  if(document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth){
    b = document.documentElement.clientHeight;
    b = document.documentElement.clientWidth;
  }
  
  return [a, b];
}

CTX.fillColor = function(r,g,b,a){if(a||a==0){this.fillStyle=`rgba(${r},${g},${b},${a})`}else if(!g&&!b){this.fillStyle=`rgb(${r},${r},${r})`}else{this.fillStyle=`rgb(${r},${g},${b})`}};
CTX.strokeColor = function(r,g,b,a){if(a||a==0){this.strokeStyle=`rgba(${r},${g},${b},${a})`}else if(!g&&!b){this.strokeStyle=`rgb(${r},${r},${r})`}else{this.strokeStyle=`rgb(${r},${g},${b})`}};

Anim(draw);

function draw(){
  C.width = 1080;
  C.height = 720;
  
  CTX.fillColor(100);
  CTX.fillRect(100,100,100,100);
  
  CTX.textBaseline = "middle";
  CTX.textAlign = "center";
  CTX.font = "35px Arial";
  
  CTX.beginPath();
  CTX.moveTo(0,60);
  CTX.lineTo(130,60);
  CTX.lineTo(210,0);
  CTX.lineTo(0,0);
  CTX.closePath();
  CTX.fillColor(193,136,94,0.3);
  CTX.fill();
  
  CTX.beginPath();
  CTX.lineWidth=2;
  CTX.moveTo(0,60);
  CTX.lineTo(130,60);
  CTX.lineTo(210,0);
  CTX.strokeColor(193,136,94);
  CTX.stroke();
  
  CTX.fillColor(255);
  if(workObj.run){
    CTX.fillText(`预计目标坐标：(${elderWObj.x+elderWObj.dx/2},${elderWObj.z+elderWObj.dz/2})；目标范围：±${Math.max(elderWObj.dx/2,elderWObj.dx/2)}`,540,680);
    CTX.fillColor(93,192,97);
    CTX.font = "40px Arial";
    CTX.fillText("正常",65,31);
    
  } else {
    CTX.fillText('预计目标坐标：( - , - )；目标范围：-',540,680);
    CTX.fillColor(95,168,216);
    CTX.font = "40px Arial";
    CTX.fillText("待命",65,31);
  }
  
  Animator.tick();
  
  Anim(draw);
}

var Animator = {
  tick: function(){
    let preDel = [];
    for(let a in this.anims){
      if(this.anims[a]){
        this.anims[a].opr((this.anims[a].cur - this.anims[a].start) / this.anims[a].dur);
        this.anims[a].cur = this.ticks;
      
        if((this.anims[a].cur - this.anims[a].start) / this.anims[a].dur >= 1)preDel.push(a);
      }
    }
    this.ticks++;
    
    for(let i = 0;i< preDel.length;i++){
      this.anims[preDel[i]] = undefined;
    }
  },
  addAnim: function(a,c,d){
    let b = this.ticks;
    this.anims[a] = { opr: c, dur: d, start: b, cur: b };
  },
  ticks: 0,
  anims: {}
};

Animator.addAnim('a',(a)=>{console.log(a)}, 10*60);