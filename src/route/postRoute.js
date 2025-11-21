const express = require('express');
const router = express.Router();

const {
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getPosts,
  getUserPosts,
  getFeedPosts,
  searchPosts,
  getPostsByTags,
  likePost,
  unlikePost,
  getTopPosts,
  getFoodReviewsByRating,
} = require('../controller/postController');

const { authenticate, optionalAuth } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validator');
const { validateCreatePost, validateUpdatePost } = require('../validation/postValidation');

// CRUD
router.post('/', authenticate, validateCreatePost, handleValidationErrors, createPost);
router.put('/:postId', authenticate, validateUpdatePost, handleValidationErrors, updatePost);
router.delete('/:postId', authenticate, deletePost);

// Like/Unlike
router.post('/:postId/like', authenticate, likePost);
router.post('/:postId/unlike', authenticate, unlikePost);

// Feed
router.get('/feed', authenticate, getFeedPosts);

// Public routes
router.get('/tags', optionalAuth, getPostsByTags);
router.get('/top', optionalAuth, getTopPosts);
router.get('/food-reviews/rating', optionalAuth, getFoodReviewsByRating);
router.get('/user/:authorId', optionalAuth, getUserPosts);
router.get('/', optionalAuth, getPosts);
router.get('/:postId', optionalAuth, getPostById);

module.exports = router;
