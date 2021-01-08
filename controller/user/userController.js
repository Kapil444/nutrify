const user = require( "../../models/user" );
const mongoose = require( "mongoose" );
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );
var LocalStorage = require( 'node-localstorage' ).LocalStorage,
  localStorage = new LocalStorage( './scratch' );

exports.login = ( req, res, next ) => {
  const { userName, password } = req.body;
  user.find( { userName: userName }, ( err, result ) => {
    if ( err ) {
      return res.render( 'home', {
        message: "Invalid User"
      } )
    } else {
      if ( result.length > 0 ) {
        bcrypt.hash( req.body.password, 10, ( err, hash ) => {
          if ( err ) {
            return res.render( 'home', {
              message: "Invalid User"
            } )
          }
           bcrypt.compare( password, result[0].password, ( err, isAuthentic ) => {
            if ( isAuthentic ) {
              const token = jwt.sign( {
                userName: result[0].userName,
                _id: result[0]._id,
                is_admin: result[0].is_admin
              }, "AddSkill", {
                expiresIn: "1h"
              } );
              result[0].token = token;
              localStorage.setItem( 'token', token );
              res.redirect( '/home')
            } else {
              return res.render( 'home', {
                message: "Auth Failed !"
              } )
            }
          } )
        } );
      } else {
        return res.render( 'home', {
          message: "No user found"
        } )
      }
    }
  } )

}
exports.createUser = ( req, res, next ) => {
  user.find( { userName: req.body.userName }, ( err, docs ) => {
    if ( err ) {
      res.render( 'home', {
        message: "Internal Server Error"
      } )
      // return res.status( 500 ).json( {
      //   "status": false,
      //   "message": "Internal Server Error"
      // } )
    } else {
      if ( docs.length > 0 ) {
        res.render( 'home', {
          message: "User Already Exist"
        } )
        // return res.status( 419 ).json( {
        //   "status": false,
        //   "message": "UserName Already Exist"
        // } )
      } else {
        bcrypt.hash( req.body.password, 10, ( err, result ) => {
          if ( err ) {
            // return res.status( 500 ).json( {
            //   "message": "Internal Server Error"
            // } )
            res.render( 'home', {
              message: "Registeration failed"
            } )
          } else {
            const customer = new user( {
              _id: mongoose.Types.ObjectId(),
              firstName: req.body.firstName,
              lastName: req.body.LastName,
              password: result,
              caloriesPerDay: req.body.caloriesPerDay,
              phoneNo: req.body.phoneNo,
              email: req.body.email,
              userName: req.body.userName,
            } );
            customer
              .save()
              .then( ( result ) => {
                res.render( 'home', {
                  message: "Register Successfully Please Login !"
                } )
                // res.status( 201 ).json( {
                //   status: true,
                //   message: "User Register Successfully",
                // } );
              } )
              .catch();
          }
        } );
      }
    }
  } );
};
exports.getAllUser = ( req, res, next ) => {
  let token = localStorage.getItem( 'token' );
  let decode
  try {
    decode = jwt.verify( token, "AddSkill" );
  } catch ( e ) {
    res.render( 'home', {
      message: "Please Login first " + e.message
    } )

  }
  user.find( ( err, res ) => {
    if ( err ) {
      res.status( 500 ).json( {
        status: false,
        message: "Internal Server Error",
        Error: err,
      } );
    } else {
      res.status( 200 ).json( {
        status: true,
        message: "Successfully Retrive",
        object: res,
      } );
    }
  } );
};
exports.updateUser = ( req, res, next ) => {
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
  const userName = decode.userName;
  user.findOne( { userName: userName }, ( err, result ) => {
    if ( err ) {
      // res.status( 500 ).json( {
      //   status: false,
      //   message: "Internal Server Error",
      //   Error: err,
      // } );
      res.render( 'customerProfile', {
        message: "Error during updating user " + erro
      } )
    } else {
      const userobj = {};
      console.log( result );
      result.firstName = req.body.firstName,
        result.lastName = req.body.LastName,
        result.caloriesPerDay = req.body.caloriesPerDay,
        result.phoneNo = req.body.phoneNo,
        result.email = req.body.email,
        user.updateOne( { userName: userName }, ( $set = result ) )
          .then( ( doc ) => {
            // res.status( 200 ).json( {
            //   status: true,
            //   message: "Update User Successfull",
            //   object: doc,
            // } );
            res.render( 'customerProfile', {
              message: "Customer Updated Successfully",result :doc
            } )
            console.log( doc );
          } )
          .catch( ( erro ) => {
            // res.status( 203 ).json( {
            //   status: false,
            //   message: "Error In update",
            //   Error: erro,
            // } );
            res.render( 'customerProfile', {
              message: "Error during updating user " + erro
            } )
          } );
    }
  } );
};

exports.deleteUser = ( req, res, next ) => {
  let token = localStorage.getItem( 'token' );
  if ( token == undefined ) {
    res.render( 'home', {
      message: "Please Login first"
    } )
  }
  const userName = req.query.userName;
  user.deleteOne( { userName: userName }, ( err, result ) => {
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