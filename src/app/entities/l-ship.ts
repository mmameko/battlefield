import { Ship } from './ship';

export class LShip extends Ship {
  constructor(public size: number, filledCells) {
    super(size, filledCells);
  }

  getAroundCells(id) {
    const row = Math.floor(id / this.size);
    const col = id % this.size;
    const bodyCells = this.getBodyCells(id);
    let counter = bodyCells.length;

    this.cells = [
      [row - 1, col - 2],
      [row - 1, col - 1],
      [row - 1, col],
      [row - 1, col + 1],
      [row, col - 2],
      [row, col - 1],
      [row, col],
      [row, col + 1],
      [row + 1, col - 2],
      [row + 1, col - 1],
      [row + 1, col],
      [row + 1, col + 1],
      [row + 2, col - 1],
      [row + 2, col],
      [row + 2, col + 1]
    ];

    this.cells = this.filterAroundCells(this.cells);

    this.cells.forEach((cellId) => {
      if (bodyCells.indexOf(cellId) !== -1) {
        counter--;
      }
    });

    return counter ? [] : this.cells;
  }

  getBodyCells(id) {
    const row = Math.floor(id / this.size);
    const col = id % this.size;

    return [
      row * this.size + col - 1,
      id,
      (row + 1) * this.size + col
    ];
  }
}
