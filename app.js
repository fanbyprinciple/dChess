var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

var usernames={};
var numUsers=0;

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.send('<h2>Hi, the server is working.<br>In the search bar go to /public/index.html to start </h2>');
});

io.on('connection', function (socket) {
    console.log('A user is connected');
     
    //giving id to users
    socket.username =  "name "+Math.random();
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
    
    socket.on('move', function(msg) {
        socket.broadcast.emit('move', msg);
    });


    socket.on('disconnect', function() {
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