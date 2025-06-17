export const apiUrl = 'http://localhost:8000/api';
export const baseUrl = 'http://localhost:8000';

// Function to get CSRF token
export const getCsrfToken = async () => {
    try {
        const response = await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch CSRF token');
        }
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
};

export const adminToken = () => {
    try {
        const adminInfo = localStorage.getItem('adminInfo');
        if (!adminInfo) {
            console.error('No admin info found in localStorage');
            return null;
        }
        const { token } = JSON.parse(adminInfo);
        if (!token) {
            console.error('No token found in admin info');
            return null;
        }
        return token;
    } catch (error) {
        console.error('Error getting admin token:', error);
        return null;
    }
};

export const userToken = () => {
    try {
        const userInfo = localStorage.getItem('UserInfo');
        if (!userInfo) {
            console.log('No user info found in localStorage');
            return null;
        }
        
        const parsedUserInfo = JSON.parse(userInfo);
        if (!parsedUserInfo || !parsedUserInfo.token) {
            console.log('No token found in user info');
            return null;
        }
        
        return parsedUserInfo.token;
    } catch (error) {
        console.error('Error getting user token:', error);
        return null;
    }
};

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
    try {
        // Get CSRF token first
        await getCsrfToken();

        // Handle admin authentication
        if (options.isAdmin) {
            const token = adminToken();
            if (!token) {
                throw new Error('Admin token not found. Please log in again.');
            }
            return await fetch(`${apiUrl}${endpoint}`, {
                ...options,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Authorization': `Bearer ${token}`,
                    ...options.headers
                }
            }).then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                return response.json();
            });
        }

        // Handle user authentication
        const token = userToken();
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        return await fetch(`${apiUrl}${endpoint}`, {
            ...options,
            credentials: 'include',
            headers
        }).then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};