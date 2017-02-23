var mongoose = require('mongoose');
var PromiseIO = require('promised-io/promise');
var Deferred = PromiseIO.Deferred;

var isInTest = typeof global.it === 'function';

var Schema = mongoose.Schema;
// TODO: add stadium schema
var StadiumSchema = new Schema({
	
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


//READ all stadiums
function readStadiums(skip, count) {
	var deferred = new Deferred();

	// TODO: use StadiumModel to query for all stadiums; use mongoose documentation

	return deferred;
}


module.exports.readStadiums = readStadiums;

/* ====================================================================================================== */
/* ======================================= [ Private Functions ] ======================================== */
/* ====================================================================================================== */

