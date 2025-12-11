// src/utils/api.js

// Get token from localStorage
const getToken = () => {
    // I noticed your token key is 'authToken'. Let's ensure consistency.
    return localStorage.getItem('authToken');
};

/**
 * A robust API utility function for making authenticated requests.
 * @param {string} method - The HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @param {string} endpoint - The API endpoint (e.g., '/user', '/user/profile').
 * @param {object} [body=null] - The request body for POST/PUT requests.
 * @returns {Promise<any>} - A promise that resolves with the response data.
 * @throws {object} - Throws a custom error object on failure.
 */
export const apiCall = async (method, endpoint, body = null) => {
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: method, // GET, POST, PUT, etc.
        headers: headers,
    };

    // Only add a body for methods that support it.
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}${endpoint}`, config);

        // Try to parse JSON, but handle cases where the body might be empty (e.g., 204 No Content).
        const responseData = await response.text().then(text => text ? JSON.parse(text) : {});

        if (!response.ok) {
            // Create a custom error object that includes all relevant information.
            const error = new Error(responseData.message || 'An unexpected API error occurred.');
            error.status = response.status;       // e.g., 422, 401, 500
            error.errors = responseData.errors;   // The validation errors object from Laravel
            throw error; // Throw the custom error object.
        }

        return responseData; // Return data on success

    } catch (error) {
        // This catches network errors (fetch fails) or the custom error thrown above.
        // It's good practice to re-throw it so the component's catch block can handle it.
        console.error("API Call Failed:", error);

        // If it's not our custom error, create one for consistency.
        if (!error.status) {
            const networkError = new Error('Network error or server is unreachable.');
            networkError.status = 503; // Service Unavailable
            throw networkError;
        }

        throw error; // Re-throw the error to be caught by the calling function
    }
};
