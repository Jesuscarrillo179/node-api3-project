const express = require('express');
const Db = require('./userDb')
const postDb = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUser,(req, res) => {
  const user = req.body

  Db.insert(user)
  .then(db => {
    res.status(201).json({message: "user created!"})
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({message: "status 500 server error"})
  })
});

router.post('/:id/posts', validateUserId, validatePost,(req, res) => {
  const post = req.body
  const { text } = post
  const user_id = req.user.id

   postDb.insert({text, user_id})
   .then(db => {
     res.status(201).json(db)
   })
   .catch(error => {
     console.log(error)
     res.status(500).json({message: "status 500 server error"})
   })
});

router.get('/', (req, res) => {
  Db.get()
  .then(db => {
    res.status(200).json(db)
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({message: "status 500 server error"})
  })
});

router.get('/:id', validateUserId,(req, res) => {
  const id = req.user.id
  Db.getById(id)
  .then(db => {
    res.status(202).json(db)
  })
  .catch(error => {
    res.status(500).json({message: "status 500 server error"})
  })
});

router.get('/:id/posts', validateUserId,(req, res) => {
  const id = req.user.id
  Db.getUserPosts(id)
  .then(db => {
    res.status(200).json(db)
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({message: "status 500 server error"})
  })

});

router.delete('/:id', validateUserId,(req, res) => {
  const id = req.user.id
  Db.remove(id)
  .then(db => {
    res.status(202).json({message: "user deleted!"})
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({message: "status 500 server error"})
  })
});

router.put('/:id', validateUserId, validateUser,(req, res) => {
  const id = req.user.id
  const newUser = req.body

  if (!newUser.name) {
    res.status(400).json({ errorMessage: "Please provide a name." })
  } else {
    Db.update(id, newUser)
    .then(db => {
      res.status(202).json({message: "name updated!"})
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({message: "status 500 server error"})
    })
  }
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id
  Db.getById(id).then(db => {
    if(db){
      req.user = db
      next()
    }
    else{
      res.status(400).json({ message: "invalid user id" })
    }
  })
}

function validateUser(req, res, next) {
  const user = req.body
  if(user.name === ""){
    res.status(400).json({ message: "missing required name field" })
  } else if (Object.keys(user).length === 0){
    res.status(404).json({ message: "missing user data" })
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  const post = req.body
  if(post.text === ""){
    res.status(400).json({ message: "missing required text field" })
  } else if (Object.keys(post).length === 0){
    res.status(404).json({ message: "missing post data" })
  } else {
    next()
  }
}

module.exports = router;
