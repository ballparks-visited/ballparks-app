// console.log(process.env);

if(typeof process.env.appMode !== 'undefined' && process.env.appMode === 'production') {
	// app is running in production mode
	module.exports = {
		mongo_url : process.env.MONGODB_URI,
		appId: process.env.FB_APP_ID,
		appSecret: process.env.FB_APP_SECRET,
		jwtSecret: process.env.JWT_SECRET
	} 
} /*
else {
	// app is running in test mode
	// module.exports = {
	// 	mongo_url : 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + ':27017/testAPP',
	// 	appId: "1272641912758292",
	// 	appSecret: "09be4141b221d59aa4f39619f6d1cd28",
	// 	jwtSecret: "6b4d826c2cd3e7d2068ee86948da351e06beb076"
	// }
	// app is running in test mode
	module.exports = {
		mongo_url : 'mongodb://heroku_q4jgklvp:te4ddga4b1ved2nbeferqndnso@ds157439.mlab.com:57439/heroku_q4jgklvp',
		appId: "1272641912758292",
		appSecret: "09be4141b221d59aa4f39619f6d1cd28",
		jwtSecret: "6b4d826c2cd3e7d2068ee86948da351e06beb076"
	}
} */

