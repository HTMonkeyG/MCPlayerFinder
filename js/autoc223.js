typeof Auto === "undefined" && typeof require !== "undefined" && (Auto = require("./auto.js"))

/** Return the pow of 10 with the same number of digits */
function powOf10(x) { return 10 ** Math.floor(Math.log10(x)) }

/** Return the most significant digit */
function mostSignificantDigit(x) { return Math.floor(x / powOf10(x)) }

/** Calc delta */
function getDeltaFrom(x) {
  var t = x, u;
  t /= u = powOf10(t);
  return t > 1 ? u : u / 10;
}

class AutoC223 extends Auto {
  /**
   * Copies an automaton from given object
   * @param {AutoC223} o 
   * @returns 
   */
  static from(o) {
    var a = new AutoC223(o.x, o.z, o.dx, o.dz, o.p);
    a.last = o.last;
    a.delta = o.delta;
    a.ctr = o.ctr;
    a.setState(o.getState());
    return a
  }

  /**
   * Init
   * @param {Number} x - Initial x
   * @param {Number} z - Initial z
   * @param {Number} dx - Initial dx
   * @param {Number} dz - Initial dz
   * @param {Number|undefined} p - Final precision
   */
  constructor(x, z, dx, dz, p) {
    super();
    this.x = x;
    this.z = z;
    this.dx = dx;
    this.dz = dz;
    this.p = typeof p === "undefined" ? 100 : p;
    this.delta = 0;
    this.last = 0;
    this.init = Math.abs(dx * dz);
  }

  updateDelta(x) {
    var t = x, u;
    t /= u = powOf10(t);
    // Reject: invalid param
    if (Number.isNaN(u)) this.setState(-2);
    this.delta = t > 1 ? u : u / 10;
  }

  getFormat() {
    return {
      x: this.x, z: this.z,
      dx: this.dx, dz: this.dz
    }
  }

  getInfo() {
    return {
      N: Math.log2(this.dx * this.dz / this.init) / this.ctr,
      C: this.ctr
    }
  }

  checkPrecision(equ) {
    return equ ? Math.hypot(this.dx, this.dz) <= this.p : Math.hypot(this.dx, this.dz) < this.p
  }

  /**
   * Next state
   * @param {Boolean} i - Input, true if player is in the last area.
   * @returns 
   */
  next(i) {
    switch (this.state) {
      // Ensure and direction decide
      case 0:
        // Reject: player escaped
        if (!i) { this.setState(-1); break; }
        // Accept: reached expected precision
        if (this.checkPrecision()) { this.setState(-3); break; }
        this.last = 0;
        this.setState(this.dx > this.dz ? 1 : 2);
        this.updateDelta(Math.max(this.dx, this.dz));
        this.next(1);
        break;
      // Reduce X #1
      case 1:
        var v = this.dx == this.delta
          , w = Math.trunc(this.dx / this.delta);
        // Accept: reached expected precision
        if (this.checkPrecision()) { this.setState(-3); break; }
        if (i) {
          // If dx is pow of 10,
          // then separate 1 (10) into two parts,
          // else minus the highest 1
          if (w == 10)
            this.dx -= this.last = 5 * this.delta;
          else if (w == 1)
            this.dx -= this.last = v ? (this.setState(0), 0) : (this.setState(3), this.delta), v && this.next(1);
          // Separate 5 into 2 and 3
          else if (w == 5)
            this.dx -= this.last = 3 * this.delta;
          // Not 5 nor 1 or 10, then just minus 1
          else
            this.dx -= this.last = this.delta;
        } else {
          // Reject: player escaped
          if (!this.last) { this.setState(-1); break; }
          this.x += this.dx;
          this.dx = this.last;
          this.last == this.delta && this.setState(0);
          this.last = 0;
        }
        // Accept: reached expected precision
        if (this.checkPrecision()) { this.setState(-3); break; }
        break;
      // Reduce Z #1
      case 2:
        var v = this.dz == this.delta
          , w = Math.trunc(this.dz / this.delta);
        if (i) {
          // If dz is pow of 10,
          // then separate 1 (10) into two parts,
          // else minus the highest 1
          if (w == 10)
            this.dz -= this.last = 5 * this.delta;
          else if (w == 1)
            this.dz -= this.last = v ? (this.setState(0), 0) : (this.setState(4), this.delta), v && this.next(1);
          // Separate 5 into 2 and 3
          else if (w == 5)
            this.dz -= this.last = 3 * this.delta;
          // Not 5 nor 1 or 10, then just minus 1
          else
            this.dz -= this.last = this.delta;
        } else {
          // Reject: player escaped
          if (!this.last) { this.setState(-1); break; }
          this.z += this.dz;
          this.dz = this.last;
          this.last == this.delta && this.setState(0);
          this.last = 0;
        }
        // Accept: reached expected precision
        if (this.checkPrecision(1)) { this.setState(-3); break; }
        break;
      // Reduce X #2
      case 3:
        if (i) this.setState(0), this.next(1);
        else {
          // Reject: player escaped
          if (!this.last) { this.setState(-1); break; }
          this.x += this.dx;
          this.dx = this.last;
          this.last = 0;
          this.setState(0);
        }
        // Accept: reached expected precision
        if (this.checkPrecision(1)) { this.setState(-3); break; }
        break;
      // Reduce Z #2
      case 4:
        if (i) this.setState(0), this.next(1);
        else {
          // Reject: player escaped
          if (!this.last) { this.setState(-1); break; }
          this.z += this.dz;
          this.dz = this.last;
          this.last = 0;
          this.setState(0);
        }
        // Accept: reached expected precision
        if (this.checkPrecision(1)) { this.setState(-3); break; }
        break;
    }

    this.getDone() || this.ctr++;

    return {
      value: this,
      done: this.getDone()
    }
  }

  /**
   * Predict next state with given input
   * @param {Boolean} i - Input
   * @returns 
   */
  predict(i) { return AutoC223.from(this).next(i); }

  toString() {
    switch (this.state) {
      case -1:
        return "/w @s Rejected: Player escaped."
      case -2:
        return "/w @s Rejected: Invalid param."
      case -3:
        return "/w @s Accepted: Reached expected precision."
    }
    return `/w @s @a[y=-64,dy=1000,x=${this.x},z=${this.z},dx=${this.dx},dz=${this.dz}]`
  }
}

typeof module !== "undefined" && module.exports && (module.exports = AutoC223);