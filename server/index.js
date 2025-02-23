import { createServer } from "wsnet-server";

const clients = {};
const rooms = {};

createServer({ port: 8080 }, async client => {
    client.onGet("join", data => {

    });
});