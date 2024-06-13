let wkObj0303 = {
  init: (x,y,r)=>{
    r = this.A(r);
    this.x = Math.floor(x) - Math.floor(r/2);
  },
  A: (x,b)=>{
    return Math.pow(b,Math.ceil(Math.log(x)/Math.log(b)));
  },
};

function atm0303init(){
  
}

//yes按钮的函数
function inputA(){

}

//no按钮的函数
function inputB(){

}