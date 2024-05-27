// const isLogin = async(req,res,next)=>{

//     try{
        
//         if(req.session.user_id){

//         }else{
//             res.redirect('/');
//         }
//         next();

//     }catch(error){
//         console.log(error.message);
//     }

// }


// const isLogout = async(req,res,next)=>{

//     try{

//         if(req.session.user_id){
//             res.redirect('/home');
//         }
//         next();

//     }catch(error){
//         console.log(error.message);
//     }

// }

// module.exports = {
//     isLogin,
//     isLogout
// }

const isLogin = async (req, res, next) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/');
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
};

const isLogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            return res.redirect('/home');
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    isLogin,
    isLogout
};
