const io = require('socket.io')(8900,
    {cors: {origin: "*"}
});

//This is all active user list
var activeUsers = [];

//This is all active Guest list
var activeGuest = [];

//this is all active admin list
var admin = [];

//this is all active driver list stored in form of object in which key is hotelId and value is all active driver array
var activeDriver={}

//this function is for adding user to all the above list. it will called when new user will connect and will also be called after every 10 sec to update driver list
const addUser = (data,socketId) => {

    //this is for adding all the active user to active list
    !activeUsers.some((user) => user.userId===data.userId)&&
    activeUsers.push({userId:data.userId,socketId,role:data.role,username:data.username,latitude:data.latitude,longitude:data.longitude,hotelId:data.hotelId});

    //this is for adding all the driver list to active driver object
    if(data.role === "driver") {
        if(!(data.hotelId in activeDriver)){
            activeDriver[data.hotelId]=[]
        }
        !activeDriver[data.hotelId].some((user) => user.userId===data.userId) && activeDriver[data.hotelId].push({userId:data.userId,socketId,role:data.role,username:data.username,latitude:data.latitude,longitude:data.longitude,hotelId:data.hotelId});
    }

    //this is for adding all the guest list to active guest list
    if(data.role === "guest") {
        !activeGuest.some((user) => user.userId===data.userId)&&
        activeGuest.push({userId:data.userId,socketId,role:data.role,username:data.username,latitude:data.latitude,longitude:data.longitude});
    }

    //this is for adding all the admin list to active admin list
    if(data.role === "admin") {
        !admin.some((user) => user.userId===data.userId)&&
        admin.push({userId:data.userId,socketId,role:data.role,username:data.username,latitude:data.latitude,longitude:data.longitude});
    }
}

//this function will remove user 
const removeUser = (socketId) => {
    activeUsers=activeUsers.filter((user) => user.socketId!==socketId)
    for (let key in activeDriver){
            activeDriver[key]=activeDriver[key].filter((user) => user.socketId!==socketId)
    }
    activeGuest=activeGuest.filter((user) => user.socketId!==socketId)
    admin=admin.filter((user) => user.socketId!==socketId)
}

//this function will be use to get user based on hotelId and driverId. this will be basically used for guest to driver connection
const getUser = (hotelId,driverId)=>{
    let u={}
    u=activeDriver[hotelId].find((user) => user.userId===driverId)
    return u
}

//this is main socket code for conn and all the operations
io.on('connection',async (socket)=>{
    console.log("a user connected "+" && "+socket.id)
    
    //this will help to add new user to real time server
    socket.on("new user",(data) => {
        if(data.role === 'admin'){
            socket.join(data.room)
        }
        addUser(data,socket.id);
        io.emit("active user",activeUsers)
        io.emit("admin",admin)
        io.emit("active guest",[activeDriver[Math.floor(Math.random() * activeDriver.length)]])
    })

    //this will trigger after every 10 second to update location of the driver
    socket.on("active driver",(data) => {
        for (let key in activeDriver){
            activeDriver[key]=activeDriver[key].filter((user) => user.userId!==data.userId)
        }
        addUser(data,socket.id)
        io.emit("activeUser",activeUsers)
    })

    //this will trigger after every 10 second to send updated location of driver to user
    socket.on("guest",(data) => {
        io.to(socket.id).emit("booked driver",getUser(data.hotelId,data.driverId))
    })

    //this will trigger after every 10 second to send updated location of driver to admin. this will return all the driver location of particular hotel based on hotelId
    socket.on("activeDriver", (o) => {
        socket.join("room-"+o.hotelId)
        socket.broadcast.to(o.room).emit("msg",activeDriver[o.hotelId]);
    });

    //this will called when user will go offline
    socket.on("disconnect", () =>{
        console.log("a user disconnected && "+socket.id)
        removeUser(socket.id)
        io.emit("active user",activeUsers)
        io.emit("admin",admin)
        io.emit("active guest",[activeDriver[Math.floor(Math.random() * activeDriver.length)]])
    })

})