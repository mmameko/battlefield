import {Component} from '@angular/core';

import { BattleFieldType } from '../../enums/battle-field-type';
import { AppService } from '../../services/app.service';
import {GameService} from '../../services/game.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: [ './content.component.css' ]
})
export class ContentComponent {
  get own() { return BattleFieldType.OWN; }
  get alien() { return BattleFieldType.FOREIGN; }
  get isReady() { return !this.gameService.isGameStarted && this.gameService.isReady; }
  get ownerShips() { return this.gameService.ownerShips; }
  get foregnerShips() { return this.gameService.foregnerShips; }
  get allowStep() { return this.gameService.couldOwnerStep; }
  get gameStarted() { return this.gameService.isGameStarted; }

  constructor(private appService: AppService, private gameService: GameService) {}

  startGame() {
    this.gameService.startGame();
  }

  selectCell(id) {
    this.gameService.ownerStep(id);
  }
}
