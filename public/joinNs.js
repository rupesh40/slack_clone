function joinNs(endpoint){
    if(nsSocket){
        //check if there is socket, if it is then close the conn
        nsSocket.close();

        //remove the event listener before its added again
        document.querySelector("#user-input").removeEventListener("click",onSubmitHandler)
    }
     nsSocket= io(`http://localhost:9000${endpoint}`);
    nsSocket.on("nsRoomLoad",(nsRooms)=>{

        let roomList = document.querySelector(".room-list");
        roomList.innerHTML = "";

        nsRooms.forEach((room)=>{
            let glyph = "";

            if(room.privateRoom){
                glyph="lock";

            }
            else{
                glyph="globe";
            }
            roomList.innerHTML += `<li class="room"><span class ="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li> `

        })

        //add click listner to rooms

        let roomNodes= document.getElementsByClassName("room");
        Array.from(roomNodes).forEach((room)=>{
            room.addEventListener("click",(e)=>{
                joinRoom(e.target.innerText)
            })
        })


        // user shpuld automatically join the first room
        let topRoom = document.querySelector(".room");
        let topRoomName = topRoom.innerText
        joinRoom(topRoomName);

     nsSocket.on('messageToClients',(msg)=>{
        //  console.log(msg);
        const newMsg = buildHTML(msg);
        document.querySelector("#messages").innerHTML += `<li> ${newMsg}</li>`
       }) 

     document.querySelector(".message-form").addEventListener("submit",onSubmitHandler)  
    })

}

function onSubmitHandler(e){
    e.preventDefault();
    const newMessage = document.querySelector("#user-message").value ;
    nsSocket.emit("newMessageToServer", {text :newMessage})
}

function buildHTML(msg){
    const convertedDate = new Date(msg.time).toLocaleString();
    const newHTML= `
    <li>
        <div class="user-image">
        <img src=${msg.avatar} />
        </div>
        <div class="user-message">
        <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
        <div class="message-text">${msg.text}.</div>
        </div>
    </li>`

return newHTML;
}