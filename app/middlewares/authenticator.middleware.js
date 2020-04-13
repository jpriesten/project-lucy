const jwt  = require('jsonwebtoken');
const User = require('../models/user.model');
const env = require('../environment/secrets.env')

const auth = async (req,res,next) => {
    try {
        const token = req.header('Authorization').replace('Bearer', '').trim();
        
        const decoded  = jwt.verify(token, env.JWT_KEY);

        const user  = await User.findOne({ _id:decoded._id, 'tokens.token': token});
        
        if(!user){
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.log("Errors", error);
        res.status(401).send({error: true, code: 13579, results: 'Please authenticate!',
         message: error.message});
    }
}

module.exports = auth;