// Get token from localStorage
export const getToken = () => {
    return localStorage.getItem('authToken');
};

// Get user from localStorage
export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Remove token and user from localStorage (for logout)
export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
};