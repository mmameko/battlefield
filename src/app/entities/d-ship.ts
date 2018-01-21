import { Ship } from './ship';

export class DShip extends Ship {
  constructor(public size: number, filledCells: number[]) {
    super(size, filledCells);
  }

  getAroundCells(id) {
    const row = Math.floor(id / this.size);
    const col = id % this.size;

    this.cells = [
      [row - 1, col - 1],
      [row - 1, col],
      [row - 1, col + 1],
      [row, col - 1],
      [row, col],
      [row, col + 1],
      [row + 1, col - 1],
      [row + 1, col],
      [row + 1, col + 1]
    ];

    this.cells = this.filterAroundCells(this.cells);

    return this.cells;
  }

  getBodyCells(id) {
    return [id];
  }
}
