const RadiusTooSmall = '当前半径已经足够小了，\n再往下误差就会变大了qwq，\n建议转用游戏内方法进行更精确定位。';
const PlayerNotFound1 = 'Oops! 玩家似乎消失了。\n可能他离开了你所在的维度。\n复位重新查找试试？\n可以把初值设为玩家消失之前的圆心半径减少耗时哦 :D';
const PlayerNotFound2 = 'Oops! 玩家似乎消失了。\n可能他不在你所在的维度。\n复位重新查找试试？';
const PosSyntaxError = '坐标和范围格式似乎错了qwq';
/* 数据存储变量 */
var step = 0
  , active = false;

var c223;

var command = document.getElementById('result'),
  monitor = document.getElementById('monitor');

command.value = "-";
monitor.value = "-";

document.getElementById("result").onclick = function (e) {
  if (!c223 || c223.getDone())
    return;
  if (this.active) {
    this.select();
    document.execCommand('Copy');
  } else {
    this.active = true;
    let a = this;
    window.setTimeout(function () {
      a.active = false
    }, 200);
  }
};

function changeInitPos() {
  let initPosObj = document.getElementById('initPos');
  let str = initPosObj.value;
  str = str.replace(/\s/g, '').match(/^(\([0-9]+\,[0-9]+\))$/);
  if (str) {
    let _pos = str[0].match(/[0-9]+/g);
    return [Number(_pos[0]), Number(_pos[1])];
  } else {
    alert(PosSyntaxError);
    return !1;
  }
}

function changeInitRange() {
  let initRangeObj = document.getElementById('initRange');
  let str = initRangeObj.value;
  if (!isNaN(Number(str))) {
    return Number(str);
  } else {
    alert(PosSyntaxError);
    return !1;
  }
}

function startBtnClick() {
  if (!c223 || c223.getDone()) {
    init();
  } else {
    if (!active) {
      active = true;
      setTimeout(() => { active = false; }, 200);
    } else {
      reset();
    }
  }
}

function init() {
  let r = changeInitRange();
  let p = changeInitPos();
  if (r && p) {
    document.getElementById('ctrl').innerHTML = '双击复位';
    c223 = new AutoC223(p[0] - r, p[0] - r, 2 * r, 2 * r);
    command.value = c223 + "";
    dsblValueInput();
  }
}

function reset() {
  document.getElementById('ctrl').innerHTML = '开始查找';
  command.value = "-";
  monitor.value = "-";
  c223 = null;

  enblValueInput();
}

function listener(a) {
  var v = c223.next(a);
  if (!v.done) {
    command.value = c223 + "";
    //monitor.value = `T(${a.data[1] + a.data[3] / 2}, ${a.data[2] + a.data[4] / 2}), R = ${Math.max(a.data[3], a.data[4])}`;
    //if (Math.max(a.data[3], a.data[4]) <= 100) alert(RadiusTooSmall);
  } else {
    switch (c223.state) {
      case -1:
        alert("检测到玩家逃逸");
        break;
      case -2:
        alert("参数无效");
        break;
      case -3:
        alert("已达到目标精度");
        break;
    }
  }
}

function enblValueInput() {
  document.getElementById("initPos").readOnly = false;
  document.getElementById("initRange").readOnly = false;
  document.getElementById("initPos").classList.remove("dsblTextBox1");
  document.getElementById("initRange").classList.remove("dsblTextBox1");
}

function dsblValueInput() {
  document.getElementById("initPos").readOnly = true;
  document.getElementById("initRange").readOnly = true;
  document.getElementById("initPos").classList.add("dsblTextBox1");
  document.getElementById("initRange").classList.add("dsblTextBox1");
}