import {Component, EventEmitter, Injector, Input, Output, ViewChildren} from '@angular/core';

import { BattleFieldCellComponent } from '../field-cell/battle-field-cell.component';
import { BattleFieldType } from '../../enums/battle-field-type';

@Component({
  selector: 'battle-field',
  styleUrls: [ './battle-field.component.css' ],
  templateUrl: './battle-field.component.html'
})
export class BattleFieldComponent {
  @ViewChildren(BattleFieldCellComponent) cells;

  @Output('select') selectEvent = new EventEmitter();

  @Input() type: number = BattleFieldType.OWN;
  @Input() set allowStep(v: boolean) {
    this._allowStep = v;
  }
  get allowStep() { return this._allowStep; }
  @Input() set ships(ships) {
    if (ships && ships.length) {
      this._ships = ships;
      this.proceedShips();
    }
  };
  get ships() { return this._ships; }

  alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  private _ships = [];
  private _allowStep;

  get size() { return this.alphabet.length; }

  constructor(private injector: Injector) {}

  clickField(e) {
    if (this.type === BattleFieldType.OWN || !this.allowStep) {
      return;
    }

    const { target } = e;
    const id = +target.dataset.id;
    const cell = this.getCellById(id);

    if (!cell.isVisited) {
      cell.checkCell();
      this.selectEvent.emit(id);
    }
  }

  getCellById(id) {
    return this.cells.find((c, index) => index === id);
  }

  clearField() {
    this.cells.forEach((cell) => { cell.initCell(); });
  }

  proceedShips() {
    const service = this.injector.get(this.type === BattleFieldType.OWN ? 'OwnerService' : 'ForeignerService');

    this.clearField();
    this.ships.forEach((ship) => {
      const { cellIDs } = ship;
      let cell;

      for (let id = 0; id < cellIDs.length; id++) {
        cell = this.getCellById(cellIDs[id]);
        cell.isEmpty = false;
        ship.battleCells.push(cell);
        cell.ship = ship;
      }
    });

    service.battleCells = this.cells;
  }

  isEmpty(id) {
    return this.ships.indexOf(id) === -1;
  }
}
