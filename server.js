var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 8080;

var usernames = {};
var numUsers = 0;

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/login.html');
});

io.on('connection', function (socket) {
    console.log('A user is connected');

    
    //giving id to users
    socket.username = "name " + Math.random() * (2);
    socket.color = numUsers < 1 ? 'white' : 'black';
    usernames[socket.username] = socket.username;
    ++numUsers;

    socket.emit('join', {
        color: socket.color
    });

    socket.broadcast.emit('user joined', {
        username: socket.username,
        color: socket.color,
        numUsers: numUsers
    });

    socket.on('move', function (msg) {
        socket.broadcast.emit('move', msg);
    });


    socket.on('disconnect', function () {
        console.log('a user is disconnected');
        delete usernames[socket.username];
        --numUsers;

        socket.broadcast.emit('user left', {
            username: socket.username,
            numUsers: numUsers
        });
    });

});

http.listen(port, function () {
    console.log("connected to " + port);
});