const socketio=require('socket.io');
const mongoose=require('mongoose');


const check=require('./../lib/checkLib');
const redisLib=require('./../lib/redisLib');
const userpath=require('./../models/userModel');
const UserModel= mongoose.model('UserModel');

let setServer=(server)=>{
   
    let io=socketio.listen(server);
    let myio=io.of('');

    myio.on('connection',(socket)=>{
       

        socket.emit('verifyUser','');
        //coder to verify the user and make him online
           
        
        //setuser code is start
        socket.on('set-user',(userId)=>{
            UserModel.findOne({userId:userId},(err,result)=>{
                if(err){
                    socket.emit('user-error',{status:403,message:'user is not found'})
                }
                else if(check.isEmpty(result)) {
                    socket.emit('user-error',{status:403,message:'user is not found'})
                }
                else {
                    let currentUser=result;

                    socket.userId=currentUser.userId;
                         
                    let fullName=`${currentUser.firstName} ${currentUser.lastName}`;

                    let key=currentUser.userId;
                     let value=fullName;
                     let setUserOnline=redisLib.setNewOnlineUserInHash('onlineUsers',key,value,(err,result)=>{
                         if(err){
                             console.log(err)
                         }
                         
                         else {
                             redisLib.getAllUsersInHash('onlineUsers',(err,result)=>{
                                 if(err){
                                     console.log(err)
                                 }
                                 else {
                                     socket.room='Issue-tracker';
                                     socket.join(socket.room)
                                     console.log(result)
                                     socket.to(socket.room).broadcast.emit('online-user-list',result);
                                 }
                             })
                         }
                     })
                }
            })
    })
      //setuser code is end
    
      
        //socet disconnect code start
        socket.on('disconnect',()=>{
            if(socket.userId){
            redisLib.deleteUserFromHash('onlineUsers',socket.userId);
            redisLib.getAllUsersInHash('onlineUsers',(err,result)=>{
                if(err){
                    console.log(err)
                }
                else {
                    socket.leave(socket.room)
                    socket.to(socket.room).broadcast.emit('online-user-list',result)
                }
            })
        }
           })
        //socket disconnect code end

         
        //userplaced order code start
        socket.on('place-order',(data)=>{
            socket.broadcast.emit(`${data.adminId} placeordernotify`,data)
               })
        //user placed ordercode end

           
        //admin order req confirm code start
        socket.on('admin-order-req-confirm',(data)=>{
            console.log(data)
            socket.broadcast.emit(`${data.userId} admin-order-req-confirm`,data)
               })
        //admin order req confirm ordercode end

         //admin order req cancel  code start
        socket.on('admin-order-req-cancel',(data)=>{
          
            socket.broadcast.emit(`${data.userId} admin-order-req-cancel`,data)
               })
        //admin order req cancel code end

         //user order req cancel  code start
         socket.on('userorderreqcancel',(data)=>{
          
            socket.broadcast.emit(`${data.adminId} userorderreqcancel`,data)
               })
        //admin order req cancel code end

                
        //admin order  confirm code start
        socket.on('admin-order-confirm',(data)=>{
           
            socket.broadcast.emit(`${data.userId} admin-order-confirm`,data)
               })
        //admin order  confsirm ordercode end
               


         //admin order cancel  code start
        socket.on('admin-order-cancel',(data)=>{
          
            socket.broadcast.emit(`${data.userId} admin-order-cancel`,data)
               })
        //admin order cancel code end

         //user order cancel  code start
         socket.on('user-order-cancel',(data)=>{
          
            socket.broadcast.emit(`${data.adminId} user-order-cancel`,data)
               })
        //admin order cancel code end
                })


            
}


module.exports={
    setServer:setServer
}