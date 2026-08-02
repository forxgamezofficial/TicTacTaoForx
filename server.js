js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));


// ==========================================
// ROOMS
// ==========================================

const rooms = {};


// ==========================================
// GENERATE ROOM ID
// ==========================================

function generateRoomId() {

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let roomId;

    do {

        roomId = "";

        for (let i = 0; i < 6; i++) {

            roomId +=
                chars[
                    Math.floor(
                        Math.random() * chars.length
                    )
                ];

        }

    } while (rooms[roomId]);

    return roomId;
}


// ==========================================
// CREATE ROOM OBJECT
// ==========================================

function createRoom(roomId, socketId) {

    rooms[roomId] = {

        board: Array(25).fill(""),

        turn: "X",

        starter: "X",

        gameOver: false,

        players: {

            X: socketId,

            O: null

        }

    };

}


// ==========================================
// SOCKET CONNECTION
// ==========================================

io.on("connection", (socket) => {

    console.log(
        "Player Connected:",
        socket.id
    );


    // ======================================
    // CREATE ROOM
    // ======================================

    socket.on("createRoom", () => {

        const roomId =
            generateRoomId();

        createRoom(
            roomId,
            socket.id
        );

        socket.join(roomId);

        // Save room ID on socket
        socket.roomId =
            roomId;

        socket.player =
            "X";


        socket.emit(
            "roomCreated",
            {

                roomId: roomId,

                symbol: "X"

            }
        );


        console.log(
            "Room Created:",
            roomId
        );

        console.log(
            "Player X:",
            socket.id
        );

    });


    // ======================================
    // JOIN ROOM
    // ======================================

    socket.on(
        "joinRoom",
        (roomId) => {

            // Clean Room ID
            roomId =
                String(roomId)
                    .trim()
                    .toUpperCase();


            // Empty Room ID
            if (!roomId) {

                socket.emit(
                    "roomNotFound"
                );

                return;

            }


            // Find Room
            const room =
                rooms[roomId];


            // Room Doesn't Exist
            if (!room) {

                socket.emit(
                    "roomNotFound"
                );

                console.log(
                    "Room Not Found:",
                    roomId
                );

                return;

            }


            // Room Already Has 2 Players
            if (
                room.players.X &&
                room.players.O
            ) {

                socket.emit(
                    "roomFull"
                );

                console.log(
                    "Room Full:",
                    roomId
                );

                return;

            }


            // Prevent Same Player Joining Again
            if (
                room.players.X ===
                socket.id
            ) {

                socket.emit(
                    "alreadyJoined"
                );

                return;

            }


            // Assign O Player
            room.players.O =
                socket.id;


            socket.join(roomId);


            // Save room information
            socket.roomId =
                roomId;

            socket.player =
                "O";


            // Tell Joiner Their Symbol
            socket.emit(
                "assignSymbol",
                "O"
            );


            // Tell Creator Their Symbol
            io.to(
                room.players.X
            ).emit(
                "assignSymbol",
                "X"
            );


            // Game Started
            io.to(roomId).emit(
                "gameStart",
                {

                    roomId:
                        roomId,

                    firstTurn:
                        room.turn

                }
            );


            console.log(
                "Player O Joined:",
                roomId
            );

            console.log(
                "Player O:",
                socket.id
            );

        }
    );


    // ======================================
    // PLAYER MOVE
    // ======================================

    socket.on(
        "move",
        (data) => {

            const roomId =
                data.roomId;

            const room =
                rooms[roomId];


            if (!room) {
                return;
            }


            // Game Already Over
            if (
                room.gameOver
            ) {
                return;
            }


            // Player Must Be In This Room
            if (
                socket.roomId !==
                roomId
            ) {
                return;
            }


            // Verify Player Symbol
            if (
                socket.player !==
                data.player
            ) {
                return;
            }


            // Verify Turn
            if (
                data.player !==
                room.turn
            ) {
                return;
            }


            // Validate Coordinates
            const r =
                Number(data.r);

            const c =
                Number(data.c);


            if (
                !Number.isInteger(r) ||
                !Number.isInteger(c)
            ) {
                return;
            }


            if (
                r < 0 ||
                r > 4 ||
                c < 0 ||
                c > 4
            ) {
                return;
            }


            // Convert Row + Column
            // To Board Index

            const index =
                r * 5 + c;


            // Cell Already Used
            if (
                room.board[index] !== ""
            ) {
                return;
            }


            // Save Move
            room.board[index] =
                data.player;


            // Change Turn
            room.turn =
                room.turn === "X"
                    ? "O"
                    : "X";


            // Send Move To Both Players
            io.to(roomId).emit(
                "move",
                {

                    r: r,

                    c: c,

                    player:
                        data.player,

                    nextTurn:
                        room.turn

                }
            );

        }
    );


    // ======================================
    // RESTART GAME
    // ======================================

    socket.on(
        "restart",
        (roomId) => {

            const room =
                rooms[roomId];


            if (!room) {
                return;
            }


            // Only Players In Room
            if (
                socket.roomId !==
                roomId
            ) {
                return;
            }


            // Clear Board
            room.board =
                Array(25).fill("");


            // Game Active
            room.gameOver =
                false;


            // Change Starter
            room.starter =
                room.starter === "X"
                    ? "O"
                    : "X";


            // New Turn
            room.turn =
                room.starter;


            // Send Restart To Players
            io.to(roomId).emit(
                "restart",
                {

                    firstTurn:
                        room.turn

                }
            );


            console.log(
                "Game Restarted:",
                roomId
            );

            console.log(
                "First Turn:",
                room.turn
            );

        }
    );


    // ======================================
    // GAME OVER
    // ======================================

    socket.on(
        "gameOver",
        (roomId) => {

            const room =
                rooms[roomId];


            if (!room) {
                return;
            }


            if (
                socket.roomId !==
                roomId
            ) {
                return;
            }


            room.gameOver =
                true;


            console.log(
                "Game Over:",
                roomId
            );

        }
    );


    // ======================================
    // DISCONNECT
    // ======================================

    socket.on(
        "disconnect",
        () => {

            console.log(
                "Player Disconnected:",
                socket.id
            );


            const roomId =
                socket.roomId;


            // Player Was Not In A Room
            if (!roomId) {
                return;
            }


            const room =
                rooms[roomId];


            if (!room) {
                return;
            }


            // Notify Other Player
            socket
                .to(roomId)
                .emit(
                    "opponentLeft"
                );


            // Delete Room
            delete rooms[roomId];


            console.log(
                "Room Deleted:",
                roomId
            );

        }
    );

});


// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 3000;

server.listen(
    PORT,
    () => {
        console.log(
            `Server Running On Port ${PORT}`
        );
    }
);

        console.log(
            "================================"
        );

        console.log(
            "FORX GAMEZ SERVER"
        );

        console.log(
            "Server Running On Port 3000"
        );

        console.log(
            "================================"
        );

    }
);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});
