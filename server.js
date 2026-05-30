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

    if (waitingPlayer && waitingPlayer.id !== socket.id) {

        const roomId =
            waitingPlayer.id + "-" + socket.id;

        waitingPlayer.join(roomId);
        socket.join(roomId);

        rooms[roomId] = {
            board: Array(25).fill(""),
            turn: "X",
            gameOver: false,
            starter: "X"
        };

        console.log(
            "Game Started:",
            roomId
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

        const index =
            data.r * 5 + data.c;

        if (
            index < 0 ||
            index >= 25
        ) {
            return;
        }

        if (room.board[index] !== "") {
            return;
        }

        room.board[index] =
            data.player;

        room.turn =
            room.turn === "X"
                ? "O"
                : "X";

        io.in(data.roomId).emit(
            "move",
            {
                r: data.r,
                c: data.c,
                player: data.player,
                nextTurn: room.turn
            }
        );
    });

    socket.on("restart", (roomId) => {

        const room = rooms[roomId];

        if (!room) return;

        room.board =
            Array(25).fill("");

        room.gameOver = false;

        room.starter =
            room.starter === "X"
                ? "O"
                : "X";

        room.turn =
            room.starter;

        io.to(roomId).emit(
            "restart",
            {
                firstTurn:
                    room.turn
            }
        );

        console.log(
            "Restart:",
            roomId,
            "First Turn:",
            room.turn
        );
    });

    socket.on("gameOver", (roomId) => {

        const room = rooms[roomId];

        if (!room) return;

        room.gameOver = true;
    });

    socket.on("disconnect", () => {

        console.log(
            "Disconnected:",
            socket.id
        );

        if (
            waitingPlayer &&
            waitingPlayer.id === socket.id
        ) {
            waitingPlayer = null;
        }

        for (const roomId in rooms) {

            const roomMembers =
                io.sockets.adapter.rooms.get(
                    roomId
                );

            if (
                roomMembers &&
                roomMembers.has(socket.id)
            ) {

                socket
                    .to(roomId)
                    .emit(
                        "opponentLeft"
                    );

                delete rooms[roomId];

                console.log(
                    "Room Deleted:",
                    roomId
                );

                break;
            }
        }
    });
});

server.listen(3000, () => {

    console.log(
        "Server Running On Port 3000"
    );

});
