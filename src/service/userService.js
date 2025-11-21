const User = require('../model/userModel');
const AppError = require('../util/AppError');

class UserService {
  // Register a new user
  async registerUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new AppError('User with this email already exists', 400);
      }
      const existingUsername = await User.findOne({ username: userData.username });
      if (existingUsername) {
        throw new AppError('Username is already taken', 400);
      }
      // Create new user
      const newUser = await User.create(userData);

      // Return user without password
      return newUser.getPublicProfile();
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err) => err.message);
        throw new AppError(`Validation Error: ${errors.join(', ')}`, 400);
      }
      throw error;
    }
  }

  // Login user
  async loginUser(email, password) {
  // Validate
  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  // Tìm user bằng email
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  // Kiểm tra isActive
  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Please contact support.', 401);
  }

  // Update lastLogin
  user.lastLogin = new Date();
  await user.save({ validateModifiedOnly: true });

  // Remove password
  user.password = undefined;

  return user;
}


  // Get user by ID
  async getUserById(userId) {
    try {
      const user = await User.findById(userId).populate('favoriteFoods');
      if (!user) {
        throw new AppError('User not found', 404);
      }
      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid user ID', 400);
      }
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userId, updateData) {
    try {
      if (updateData.username) {
        const existingUser = await User.findOne({ 
          username: updateData.username.toLowerCase(),
          _id: { $ne: userId } // Exclude current user
        });
        
        if (existingUser) {
          throw new AppError('Username is already taken', 400);
        }
      }
      // Fields that are allowed to be updated
      const allowedFields = [
        'username',   
        'name',
        'avatar',   
        'bio',      
        'age',
        'gender',
        'height',
        'weight',
        'goal',
        'preferences',
        'allergies',
        'favoriteFoods',
      ];
      // Filter out non-allowed fields
      const filteredData = {};
      Object.keys(updateData).forEach((key) => {
        if (allowedFields.includes(key)) {
          filteredData[key] = updateData[key];
        }
      });

      // Update user
      const updatedUser = await User.findByIdAndUpdate(userId, filteredData, {
        new: true,
        runValidators: true,
      }).populate('favoriteFoods');

      if (!updatedUser) {
        throw new AppError('User not found', 404);
      }


      return updatedUser;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err) => err.message);
        throw new AppError(`Validation Error: ${errors.join(', ')}`, 400);
      }
      if (error.name === 'CastError') {
        throw new AppError('Invalid user ID', 400);
      }
      throw error;
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId).select('+password');
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Check current password
      const isCurrentPasswordCorrect =
        await user.comparePassword(currentPassword);
      if (!isCurrentPasswordCorrect) {
        throw new AppError('Current password is incorrect', 400);
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Deactivate user account
  async deactivateUser(userId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
      );

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return { message: 'Account deactivated successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getFollowingIds(userId) {
  const user = await User.findById(userId).select('following');
  return user && Array.isArray(user.following)
    ? user.following.map(id => id.toString())
    : [];
  }



  async getFollowerIds(userId) {
    const user = await User.findById(userId).select('followers');
    return user && Array.isArray(user.followers)
      ? user.followers.map(id => id.toString())
      : [];
  }

  async followUser(followerId, followingId) {
    if (followerId.toString() === followingId.toString()) {
      throw new Error("You can't follow yourself");
    }

    await User.findByIdAndUpdate(followerId, {
      $addToSet: { following: followingId },
      $inc: { 'stats.followingCount': 1 },
    });

    await User.findByIdAndUpdate(followingId, {
      $addToSet: { followers: followerId },
      $inc: { 'stats.followersCount': 1 },
    });
  }

  async unfollowUser(followerId, followingId) {
    await User.findByIdAndUpdate(followerId, {
      $pull: { following: followingId },
      $inc: { 'stats.followingCount': -1 },
    });

    await User.findByIdAndUpdate(followingId, {
      $pull: { followers: followerId },
      $inc: { 'stats.followersCount': -1 },
    });
  }
}

module.exports = new UserService();
