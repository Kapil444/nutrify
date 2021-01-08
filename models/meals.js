const mongoose = require('mongoose');
const mealSchema = mongoose.Schema({
    _id : mongoose.Types.ObjectId,
    date : {type : Date,default : Date.now},
    mealType : String,
    mealName : String,
    description : String,
    calories : Number,
    userName : {type : String,required : true}
})
module.exports = mongoose.model('Meal',mealSchema);