const express = require('express');
const router = express.Router();
const Blogpost = require('../v1/models/blogpost');
const mongoose = require('mongoose');

router.get('/ping', (req, res) => {
    res.status(200).json({ msg: 'pong', date: new Date()});
}); //localhost:3000/ping

router.get('/blog-posts', (req, res) => {
   Blogpost.find()
    .sort({ 'createdOn': -1 })
    .exec()
    .then((blogPosts) => res.status(200).json(blogPosts))
    .catch(err => res.status(500).json({
        message: 'blog posts not found',
        error: err
    }));
})

router.get('/blog-posts/:id', (req, res) => {
    const id = req.params.id;
    Blogpost.findById(id)
    .then(blogPost => res.status(200).json(blogPost))
    .catch(err => res.status(500).json({
        message: `blog post with id ${id} not found`,
        error: err
    }));
})

router.post('/blog-posts', (req, res) => {
    console.log('req.body', req.body);
    const blogPost = new Blogpost(req.body);
    blogPost.save((err, blogPost) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(201).json(blogPost);
    });
});

router.delete('/blog-posts/:id', (req, res) => {
    const id = req.params.id;
    Blogpost.findByIdAndDelete(id, (err, blogPost) => {
        if (err) {
            return res.status(500).json(err)
        }
        res.status(202).json({ msg: `blogPost with id ${blogPost._id} deleted`});
    });
});

router.delete('/blog-posts', (req, res) => {
    const ids = req.query.ids;
    console.log(ids)
    const allIds = ids.split(',').map(id => {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            return mongoose.Types.ObjectId((id));
        } else {
            console.log('id is not valid', id);
        }
    });
    const condition = { _id: { $in : allIds } };
    Blogpost.deleteMany(condition, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(202).json(result)
    })
});

module.exports = router;