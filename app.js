const express = require('express');
const app = express();
const http = require('http');
const socket = require('socket.io');
const path = require('path');

const server = http.createServer(app);
const io = socket(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'))); // Use path.join for clarity

app.get('/', (req, res) => {
  // res.send('hey, I am up!');
  res.render('index');
});

io.on('connection', (socket) => {
  // console.log('socket connected', socket.id);

  socket.on('send-location', (data) => {
    // Broadcast location data to all clients
    io.emit('receive-location', {
      id: socket.id,
      ...data
    });
  });

  socket.on('disconnect', () => {
    console.error(`socket ${socket.id} disconnected`);
    io.emit('user-disconnected', socket.id);
  });
});

server.listen(3000, () => {
  // console.log('Server running on http://localhost:3000');
});
