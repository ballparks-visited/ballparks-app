var config = require('../../config/config');
var mongoose = require('mongoose');
var PromiseIO = require('promised-io/promise');
var jwt = require('jsonwebtoken');
var Deferred = PromiseIO.Deferred;

var isInTest = typeof global.it === 'function';

var Schema = mongoose.Schema;
	ObjectId = Schema.ObjectId;
var UserSchema = new Schema({
	first_name:       { type: String, required: true },
	last_name:        { type: String, required: true },
	fb_id:            { type: String, required: true, unique: true },
	access_token:     { type: String, required: true },
	token_expire:     { type: String, required: true },
	permissions:      { type: String, required: true },
	signed_request:   { type: String, required: true },
	dateCreated:      { type: Date },
	dateModified:     { type: Date },
	ballparks:        [{
						data: { type: Schema.ObjectId, ref: 'Ballpark' },
						dateVisited: { type: Date }
					  }]
});

UserSchema.pre('save', function(next){
	now = new Date();
	this.dateModified = now;
	if ( !this.dateCreated ) {
		this.dateCreated = now;
	}
	next();
});

UserSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    fb_id: this.fb_id,
    access_token: this.access_token,
    first_name: this.first_name,
    exp: parseInt(expiry.getTime() / 1000),
  }, config.jwtSecret);
};
var UserModel = mongoose.model('User', UserSchema);

/* ====================================================================================================== */
/* ======================================= [ Public Functions ] ========================================= */
/* ====================================================================================================== */

// UPSERT user by facebook id
function upsertUserByFBId(user) {
	var deferred = new Deferred();
	
	var query = {'fb_id': user.fb_id};
	UserModel.findOneAndUpdate(query, user, {new:true, upsert:true}, function(err, f) {
		if (!err) {
			if(!isInTest) console.log("[ADD]   User created with id: " + f._id);
			deferred.resolve(f);
		} else {
			if(!isInTest) console.log(err);
			deferred.reject(err);
		}
	});

	return deferred;
}

//READ all users
function readUsers(userIds) {
	var deferred = new Deferred();

	var query = {};
	if(typeof userIds !== 'undefined') {
		query.fb_id = {$in: userIds.split(',')};
	}

	UserModel.find(query)
	.sort('-dateCreated').exec('find', function (err, users) {
		if (!err) {
			if(!isInTest) console.log('[GET]   Get users: ' + users.length);
			deferred.resolve(users);
		} else {
			if(!isInTest) console.log(err);
			deferred.reject(err);
		}
	});

	return deferred;
}

//READ user by id
function readUserById(id){
	var deferred = new Deferred();
	
	UserModel.findOne({'fb_id': id}).populate('ballparks.data').exec('find', function (err, user) {
		if (!err) {
			if(!isInTest) console.log('[GET]   Get user: ' + user[0]._id);
			deferred.resolve(user[0]);
		} else {
			if(!isInTest) console.log(err);
			deferred.reject(err);
		}
	});

	return deferred.promise;
}

//UPDATE user
function addUserBallpark(id, ballparkId, dateVisited){
	var deferred = new Deferred();

	UserModel.findOne({'fb_id': id} , function (err, user) {
		if (!err) {

			// make sure this ballpark is not already added
			var addBallpark = true;
			for (var i = 0; i < user.ballparks.length; i++) {
				if(user.ballparks[i].data == ballparkId) {
					addBallpark = false;
				}
			}
			if(addBallpark) {
				user.ballparks.push({ "dateVisited": dateVisited, "data": ballparkId });
			}
			
			return user.save(function (err) {
				if (!err) {
					if(!isInTest) console.log("[UDP]   Updated user: " + user._id);
					deferred.resolve(user);
				} else {
					if(!isInTest) console.log(err);
					deferred.reject(err);
				}
			});
		} else {
			if(!isInTest) console.log(err);
			deferred.reject(err);
		}
	});

	return deferred.promise;
}

// remove user ballpark
function removeUserBallpark(id, ballparkId){
	var deferred = new Deferred();

	UserModel.findOne({'fb_id': id} , function (err, user) {
		if (!err) {

			// make sure this ballpark is not already added
			var removeIndex = -1;
			for (var i = 0; i < user.ballparks.length; i++) {
				if(user.ballparks[i].data == ballparkId) {
					removeIndex = i;
				}
			}
			if(removeIndex >= 0) {
				user.ballparks.splice(removeIndex, 1);
			}
			
			return user.save(function (err) {
				if (!err) {
					if(!isInTest) console.log("[UDP]   Updated user: " + user._id);
					deferred.resolve(user);
				} else {
					if(!isInTest) console.log(err);
					deferred.reject(err);
				}
			});
		} else {
			if(!isInTest) console.log(err);
			deferred.reject(err);
		}
	});

	return deferred.promise;
}


//DELETE user
 function deleteUser(id){ 		
	var deferred = new Deferred();
	
	UserModel.remove({'fb_id': id} , function (err,result) {
		if (!err) {
			if(!isInTest) console.log("[DEL]    Deleted user");
			deferred.resolve();
		} else {
			if(!isInTest) console.log(err);
			deferred.reject(err);
		};
 	});
	
	return deferred.promise;
 }

module.exports.upsertUserByFBId = upsertUserByFBId;
module.exports.readUsers = readUsers;
module.exports.readUserById = readUserById;
module.exports.addUserBallpark = addUserBallpark;
module.exports.removeUserBallpark = removeUserBallpark;
module.exports.deleteUser = deleteUser;

/* ====================================================================================================== */
/* ======================================= [ Private Functions ] ======================================== */
/* ====================================================================================================== */

/*

//CREATE new user
function createUser(user, callbacks){
	var f = new UserModel({
		name:           user.name,
		description:    user.description,
		price:          user.price
	});

	f.save(function (err) {
		if (!err) {
			if(!isInTest) console.log("[ADD]   User created with id: " + f._id);
			callbacks.success(f);
		} else {
			if(!isInTest) console.log(err);
			callbacks.error(err);
		}
	});
}

//UPDATE user
function updateUser(id, user, callbacks){
	return UserModel.findById(id, function (err, f) {
		if (!err) {
			if (user.name) f.name = user.name;
			if (user.description) f.description = user.description;
			if (user.price) f.price = user.price;

			return f.save(function (err) {
				if (!err) {
					if(!isInTest) console.log("[UDP]   Updated user: " + f._id);
					callbacks.success(f);
				} else {
					if(!isInTest) console.log(err);
					callbacks.error(err);
				}
			});
		} else {
			if(!isInTest) console.log(err);
			callbacks.error(err);
		}
	});
}

*/
