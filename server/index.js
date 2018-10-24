import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import sqlite from 'sqlite';
import socket from 'socket.io';
import { indexBy, prop, trim } from 'ramda';
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
  await db.run('CREATE TABLE IF NOT EXISTS votes (id INTEGER PRIMARY KEY, userid INTEGER NOT NULL, headlineid INTEGER NOT NULL, direction INTEGER, FOREIGN KEY(userid) REFERENCES users(id), FOREIGN KEY(headlineid) REFERENCES headlines(id));');
  const tables = await db.all('SELECT name FROM sqlite_master WHERE type="table"');
  console.log(tables);
}

io.on('connection', (socket) => {
  console.log('a user connected');
});

const getVotes = async(id) => {
  const db = await dbPromise;
  const votes = await db.get('SELECT ( SELECT COALESCE( SUM(direction), 0) FROM votes WHERE votes.headlineid = ?) as votes', id);
  return votes.votes;
};

app.get('/headlines', async (req, res) => {
  const { email } = req.query;
  const db = await dbPromise;
  let user = await db.get('SELECT id FROM users WHERE email=?', email);
  if(!user) {
    await db.run('INSERT INTO users (email) VALUES (?)', trim(email));
    user = await db.get('SELECT id FROM users WHERE email=?', trim(email));
  };
  const headlines = await db.all(
    `SELECT
      headlines.headline,
      headlines.id,
      users.id as author,
      ( SELECT COALESCE(SUM(votes.direction), 0) FROM votes WHERE votes.headlineid = headlines.id) as votes,
      ( SELECT COALESCE(SUM(votes.direction), 0) FROM votes WHERE votes.headlineid = headlines.id AND votes.userid = ?) as selfVotes
     FROM headlines LEFT JOIN users ON headlines.userid = users.id`, user.id);
  res.json(indexBy(prop('id'), headlines));
});

app.post('/headlines', async (req, res) => {
  debugger;
  const { headline, user: email } = req.body;
  const db = await dbPromise;
  let user = await db.get('SELECT id FROM users WHERE email=?', trim(email));
  console.log(email);
  if(!user) {
    await db.run('INSERT INTO users (email) VALUES (?)', trim(email));
    user = await db.get('SELECT id FROM users WHERE email=?', trim(email));
  };
  await db.run('INSERT INTO headlines ( headline, userid ) VALUES (?, ?);', headline, user.id);
  res.status(200).send();
});

app.get('/headlines/:id', async (req, res) => {
  const db = await dbPromise;
  const headline = await db.get('SELECT * FROM headlines WHERE id=?', req.params.id);
  res.json(headline);
});

app.post('/headlines/:id/vote', async (req, res) => {
  const { id } = req.params;
  const { email, direction } = req.body;
  const db = await dbPromise;
  await db.run('DELETE FROM votes WHERE userid=(SELECT id FROM users WHERE email=?) AND headlineid=?', email, id);
  await db.run('INSERT INTO votes (headlineid, userid, direction) VALUES (?, (SELECT id FROM users WHERE email=?), ?);', id, email, direction);
  const votes = await getVotes(id);
  io.emit('RECEIVE_HEADLINE_VOTE', { id, votes });
  res.send();
});

app.post('/headlines/:id/unvote', async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  const db = await dbPromise;
  await db.run('DELETE FROM votes WHERE userid=(SELECT id FROM users WHERE email=?) AND headlineid=?', email, id);
  const votes = await getVotes(id);
  io.emit('RECEIVE_HEADLINE_VOTE', { id, votes });
  res.send();
})

app.use(express.static('../client/build/'));

app.use((req, res) => {
  res.sendFile('../client/build/index.html');
})

server.listen(8080, function () {
  setupDb();
  console.log('http://localhost:8080')
});