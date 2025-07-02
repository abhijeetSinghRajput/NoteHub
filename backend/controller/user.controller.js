import User from "../model/user.model.js";
import { deleteImage, uploadStream } from "../services/cloudinary.service.js";
import validator from "validator";

export const isEmailAvailable = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const normalizedEmail = validator.normalizeEmail(email);
    const existingUser = await User.findOne({ email: normalizedEmail });

    res.status(200).json({
      success: true,
      available: !existingUser,
      message: existingUser
        ? "Email is already registered"
        : "Email is available",
    });
  } catch (error) {
    console.error("Error in isEmailAvailable:", error);
    res.status(500).json({
      success: false,
      message: "Server error while checking email availability",
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User not found" });
    }
    const user = req.user;
    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error in checkAuth controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getUser = async (req, res) => {
  const { identifier } = req.params;
  try {
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { userName: { $regex: new RegExp(`^${identifier}$`, 'i') } }
      ]
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUser controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const filter = req.query.filter || 'all';
    
    // Build the base query
    let query = {};
    
    // Apply search filter
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Apply additional filters
    switch (filter) {
      case 'online':
        query.isOnline = true;
        break;
      case 'oauth':
        query.hasGoogleAuth = true;
        break;
      // 'all' case doesn't need additional filtering
    }
    
    // Get total count of matching users
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);
    
    // Calculate skip value
    const skip = (page - 1) * limit;
    
    // Fetch users with pagination
    const users = await User.find(query, { password: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get counts for each filter type
    const allUsersCount = await User.countDocuments();
    const onlineUsersCount = await User.countDocuments({ isOnline: true });
    const oauthUsersCount = await User.countDocuments({ hasGoogleAuth: true });
    
    res.status(200).json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        usersPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      },
      counts: {
        all: allUsersCount,
        online: onlineUsersCount,
        oauth: oauthUsersCount
      }
    });
  } catch (error) {
    console.error("Error in getAllUsers controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const { user } = req;
    const file = req.file;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Remove old avatar if exists
    if (user.avatar) {
      await deleteImage(user.avatar);
    }

    // Upload new avatar
    const folder = `user_profiles/${user._id}`;
    const { secure_url } = await uploadStream(file.buffer, folder);

    user.avatar = secure_url;
    await user.save();

    const { password, ...userWithoutPassword } = user.toObject();
    return res.status(200).json({
      user: userWithoutPassword,
      message: "Profile picture updated successfully",
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeAvatar = async (req, res) => {
  const { user } = req;
  try {
    if (!user.avatar) {
      return res.status(400).json({ message: "No avatar to remove." });
    }

    await deleteImage(user.avatar);
    user.avatar = null;
    await user.save();

    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      user: userWithoutPassword,
      message: "Avatar removed successfully",
    });
  } catch (error) {
    console.error("Error in removeAvatar controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadCover = async (req, res) => {
  try {
    const { user } = req;
    const file = req.file;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (user.cover) {
      await deleteImage(user.cover);
    }

    const folder = `user_covers/${user._id}`;
    const { secure_url } = await uploadStream(file.buffer, folder);

    user.cover = secure_url;
    await user.save();

    const { password, ...userWithoutPassword } = user.toObject();
    return res.status(200).json({
      user: userWithoutPassword,
      message: "Cover image updated successfully",
    });
  } catch (error) {
    console.error("Upload cover error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeCover = async (req, res) => {
  const { user } = req;
  try {
    if (!user.cover) {
      return res.status(400).json({ message: "No cover to remove." });
    }

    await deleteImage(user.cover);
    user.cover = null;
    await user.save();

    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      user: userWithoutPassword,
      message: "Cover removed successfully",
    });
  } catch (error) {
    console.error("Error in removeCover controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateFullName = async (req, res) => {
  try {
    const { fullName } = req.body;
    const { user } = req;

    if (!fullName?.trim()) {
      return res.status(400).json({ message: "Full name is required." });
    }

    user.fullName = fullName;
    await user.save();

    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      user: userWithoutPassword,
      message: "Name updated successfully.",
    });
  } catch (error) {
    console.log("Error in updateFullName controller\n", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const updateUserName = async (req, res) => {
  try {
    const { userName } = req.body;
    const { user } = req;

    if (!userName?.trim()) {
      return res.status(400).json({ message: "Username is required." });
    }

    // The model's validation will handle case-insensitive checks
    user.userName = userName;
    await user.save();

    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      user: userWithoutPassword,
      message: "Username updated successfully.",
    });
  } catch (error) {
    if (error.message.includes("Username is already taken")) {
      return res.status(400).json({ message: error.message });
    }
    console.log("Error in updateUserName controller\n", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const { user } = req;

    if (!email?.trim()) {
      return res.status(400).json({ message: "Email is required." });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const normalizedEmail = validator.normalizeEmail(email);
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res.status(400).json({ message: "Email already in use." });
    }

    user.email = normalizedEmail;
    await user.save();

    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      user: userWithoutPassword,
      message: "Email updated successfully.",
    });
  } catch (error) {
    console.log("Error in updateEmail controller\n", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
