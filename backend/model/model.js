const mongoose = require('mongoose');
const jwt=require("jsonwebtoken");

// Define user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]
});
// generating tooken.userSchema...
userSchema.methods.generateWebtoken= async function(){
    try{
        console.log(this._id);
        const token=jwt.sign({_id:this._id.toString()},"mynameisomprakashlenka");
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
        
    }catch(err){
        resizeBy.send(err);
        console.log("error occuring",err);
        
    }
}

module.exports = mongoose.model('User', userSchema);




