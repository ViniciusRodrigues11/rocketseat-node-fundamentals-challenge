import http from 'node:http';
import { json } from './middlewares/json.js';
import { routing } from './middlewares/routing.js'

const server = http.createServer(async (req, res) => {
    await json(req, res);
    await routing(req, res);
});

server.listen(3000)