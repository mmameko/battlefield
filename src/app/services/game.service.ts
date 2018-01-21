import { Injectable, Inject } from '@angular/core';
import {Ship} from '../entities';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class GameService {
  get isReady() {
    return this.ownerService.isReady() && this.foreignerService.isReady();
  }
  get isGameStarted() { return this._isGameStarted; }
  get couldOwnerStep() { return this._isOwnerStep; }

  public game: Subject<any>;

  public ownerShips: Ship[];
  public foregnerShips: Ship[];

  private _isGameStarted = false;
  private _isOwnerStep = false;

  constructor(@Inject('IS_PROD') private isProd,
              @Inject('OwnerService') private ownerService,
              @Inject('ForeignerService') private foreignerService) {}

  generateRandomShips() {
    this.ownerShips = this.ownerService.generateShips();

    // If it's a dev mode we can don't to update generated ships for foreigner
    if (!this.isProd && !this.foreignerService.isReady()) {
      this.foregnerShips = this.foreignerService.generateShips();
    }
  }

  startGame() {
    this._isGameStarted = true;
    this._isOwnerStep = true;

    if (this.game) {
      this.game.unsubscribe();
    }

    this.game = new Subject();

    this.game.subscribe(
      (value) => {
        if (this._isOwnerStep) {
          if (!value) {
            setTimeout(() => {
              this._isOwnerStep = false;
              this.foreignerStep();
            }, 500);
          }
        } else {
          if (value) {
            this.foreignerStep();
          } else {
            this._isOwnerStep = true;
          }
        }
      },
      () => {},
      () => {
        if (this._isOwnerStep) {
          alert('You WIN!!!');
        } else {
          alert('You LOSE!!!');
        }

        this.ownerService.clear();

        if (!this.isProd) {
          this.foreignerService.clear();
        }

        this._isGameStarted = false;
        this._isOwnerStep = false;
      }
    );
  }

  ownerStep(id) {
    const result = this.foreignerService.checkCell(id);
    let isLost;

    if (result) {
      isLost = this.foreignerService.isLost();

      if (isLost) {
        this.game.complete();
        return;
      }
    }

    this.game.next(result);
  }

  foreignerStep() {
    // Just to see the results
    setTimeout(() => {
      const id = this.foreignerService.next();
      const result = this.ownerService.checkCell(id);
      let isLost;

      if (result) {
        isLost = this.ownerService.isLost();

        if (isLost) {
          this.game.complete();
          return;
        }
      }

      this.game.next(result);
    }, 1000);
  }
}
