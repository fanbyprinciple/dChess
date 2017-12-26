var game, board, socket, playerColor;

var onChange = function (oldPos, newPos) {
    console.log("Position changed:");
    console.log("Old position: " + ChessBoard.objToFen(oldPos));
    console.log("New position: " + ChessBoard.objToFen(newPos));
    console.log("--------------------");
};


var onDragStart = function (source, piece, position, orientation) {
    console.log('onDragStart');
    if (game.game_over() === true ||
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
}; // not allowing players to move other players piece

var onSnapEnd = function () {
    console.log('onSnapEnd');
    board.position(game.fen());
}; //update game position


/////////////////socket io start
$(function () {

    socket = io();
    $('#checkbutton').click(function () {
        socket.emit('button', 'socket.io working!');
    });

    socket.on('join', function (msg) {
        console.log("joined as " + msg.color);
        playerColor = msg.color;
        initGame();
    });

    socket.on('user joined', function (msg) {
        console.log(msg.name + " joined as " + msg.color);
    });

    socket.on('move', function (msg) {
        game.move(msg);
        board.position(game.fen());
    });

    socket.on('user left', function (msg) {
        console.log(msg.name + 'left');
    });

});
//////////socket io end

var onDrop = function (source, target) {
    // see if the move is legal
    console.log('onDrop');
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) {
        return 'snapback';
    } else {
        socket.emit('move', move);
    }

}; // written after others since it uses socket


var initGame = function () {

    game = new Chess();
    var cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        onChange: onChange
    };

    board = ChessBoard('board', cfg);
};