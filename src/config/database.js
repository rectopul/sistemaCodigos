require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
})

let database

if (process.env.DATABASE_URL) {
    // the application is executed on Heroku ... use the postgres database
    database = {
        use_env_variable:
            'postgres://xsmwpiwdiswucr:5f11c61ab31ba705b3bfe5e84a7455344f2b5eb8b16ea2181643df88d706eddd@ec2-52-72-221-20.compute-1.amazonaws.com:5432/d3gp5kd23selll',
        url:
            'postgres://xsmwpiwdiswucr:5f11c61ab31ba705b3bfe5e84a7455344f2b5eb8b16ea2181643df88d706eddd@ec2-52-72-221-20.compute-1.amazonaws.com:5432/d3gp5kd23selll',
        dialect: process.env.DB_DIALECT || 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
            },
        },
        host: 'ec2-52-72-221-20.compute-1.amazonaws.com',
        username: 'xsmwpiwdiswucr',
        password: '5f11c61ab31ba705b3bfe5e84a7455344f2b5eb8b16ea2181643df88d706eddd',
        database: 'd3gp5kd23selll',
        storage: './__tests__/database.sqlite',
        ssl: true,
        options: {
            port: 5432,
        },
        define: {
            timestamps: true,
            underscored: true,
            underscoredAll: true,
        },
    }
} else {
    // the application is executed on the local machine ... use mysql
    database = {
        dialect: process.env.DB_DIALECT || 'postgres',
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        storage: './__tests__/database.sqlite',
        logging: false,
        options: {
            port: 5432,
        },
        define: {
            timestamps: true,
            underscored: true,
            underscoredAll: true,
        },
    }
}

module.exports = database
