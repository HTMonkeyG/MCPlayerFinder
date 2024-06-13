let BoxWorkObj = {
  s:   0,
  x0:  0,
  z0:  0,
  dx:  0,
  dz:  0,
  ix0: 0,
  iz0: 0,
  idx: 0,
  idz: 0,
  div: 0
};

function BinSearchMain(data){

}

function BoxSearchMain(data){
  if(data.type == 'init' && BoxWorkObj.s == 0){
    BoxWorkObj = data.initVal;
	BoxWorkObj.s = 1;
  } if(data.type == 'reset'){
    BoxWorkObj = {x0:0,z0:0,dx:0,dy:0,div:0,s:0};
  } if(data.type == 'btnY' || data.type == 'btnN'){
    t = data.type == 'btnY' ? 1 : 0;
    switch(BoxWorkObj.s){
      case 1:
	    if(t){
          BoxWorkObj.s = 2;
		  BoxWorkObj.dx -= BoxWorkObj.div * BoxWorkObj.dx;
		} else {
          return {
		    type: "Error",
		    data: "No_Player_Found"
		  };
		}
		break;
      case 2:
	    if(t){
          if(BoxWorkObj.dx <= 0){
		    return {
              type: "Error",
			  data: "Player_Always_Exist"
			};
		  } else {
            BoxWorkObj.dx -= BoxWorkObj.div * BoxWorkObj.dx;
		  }
		} else {
		  BoxWorkObj.dx -= BoxWorkObj.div * BoxWorkObj.dx;
		  BoxWorkObj.s = 3;
          BoxWorkObj.x0 = BoxWorkObj.dx;
		  BoxWorkObj.dx = BoxWorkObj.div * BoxWorkObj.dx;
		}
	    break;
      case 3:
	    if(t){
          BoxWorkObj.s = 4;
		  BoxWorkObj.dz -= BoxWorkObj.div * BoxWorkObj.dz;
		} else {
          return {
		    type: "Error",
		    data: "No_Player_Found"
		  };
		}
		break;
      case 4:
	    if(t){
          if(BoxWorkObj.dz <= 0){
		    return {
              type: "Error",
			  data: "Player_Always_Exist"
			};
		  } else {
            BoxWorkObj.dz -= BoxWorkObj.div * BoxWorkObj.dz;
		  }
		} else {
		  BoxWorkObj.dz -= BoxWorkObj.div * BoxWorkObj.dz;
		  BoxWorkObj.s = 1;
          BoxWorkObj.z0 = BoxWorkObj.dz;
		  BoxWorkObj.dz = BoxWorkObj.div * BoxWorkObj.dz;
		}
	    break;
	}

	return {
      type: "success",
      data: BoxWorkObj
	}
  }
}

function DotSearchMain(data){

}
