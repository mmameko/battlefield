import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BattleFieldComponent } from '../../components/field/battle-field.component';
import { BattleFieldCellComponent } from '../../components/field-cell/battle-field-cell.component';

import { RepeatDirective } from '../../directives/repeat.directive';

@NgModule({
  imports: [
    CommonModule, FormsModule
  ],
  declarations: [
    BattleFieldComponent,
    BattleFieldCellComponent,
    RepeatDirective
  ],
  exports: [ RepeatDirective, BattleFieldComponent ]
})
export class BattleFieldModule {}
