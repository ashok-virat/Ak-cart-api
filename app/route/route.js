const appConfig=require('./../Config/appConfig');
const controller=require('./../controller/usercontroller');
const authorization=require('./../middleware/auth');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
const fileFilter=(req,file,cb)=>{
    if(file.mimetype=='image/png' || file.mimetype=='image/jpeg' || file.mimetype=='image/jpg'){
        cb(null,true)
    }
    else {
        cb(null,false)
    }
 }

const upload = multer({
    storage: storage,
    fileFilter:fileFilter
})


let setRouter=(app)=>{
    let baseUrl=`${appConfig.apiVersion}/users`;
  
    app.post(`${baseUrl}/signup`,controller.signup);
    app.post(`${baseUrl}/signin`,controller.signin);
    app.post(`${baseUrl}/addproduct/:authToken`,authorization.isAuthorized,upload.single('product'),controller.newproduct);
    app.post(`${baseUrl}/getmyproducts/:authToken`,authorization.isAuthorized,controller.getmyproducts);   
    app.post(`${baseUrl}/getsingleproduct/:authToken`,authorization.isAuthorized,controller.getsingleproduct);
   app.post(`${baseUrl}/updateproduct/:authToken`,authorization.isAuthorized,upload.single('product'),controller.updateproduct);
    app.post(`${baseUrl}/deleteproduct/:authToken`,authorization.isAuthorized,controller.deleteproduct);
    app.get(`${baseUrl}/getallproducts/:authToken`,authorization.isAuthorized,controller.getallproducts); 
    app.post(`${baseUrl}/orderrequest/:authToken`,authorization.isAuthorized,controller.placeorder);
    app.post(`${baseUrl}/getusercart/:authToken`,authorization.isAuthorized,controller.getusercart);
    app.post(`${baseUrl}/getadmincart/:authToken`,authorization.isAuthorized,controller.getadmincart);
    app.post(`${baseUrl}/admincancelreq/:authToken`,authorization.isAuthorized,controller.admincancelreq);
    app.post(`${baseUrl}/usercancelreq/:authToken`,authorization.isAuthorized,controller.usercancelreq);
    app.post(`${baseUrl}/adminacceptreq/:authToken`,authorization.isAuthorized,controller.adminacceptreq);
    app.post(`${baseUrl}/admincancelorder/:authToken`,authorization.isAuthorized,controller.admincancelorder);
    app.post(`${baseUrl}/usercancelorder/:authToken`,authorization.isAuthorized,controller.usercancelorder);
     app.post(`${baseUrl}/getuserorders/:authToken`,authorization.isAuthorized,controller.getuserorders);
    app.post(`${baseUrl}/getadminorders/:authToken`,authorization.isAuthorized,controller.getadminorders);
}

module.exports={
    setRouter:setRouter
}