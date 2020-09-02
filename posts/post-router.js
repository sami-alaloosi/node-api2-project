const express = require('express')
const dp = require('../data/db')
const e = require('express')
const router = express.Router()

//Get all 

router.get('/', (req, res)=>{
    dp.find()
    .then((posts)=> res.status(200).json(posts))
    .catch(()=>res.status(500).json({ error: "There was an error while saving the comment to the database" }) )
})

// Get by ID

router.get('/:id', (req, res)=>{
    const {id} = req.params
    dp.findById(id)
    .then((post)=>{
        if(typeof post[0] !== "object"){ res.status(404).json({ message: "The post with the specified ID does not exist." })} else {res.status(200).json(post)}
    })
    .catch(()=>status(500).json({ error: "The post information could not be retrieved." }))
})

// Get  all comments by  post ID

router.get('/:id/comments', (req, res)=>{
    const {id} = req.params
    dp.findPostComments(id)
    .then((comment)=>{
        if(comment.length === 0) {res.status(404).json({ message: "The post with the specified ID does not exist." })} else {res.status(200).json(comment)}
    })
    .catch(()=> res.status(500).json({ error: "The comments information could not be retrieved." }))
})

// post a post 

router.post('/', (req, res)=>{
    const info = req.body
    dp.insert(info)
    .then(()=> {
        if( typeof info.title === "string" &&  typeof info.contents === "string"){res.status(201).json(info)} else  {res.status(400).json({ errorMessage: "Please provide title and contents for the post." })} 
        
    })
    .catch(()=> res.status(500).json({ error: "There was an error while saving the post to the database" }))
})

// post a comment


router.post('/:id/comments', (req, res)=>{
    const {id} = req.params
    const myComment = req.body
    dp.findById(id)
    .then((post)=>{
        if(post.length !== 0){
            dp.insertComment(myComment)
    .then((something)=> {if( typeof myComment.text === "string"){res.status(201).json(something)} else { res.status(400).json({ errorMessage: "Please provide text for the comment." })}
  })
    .catch(()=> res.status(500).json({ error: "There was an error while saving the comment to the database" }))
        } else {res.status(404).json({ message: "The post with the specified ID does not exist." })}
    })

    .catch(()=> res.status(500).json({ error: "There was an error while saving the comment to the database" }))

})





// Delete a post 

router.delete('/:id', (req, res)=>{
    const {id} = req.params
    dp.remove(id)
    .then((deletedPost)=> {
        if(deletedPost === 1){res.status(200).json(deletedPost)} else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
        })
    .catch(()=> res.status(500).json({ error: "The post could not be removed" }))
})



// Put update a post

router.put("/:id", (req, res) => {
    const id = req.params.id;
    const info = req.body;
    if (!info.title || !info.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        dp.update(id, info)
            .then(post => {
                if (post) {
                    res.status(200).json(info)
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: "The post information could not be modified." })
            })
    }
})




module.exports = router