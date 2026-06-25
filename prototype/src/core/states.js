class State {
  constructor() {
    this.allPieces = [];
    this.selectedDateRange = null;
    this.statusFilter = 'all';
    this.subscribers = [];
  }

  setPieces(pieces, silent = false) {
    this.allPieces = pieces;
    if (!silent) this.notify();
  }

  setDateRange(range) {
    this.selectedDateRange = range;
    this.notify();
  }

  setStatusFilter(filter) {
    this.statusFilter = filter;
    this.notify();
  }

  subscribe(fn) {
    this.subscribers.push(fn);
  }

  notify() {
    this.subscribers.forEach(fn => fn(this));
  }
}

export const state = new State();

