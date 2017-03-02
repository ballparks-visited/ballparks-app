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

/* ====================================================================================================== */
/* ======================================= [ Public Functions ] ========================================= */
/* ====================================================================================================== */




//READ all Stadiums
function readStadiums(skip, count) {
	var deferred = new Deferred();

	StadiumModel.find()
	.sort('-dateCreated').skip(skip).limit(count).exec('find', function (err, stadiums) {
		if (!err) {
			if(!isInTest) console.log('[GET]   Get stadiums: ' + stadiums.length);
			deferred.resolve(stadiums);
		} else {
			if(!isInTest) console.log(err);
			deferred.reject(err);
		}
	});

	return deferred;
}



module.exports.upsertStadiumsByFBId = upsertUserByFBId;
module.exports.readStadiums = readUsers;
module.exports.readStadiumsrById = readUserById;
// module.exports.deleteStadium = deleteStadium;

/* ====================================================================================================== */
/* ======================================= [ Private Functions ] ======================================== */
/* ====================================================================================================== */


