const express = require('express');
const router = express.Router();

const {
  createComment,
  getCommentById,
  getCommentsByPost,
  getRepliesByComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
} = require('../controller/commentController');

const { authenticate } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validator');
const {
  validateCreateComment,
  validateUpdateComment,
  validateDeleteComment,
  validateGetComment,
  validateGetComments,
  validateLikeComment,
  validateUnlikeComment,
  validateGetReplies,
} = require('../validation/commentValidation');

// Create a new comment (requires authentication)
router.post(
  '/',
  authenticate,
  validateCreateComment,
  handleValidationErrors,
  createComment
);

// Get comments by post ID (optional authentication for personalized data)
router.get(
  '/post/:postId',
  validateGetComments,
  handleValidationErrors,
  getCommentsByPost
);

// Get a single comment by ID (optional authentication)
router.get(
  '/:commentId',
  validateGetComment,
  handleValidationErrors,
  getCommentById
);

// Get replies of a comment (optional authentication)
router.get(
  '/:commentId/replies',
  validateGetReplies,
  handleValidationErrors,
  getRepliesByComment
);

// Update a comment (requires authentication)
router.put(
  '/:commentId',
  authenticate,
  validateUpdateComment,
  handleValidationErrors,
  updateComment
);

// Delete a comment (requires authentication)
router.delete(
  '/:commentId',
  authenticate,
  validateDeleteComment,
  handleValidationErrors,
  deleteComment
);

// Like a comment (requires authentication)
router.post(
  '/:commentId/like',
  authenticate,
  validateLikeComment,
  handleValidationErrors,
  likeComment
);

// Unlike a comment (requires authentication)
router.post(
  '/:commentId/unlike',
  authenticate,
  validateUnlikeComment,
  handleValidationErrors,
  unlikeComment
);

module.exports = router;