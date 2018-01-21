export abstract class Ship {
  isSunk = false;
  cellIDs = [];
  battleCells = [];
  cells;

  protected injured = [];

  constructor(public size: number, filledCells) {
    let id;
    let isEmpty = false;

    while (!isEmpty) {
      id = this.getRandom(0, this.size * this.size - 1);
      isEmpty = this.isEmpty(id, filledCells);
    }

    this.cellIDs = this.getBodyCells(id);
  }

  abstract getAroundCells(id: number);
  abstract getBodyCells(id);

  public setInjured(id) {
    this.setVisited(id);
    this.injured.push(id);
    return this.checkSunk();
  }
  public checkSunk() {
    this.isSunk = this.cellIDs.length === this.injured.length;

    return this.isSunk ? this.cells : null;
  }
  public setVisited(id) {
    this.battleCells.forEach((cell) => {
      if (cell.id === id) {
        cell.isVisited = true;
      }
    });
  }
  public isEmpty(id: number, filledCells: number[]) {
    const cells = this.getAroundCells(id);
    let isEmpty = !!cells.length;

    cells.forEach((cell) => {
      if (filledCells.indexOf(cell) !== -1) {
        isEmpty = false;
      }
    });

    return isEmpty;
  }
  protected filterAroundCells(cells) {
    return cells.filter((cell) => {
      const [r, c] = cell;
      return (r >= 0 && r < this.size) && (c >= 0 && c < this.size);
    }).map((cell) => {
      const [r, c] = cell;
      return r * this.size + c;
    });
  }
  protected getRandom(min, max) { return Math.floor(min + Math.random() * (max - min)); }
}
