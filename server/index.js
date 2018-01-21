const express = require('express');
const app = express();
const randToken = require('rand-token');
const cookieParser = require('cookie-parser');
const PORT = 4201;

const CHECK_PLAYER_INTERVAL = 60000;
const PLAYER_TOKEN_NAME = 'authToken';

let playersOnline = {};

app.use(cookieParser());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http\:\/\/127.0.0.1:4200');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/players_online', (req, res) => {
  const token = req.cookies[PLAYER_TOKEN_NAME];
  let playersOnlineCount = Object.keys(playersOnline).length;
  const player = playersOnline[token];

  if (player) {
    player.active = true;
  }

  res.send({playersOnlineCount});
});

app.get('/reactivate', (req, res) => {
  const token = req.cookies[PLAYER_TOKEN_NAME];
  let playersOnlineCount;
  const player = playersOnline[token];

  if (player) {
    player.active = true;
  } else {
    setPlayer(token);
  }

  playersOnlineCount = Object.keys(playersOnline).length;

  res.send({playersOnlineCount});
});

app.get('/register_player', (req, res) => {
  let token = randToken.generate(16);
  let playersOnlineCount;

  while(playersOnline[token]) {
    token = randToken.generate(16);
  }

  setPlayer(token);

  playersOnlineCount = Object.keys(playersOnline).length;

  console.log('register', token);

  res.cookie(PLAYER_TOKEN_NAME, token);
  res.send({playersOnlineCount});
});

function setPlayer(token) {
  playersOnline[token] = {
    active: true,
    timer: setInterval(() => {
      const player = playersOnline[token];

      if (!player.active) {
        clearInterval(player.timer);
        delete playersOnline[token];
      } else {
        player.active = false;
      }
    }, CHECK_PLAYER_INTERVAL)
  };
}

app.listen(PORT, () => {
  console.log(`Listen the port ${PORT}`);
});
