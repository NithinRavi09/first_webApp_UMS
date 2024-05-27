const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
};

const loadRegister = async (req, res) => {
    try {
        res.render('registration');
    } catch (error) {
        console.log(error.message);
    }
};

const insertUser = async (req, res) => {
    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            image: req.file.filename,
            password: spassword,
            is_admin: 0,
        });

        const userData = await user.save();

        if (userData) {
            return res.render('login', { message: "Your registration has been successfully." });
        } else {
            return res.render('registration', { message: "Your registration has failed" });
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

// login user methods
const loginLoad = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
};

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                req.session.user_id = userData._id;
                return res.redirect('/home');
            } else {
                return res.render('login', { message2: "Email and password are incorrect" });
            }
        } else {
            return res.render('login', { message2: "Email and password are incorrect" });
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

const loadHome = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        if(userData){
            res.render('home', { user: userData });
        }else{
            res.redirect('/logout')
        }
       
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

const userLogout = async (req, res) => {
    try {
        delete req.session.user_id;
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

// user profile edit and update
const editLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await User.findById({ _id: id });

        if (userData) {
            res.render('edit', { user: userData });
        } else {
            res.redirect('/home');
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

const updateProfile = async (req, res) => {
    try {
        if (req.file) {
            await User.findByIdAndUpdate(
                { _id: req.body.user_id },
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        mobile: req.body.mno,
                        image: req.file.filename,
                    },
                }
            );
        } else {
            await User.findByIdAndUpdate(
                { _id: req.body.user_id },
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        mobile: req.body.mno,
                    },
                }
            );
        }
        res.redirect('/home');
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editLoad,
    updateProfile,
};



