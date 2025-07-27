class Auto {
  constructor() { this.state = 0; this.ctr = 0 }
  getState() { return this.state }
  setState(s) { this.state = s }
  getDone() { return this.state < 0 }
  getFormat() { return this }
  getState() { return this.ctr }
  getInfo() { return { C: this.ctr } }
  next() { this.ctr++; }
  predict() { }
  current() { }
}

typeof module !== "undefined" && module.exports && (module.exports = Auto);