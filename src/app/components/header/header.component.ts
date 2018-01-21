import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';
import {GameService} from '../../services/game.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.css' ]
})
export class HeaderComponent {
  get playersOnline() {
    return this.appService.playersOnline;
  }

  get allowFillBattleField() { return !this.gameService.isGameStarted; }

  menuOpened = false;

  constructor(private appService: AppService,
              private gameService: GameService) {}

  openMobileMenu() {
    this.menuOpened = !this.menuOpened;
  }

  createRandomShips() {
    console.log('create random ships');
    this.gameService.generateRandomShips();
  }
}
