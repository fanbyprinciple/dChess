var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.send('<h2>Hi, the server is working.<br>In the search bar go to /public/index.html to start </h2>');
});

io.on('connection', function (socket) {
    console.log('A user is connected');

    socket.on('button', function (msg) {
        console.log(msg);
    });

    socket.on('disconnect', function (msg) {
        console.log('User disconnected');
    });
});

http.listen(port, function () {
    console.log("connected to " + port);
});