const moongose = require('mongoose');
const userSchema = moongose.Schema({
    _id : moongose.Types.ObjectId,
    firstName : String,
    lastName : String,
    password : String,
    caloriesPerDay : {type: String},
    phoneNo : {type:String},
    email : {type:String,required:true},
    userName : {
        type : String,
        required : true,
        unique : true
    },
 is_admin : {type : String,default:0}

})
module.exports = moongose.model('User',userSchema);