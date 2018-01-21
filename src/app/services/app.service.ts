import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'angular2-cookie/core';

import { ShipType } from '../enums/ship-type';
import { IShipType } from '../interfaces/ship-type';

@Injectable()
export class AppService {
  get playersOnline() { return this._playersOnline; }
  get size() { return this._size; }
  get shipSet() { return this._ships.slice(); }

  private _ships: IShipType[] = [
    {
      type: ShipType.DShip,
      count: 2
    },
    {
      type: ShipType.LShip,
      count: 1
    },
    {
      type: ShipType.IShip,
      count: 1
    }
  ];
  private _updateInterval = 10000;
  private _playersOnline: number = 0;
  private _baseURL = 'http://localhost:4201';
  private _size = 10;

  constructor(private http: HttpClient, private cookie: CookieService) {
    const token = this.cookie.get('authToken');

    if (token) {
      this.reactivateToken().subscribe((response: {playersOnlineCount}) => {
        this._playersOnline = response.playersOnlineCount;
        this._spyPlayers();
      });
    } else {
      this.registerUser().subscribe((response: {playersOnlineCount}) => {
        this._playersOnline = response.playersOnlineCount;
        this._spyPlayers();
      });
    }
  }

  registerUser() {
    return this.http.get(`${this._baseURL}/register_player`, {withCredentials: true});
  }

  getUsersCount() {
    this.http.get(`${this._baseURL}/players_online`, {withCredentials: true})
      .subscribe((response: {playersOnlineCount}) => {
        this._playersOnline = response.playersOnlineCount;
      });
  }

  reactivateToken() {
    return this.http.get(`${this._baseURL}/reactivate`, {withCredentials: true});
  }

  private _spyPlayers() {
    setInterval(() => {
      this.getUsersCount();
    }, this._updateInterval);
  }
}
