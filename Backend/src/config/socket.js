import {Server} from "socket.io";
import { getStocksData } from "../controllers/stock.contollers.js";

let io ;
const initializeServer = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods:["GET","POST"]
        },
    });
    
    io.on("connection", async (socket) => {
        console.log("a user connected",socket.id);
 


        socket.on('disconnect', () => {
            console.log('user disconnected',socket.id);
          });

    });
     
    return io;
}

const getSocketInstance = () => {
    if(!io){
        throw new Error("Socket instance not initialized");

    }

    return io;
}

export {initializeServer, getSocketInstance};
