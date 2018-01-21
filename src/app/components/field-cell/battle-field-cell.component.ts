import {Component, Input} from '@angular/core';

import { Ship } from '../../entities/index';
import { BattleFieldType } from '../../enums/battle-field-type';

@Component({
  selector: 'battle-field-cell',
  template: `
    <div #cell
         [attr.data-id]="id"
         [ngClass]="{'battle-field-cell-alien-empty' : applyAlienEmptyCls(),
                     'battle-field-cell-alien-sunk' : applyAlienSunkCls(),
                     'battle-field-cell-own-ship': applyOwnShipCls(),
                     'battle-field-cell-own-empty' : applyOwnEmptyCls(),
                     'battle-field-cell-sunk': applyShipSunk(),
                     'battle-field-cell-own-sunk' : applyOwnSunkCls() }"
         class="battle-field-cell"></div>
  `,
  styleUrls: [ './battle-field-cell.component.css' ]
})
export class BattleFieldCellComponent {
  @Input() id: number;
  @Input()
  set isEmpty(v: boolean) {
    this._isEmpty = v;
  }
  get isEmpty() {
    const empty = this._isEmpty;
    return empty;
  }
  @Input()
  set type(v: number) {
    this._isOwn = v === BattleFieldType.OWN;
  }

  ship: Ship;

  set isVisited(v) { this._isVisited = v; }
  get isVisited() {
    const visited = this._isVisited;
    return visited;
  }

  private _isOwn = false;
  private _isEmpty = true;
  private _isVisited = false;

  initCell() {
    this._isVisited = false;
    this._isEmpty = true;
  }

  checkCell() {
    this._isVisited = true;
  }

  applyAlienEmptyCls() { return !this._isOwn && this._isVisited && this.isEmpty; }

  applyAlienSunkCls() { return !this._isOwn && this._isVisited && !this.isEmpty; }

  applyOwnEmptyCls() { return this._isOwn && this._isVisited && this.isEmpty; }

  applyOwnSunkCls() { return this._isOwn && this._isVisited && !this.isEmpty; }

  applyOwnShipCls() { return this._isOwn && !this._isVisited && !this.isEmpty; }

  applyShipSunk() { return this.ship && this.ship.isSunk; }
}
