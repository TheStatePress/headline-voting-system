import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import sqlite from 'sqlite';
import socket from 'socket.io';
import { indexBy, trim } from 'ramda';
import cors from 'cors';

const app = express();
const server = http.Server(app);
const io = socket(server);
const dbPromise = sqlite.open('./data.db');

app.use(bodyParser.json());
app.use(cors({
  origin: true,
  credentials: true
}));

const setupDb = async () => {
  const db = await dbPromise;
  const clear = false;
  if (clear) {
    await Promise.all([
      db.run('DROP TABLE IF EXISTS headlines;'),
      db.run('DROP TABLE IF EXISTS votes;'),
      db.run('DROP TABLE IF EXISTS users;'),
    ]);
    console.log('cleared tables');
  };
  await db.run('CREATE TABLE IF NOT EXISTS headlines (id INTEGER PRIMARY KEY, headline STRING NOT NULL, userid INTEGER NOT NULL);');
  await db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email STRING NOT NULL);');
  await db.run('CREATE TABLE IF NOT EXISTS votes (id INTEGER PRIMARY KEY, userid INTEGER NOT NULL, headlineid INTEGER NOT NULL, FOREIGN KEY(userid) REFERENCES users(id), FOREIGN KEY(headlineid) REFERENCES headlines(id));');
  const tables = await db.all('SELECT name FROM sqlite_master WHERE type="table"');
  console.log(tables);
}

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.get('/headlines', async (req, res) => {
  const db = await dbPromise;
  const headlines = await db.all('SELECT headlines.headline, headlines.id, users.email, ( SELECT COUNT(*) FROM votes WHERE votes.headlineid = headlines.id ) as votes FROM headlines LEFT JOIN users ON headlines.userid = users.id');
  res.json(indexBy(headline => headline.id, headlines));
});

app.post('/headlines', async (req, res) => {
  debugger;
  const { headline, user: email } = req.body;
  const db = await dbPromise;
  let userid = await db.get('SELECT id FROM users WHERE email=?', trim(email));
  console.log(email);
  if(!userid) {
    await db.run('INSERT INTO users (email) VALUES (?)', email);
    userid = await db.get('SELECT id FROM users WHERE email=?', trim(email));
  };
  await db.run('INSERT INTO headlines ( headline, userid ) VALUES (?, ?);', headline, userid.id);
  res.status(200).send();
});

app.get('/headlines/:id', async (req, res) => {
  const db = await dbPromise;
  const headline = await db.get('SELECT * FROM headlines WHERE id=?', req.params.id);
  res.json(headline);
});

app.post('/headlines/:id', async (req, res) => { });

app.use(express.static('../client/build/'));

app.use((req, res) => {
  res.sendFile('../client/build/index.html');
})

server.listen(8080, function () {
  setupDb();
  console.log('http://localhost:8080')
});