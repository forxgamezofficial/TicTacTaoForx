const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"));

let waitingPlayer = null;
const rooms = {};
io.on("connection", (socket) => {

    console.log("Player Connected:", socket.id);

    if (waitingPlayer) {

        const roomId =
            waitingPlayer.id + "-" + socket.id;
            waitingPlayer.join(roomId);
socket.join(roomId);
            rooms[roomId] = {
    board: Array(25).fill(""),
    turn: Math.random() > 0.5 ? "X" : "O",
    gameOver: false
};
console.log("TURN =", rooms[roomId].turn);

console.log(
"First Turn:",
rooms[roomId].turn
);
       waitingPlayer.emit("gameStart", {
    symbol: "X",
    roomId,
    firstTurn: rooms[roomId].turn
});

socket.emit("gameStart", {
    symbol: "O",
    roomId,
    firstTurn: rooms[roomId].turn
});


        waitingPlayer = null;

    } else {

        waitingPlayer = socket;

        socket.emit("waiting");
    }

socket.on("move", (data) => {

    const room = rooms[data.roomId];

    if (!room) return;

    if (room.gameOver) return;

    if (data.player !== room.turn) return;

    const index = data.r * 5 + data.c;

    if (room.board[index] !== "") return;

    room.board[index] = data.player;

    room.turn =
        room.turn === "X"
        ? "O"
        : "X";

    io.to(data.roomId).emit("move", {
        r: data.r,
        c: data.c,
        player: data.player,
        nextTurn: room.turn
    });

});

    socket.on("restart", (roomId) => {

        io.to(roomId)
            .emit("restart");

    });

    socket.on("disconnect", () => {

        console.log("Disconnected:", socket.id);
        for (const roomId in rooms) {

    const room = io.sockets.adapter.rooms.get(roomId);

    if(room && room.has(socket.id)){

        socket.to(roomId)
        .emit("opponentLeft");

        delete rooms[roomId];

    }
}

        if (
            waitingPlayer &&
            waitingPlayer.id === socket.id
        ) {
            waitingPlayer = null;
        }
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

    console.log("Running", PORT);

});
