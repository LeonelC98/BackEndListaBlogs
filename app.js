
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/Blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false);

logger.info('Estableciendo conexion con la base de datos', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
.then(()=>{
    logger.info('Establecida conexion con la base de datos')
}).catch((error)=>{
    logger.error('Error al conectar con la base de datos ', error.message)
})

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs',blogsRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app;