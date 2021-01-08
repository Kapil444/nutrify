const express = require( 'express' );
const app = express();
const usersRoute = require( './routers/user/user.js' )
const mealsRoute = require( './routers/meals/meals' )
const mongoose = require( 'mongoose' );
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const path = require( 'path' );
const uri = "mongodb+srv://admin:1234567890@cluster0.s11is.mongodb.net/users?retryWrites=true&w=majority";
const user = require( './models/user' );
const meals = require( "./models/meals" );
const jwt = require( 'jsonwebtoken' );
const moment = require( 'moment' )
var LocalStorage = require( 'node-localstorage' ).LocalStorage,
  localStorage = new LocalStorage( './scratch' );


app.use( morgan( 'dev' ) );

//server Run on port 3000
app.listen( 3000, ( err ) => {
  if ( err ) { console.error( err ); }
  console.log( 'Listening on 3000' );
} );

// Use connect method to connect to the server
mongoose.connect( uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}, function ( err, client ) {
  if ( err ) {
    console.log( err );
  } else {
    console.log( "Connected successfully to Database" );
  }

} );

//  parse application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: false } ) )
app.use( bodyParser.json() )

app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'ejs' )

app.use( '/api/user', usersRoute );
app.use( '/api/meals', mealsRoute );

app.get( '/', ( req, res ) => {
  res.render( 'home', {
    message: undefined
  } );
} )

app.get( '/logout', ( req, res ) => {
  localStorage.clear();
  res.render( 'home', {
    message: "Logout Successfully !"
  } )
} )

app.get( '/all/user', ( req, res ) => {
  let token = localStorage.getItem( 'token' );
  try {
    const decode = jwt.verify( token, "AddSkill" );
    if ( decode.is_admin == '1' ) {
      var mysort = { date: -1, calories: -1 };
      var startDate = new Date().toDateString() + " " + "00:00:00";
      var endDate = new Date().toDateString() + " " + "23:59:59";
      user.find( { is_admin: '0' }, ( err, data ) => {
        if ( err ) {
          res.render( 'allUser', {
            message: "Somthing went wrong " + err.message
          } )
        } else {
          res.render( 'allUser', {
            message: undefined,
            userList: data
          } )
        }
      } ).sort( mysort );
    } else {
      res.render( 'home', {
        message: "Don't Have permission"
      } )
    }

  } catch ( e ) {
    res.render( 'home', {
      message: "Please Login first " + e.message
    } )
  }
} )

app.post( '/home/date', ( req, res ) => {
  let token = localStorage.getItem( 'token' );
  try {
    const decode = jwt.verify( token, "AddSkill" );
    console.log( "userName", decode.userName, req.body )
    const date = req.body.dateFilter;
    user.findOne( { userName: decode.userName }, ( err, userInfo ) => {
      if ( err ) {
        res.render( 'dashboad', {
          message: "Somthing went wrong " + e.message
        } )
      } else {
        var mysort = { date: -1 };
        let newDate = moment( new Date( date ) ).toDate()

        var startDate = new Date( date + "T00:00:00Z" );
        var endDate = new Date( date + "T23:59:59Z" )
        meals.find( { userName: decode.userName, date: { $gte: startDate, $lt: endDate } }, ( err, data ) => {
          if ( err ) {
            res.render( 'home', {
              message: "Somthing went wrong " + err.message
            } )
          } else {
            let consumeCalories = 0;
            data.forEach( element => {
              consumeCalories += element.calories;
            } );
            res.render( 'dashboad', { message: undefined, userInfo: userInfo, mealList: data, consumeCalories: consumeCalories } )
          }
        } ).sort( mysort );
      }
    } )

  } catch ( e ) {
    res.render( 'home', {
      message: "Please Login first " + e.message
    } )
  }
} )

app.get( '/home', ( req, res ) => {
  let token = localStorage.getItem( 'token' );
  try {
    const decode = jwt.verify( token, "AddSkill" );
    console.log( "userName", decode.userName )
    user.findOne( { userName: decode.userName }, ( err, userInfo ) => {
      if ( err ) {
        res.render( 'dashboad', {
          message: "Somthing went wrong " + err.message
        } )
      } else {
        var mysort = { date: -1, calories: -1 };
        var startDate = new Date().toDateString() + " " + "00:00:00";
        var endDate = new Date().toDateString() + " " + "23:59:59";
        console.log( startDate, endDate )
        meals.find( { userName: decode.userName, date: { $gte: startDate, $lt: endDate } }, ( err, data ) => {
          if ( err ) {
            res.render( 'home', {
              message: "Somthing went wrong " + err.message
            } )
          } else {
            let consumeCalories = 0;
            data.forEach( element => {
              consumeCalories += element.calories;
            } );
            res.render( 'dashboad', { message: undefined, userInfo: userInfo, mealList: data, consumeCalories: consumeCalories } )
          }
        } ).sort( mysort );
      }
    } )

  } catch ( e ) {
    res.render( 'home', {
      message: "Please Login first " + e.message
    } )
  }

} )

app.get( '/profile', ( req, res ) => {
  let token = localStorage.getItem( 'token' );
  try {
    const decode = jwt.verify( token, "AddSkill" );

    user.findOne( { userName: decode.userName }, ( err, result ) => {
      if ( err ) {
        res.render( 'customerProfile', {
          message: "Somthing went wrong " + e.message
        } )
      } else {
        console.log( result )
        res.render( 'customerProfile', { message: undefined, result: result } )
      }
    } )
  } catch ( e ) {
    res.render( 'home', {
      message: "Please Login first " + e.message
    } )
  }
} )

app.get( '/add/meal', ( req, res ) => {
  let token = localStorage.getItem( 'token' );
  try {
    const decode = jwt.verify( token, "AddSkill" );
    res.render( 'addMeal', {
      message: undefined
    } );
  } catch ( E ) {
    res.render( 'home', {
      message: "Please Login first " + e.message
    } )
  }
} )

app.get( '/add/meal/:id', ( req, res ) => {
  let token = localStorage.getItem( 'token' );
  const id = req.params.id;
  console.log( "Id ", id );
  req.body._id = id;
  try {
    const decode = jwt.verify( token, "AddSkill" );
    meals.findById( id, ( err, doc ) => {
      if ( err ) {
        res.render( 'updateMeal', {
          message: "Can't update",
          data: doc
        } )
      } else {
        res.render( 'updateMeal', {
          message: undefined,
          data: doc
        } )
      }
    } )

  } catch ( e ) {
    res.render( 'home', {
      message: "Please Login first " + e.message
    } )
  }
} )

app.get( '/delete/meal/:id', ( req, res ) => {
  let token = localStorage.getItem( 'token' );
  const id = req.params.id;
  console.log( "Id ", id );
  try {
    const decode = jwt.verify( token, "AddSkill" );
    meals.findByIdAndDelete( id, ( err, doc ) => {
      if ( err ) {
        res.render( 'home', {
          message: "Can't Delete",
          data: doc
        } )
      } else {
        res.redirect( '/home' )
      }
    } )

  } catch ( e ) {
    res.render( 'home', {
      message: "Please Login first " + e.message
    } )
  }
} )

app.get( '/delete/user/:id', ( req, res ) => {
  let token = localStorage.getItem( 'token' );
  const id = req.params.id;
  console.log( "Id ", id );
  try {
    const decode = jwt.verify( token, "AddSkill" );
    if ( decode.is_admin == '1' ) {
      user.findByIdAndDelete( id, ( err, doc ) => {
        if ( err ) {
          res.render( 'allUser', {
            message: "Can't Delete",
            data: doc
          } )
        } else {
          res.redirect( '/all/user' )
        }
      } )
    } else {
      res.render( 'home', {
        message: "Don't Have permission to delete user"
      } )
    }
  } catch ( e ) {
    res.render( 'home', {
      message: "Please Login first " + e.message
    } )
  }

} )


app.get( ( req, res, next ) => {
  return res.status( 404 ).json( {
    "message": "Url Not Found "
  } )
} )

module.exports = app;
