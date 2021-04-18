const username = prompt("what is your name?")
socket = io("http://localhost:9000/",{
    query:{
        username
    }
});
let nsSocket = ""

socket.on("nslist",(nsData)=>{
    let namespaceDiv= document.querySelector(".namespaces");
    namespaceDiv.innerHTML = "";
    nsData.forEach((ns)=>{

        namespaceDiv.innerHTML += `<div class = "namespace" ns="${ns.endpoint}"><img src="${ns.img}"/></div>`
    })
   
  

    //add click event on each namespaces
    Array.from((document.getElementsByClassName("namespace"))).forEach((elem)=>{
        elem.addEventListener("click",(e)=>{
            let nsEndpoint = elem.getAttribute("ns");
            joinNs(nsEndpoint);
            
        })
    })

    joinNs("/wiki")

})