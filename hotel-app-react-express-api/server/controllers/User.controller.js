import User from '../models/User.model.js';
import { validateUserInputs } from '../utils/validators.js';
import { generateNewToken, validateToken } from '../utils/auth-helpers.js';
import bcrypt from 'bcrypt';
import {
    BCRYPT_CONFIG,
    USER_CREATION_MESSAGES,
    HTTP_RESPONSE_COOKIE_CONFIG,
} from '../utils/constants.js';

export const registerUser = async (req, res) => {
    try {
        const errorsList = await validateUserInputs(req.body);
        if (errorsList.length > 0) {
            return res.status(400).json({
                errors: errorsList,
                data: { status: 'User not created' },
            });
        }

        // Using bcrypt.hash in an async manner
        try {
            const hash = await bcrypt.hash(
                req.body.password,
                BCRYPT_CONFIG.SALT_ROUNDS
            );
            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hash,
                phoneNumber: req.body.phoneNumber,
                country: req.body.country,
                profilePicture: '',
            });
            await newUser.save();

            return res.status(201).json({
                errors: [],
                data: { status: USER_CREATION_MESSAGES.SUCCESS },
            });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(
                'Error while generating hashing password',
                err.message
            );
            return res.status(500).json({
                errors: ['Error while generating hashing password'],
                data: { status: USER_CREATION_MESSAGES.FAILED },
            });
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('A technical error has occurred', error);
        return res.status(500).json({
            errors: ['A technical error has occurred'],
            data: { status: 'User not created' },
        });
    }
};

/**
 * Handles user login, including token generation and validation.
 *
 * @param {Object} req - The request object containing login credentials.
 * @param {Object} res - The response object used to send back the HTTP response.
 * @returns {Promise} A promise that resolves to the HTTP response with either a token or an error message.
 */
export const loginUser = async (req, res) => {
    const cookieOptions = {
        maxAge: HTTP_RESPONSE_COOKIE_CONFIG.MAX_AGE,
        httpOnly: HTTP_RESPONSE_COOKIE_CONFIG.HTTP_ONLY,
        secure: HTTP_RESPONSE_COOKIE_CONFIG.SECURE,
        sameSite: HTTP_RESPONSE_COOKIE_CONFIG.SAME_SITE,
    };

    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);
        
        const user = await User.findOne({ email }).maxTimeMS(5000); // 5 second timeout
        console.log('User found:', !!user);

        if (!user) {
            console.log('User not found in database for email:', email);
            return res.status(404).json({
                errors: ['User not found or invalid credentials'],
                data: {},
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Invalid password for email:', email);
            return res.status(404).json({
                errors: ['User not found or invalid credentials'],
                data: {},
            });
        }

        // Check for existing cookie
        const existingToken = req.cookies._token;
        if (existingToken) {
            const isTokenValid = validateToken(existingToken);
            if (isTokenValid) {
                // Reuse existing valid token
                res.cookie('_token', existingToken, cookieOptions);
                return res.status(200).json({
                    data: { token: existingToken },
                    errors: [],
                });
            }
            // If token exists but is invalid/expired, clear it and continue with new login
            res.clearCookie('_token');
        }

        // Generate a new token for the user
        const token = generateNewToken(user);
        res.cookie('_token', token, cookieOptions);
        return res.status(200).json({
            data: { token },
            errors: [],
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('An error occurred during the login process', error);
        return res.status(500).json({
            errors: ['An error occurred during the login process'],
            data: {},
        });
    }
};

/**
 * Logs out the user by clearing the JWT token cookie.
 *
 * @param {Object} _req - The request object from Express.js, which is not used in this function.
 * @param {Object} res - The response object from Express.js used to send back the desired HTTP response.
 * @returns {Object} The HTTP response with a message indicating that the user has been logged out successfully.
 */
export const logoutUser = (_req, res) => {
    res.clearCookie('_token');
    return res.status(200).json({ message: 'User logged out successfully' });
};

/**
 * Fetches and returns user details by user ID.
 *
 * @param {Object} req - The request object from Express.js, containing the user's information in `req.user`.
 * @param {Object} res - The response object from Express.js used to send back the desired HTTP response.
 * @returns {Promise<Object>} A promise that resolves to the response object, which includes the user's details or an error message.
 */
export const getUser = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const userDetails = await User.findById(userId);
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            country,
            isPhoneVerified,
            isEmailVerified,
        } = userDetails;
        return res.status(200).json({
            errors: [],
            data: {
                isAuthenticated: true,
                userDetails: {
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    country,
                    isPhoneVerified,
                    isEmailVerified,
                },
            },
        });
    } catch (error) {
        return res.status(500).json({
            errors: ['A technical error has occurred'],
        });
    }
};

/**
 * Updates the user's profile information.
 *
 * @param {Object} req - The request object from Express.js, containing the user's updated details.
 * @param {Object} res - The response object from Express.js used to send back the desired HTTP response.
 * @returns {Promise<Object>} A promise that resolves to the response object, which includes the user's updated details or an error message.
 */
export const updateUser = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const userDetails = await User.findById(userId);
        const updatedUserDetails = await User.findByIdAndUpdate(userId, req.body, { new: true });
        return res.status(200).json({
            errors: [],
            data: {
                updatedUserDetails,
            },
        });
    } catch (error) {
        return res.status(500).json({
            errors: ['A technical error has occurred'],
        });
    }
};
