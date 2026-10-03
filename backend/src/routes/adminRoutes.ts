import { Router } from 'express';
import { adminLogin } from '../controllers/adminAuthController.js';
import {
  getOverview,
  getAdminColleges,
  getAdminCollegeById,
  createAdminCollege,
  updateAdminCollege,
  deleteAdminCollege,
  getAdminEnquiries,
  updateEnquiryStatus,
  exportEnquiriesCSV,
  getAdminContacts,
  updateContactStatus,
  getAdminConversations,
  getAdminConversationById,
  getAdminUsers,
  getAuthorizedAdmins,
  addAuthorizedAdmin,
  revokeAuthorizedAdmin
} from '../controllers/adminController.js';
import {
  getAdminBlogs,
  getAdminBlogById,
  createAdminBlog,
  updateAdminBlog,
  deleteAdminBlog
} from '../controllers/blogController.js';
import { authenticateUser, requireAdmin, requireSuperAdmin } from '../middleware/auth.js';

const router = Router();

// Dedicated Admin Login Endpoint (publicly accessible with credentials)
router.post('/login', adminLogin);

// All other admin routes require JWT authentication and at least ADMIN role
router.use(authenticateUser, requireAdmin);

// Dashboard Overview
router.get('/overview', getOverview);

// College Database Management (PostgreSQL CRUD)
router.get('/colleges', getAdminColleges);
router.get('/colleges/:id', getAdminCollegeById);
router.post('/colleges', createAdminCollege);
router.put('/colleges/:id', updateAdminCollege);
router.patch('/colleges/:id', updateAdminCollege);
router.delete('/colleges/:id', deleteAdminCollege);

// Student Enquiries & Direct Contact Requests
router.get('/enquiries/export', exportEnquiriesCSV);
router.get('/enquiries', getAdminEnquiries);
router.patch('/enquiries/:id/status', updateEnquiryStatus);
router.get('/contacts', getAdminContacts);
router.patch('/contacts/:id/status', updateContactStatus);

// Blog Management (Private & Government Categories)
router.get('/blogs', getAdminBlogs);
router.get('/blogs/:id', getAdminBlogById);
router.post('/blogs', createAdminBlog);
router.put('/blogs/:id', updateAdminBlog);
router.patch('/blogs/:id', updateAdminBlog);
router.delete('/blogs/:id', deleteAdminBlog);

// AI Conversations Audit Log
router.get('/conversations', getAdminConversations);
router.get('/conversations/:id', getAdminConversationById);

// Users Management
router.get('/users', getAdminUsers);

// Admin Management (Super Admin ONLY)
router.get('/admins', requireSuperAdmin, getAuthorizedAdmins);
router.post('/admins', requireSuperAdmin, addAuthorizedAdmin);
router.delete('/admins/:id', requireSuperAdmin, revokeAuthorizedAdmin);

export default router;
