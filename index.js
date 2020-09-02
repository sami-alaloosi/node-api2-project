const express = require('express')
const server = express()
const dp = require('./data/db')
const cros = require('cors')
const postRouter = require('./posts/post-router')
server.use(express.json())
server.use(cros())
server.use('/api/posts', postRouter)



const port = 4000
server.listen(port, ()=>{
    console.log(`server listening to port:${port}`)
})