import { Injectable } from '@angular/core';
import { AppService } from './app.service';

import { Ship, IShip, LShip, DShip } from '../entities';
import { IShipType } from '../interfaces/ship-type';
import { ShipType } from '../enums/ship-type';
import { getRandom } from '../utils/utilities';

@Injectable()
export class PlayerService {
  get ships() { return this._ships; }

  public battleCells;
  private _ships: Ship[] = [];
  private _filledCells: number[] = [];
  private _visitedCells: number[] = [];

  constructor(private appService: AppService) {}

  generateShips(): Ship[] {
    const size = this.appService.size;

    this.clear();

    this.appService.shipSet.forEach((kind: IShipType) => {
      let ship: Ship;
      const { count, type } = kind;

      for (let i = 0; i < count; i++) {
        ship = null;
        switch (type) {
          case ShipType.DShip: {
            ship = new DShip(size, this._filledCells);
            break;
          }
          case ShipType.LShip: {
            ship = new LShip(size, this._filledCells);
            break;
          }
          case ShipType.IShip: {
            ship = new IShip(size, this._filledCells);
            break;
          }
        }

        if (ship) {
          this._ships.push(ship);
          this.updateFilledCells(ship);
        }
      }
    });

    return this._ships;
  }

  getShips(): Ship[] { return this._ships.slice(); }

  checkCell(id: number): boolean {
    const result = this._filledCells.indexOf(id) !== -1;

    if (result) {
      this._ships.filter(ship => !ship.isSunk).forEach((ship) => {
        const cellIDs = ship.cellIDs;
        const isExist = cellIDs.indexOf(id) !== -1;
        let aroundCells;

        if (isExist) {
          aroundCells = ship.setInjured(id);
          if (aroundCells) {
            aroundCells.forEach((aCell) => {
              const cell = this.battleCells.find((c) => c.id === aCell);

              cell.isVisited = true;
              this._visitedCells.push(aCell);
            });
          }
        }
      });
    } else {
      if (this.battleCells) {
        const cell = this.battleCells.find((c) => c.id === id);

        cell.isVisited = true;
      }
    }

    return result;
  }

  next() {
    const size = this.appService.size;
    let isExist = true;
    let id;

    while (isExist) {
      id = getRandom(0, size * size - 1);
      isExist = this._visitedCells.indexOf(id) !== -1;
    }

    this._visitedCells.push(id);

    return id;
  }

  clear() {
    this._ships = [];
    this._filledCells = [];
    this._visitedCells = [];
  }

  isReady() { return !!this._ships.length; }

  isLost() {
    let allSunk = true;

    this._ships.forEach((ship) => {
      if (!ship.isSunk) {
        allSunk = false;
      }
    });

    return allSunk;
  }

  private updateFilledCells(ship: Ship) {
    this._filledCells = this._filledCells.concat(ship.cellIDs);
  }
}
