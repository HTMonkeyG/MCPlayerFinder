function DBAM() {
  this.data = [0];
  this.mode = "none";
  this.record = [];
  this.curPtr = 0;
  this.error = null;
  this.functions = {
    Box1010: Box1010Logic
  };
  /* 
    data[0]: State
  */
  this.callback = function () { };
}

DBAM.prototype.listener = function (cb) {
  if (typeof (cb) === 'function')
    this.callback = cb;
  else throw new TypeError("Param 'cb' must be a function, recieved " + typeof (cb))
};

DBAM.prototype.messager = function (msg) {
  switch (msg.type) {
    // Initialize msg
    case 'init':
      this.mode = msg.mode;
      this.data = [0];
      this.record = [];
      break;
    // Give an input
    case 'input':
      // this.data: data register,
      // msg.code: a symbol of input,
      // msg.data: additional data
      if (!(this.mode === 'none'))
        this.functions[this.mode].call(this, this.data, msg.code, msg.data, this.callback);
      else if(this.mode === 'error')
        this.callback(this.error);
      break;
  }
};

function Box1010Logic(reg, code, data, cb) {
  function drCalc(x) {
    var a = Math.pow(10, Math.floor(Math.log10(x)) - 1),
      b = Math.floor(x / a), r;  // Get the highest 2 digits
    b > 10 ? (r = a * 10) : (r = a);
    return r;
  }
  /**
   * data register structure
   * [1]: x
   * [2]: z
   * [3]: dx
   * [4]: dz
   * dx must be larger than 1, so as dz
   * [5]: drx, if the highest 2 digits is 10,
   *      then drx = total digit number - 1;
   *      else the total digit number
   * [6]: drz, so as drx
   */
  var TABLE = {
    // Initial state (nothing)
    "0": {
      // Initialize
      "0": function (a, b, cb) {
        a[1] = Math.floor(b.x);
        a[2] = Math.floor(b.z);
        a[3] = Math.floor(b.dx);
        a[4] = Math.floor(b.dz);

        a[5] = drCalc(a[3]);
        a[6] = drCalc(a[4]);

        a[5] > a[6] ? (a[0] = 3) : (a[0] = 4); // Maximum dr first

        cb({
          type: "snapshot",
          data: a.slice(0)
        })
      }
    },
    // Reduce X state
    "1": {
      // Yes
      "0": function (a, b, cb) {
        if (a[3] - a[5] <= 0) {
          // Recalculate dr
          a[5] = drCalc(a[3]);
          a[6] = drCalc(a[4]);

          a[5] > a[6] ? (a[0] = 3) : (a[0] = 4); // Maximum dr first

          this.record.push(a.slice(0));
          this.curPtr++;
          cb({
            type: "snapshot",
            data: a.slice(0)
          })
        } else {
          this.record.push(a.slice(0));
          this.curPtr++;
          a[3] -= a[5];
          cb({
            type: "snapshot",
            data: a.slice(0)
          })
        }
      },
      // No
      "1": function (a, b, cb) {
        if (a[3] - a[5] < 0) {
          cb({
            type: "error",
            msg: "Player escaped",
            data: a.slice(0),
            errno: 2
          })
        } else {
          this.record.push(a.slice(0));
          this.curPtr++;

          a[1] += a[3];
          a[3] = a[5];

          a[5] = drCalc(a[3]);
          a[6] = drCalc(a[4]);

          a[5] > a[6] ? (a[0] = 3) : (a[0] = 4); // Maximum dr first

          cb({
            type: "snapshot",
            data: a.slice(0)
          })
        }
      }
    },
    // Reduce Z state
    "2": {
      // Yes
      "0": function (a, b, cb) {
        if (a[4] - a[6] <= 0) {
          // Recalculate dr
          a[5] = drCalc(a[3]);
          a[6] = drCalc(a[4]);

          a[5] > a[6] ? (a[0] = 3) : (a[0] = 4); // Maximum dr first

          this.record.push(a.slice(0));
          this.curPtr++;
          cb({
            type: "snapshot",
            data: a.slice(0)
          })
        } else {
          this.record.push(a.slice(0));
          this.curPtr++;
          a[4] -= a[6];
          cb({
            type: "snapshot",
            data: a.slice(0)
          })
        }
      },
      // No
      "1": function (a, b, cb) {
        if (a[4] - a[6] < 0 /*a[6]*/) {
          cb({
            type: "error",
            msg: "Player escaped",
            data: a.slice(0),
            errno: 2
          })
        } else {
          this.record.push(a.slice(0));
          this.curPtr++;

          a[2] += a[4];
          a[4] = a[6];

          a[5] = drCalc(a[3]);
          a[6] = drCalc(a[4]);

          a[5] > a[6] ? (a[0] = 3) : (a[0] = 4); // Maximum dr first

          cb({
            type: "snapshot",
            data: a.slice(0)
          })
        }
      }
    },
    // Reduce X transport state
    "3": {
      // Yes
      "0": function (a, b, cb) {
        if (a[3] - a[5] <= 0) {
          // Recalculate dr
          a[5] = drCalc(a[3]);
          a[6] = drCalc(a[4]);

          a[5] > a[6] ? (a[0] = 3) : (a[0] = 4); // Maximum dr first

          this.record.push(a.slice(0));
          this.curPtr++;
          cb({
            type: "snapshot",
            data: a.slice(0)
          })
        } else {
          this.record.push(a.slice(0));
          this.curPtr++;
          a[3] -= a[5];
          a[0] = 1;
          cb({
            type: "snapshot",
            data: a.slice(0)
          })
        }
      },
      // No
      "1": function (a, b, cb) {
        cb({
          type: "error",
          msg: "Player escaped",
          data: a.slice(0),
          errno: 2
        })
      }
    },
    // Reduce Z transport state
    "4": {
      // Yes
      "0": function (a, b, cb) {
        if (a[4] - a[6] <= 0) {
          // Recalculate dr
          a[5] = drCalc(a[3]);
          a[6] = drCalc(a[4]);

          a[5] > a[6] ? (a[0] = 3) : (a[0] = 4); // Maximum dr first

          this.record.push(a.slice(0));
          this.curPtr++;
          cb({
            type: "snapshot",
            data: a.slice(0)
          })
        } else {
          this.record.push(a.slice(0));
          this.curPtr++;
          a[4] -= a[6];
          a[0] = 2;
          cb({
            type: "snapshot",
            data: a.slice(0)
          })
        }
      },
      // No
      "1": function (a, b, cb) {
        cb({
          type: "error",
          msg: "Player escaped",
          data: a.slice(0),
          errno: 2
        })
      }
    },
  };

  if (TABLE[reg[0]][code]) TABLE[reg[0]][code].call(this, reg, data, cb);
  else cb({
    type: "error",
    msg: "Rejected input",
    errno: 1
  })
}