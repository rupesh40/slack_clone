const express = require('express');
const app = express();
const socketio = require('socket.io')

let namespaces = require('./data/namespaces');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000,()=>console.log("listening on 9000"));
const io = socketio(expressServer);

io.on("connect",(socket)=>{
    nslist=namespaces.map((ns)=>{
        return{
            img:ns.img,
            endpoint:ns.endpoint
        }
    })
    socket.emit("nslist",nslist);
})
namespaces.forEach((namespace)=>{
    
    
    io.of(namespace.endpoint).on("connect",(nsSocket)=>{
       //console.log(`connection is on and id is ${nsSocket.id}`)

       const username = nsSocket.handshake.query.username;

       nsSocket.emit("nsRoomLoad",namespace.rooms)

       nsSocket.on("joinRoom",(roomToJoin,noOfNewUsersCallback)=>{
           //deal with history later
          
           //leave the previous room to join current room
           const roomToLeave = Object.keys(nsSocket.rooms)[1]
           nsSocket.leave(roomToLeave);
           updateRoomMembers(namespace,roomToLeave)
           nsSocket.join(roomToJoin);
           
        //    io.of("namespace.endpoint").in(roomToJoin).clients((error,clients)=>{
        //        //console.log(clients.length)
        //        noOfNewUsersCallback(clients.length)
        //    })

           //sending the history of room when someone joins the room

           const nsRoom = namespace.rooms.find((room)=>{
               return room.roomTitle === roomToJoin;
           })

           nsSocket.emit("historyCatchUp",nsRoom.history)
           
           // send back number of users in this room
           updateRoomMembers(namespace,roomToJoin)

           

           
        })

       nsSocket.on("newMessageToServer",(msg)=>{
           const fullMsg = {
               text : msg.text,
               time : Date.now(),
               username: username,
               avatar : "https://via.placeholder.com/30"
            }

           const roomTitle = Object.keys(nsSocket.rooms)[1]

            const nsRoom = namespace.rooms.find((room)=>{
                return room.roomTitle === roomTitle 
            })
            nsRoom.addMessage(fullMsg);
            //console.log(nsRoom)
           io.of(namespace.endpoint).to(roomTitle).emit("messageToClients",fullMsg)



        })
    
    })

})

function updateRoomMembers(namespace,room){
    io.of(namespace.endpoint).in(room).clients((error,clients)=>{
        io.of(namespace.endpoint).in(room).emit("updateMembers",clients.length);
    })
}