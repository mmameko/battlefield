import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'angular2-cookie/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/content/content.component';

import { AppService } from './services/app.service';

import { PlayerService } from './services/player.service';
import { ForeingService } from './services/foreing.service';
import { GameService } from './services/game.service';
import { BattleFieldComponent } from './components/field/battle-field.component';
import { BattleFieldCellComponent } from './components/field-cell/battle-field-cell.component';
import { RepeatDirective } from './directives/repeat.directive';

export function opponentFactory(isProd, appService) {
  return isProd ? new ForeingService() : new PlayerService(appService);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    BattleFieldComponent,
    BattleFieldCellComponent,
    RepeatDirective
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [
    AppService,
    CookieService,
    {
      provide: 'IS_PROD',
      useValue: false
    },
    {
      provide: 'OwnerService',
      useClass: PlayerService
    },
    {
      provide: 'ForeignerService',
      useFactory: opponentFactory,
      deps: ['IS_PROD', AppService]
    },
    GameService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
