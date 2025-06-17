import axios from 'axios';

// Remove trailing slash to prevent double slashes in URLs
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api").replace(/\/$/, "");

/**
 * Admin API service that handles authentication and API calls for admin functions
 */
class AdminService {
  /**
   * Get pending mentor applications
   */
  async getPendingMentors() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/admin/approve-mentor`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching pending mentors:', error);
      throw error;
    }
  }

  /**
   * Approve a mentor application
   */
  async approveMentor(userId: string) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/approve-mentor`, 
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error approving mentor:', error);
      throw error;
    }
  }

  /**
   * Reject a mentor application
   */
  async rejectMentor(userId: string, reason?: string) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/approve-mentor/reject`, 
        { userId, reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error rejecting mentor:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const adminService = new AdminService();
export default adminService;
