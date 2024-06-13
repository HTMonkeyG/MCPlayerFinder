const RadiusTooSmall = '当前半径已经足够小了，\n再往下误差就会变大了qwq，\n建议转用游戏内方法进行更精确定位。';
const PlayerNotFound1 = 'Oops! 玩家似乎消失了。\n可能他离开了你所在的维度。\n复位重新查找试试？\n可以把初值设为玩家消失之前的圆心半径减少耗时哦 :D';
const PlayerNotFound2 = 'Oops! 玩家似乎消失了。\n可能他不在你所在的维度。\n复位重新查找试试？';
const PosSyntaxError = '坐标和范围格式似乎错了qwq';
/* 数据存储变量 */
var step = 0,
  workObj = new DBAM(),
  elderWObj = workObj,
  active = false;

var Out = document.getElementById('result'),
  monitor = document.getElementById('monitor');

Out.value = "-";
monitor.value = "-";

document.getElementById("result").onclick = function (e) {
  if (!workObj.data[0]) return;
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

function listener(a) {
  if (a.type === "snapshot") {
    Out.value = genCmd(a.data[1], a.data[2], a.data[1] + a.data[3], a.data[2] + a.data[4]);
    monitor.value = `T(${a.data[1] + a.data[3] / 2}, ${a.data[2] + a.data[4] / 2}), R = ${Math.max(a.data[3], a.data[4])}`;
    if (Math.max(a.data[3], a.data[4]) <= 100) alert(RadiusTooSmall);
  } else if (a.type === "error") {
    if (a.errno == 2) {
      alert(PlayerNotFound1);
    }
  }
}

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
  if (!workObj.data[0]) {
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

    workObj.listener(listener);
    workObj.messager({ type: "init", mode: "Box1010" });
    workObj.messager({ type: "input", code: 0, data: { x: p[0] - r, z: p[0] - r, dx: 2 * r, dz: 2 * r } });

    dsblValueInput();
  }
}

function reset() {
  document.getElementById('ctrl').innerHTML = '开始查找';
  Out.value = "-";
  monitor.value = "-";
  workObj = new DBAM();

  enblValueInput();
}

function Y() {
  workObj.messager({ type: "input", code: 0 });
}

function N() {
  workObj.messager({ type: "input", code: 1 });
}

function genCmd(xl, zl, xr, zr) {
  let a = Math.min(xl, xr),
    b = Math.max(xl, xr),
    c = Math.min(zl, zr),
    d = Math.max(zl, zr);

  if (a == b || c == d) return !1;

  return `/w @s @a[x=${a},y=-64,z=${c},dx=${b - a - 1},dy=1024,dz=${d - c - 1}]`;
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