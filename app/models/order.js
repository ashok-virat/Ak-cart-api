const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const orderdetails=new Schema({
    orderId:{
        type:String,
        default:''
    },
    productId:{
        type:String,
        default:''
    },
    productName:{
        type:String,
        default:''
    },
    userId:{
        type:String,
        default:''
    },
    adminfirstName:{
        type:String,
        default:''
    },
    adminlastName:{
         type:String,
         default:''
    },
    userfirstName:{
        type:String,
        default:''
    },
    userlastName:{
        type:String,
        default:''
    },
    adminId:{
        type:String,
        default:''
    },
    requestDate:{
        type:Date,
        default:Date.now()
    }
})

mongoose.model('order',orderdetails)