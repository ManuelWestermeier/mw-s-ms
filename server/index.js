import { basicHash } from "../utis/crypto-api.js";
import { areSetAndTheSameType } from "are-set";
import { createServer } from "wsnet-server";

const clients = {};
const rooms = {};

setInterval(() => {
    console.log(clients);
    console.log(rooms);
}, 2_000);

createServer({ port: 8080 }, async client => {
    const roomsJoined = [];
    let userName = false;

    function send(id, message) {
        if (!userName) return;
        for (const _client of rooms[id].clients) {
            if (_client != client) {
                _client.say("message", message);
            }
        }
    }

    client.onGet("send", data => {
        if (!userName) return;
        if (!areSetAndTheSameType(data, [["id", "string"], ["type", "string"], ["message", "string"]])) return false;
        const { id, type, message } = data;
        if (!roomsJoined.includes(id)) return false;
        rooms[id].messages.push({ type, message });
        send(id, { type, message });
        return true;
    });

    client.onGet("clear", id => {
        if (!userName) return;
        if (!roomsJoined.includes(id)) return false;
        send(id, { type: "clear" });
        rooms[id].messages = [];
        return true;
    });

    client.onGet("join", data => {
        if (!userName) return false;
        if (!areSetAndTheSameType(data, [["id", "string"], ["keyHash", "string"]])) return false;
        const { id, keyHash } = data;

        if (roomsJoined.includes(id)) {
            return false;
        }
        roomsJoined.push(id);

        if (!rooms[id]) {
            rooms[id] = {
                clients: [userName],
                messages: [
                    { type: "joined", data: userName }
                ],
                keyHash: basicHash(keyHash),
            }
            return rooms[id].messages;
        }

        if (!rooms[id].keyHash == basicHash(keyHash)) return false;
        rooms[id].clients.push(userName);
        rooms[id].messages.push({ type: "joined", data: userName });
        send(id, { type: "joined", data: userName });
        return rooms[id].messages;
    });

    client.onGet("leave", id => {
        if (!userName) return false;
        if (!roomsJoined.includes(id)) return false;
        rooms[id].clients = rooms[id].clients.filter(cli => cli != client);
    });

    client.onGet("auth", _userName => {
        if (userName) {
            delete clients[userName];
        }
        if (clients[_userName]) {
            return false;
        }

        userName = _userName;
        clients[userName] = client;

        return true;
    });

    client.onerror = () => client.close()

    client.onclose = () => {
        if (!userName) return;
        delete clients[userName];
        for (const room of roomsJoined) {
            const keys = Object.keys(rooms[room]);
            if (keys.length == 1) {
                delete rooms[room];
            }
            else {
                rooms[room].clients = rooms[room].clients.filter(_userName => userName != _userName);
                send(room, { type: "exit", data: userName });
            }
        }
    };
});