// Base API URL - Update this with your actual API endpoint
const API_BASE_URL = '/api';

export class MaterialsService {
    static async uploadFile(file, path = '') {
        try {
            const formData = new FormData();
            formData.append('file', file);
            if (path) formData.append('path', path);

            const response = await fetch(`${API_BASE_URL}/materials/upload`, {
                method: 'POST',
                body: formData,
                // Add authentication token if needed
                // headers: {
                //     'Authorization': `Bearer ${getAuthToken()}`
                // }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to upload file');
            }

            return await response.json();

        } catch (error) {
            console.error('Error in uploadFile:', error);
            throw error;
        }
    }

    static async getMaterials(searchTerm = '') {
        try {
            const url = new URL(`${API_BASE_URL}/materials`);
            if (searchTerm) {
                url.searchParams.append('search', searchTerm);
            }

            const response = await fetch(url, {
                // Add authentication token if needed
                // headers: {
                //     'Authorization': `Bearer ${getAuthToken()}`
                // }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch materials');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in getMaterials:', error);
            throw error;
        }
    }

    static async getMaterialById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
                // Add authentication token if needed
                // headers: {
                //     'Authorization': `Bearer ${getAuthToken()}`
                // }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch material');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in getMaterialById:', error);
            throw error;
        }
    }

    static async updateMaterial(id, updates) {
        try {
            const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update material');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in updateMaterial:', error);
            throw error;
        }
    }

    static async deleteMaterial(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
                method: 'DELETE',
                // headers: {
                //     'Authorization': `Bearer ${getAuthToken()}`
                // }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete material');
            }

            return true;
        } catch (error) {
            console.error('Error in deleteMaterial:', error);
            throw error;
        }
    }

    static async getMaterialsByUser(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}/materials`, {
                // headers: {
                //     'Authorization': `Bearer ${getAuthToken()}`
                // }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch user materials');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in getMaterialsByUser:', error);
            throw error;
        }
    }
}