var mongooseRestEndpoints = require('mongoose-rest-endpoints');
var mongoose = require('mongoose');
var PromiseIO = require('promised-io/promise');
var Deferred = PromiseIO.Deferred;

var isInTest = typeof global.it === 'function';

var Schema = mongoose.Schema;
// TODO: add stadium schema
var StadiumSchema = new Schema({
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

StadiumSchema.pre('save', function(next){
	now = new Date();
	this.dateModified = now;
	if ( !this.dateCreated ) {
		this.dateCreated = now;
	}
	next();
});
var StadiumModel = mongoose.model('Stadium', StadiumSchema);

new mongooseRestEndpoints.endpoint('/api/Stadium', 'Stadium').register(app);

/* ====================================================================================================== */
/* ======================================= [ Public Functions ] ========================================= */
/* ====================================================================================================== */


// UPSERT Stadiums by facebook id
function upsertStadiumsByFBId(user) {
	var deferred = new Deferred();
	
	var query = {'fb_id': user.fb_id};
	StadiumModel.findOneAndUpdate(query, user, {new:true, upsert:true}, function(err, f) {
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

//READ all Stadiums
function readStadiums(skip, count) {
	var deferred = new Deferred();

	StadiumModel.find()
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

//READ Stadiums by id
function readStadiumsById(id, callbacks){
	return StadiumModel.findById(id, function (err, user) {
		if (!err) {
			if(!isInTest) console.log('[GET]   Get user: ' + user._id);
			callbacks.success(user);
		} else {
			if(!isInTest) console.log(err);
			callbacks.error(err);
		}
	});
}


//DELETE Stadium
// function deleteStadium(id, callbacks){
// 	return StadiumModel.findById(id, function (err, f) {
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

module.exports.upsertStadiumsByFBId = upsertUserByFBId;
module.exports.readStadiums = readUsers;
module.exports.readStadiumsrById = readUserById;
// module.exports.deleteStadium = deleteStadium;

/* ====================================================================================================== */
/* ======================================= [ Private Functions ] ======================================== */
/* ====================================================================================================== */

/*

//CREATE new Stadium
function createStadium(user, callbacks){
	var f = new StadiumModel({
		name:           user.name,
		description:    user.description,	
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
//UPDATE Stadium
function updateUser(id, user, callbacks){
	return StadiumModel.findById(id, function (err, f) {
		if (!err) {
			if (user.name) f.name = user.name;
			if (user.description) f.description = user.description;
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

