let wkObj1010 = {
  run: false,
  Aa: function(x,b){
    return Math.pow(b,Math.ceil(Math.log(x)/Math.log(b)));
  },
  Ab: function(){
    if(this.dr < 1){
      this.run = false;
      this.errHandler(1);
      return;
    }
    this.cmdHandler(this);
  },
  init: function(x,z,r){
    r = this.Aa(r,10);
    this.x = x - r;
    this.z = z - r;
    this.dx = r;
    this.dz = r;
    this.state = 1;
    this.dr = r;
    this.run = true;
    this.Ab(this);
  },
  rst: function(){
    this.state = 0;
    this.run = false;
  },
  errHandler: function(){},
  cmdHandler: function(){},
  Ba: function(){
    if(!this.state)return;
    if(!this.run)return;
    if(this.state == 1){
      if(this.dx - this.dr > 0){
        this.dx -= this.dr;
      } else {
        this.dx = this.dr;
        this.state = 2;
      }
      this.Ab();
      return;
    }
    if(this.state == 2){
      if(this.dz - this.dr > 0){
        this.dz -= this.dr;
      } else {
        this.dz = this.dr;
        this.dr /= 10;
        this.state = 1;
      }
      this.Ab();
      return;
    }
  },
  Bb: function(){
    if(!this.state)return;
    if(!this.run)return;
    if(this.state == 1){
      this.x += this.dx;
      this.dx = this.dr;
      this.state = 2;
      this.Ab();
      return;
    }
    if(this.state == 2){
      this.z += this.dx;
      this.dz = this.dr;
      this.dr /= 10;
      this.state = 1;
      this.Ab();
      return;
    }
  }
};
