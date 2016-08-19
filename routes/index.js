/// index.js routes
    
//var db = app.settings.db;
var mongo = require('../mydatabaseconn.js');
var ObjectId = require('mongodb').ObjectID;

var twitterAPI = require('node-twitter-api');

    var twitter = new twitterAPI({
    consumerKey: 'QIn582TWOLhmDzzzzzzzzzzzzzzgA',
    consumerSecret: 'rlWVHc1XBJnsY8GtFqdtlLczzzzzzzzzzzzzzzzzzzzzzzzzzz',
    callback: 'https://build-a-pinterest-clone-martinirl.c9users.io/welcome'
});

/*
 * GET home page.
 */

exports.index = function(req, res){
 var db = mongo.client;
var user1 = req.session.user;
getAllPins(res,db, function(result) {
    aggregateResults(res, req ,db, function(agg) {
                console.log(agg);
                //res.redirect(result);
                res.render('pages/index', {
               title: 'Pinterest Clone App',
               res: result,
               error: "",
               likes: agg
                });
    });
            
    });
        
};

////////////////

//// ALL pics

exports.all = function(req, res){
 var db = mongo.client;
var sn = req.session.sn || 0;
var uimage = req.body.uimage;
if(sn !=0 ){
getAllPins(res,db, function(result) {
    aggregateResults(res, req ,db, function(agg) {
                console.log(agg);
                //res.redirect(result);
                res.render('pages/welcome', {
               title: 'Pinterest Clone App',
               res: result,
               error: "",
               sn: sn,
               uimage: uimage,
               likes: agg
                });
    });
            
    });
} else{
    res.redirect('/');
}        
};

////////////////

//// Likes

exports.likes = function(req, res){
 var db = mongo.client;
var sn = req.session.sn || 0;
var urlimage = req.body.urlimage;
var uimage = req.body.uimage;
if(sn !=0 ){
        var qLikesObj = {};    
        qLikesObj = { 
                 "sn": sn,
                 "url": urlimage,
                 "like": 1
               }; 
               
            userLikes (qLikesObj, db, res, function(result) {
            if(result){
                /////////// AGG
                getAllPins(res,db, function(result) {
                
                    
                 aggregateResults( res, req ,db, function(agg) {
           
                console.log(agg);
                //res.redirect(result);
                res.render('pages/welcome', {
               title: 'Pinterest Clone App',
               res: result,
               error: "",
               sn: sn,
               uimage: uimage,
               likes: agg
                });
    });
            
    });
                }
            else{
                // AGG function call here.
                getAllPins(res,db, function(result) {
                    aggregateResults( res, req ,db, function(agg) {
           
                console.log(agg);
                //res.redirect(result);
                res.render('pages/welcome', {
               title: 'Pinterest Clone App',
               res: result,
               error: "",
               sn: sn,
               uimage: uimage,
               likes: agg
                });
    });
            
    });
                
                ////////////////
            }
    });
} else{
    res.redirect('/');
}
};

////////////////


// logout user
exports.logout = function(req, res){
        req.session.user = null;
        req.session.sn = null;
        req.session.snimage = null;
        req.session.tokenSecret = null;
        req.session.token = null;
        req.session.location = null;
        res.redirect('/');
};


////////////////
/// Twitter Login ///////

exports.login = function(req, res){
    var sn = req.session.sn || 0;
    var uimage = req.session.snimage || 0;
    var db = mongo.client;
    console.log("SN: " + sn); 
      console.log("image: " + uimage); 
    if( sn === 0 || uimage === 0 ){
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
    if (error) {
        console.log("Error getting OAuth request token : " + error);
    } else {
        //store token and tokenSecret somewhere, you'll need them later; redirect user 
        req.session.token = requestToken;
        req.session.tokenSecret = requestTokenSecret;
         res.redirect(twitter.getAuthUrl(requestToken)); 
    }
});
     
    } // end check sn
    else{
        // process going
        var qGoingObj = {};    
        qGoingObj = { 
                 "sn": sn
               }; 
    
    getAllPins(res,db, function(result) {
                 aggregateResults(res, req ,db, function(agg) {
           
                console.log(agg);
                //res.redirect(result);
                res.render('pages/welcome', {
               title: 'Pinterest Clone App',
               res: result,
               error: "",
               sn: sn,
               uimage: uimage,
               likes: agg
                });
    });
            
    });
    
}
};

/////////////////
/// - Welcome 

exports.welcome = function(req, res){
     var db = mongo.client;
    var sn = req.session.sn || 0;
    console.log("SN" + sn);
    var uimage = req.session.snimage || 0;
    
    var oauth_token = req.oauth_token || 0;
   // var oauth_verifier = req.oauth_verifier;
   // var requestToken = req.session.token;
    var requestTokenSecret = req.session.tokenSecret || 0;
    var sname = req.query.screen_name || 0;
    var requestToken = req.query.oauth_token || 0;
    var oauth_verifier = req.query.oauth_verifier || 0;
    console.log (oauth_token + " " + requestTokenSecret + " " + requestToken + "  " + oauth_verifier );
    
    if(requestTokenSecret === 0){
        getAllPins(res,db, function(result) {
    res.render('pages/index', {
               title: 'Pinterest Clone App',
               res: result,
               error: "no key"
            });
            
    });
    }
    else if ( sn === 0 || uimage === 0 ){
    console.log("DB1: ");
    //console.log(mongo.client);
    
// check with twitter//
twitter.getAccessToken(requestToken, requestTokenSecret, oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
if (error) {
console.log(error);
 getAllPins(res,db, function(result) {
    res.render('pages/index', {
               title: 'Pinterest Clone App',
               res: result,
               error: "no key2"
            });
            
    });
} else {
//store accessToken and accessTokenSecret somewhere (associated to the user) 
//Step 4: Verify Credentials belongs here 
req.session.accessToken = accessToken;
req.session.accessTokenSecret = accessTokenSecret;

twitter.verifyCredentials(accessToken, accessTokenSecret, function(error, data, response) {
if (error) {
//something was wrong with either accessToken or accessTokenSecret 
//start over with Step 1 
 getAllPins(res,db, function(result) {
    res.render('pages/index', {
               title: 'Pinterest Clone App',
               res: result,
               error: "no key3"
            });
            
    });
} else {
//accessToken and accessTokenSecret can now be used to make api-calls (not yet implemented) 
//data contains the user-data described in the official Twitter-API-docs 
//you could e.g. display his screen_name 
console.log( "NAME" + data["screen_name"]);
console.log("IMAGE URL");
console.log(data["profile_image_url"]);
var image = data["profile_image_url"];
req.session.sn = data["screen_name"];
req.session.snimage = data["profile_image_url"];
sn = req.session.sn;

findUser(image, sn, mongo.client, res, function(result) {
    if(result !=0 ){
     getAllPins(res,db, function(result) {
    aggregateResults(res, req ,db, function(agg) {
                console.log(agg);
                //res.redirect(result);
                res.render('pages/welcome', {
               title: 'Pinterest Clone App',
               res: result,
               error: "",
               sn: sn,
               uimage: uimage,
               likes: agg
                });
    });
    });
    }
});

console.log("HERE logged in");
getAllPins(res,db, function(result) {
    
    aggregateResults(res, req ,db, function(agg) {
           
                console.log(agg);
                //res.redirect(result);
                res.render('pages/welcome', {
               title: 'Pinterest Clone App',
               res: result,
               error: "",
               sn: sn,
               uimage: uimage,
               likes: agg
                });
    });
            
    });
}
});

}
});
}
   else{
       console.log ("here - humm");
getAllPins(res,db, function(result) {
    
    aggregateResults(res, req ,db, function(agg) {
           
                console.log(agg);
                //res.redirect(result);
                res.render('pages/welcome', {
               title: 'Pinterest Clone App',
               res: result,
               error: "",
               sn: sn,
               uimage: uimage,
               likes: agg
                });
    });
            
    });
   }
};
/////////

//my pics page

////////////////


exports.mypics= function(req, res){
    var db = mongo.client;
    var sn = req.session.sn || 0;  
    var uimage = req.session.snimage || 0;
    if(sn !=0 ){
    getPics(uimage,res,db,req, function(result) {
        if(result.length > 0){
                 aggregateResults(res, req ,db, function(agg) {
           
                console.log(agg);
                //res.redirect(result);
                res.render('pages/mypics', {
               title: 'Pinterest Clone App',
               pics: result,
               error: "",
               sn: sn,
               uimage: uimage,
               likes: agg
                });
    });
           
           console.log("result: ");
           console.log(result);
            }
            else if(!result.length){
                console.log("result: ");
                console.log(result);
                 aggregateResults(res, req ,db, function(agg) {
           
                console.log(agg);
                //res.redirect(result);
                res.render('pages/mypics', {
               title: 'Pinterest Clone App',
               pics: result,
               error: "None Available.",
               sn: sn,
               uimage: uimage,
               likes: agg
                });
    });
            }         
            else{
             aggregateResults(res, req ,db, function(agg) {
           
                console.log(agg);
                //res.redirect(result);
                res.render('pages/mypics', {
               title: 'Pinterest Clone App',
               pics: result,
               error: "error.",
               sn: sn,
               uimage: uimage,
               likes: agg
                });
    });
            }

    });
}else{
         res.redirect('/'); 
     }     
};

////////////////


// User pics page

////////////////


exports.userPics= function(req, res){
    var db = mongo.client;
    var sn = req.session.sn || 0;  
    var uimage = req.body.uimage;
    console.log("image " + uimage);
    
    if(uimage !=0 ){
    getPics(uimage,res,db,req, function(result) {
            if(result.length > 0){  
              aggregateResults(res, req ,db, function(agg) {
           
                console.log(agg);
                //res.redirect(result);
                res.render('pages/userPics', {
               title: 'Pinterest Clone App',
               pics: result,
               error: "",
               sn: sn,
               uimage: uimage,
               likes: agg
                });
             });
           
           console.log("result: ");
           console.log(result);
            }
            else if(!result.length){
                console.log("result: ");
                console.log(result);
                 aggregateResults(res, req ,db, function(agg) {
           
                console.log(agg);
                //res.redirect(result);
                res.render('pages/userPics', {
               title: 'Pinterest Clone App',
               pics: result,
               error: "None Available.",
               sn: sn,
               uimage: uimage,
               likes: agg
                });
             });
            }         
            else{
             aggregateResults(res, req ,db, function(agg) {
           
                console.log(agg);
                //res.redirect(result);
                res.render('pages/userPics', {
               title: 'Pinterest Clone App',
               pics: result,
               error: "error.",
               sn: sn,
               uimage: uimage,
               likes: agg
                });
             });
            }

    });
}else{
         res.redirect('/'); 
     }     
};

////////////////

////////////////
// Pic Insert

exports.addpic = function(req, res){
console.log("HERE");
    var db = mongo.client;
    var sn = req.session.sn || 0;
    console.log(sn);
    
    var imageurl = req.body.url;
    console.log(imageurl);
    
    var desc= req.body.desc;
    console.log(desc);    
if(sn !=0){

if ( imageurl !="" || desc !="" ){
                    
db.collection('users', function(err, collection) {
           if (err) throw err; 
    collection.findOne({ 'sn': sn }, function(err, user) {
    if (err) throw err; 
    if (user) { 
        console.log("user exists");
        var picQuery = { 'imageurl' : imageurl,
                     'desc' : desc,
                     'sn': sn,
                     'userimage': user.image
                    };
 db.collection('pics', function(err, collection) {
           if (err) throw err; 
    collection.findOne({ 'sn': sn, 'imageurl': imageurl  }, function(err, pic) {
    
    if (err) throw err; 
    if (pic) {
        console.log("pic already exists");
         getAllPins(res,db, function(result) {
    res.render('pages/welcome', {
               title: 'Pinterest Clone App',
               res: result,
               error: "Picture already exists",
               sn: sn,
               likes: ""
            });
    });
         
    }
    else{
        
        /// check if its their own pic ...
        ///////////////////////////////////
        
db.collection('pics', function(err, collection) {
           if (err) throw err; 
    collection.findOne({ 'sn': sn, 'imageurl': imageurl }, function(err, pic) {
    if (err) throw err; 
    if (pic) {
     console.log ("It is your own pic!");
     getAllPins(res,db, function(result) {
    res.render('pages/welcome', {
               title: 'Pinterest Clone App',
               res: result,
               error: "It is your own picture!",
               sn: sn,
               likes: ""
            });
            
    });
    }
    else{
        
        // insert pic
     var squery = db.collection('pics'); 
        console.log(squery);
        squery.insert(picQuery, function(err, result1) {
         if (err) throw err; 
            console.log('Saved ');
            console.log( result1); 
            
            //////////////////
            
        getAllPins(res,db, function(result) {
    res.render('pages/welcome', {
               title: 'Pinterest Clone App',
               res: result,
               error: "OK Added",
               sn: sn,
               likes: ""
            });
            
    });
            
});
    }
    }); 
    });     
        /////////////////////////////
 
    }
    }); 
    });     
        
        
    }
    else{
       res.redirect('/');
    }
    }); 
    });  
}  else {
        getAllPins(res,db, function(result) {
    res.render('pages/welcome', {
               title: 'Pinterest Clone App',
               res: result,
               error: "None Entered.",
               sn: sn,
               likes: ""
            });
            
    });
    }
        
}    else
{
    getAllPins(res,db, function(result) {
    res.render('pages/index', {
               title: 'Pinterest Clone App',
               res: result,
               error: "",
               sn: sn
            });
            
    });
}
};
////////////////


//////////////// Delete myPic


exports.delmypic = function(req, res){
    var db = mongo.client;
     var user1 = req.session.user || 0; 
     var sn = req.session.sn || 0;
     console.log("user is : " + user1);
     //var book = req.body.book;
    var imageurl = req.body.imageurl || 0;
    var uimage = req.body.uimage;
     
     if(sn != 0 || imageurl){
         var query = {imageurl, sn};
        delMyPic( query, db, function(deleteBook) {
          if(deleteBook.length > 0){
                 getPics(uimage,res,db,req, function(result) {
            if(result.length > 0){  
                 res.render('pages/userPics', {
                                title: 'Pinterest Clone App',
                                error: "",
                                pics: result,
                                uimage: uimage
                 });
           
           console.log("result: ");
           console.log(result);
            }
            else if(!result.length){
                console.log("result: ");
                console.log(result);
                 res.render('pages/userPics', {
                            title: 'Pinterest Clone App',
                            error: "None Available.",
                            pics: result,
                                uimage: uimage
                            });
            }         
            else{
             res.render('pages/userPics', {
                title: 'Pinterest Clone App',
                error: "error",
                pics: result,
                uimage: uimage
            });
            }

    });
    }
    else{
        getPics(uimage,res,db,req, function(result) {
            if(result.length > 0){  
                 res.render('pages/userPics', {
                                title: 'Pinterest Clone App',
                                error: "OK Removed.",
                                pics: result,
                                uimage: uimage
                 });
           
           console.log("result: ");
           console.log(result);
            }
            else if(!result.length){
                console.log("result: ");
                console.log(result);
                 res.render('pages/userPics', {
                            title: 'Pinterest Clone App',
                            error: "None Available.",
                            pics: result,
                                uimage: uimage
                            });
            }         
            else{
             res.render('pages/userPics', {
                title: 'Pinterest Clone App',
                error: "error",
                pics: result,
                uimage: uimage
            });
            }
    });
    }
             
             /////
    });
     }else{
         res.redirect('/'); 
     }        
};

////////////////


////////////////////////////////////////////// FUNCTIONS Inner Calls
/////////////

function getAllPins(res,db, callback) {
  getAllPinsData(res,db, function(data) {
    callback(data);
  });
}

function getAllPinsData(res,db, callback) { 
        var cursor = db.collection('pics').find().sort({ when: -1 });
        cursor.skip(0);
        
         var result = [];

          cursor.each(function(err, item) {
             if(item == null) {
                //db.close();
                  callback(result);
                return;
            }
        console.log(err);
          //console.log(item);

             result.push({ desc: item["desc"], imageurl: item["imageurl"], sn: item["sn"], userimage: item["userimage"] } );
            // console.log(JSON.stringify(result));
    });
   }    

//////

//////////////////////////////////
function findUser(image, sn,mongo,res, callback) {
  getUserData(image, sn,mongo, res, function(data) {
    callback(data);
  });
}
   
function getUserData(image, sn, mongo, res, callback) {
                console.log("db3: ");
                //console.log(mongo);
                var query = {   'sn' : sn,
                                'image' : image };
                     console.log(query);
                     console.log('query');
mongo.collection('users', function(err, collection) {
           if (err) throw err; 
    collection.findOne({ 'sn': sn }, function(err, user) { 
    
    if (err) throw err; 
    if (user) { 
        console.log("user exists");
        callback(user);
    }
    else if(sn !=0){
        console.log("user does not exists");
        // save user to db
        var squery = mongo.collection('users'); 
        console.log(squery);
        squery.insert(query, function(err, result1) { 
         if (err) throw err; 
            console.log('Saved ' + result1); 
            //return result;
        callback(1);
            });
    }
    else{
        callback(0);
    }
    }); 
    });                      
}
//////

 /////////////

function getPics(uimage,res,db,req, callback) {
  getPicsData(uimage,res,db,req, function(data) {
    callback(data);
  });
}

function getPicsData(uimage,res,db,req, callback) { 
        var cursor = db.collection('pics').find( {"userimage": uimage } ).sort({ when: -1 });
        cursor.skip(0);
        
         var result = [];
         cursor.each(function(err, item) {
             if(item == null) {
                //db.close();
                  callback(result);
                return;
            }
        console.log(err);
          //console.log(item);

             result.push({ desc: item["desc"], imageurl: item["imageurl"], sn: item["sn"], _id: item["id"], userimage: item["userimage"] } );
             //console.log(JSON.stringify(result));
    });
   }    

//////

////// Delete Pic with Likes

function delMyPic(query, db, callback) {
  delMyPicData(query, db, function(data) {
    callback(data);
  });
}
   /// 
function delMyPicData(query, db, callback) {
      // delete in db collection
db.collection('pics', function(err, collection) {
           if (err) throw err; 
           console.log(query);
        collection.findOne({ 'imageurl': query.imageurl, 'sn': query.sn }, function(err, pic) {
        console.log("" + pic + " " + pic);
            if (err) throw err; 
    if (pic) {
        console.log("pic exists");
        console.log(pic);
        db.collection('likes', function(err, collection) {
           if (err) throw err; 
           collection.remove({ imageurl : query.imageurl, 'sn': query.sn }, function(err, result) {
                console.log("remove likes.");
            if (err) throw err; 
            ///////////////////
            
   db.collection('pics', function(err, collection) {
           if (err) throw err; 
           console.log(query);
        collection.findOne({ 'imageurl': query.imageurl , 'sn': query.sn }, function(err, pic) {
        console.log("" + pic + " " + pic);
            if (err) throw err; 
    if (pic) {
        console.log("pic exists");
        console.log(pic);
        collection.findOneAndDelete({ 'imageurl': query.imageurl, 'sn': query.sn }, function(err, pic) {
    if (err) throw err; 
   // console.log(collection);
    if (pic)  {
        console.log("pic exists");
        console.log(pic);
        console.log("Result from removing pic: ");
        // delete  record....
        ///////////////////////
       callback(pic);
    } else{
        callback(pic);
    }
    });
    } else {
    callback(pic);
    }
   });   
           
});
        });
});
    } else {
    callback(pic);
    }
   });   
           
});      
}      
//////

//////////////////////////////////

function userLikes (qLikesObj, db, res, callback) {
  getLikesData(qLikesObj, db, res, function(data) {
    callback(data);
  });
}
   
function getLikesData(qLikesObj, db, res, callback) { 
      // save into db collection
      
    //var squery= db.collection('pollsappdb');
    db.collection('like', function(err, collection) {
           if (err) throw err; 
    collection.findOne({ sn: qLikesObj.sn, url : qLikesObj.url }, function(err, like) { 
        console.log("USER IS: " + like);
    if (err) throw err; 
    if (like) { 
        console.log("user like exists");
        console.log(like + " " + qLikesObj.sn);
        //////// remove so unlike
        
    db.collection('like', function(err, collection) {
         if (err) throw err;
	// find the going user with the list.
      collection.remove({ sn: qLikesObj.sn, url : qLikesObj.url }, {w:1}, function (err, result) {
        if (err) throw err;
        console.log("Result from removing like: ");
        console.log(result);
       //res.redirect('/');
       //callback( 1 );
      });
    });	 
        
        //////
         callback(1);
    } else {
            console.log("users like doesn't exist");
            var voteQuery = db.collection('like'); 
            console.log(qLikesObj.sn);
            
            voteQuery.insert(qLikesObj, function(err, result1) {
             if (err) throw err; 
                console.log('Saved ' + result1);
//////
//return result;
                callback(0);
                //return 0;
                    });  
    }// end else
    }); 
    }); 
   }
//////


//////
function aggregateResults( res, req ,db, callback) {
  getARData(res,req ,db, function(data) {
    callback(data);
  });
}
   /// 
function getARData( res, req ,db, callback) {
      // save into db collection
   db.collection('like').aggregate(
     [
       //{ $match: { "url": url } },
       { $group: { "_id": "$url" , "count": { $sum: 1 } } }
     ]).toArray(function(err, result) {
       if ( err ) throw err;
       console.log("res: ");
       console.log(result);
       
       
       
       
       callback(result);
     });
    
   } 
  // end  

/////////////////////////////////