const { catchAsync } = require('../utils/error');
const Comment = require('../model/commentModel');
const { authenticate } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/v1/comments:
 *   post:
 *     summary: Create a new comment
 *     description: Add a comment to a post or reply to another comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 */
const createComment = catchAsync(async (req, res, next) => {
    const commentData = {
        ...req.body,
        author: req.user._id,
    };

    const comment = await commentService.createComment(commentData);
    res.status(201).json({
        success: true,
        message: 'Comment created successfully',
        data: comment,
    });
});

/**
 * @swagger
 * /api/v1/comments/{commentId}:
 *   get:
 *     summary: Get comment by ID
 *     tags: [Comments]
 */
const getCommentById = catchAsync(async (req, res, next) => {
    const { commentId } = req.params;
    const userId = req.user ? req.user._id : null;
    const comment = await commentService.getCommentById(commentId, userId);
    res.status(200).json({
        success: true,
        data: comment,
    });
});

/**
 * @swagger
 * /api/v1/comments/post/{postId}:
 *   get:
 *     summary: Get comments of a post
 *     tags: [Comments]
 */
const getCommentsByPost = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const result = await CommentService.getCommentByPost(postId, req.user ? req.user._id : null, {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || 'createdAt',
        order: req.query.order || 'asc',
    });
     res.status(200).json({
        success: true,
        data: result,
    });
});

/**
 * @swagger
 * /api/v1/comments/{commentId}/replies:
 *   get:
 *     summary: Get replies of a comment
 *     tags: [Comments]
 */
const getRepliesByComment = catchAsync(async (req, res, next) => {
    const { commentId } = req.params;
    const userId = req.user ? req.user._id : null;
    const replies = await commentService.getRepliesByComment(commentId, userId,{
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || 'createdAt',
        order: req.query.order || 'asc',
    });
    res.status(200).json({
        success: true,
        data: replies,
    });
});

/**
 * @swagger
 * /api/v1/comments/{commentId}:
 *   put:
 *     summary: Update a comment
 *     description: Only author can update
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 */
const updateComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;

  const updated = await commentService.updateComment(
    commentId,
    req.body,
    req.user._id
  );

  res.status(200).json({
    success: true,
    message: 'Comment updated successfully',
    data: updated,
  });
});

/**
 * @swagger
 * /api/v1/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     description: Soft delete - only author can delete
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 */
const deleteComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;

  const result = await commentService.deleteComment(commentId, req.user._id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

/**
 * @swagger
 * /api/v1/comments/{commentId}/like:
 *   post:
 *     summary: Like a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 */
const likeComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;

  const updated = await commentService.likeComment(
    commentId
  );

  res.status(200).json({
    success: true,
    message: 'Comment liked successfully',
    data: { engagement: updated.likes_count },
  });
});

/**
 * @swagger
 * /api/v1/comments/{commentId}/unlike:
 *   post:
 *     summary: Unlike a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 */
const unlikeComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;

  const updated = await commentService.unlikeComment(
    commentId
  );

  res.status(200).json({
    success: true,
    message: 'Comment unliked successfully',
    data: { engagement: updated.likes_count },
  });
});

module.exports = {
  createComment,
  getCommentById,
  getCommentsByPost,
  getReplies,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
};
