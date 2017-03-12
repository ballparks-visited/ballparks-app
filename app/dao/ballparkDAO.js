var mongoose = require('mongoose');
var PromiseIO = require('promised-io/promise');
var Deferred = PromiseIO.Deferred;

var isInTest = typeof global.it === 'function';

var Schema = mongoose.Schema;
// TODO: add ballpark schema
var BallparkSchema = new Schema({
	primary_name:       { type: String, required: true },
	alternate_names:    { type: String, required: true },
	home_team:          { type: String, required: true },
	league:             { type: String, required: true },
	street_address:     { type: String, required: true },
	city:               { type: String, required: true },
	state:              { type: String, required: true },
	zip:                { type: Number, required: true },
	latitude:           { type: Number, required: true },
	longitude:          { type: Number, required: true },
	active_status:      { type: String, required: true },
});

BallparkSchema.pre('save', function(next){
	now = new Date();
	this.dateModified = now;
	if ( !this.dateCreated ) {
		this.dateCreated = now;
	}
	next();
});
var BallparkModel = mongoose.model('Ballpark', BallparkSchema);

/* ====================================================================================================== */
/* ======================================= [ Public Functions ] ========================================= */
/* ====================================================================================================== */

//READ all ballparks
function readBallparks(skip, count) {
	var deferred = new Deferred();

	BallparkModel.find()
	.sort('-dateCreated').skip(skip).limit(count).exec('find', function (err, ballparks) {
		if (!err) {
			if(!isInTest) console.log('[GET]   Get ballparks: ' + ballparks.length);
			deferred.resolve(ballparks);
		} else {
			if(!isInTest) console.log(err);
			deferred.reject(err);
		}
	});

	return deferred;
}

function readBallparkById(ids) {
	var deferred = new Deferred();

	BallparkModel.find({  _id : { $in : ids } })
	.sort('-dateCreated').exec('find', function (err, ballparks) {
		if (!err) {
			if(!isInTest) console.log('[GET]   Get ballparks: ' + ballparks.length);
			deferred.resolve(ballparks);
		} else {
			if(!isInTest) console.log(err);
			deferred.reject(err);
		}
	});

	return deferred;
}

module.exports.readBallparks = readBallparks;
module.exports.readBallparkById = readBallparkById;

/* ====================================================================================================== */
/* ======================================= [ Private Functions ] ======================================== */
/* ====================================================================================================== */
