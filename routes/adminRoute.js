const express = require('express');
const admin_route =  express();

// const nocache = require('nocache');
// admin_route.use(nocache());

const session = require("express-session");
const config = require('../config/config');
admin_route.use(session({secret:config.sessionSecret,saveUninitialized:false,resave: false}));



admin_route.use(express.json());
admin_route.use(express.urlencoded({extended:true}));

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

const multer = require("multer");
const path = require("path");

admin_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userImages'));
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});

const upload = multer({storage:storage});

const auth = require('../middleware/adminAuth')

const adminController = require("../controllers/adminController");

admin_route.get('/',auth.isLogout,adminController.loadLogin);

admin_route.post('/',adminController.verifyLogin);

admin_route.get("/home",auth.isLogin,adminController.loadDashboard);

admin_route.get('/logout',adminController.logout);

admin_route.get('/dashboard',auth.isLogin,adminController.adminDashboard);

admin_route.get('/new-user',auth.isLogin,adminController.newUserLoad);

admin_route.post('/new-user',upload.single('image'),adminController.addUser);

admin_route.get('/edit-user',auth.isLogin,adminController.editUserLoad);

admin_route.post('/edit-user',adminController.updateUsers);

admin_route.get('/delete-user',auth.isLogin,adminController.deleteUser);

// admin_route.get('*',function(req,res){

//     res.redirect('/admin');

// })

module.exports = admin_route;
