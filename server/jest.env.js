process.env.DB_HOST = global.__TESTCONTAINERS_POSTGRES_IP__
process.env.DB_PORT = global.__TESTCONTAINERS_POSTGRES_PORT_5432__
process.env.DB_NAME = 'postgres'
process.env.DB_USER = 'test_user'
process.env.DB_PASSWORD = 'test_password'
