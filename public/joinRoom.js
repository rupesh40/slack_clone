function joinRoom (roomName){

    //send back the roomName to server
    nsSocket.emit("joinRoom",roomName,(noOfNewUsers)=>{
        document.querySelector(".curr-room-num-users").innerHTML = `${noOfNewUsers} <span class="glyphicon glyphicon-user"></span>`
    }); 
   
    nsSocket.on("historyCatchUp",(history)=>{
        const messagesUl = document.querySelector("#messages");
        messagesUl.innerHTML = "";
        history.forEach((msg)=>{
            const newMsg = buildHTML(msg);
            //const currentMsg = messageUrl.innerHTML;
            messagesUl.innerHTML += newMsg ;
        })
       messagesUl.scrollTo(0,messagesUl.scrollHeight)
    })

    nsSocket.on("updateMembers",(noOfUsers)=>{
        document.querySelector(".curr-room-num-users").innerHTML = `${noOfUsers} <span class="glyphicon glyphicon-user"></span>`
        document.querySelector(".curr-room-text").innerHTML = `${roomName} `
        
    })
}