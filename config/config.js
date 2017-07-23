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
		module.exports = {
	 	mongo_url : 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + ':27017/testAPP',
	 	appId: "",
	 	appSecret: "",
	 	jwtSecret: ""
	 }
} */

