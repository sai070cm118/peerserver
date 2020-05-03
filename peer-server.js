// const { PeerServer } = require('peer');

// const peerServer = PeerServer({ port: 9000, path: '/myapp' });

const express = require('express');
const { ExpressPeerServer } = require('peer');

var port = process.env.PORT || 9000;
const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	console.log(port);
	res.sendFile('./public/index.html', { root: __dirname });
});



app.get('/port', function(req, res) {
	res.send(''+port+'');
});

const server = app.listen(port);

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/peerjs'
});

app.use('/mypeer', peerServer);

console.log(port);
