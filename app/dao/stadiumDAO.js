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


//READ all stadiums
function readStadiums(skip, count) {
	var deferred = new Deferred();

	// TODO: use StadiumModel to query for all stadiums; use mongoose documentation
	deferred.resolve({"test": true});/*remove this line*/

	return deferred;
}


module.exports.readStadiums = readStadiums;

/* ====================================================================================================== */
/* ======================================= [ Private Functions ] ======================================== */
/* ====================================================================================================== */

