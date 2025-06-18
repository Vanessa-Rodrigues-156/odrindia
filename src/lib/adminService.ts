import { apiFetch } from '@/lib/api';

/**
 * Admin API service that handles authentication and API calls for admin functions
 */
class AdminService {
  /**
   * Get pending mentor applications
   */
  async getPendingMentors() {
    try {
      const response = await apiFetch('/admin/approve-mentor');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching pending mentors:', error);
      throw error;
    }
  }

  /**
   * Approve a mentor application
   */
  async approveMentor(userId: string) {
    try {
      const response = await apiFetch('/admin/approve-mentor', {
        method: 'POST',
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error approving mentor:', error);
      throw error;
    }
  }

  /**
   * Reject a mentor application
   */
  async rejectMentor(userId: string, reason?: string) {
    try {
      const response = await apiFetch('/admin/approve-mentor/reject', {
        method: 'POST',
        body: JSON.stringify({ userId, reason })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error rejecting mentor:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const adminService = new AdminService();
export default adminService;
