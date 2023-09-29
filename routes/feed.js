const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('../config/multer');

const feedController = require('../controllers/feed');

routes.get('/posts', feedController.getPosts)

routes.delete('/post/:id', feedController.deletePost)

routes.post('/post', multer(multerConfig).single('file') , feedController.createPost)

module.exports = routes;