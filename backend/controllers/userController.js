const User = require('../models/User'); // Adjust path as needed
const {processPostsuser} = require("./syncUserDataContoller");
const {updateUserPosts} = require("./syncUpdateUDContoller");

// READ: Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        if (!users.length) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json({ message: 'Users retrieved successfully', users });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
};

// READ: Get user by ID
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const users = await User.findAll({ where: {blogId:id } });
        if (!users.length) {
            return res.status(404).json({ message: `No users found with blogId: ${blogId}` });
        }
        res.status(200).json({ message: 'Users retrieved successfully', users });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users by blogId', error: error.message });
    }
};

// UPDATE: Update a user's information
const updateUser = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    if (!updatedData || Object.keys(updatedData).length === 0) {
        return res.status(400).json({ message: 'No update data provided' });
    }

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await user.update(updatedData);
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};



const updatePlatform = async (req, res) => {
    const { id } = req.params; // Extract user ID from URL parameters
    const { platforms } = req.body; // Extract platforms data from the request body
    console.log(platforms, "platforms");

    // Validate input
    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty platforms data' });
    }

    try {
        // Find the user by ID
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Convert the platforms array to a comma-separated string
        const platformsString = platforms.join(", ");
        console.log(platformsString, "platformsString");

        // Update only the platforms field
        user.platform = platformsString; // Assuming the platforms field exists on the User model
        await user.save();

        // Call processPostsuser function and handle potential errors
        try {
            await processPostsuser(user.id);
        } catch (processError) {
            console.error('Error in processPostsuser:', processError.message);
            return res.status(500).json({ 
                message: 'Platforms updated but an error occurred during post-processing', 
                error: processError.message 
            });
        }

        res.status(200).json({
            message: 'Platforms updated successfully',
            user: { id: user.id, platforms: user.platform }, // Return the string format
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating platforms', error: error.message });
    }
};


const Updateposts = async (req, res) => {
    const { id } = req.params; // Extract user ID from URL parameters

    try {
        // Fetch the user from the database by id
        const user = await User.findByPk(id); // Assuming you're using Sequelize ORM

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        // Assuming processPosts handles posts for the given user
        await updateUserPosts(user.id);

        res.status(200).json({
            message: 'Platforms updated successfully',
            user: { id: user.id, platforms: user.platform }, // Return user data
        });
    } catch (processError) {
        console.error('Error in processPosts:', processError.message);
        return res.status(500).json({ 
            message: 'Platforms updated but an error occurred during post-processing', 
            error: processError.message 
        });
    }
}




const registerUser = async (req, res) => {
    const { userName, blogId, email, mobile, password } = req.body;
  
    // Validate required fields
    if (!userName || !blogId || !email || !mobile || !password) {
        return res.status(400).json({ message: 'Missing required fields: userName, blogId, email, mobile, or password' });
    }
  
    try {
        // Check if the email or mobile already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ status: false, message: 'Email already in use' });
        }
  
        const newUser = await User.create({
            userName,
            blogId,
            email,
            mobile,
            password
        });

        console.log({
            id: newUser.id,
            userName: newUser.userName,
            blogId: newUser.blogId,
            email: newUser.email,
            mobile: newUser.mobile
        })

        res.status(201).json({
            status: true,
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                userName: newUser.userName,
                blogId: newUser.blogId,
                email: newUser.email,
                mobile: newUser.mobile
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error registering user', error: error.message });
    }
};


  const loginUser = async (req, res) => {
    
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({ 
            status: false, 
            message: 'Email and password are required' 
        });
    }

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.status(401).json({ 
                status: false, 
                message: 'Invalid email or password' 
            });
        }

         const isPasswordValid = (user.password == password)
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                status: false, 
                message: 'Invalid email or password' 
            });
        }

        // Remove password from response
        const userResponse = user.toJSON();
        delete userResponse.password;

        res.status(200).json({
            status: true,
            message: 'Login successful',
            user: userResponse
        });
    } catch (error) {
        res.status(500).json({ 
            status: false, 
            message: 'Error during login', 
            error: error.message 
        });
    }
};

module.exports = { loginUser, getAllUsers, getUserById, updateUser ,registerUser , updatePlatform ,Updateposts};
