require('dotenv/config')

module.exports = {
	type: process.env.DB_CONNECTION,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_DATABASE,
	synchronize: process.env.DB_SYNCHRONIZE,
	logging: process.env.DB_LOGGING,
	entities: ['src/models/**/*.model.ts'],
	migrations: ['src/database/migrations/**/*.ts'],
	subscribers: ['src/database/subscribers/**/*.ts'],
	cli: {
		entitiesDir: 'src/models',
		migrationsDir: 'src/database/migrations',
		subscribersDir: 'src/database/subscribers',
	},
}
