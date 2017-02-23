var mongoose = require('mongoose');
var PromiseIO = require('promised-io/promise');
var Deferred = PromiseIO.Deferred;

var isInTest = typeof global.it === 'function';

var Schema = mongoose.Schema;
var UserSchema = new Schema({
	first_name:       { type: String, required: true },
	last_name:        { type: String, required: true },
	fb_id:            { type: Number, required: true, unique: true },
	access_token:     { type: String, required: true },
	token_expire:     { type: String, required: true },
	permissions:      { type: String, required: true },
	signed_request:   { type: String, required: true },
	dateCreated:      { type: Date},
	dateModified:     { type: Date}
});

UserSchema.pre('save', function(next){
	now = new Date();
	this.dateModified = now;
	if ( !this.dateCreated ) {
		this.dateCreated = now;
	}
	next();
});
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
function readUsers(skip, count) {
	var deferred = new Deferred();

	UserModel.find()
	.sort('-dateCreated').skip(skip).limit(count).exec('find', function (err, users) {
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
function readUserById(id, callbacks){
	return UserModel.findById(id, function (err, user) {
		if (!err) {
			if(!isInTest) console.log('[GET]   Get user: ' + user._id);
			callbacks.success(user);
		} else {
			if(!isInTest) console.log(err);
			callbacks.error(err);
		}
	});
}


//DELETE user
// function deleteUser(id, callbacks){
// 	return UserModel.findById(id, function (err, f) {
// 		if (!err) {
// 			return f.remove(function (err) {
// 				if (!err) {
// 					if(!isInTest) console.log("[DEL]    Deleted user: " + f._id);
// 					callbacks.success(f);
// 				} else {
// 					if(!isInTest) console.log(err);
// 					callbacks.error(err);
// 				}
// 			});
// 		} else {
// 			if(!isInTest) console.log(err);
// 			callbacks.error(err);
// 		}
// 	});
// }

module.exports.upsertUserByFBId = upsertUserByFBId;
module.exports.readUsers = readUsers;
module.exports.readUserById = readUserById;
// module.exports.deleteUser = deleteUser;

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
