const meals = require( "../../models/meals" );
const mongoose = require( 'mongoose' );
const jwt = require( 'jsonwebtoken' );
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

exports.createMeals = ( req, res, next ) => {
  let token = localStorage.getItem( 'token' );
  let decode
  try {
    decode = jwt.verify( token, "AddSkill" );
  } catch ( e ) {
    res.render( 'home', {
      message: "Please Login first " + e.message
    } )

  }     
  req.body.userName = decode.userName;     
   
    const meal = new meals( {
        _id: mongoose.Types.ObjectId(),
        mealType: req.body.mealType,
        mealName: req.body.mealName,
        description: req.body.description,
        calories: req.body.calories,
        userName: req.body.userName
    } );
    meal.save().then( result => {
      res.render('addMeal',{
        message : "Meal Created Successfully"
      })
        // res.status( 201 ).json( {
        //     "status": true,
        //     "message": "Meals Added successfully"
        // } )
    } ).catch( error => {
      res.render('addMeal',{
        message : "Can't Save some issue"
      })
        // res.status( 500 ).json( {
        //     "status": false,
        //     "message": "Internal Server error",
        //     "error": error
        // } )
    } )
}

exports.getMealByUserName = (req,res,next)=>{
  let token = localStorage.getItem('token');
     if(token==undefined){
       res.render('home',{
         message : "Please Login first"
       })
     }
    console.log("Request : ",req.query.userName)
    const userName = req.query.userName;
     console.log(userName);
    meals.find({username : userName},(err,result)=>{
        if(err){
            res.status(500).json({
                "status":false,
                "error" : err
            })
        }else{
            res.status(200).json({
                "status":true,
                "message" : "Successfully get meals",
                "object" : result
            })
        }
    })
}
exports.updateMeals = ( req, res, next ) => {
  let token = localStorage.getItem( 'token' );
  let decode
  try {
    decode = jwt.verify( token, "AddSkill" );
    req.body.userName = decode.userName
  } catch ( e ) {
    res.render( 'home', {
      message: "Please Login first " + e.message
    } )

  }
  const id = req.params.id
  console.log("Id : ", req.params.id );
  meals.findOne( { _id: id }, ( err, result ) => {
    if ( err ) {
      // res.status( 500 ).json( {
      //   status: false,
      //   message: "Internal Server Error",
      //   Error: err,
      // } );
      res.render( 'updateMeal', {
        message: "Error during updating Meal " + erro,
        data : result
      } )
    } else {
      console.log("result : ", result );
      result.mealName = req.body.mealName,
        result.mealType = req.body.mealType,
        result.calories = req.body.calories,
        result.userName = req.body.userName,
        result.description = req.body.description
        meals.updateOne( { _id: id }, ( $set = result ) )
          .then( ( doc ) => {
            // res.status( 200 ).json( {
            //   status: true,
            //   message: "Update User Successfull",
            //   object: doc,
            // } );
            console.log("doc : ", doc );
            res.render( 'updateMeal', {
              message: "Meal Updated Successfully",data :doc
            } )
            
          } )
          .catch( ( erro ) => {
            // res.status( 203 ).json( {
            //   status: false,
            //   message: "Error In update",
            //   Error: erro,
            // } );
            res.render( 'updateMeal', {
              message: "Error during updating Meal " + erro,
              data : doc
            } )
          } );
    }
  } );
  };
  
  exports.deleteMeals = ( req, res, next ) => {
    let token = localStorage.getItem('token');
     if(token==undefined){
       res.render('home',{
         message : "Please Login first"
       })
     }
    const id = req.query._id;
    user.deleteOne( { _id: id }, ( err, result ) => {
      if ( err ) {
        res.status( 500 ).json( {
          'status': false,
          'message': "Error in delete",
          "Error": err
        } )
      } else {
        res.status( 200 ).json( {
          'status': true,
          'message': "Successfully Deleted",
          "Response": result
        } )
      }
    } )
  }