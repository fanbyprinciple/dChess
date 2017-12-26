$(function () {

    var game, board;
    game = new Chess();
    
    //socket.io...............................
    socket = io();
    $('#checkbutton').click(function () {
        socket.emit('button', 'socket.io working!');
    });
    //socket.io...............................

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

    var onDrop = function (source, target) {
        // see if the move is legal
        console.log('onDrop');
        var move = game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return 'snapback';

    };

    var onSnapEnd = function () {
        console.log('onSnapEnd');
        board.position(game.fen());
    }; //update game position

    var cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        onChange: onChange
    };

    board = ChessBoard('board', cfg);


});