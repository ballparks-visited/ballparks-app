module.exports = {
	mongo_url : 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + ':27017/testAPP',
	appId: "1272641912758292",
	appSecret: "09be4141b221d59aa4f39619f6d1cd28",
	jwtSecret: "6b4d826c2cd3e7d2068ee86948da351e06beb076"
}