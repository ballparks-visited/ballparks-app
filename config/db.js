module.exports = {
	url : 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + ':27017/testAPP'
}