export const state = {
  allPieces: [],
  selectedDateRange: null,
  subscribers: [],

  setPieces(pieces, silent = false) {
    this.allPieces = pieces;
    if (!silent) this.notify();
  },
  
  setDateRange(range) {
    this.selectedDateRange = range;
    this.notify();
  },

  subscribe(fn) {
    this.subscribers.push(fn);
  },

  notify() {
    this.subscribers.forEach(fn => fn(this));
  }
};
