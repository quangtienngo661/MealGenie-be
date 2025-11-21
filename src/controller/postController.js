const { catchAsync } = require('../util/catchAsync');
const postService = require('../service/postService');

/**
 * @swagger
 * /api/v1/posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a food review, recipe, or general post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 */
const createPost = catchAsync(async (req, res, next) => {
  const postData = {
    ...req.body,
    author: req.user._id, // Lấy từ auth middleware
  };

  const post = await postService.createPost(postData);

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: post,
  });
});

/**
 * @swagger
 * /api/v1/posts/{postId}:
 *   get:
 *     summary: Get post by ID
 *     description: Get detailed information of a specific post
 *     tags: [Posts]
 */
const getPostById = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user?._id; // Optional - có thể null nếu không login

  const post = await postService.getPostById(postId, userId);

  res.status(200).json({
    success: true,
    data: post,
  });
});

/**
 * @swagger
 * /api/v1/posts/{postId}:
 *   put:
 *     summary: Update post
 *     description: Update an existing post (only by author)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 */
const updatePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;
  const updateData = req.body;

  const post = await postService.updatePost(postId, userId, updateData);

  res.status(200).json({
    success: true,
    message: 'Post updated successfully',
    data: post,
  });
});

/**
 * @swagger
 * /api/v1/posts/{postId}:
 *   delete:
 *     summary: Delete post
 *     description: Delete a post (only by author)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 */
const deletePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const result = await postService.deletePost(postId, userId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

/**
 * @swagger
 * /api/v1/posts:
 *   get:
 *     summary: Get all posts with filters
 *     description: Get posts with pagination, filtering, and sorting
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: post_type
 *         schema:
 *           type: string
 *           enum: [food_review, recipe, general]
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 */
const getPosts = catchAsync(async (req, res, next) => {
  const {
    post_type,
    author,
    visibility,
    tags,
    search,
    minRating,
    maxRating,
    difficulty,
    page,
    limit,
    sortBy,
    sortOrder,
  } = req.query;

  const userId = req.user?._id;

  const filters = {
    userId,
    post_type,
    author,
    visibility,
    tags: tags ? (Array.isArray(tags) ? tags : [tags]) : undefined,
    search,
    minRating: minRating ? parseFloat(minRating) : undefined,
    maxRating: maxRating ? parseFloat(maxRating) : undefined,
    difficulty,
  };

  const options = {
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder || 'desc',
  };

  const result = await postService.getPosts(filters, options);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @swagger
 * /api/v1/posts/user/{authorId}:
 *   get:
 *     summary: Get posts by specific user
 *     description: Get all posts created by a specific user
 *     tags: [Posts]
 */
const getUserPosts = catchAsync(async (req, res, next) => {
  const { authorId } = req.params;
  const currentUserId = req.user?._id;
  const { page, limit, sortBy, sortOrder } = req.query;

  const options = {
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder || 'desc',
  };

  const result = await postService.getUserPosts(authorId, currentUserId, options);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @swagger
 * /api/v1/posts/feed:
 *   get:
 *     summary: Get feed posts
 *     description: Get personalized feed (public posts + user's own posts)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 */
const getFeedPosts = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { page, limit, sortBy, sortOrder } = req.query;

  const options = {
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder || 'desc',
  };

  const result = await postService.getFeedPosts(userId, options);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @swagger
 * /api/v1/posts/search:
 *   get:
 *     summary: Search posts
 *     description: Search posts by text in content, recipe title, ingredients, food name
 *     tags: [Posts]
 */
const searchPosts = catchAsync(async (req, res, next) => {
  const { q, page, limit, sortBy, sortOrder } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required',
    });
  }

  const userId = req.user?._id;

  const options = {
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder || 'desc',
  };

  const result = await postService.searchPosts(q, userId, options);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @swagger
 * /api/v1/posts/tags:
 *   get:
 *     summary: Get posts by tags
 *     description: Get food review posts filtered by tags
 *     tags: [Posts]
 */
const getPostsByTags = catchAsync(async (req, res, next) => {
  const { tags, page, limit, sortBy, sortOrder } = req.query;

  if (!tags) {
    return res.status(400).json({
      success: false,
      message: 'Tags parameter is required',
    });
  }

  const userId = req.user?._id;
  const tagsArray = Array.isArray(tags) ? tags : [tags];

  const options = {
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder || 'desc',
  };

  const result = await postService.getPostsByTags(tagsArray, userId, options);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @swagger
 * /api/v1/posts/{postId}/like:
 *   post:
 *     summary: Like a post
 *     description: Increment likes count
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 */
const likePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const post = await postService.updateEngagement(postId, 'likes_count', 1);

  res.status(200).json({
    success: true,
    message: 'Post liked successfully',
    data: { engagement: post.engagement },
  });
});

/**
 * @swagger
 * /api/v1/posts/{postId}/unlike:
 *   post:
 *     summary: Unlike a post
 *     description: Decrement likes count
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 */
const unlikePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const post = await postService.updateEngagement(postId, 'likes_count', -1);

  res.status(200).json({
    success: true,
    message: 'Post unliked successfully',
    data: { engagement: post.engagement },
  });
});

/**
 * @swagger
 * /api/v1/posts/top:
 *   get:
 *     summary: Get top posts
 *     description: Get most popular posts by likes, comments, or shares
 *     tags: [Posts]
 */
const getTopPosts = catchAsync(async (req, res, next) => {
  const { criteria = 'likes_count', limit = 10 } = req.query;
  const userId = req.user?._id;

  const posts = await postService.getTopPosts(
    criteria,
    parseInt(limit),
    userId
  );

  res.status(200).json({
    success: true,
    data: posts,
  });
});

/**
 * @swagger
 * /api/v1/posts/food-reviews/rating:
 *   get:
 *     summary: Get food reviews by rating
 *     description: Get food review posts filtered by rating range
 *     tags: [Posts]
 */
const getFoodReviewsByRating = catchAsync(async (req, res, next) => {
  const { minRating, maxRating, page, limit, sortBy, sortOrder } = req.query;

  if (!minRating) {
    return res.status(400).json({
      success: false,
      message: 'minRating parameter is required',
    });
  }

  const userId = req.user?._id;

  const options = {
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder || 'desc',
  };

  const result = await postService.getFoodReviewsByRating(
    parseFloat(minRating),
    maxRating ? parseFloat(maxRating) : 5,
    userId,
    options
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = {
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
};