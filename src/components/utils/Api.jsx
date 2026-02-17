/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.patilassociates.in/api";

// Fallback URLs
const FALLBACK_URL = "https://api.patilbars.in/api";

// Create axios instances with base configuration
const apiConfig = {
  baseURL: BASE_URL,
};

const Api = axios.create(apiConfig);
const Apiauth = axios.create(apiConfig);

// Add a request interceptor to include the token in headers
Api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Apiauth.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication APIs
export const login = (post) => Apiauth.post("/auth/login", post);
export const signup = (post) => Apiauth.post("/auth/signup", post);

// Dashboard APIs (Admin Only)
export const getDashboardOverviewStats = () => Api.get("/dashboard/stats");
export const getDashboardRevenueAnalytics = (params = {}) => Api.get("/dashboard/analytics/revenue", { params });
export const getDashboardBookingAnalytics = (params = {}) => Api.get("/dashboard/analytics/bookings", { params });
export const getDashboardUserAnalytics = () => Api.get("/dashboard/analytics/users");
export const getDashboardPropertyAnalytics = () => Api.get("/dashboard/analytics/properties");
export const getDashboardRealtimeStats = () => Api.get("/dashboard/realtime");

// User Management APIs (admin only)
export const getAllUsers = (params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get("/users", { params: queryParams });
};
export const getUserById = (id) => Api.get(`/users/${id}`);
export const updateUser = (id, data) => Api.put(`/users/${id}`, data);
export const deleteUser = (id) => Api.delete(`/users/${id}`);

// Property APIs
export const getAllProperties = (params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get("/properties", { params: queryParams });
};
export const getPropertyStats = () => Api.get("/properties/stats");
export const createProperty = (data) => Api.post("/properties", data);
export const updateProperty = (id, data) => Api.put(`/properties/${id}`, data);
export const deleteProperty = (id) => Api.delete(`/properties/${id}`);
export const getPropertyById = (id) => Api.get(`/properties/${id}`);
export const uploadPropertyImages = (formData) => Api.post("/properties/upload/images", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});

// Property Listing APIs
export const getAllPropertyListings = (params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get("/property-listings", { params: queryParams });
};
export const getPropertyListingStats = () => Api.get("/property-listings/stats");
export const getPropertyListingById = (id) => Api.get(`/property-listings/${id}`);
export const updatePropertyListing = (id, data) => Api.put(`/property-listings/${id}`, data);
export const deletePropertyListing = (id) => Api.delete(`/property-listings/${id}`);
export const scheduleViewing = (id, data) => Api.post(`/property-listings/${id}/schedule-viewing`, data);
export const updateViewingStatus = (id, data) => Api.put(`/property-listings/${id}/viewing-status`, data);
export const uploadListingDocuments = (id, formData) => Api.post(`/property-listings/${id}/documents`, formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const deleteListingDocument = (id, documentId) => Api.delete(`/property-listings/${id}/documents/${documentId}`);

// Hotel Room APIs
export const getAllHotelRooms = (params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get("/hotel/rooms", { params: queryParams });
};
export const getHotelRoomStats = () => Api.get("/hotel/rooms/stats");
export const createHotelRoom = (data) => Api.post("/hotel/rooms", data, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const getHotelRoomById = (id) => Api.get(`/hotel/rooms/${id}`);
export const updateHotelRoom = (id, data) => Api.put(`/hotel/rooms/${id}`, data, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const deleteHotelRoom = (id) => Api.delete(`/hotel/rooms/${id}`);
export const getAvailableRooms = (params) => Api.get("/hotel/rooms/available", { params });

// Hotel Booking APIs
export const getAllBookings = (params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get("/hotel/bookings", { params: queryParams });
};
export const getBookingStats = () => Api.get("/hotel/bookings/stats");
export const getBookingById = (id) => Api.get(`/hotel/bookings/${id}`);
export const updateBooking = (id, data) => Api.put(`/hotel/bookings/${id}`, data);
export const deleteBooking = (id) => Api.delete(`/hotel/bookings/${id}`);
export const createBooking = (data) => Api.post("/hotel/bookings", data);
export const checkRoomAvailability = (params) => Api.get("/hotel/bookings/check-availability", { params });
export const getBookingsByDateRange = (params) => Api.get("/hotel/bookings/date-range", { params });

// Restaurant APIs
export const getAllRestaurants = (params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get("/restaurant", { params: queryParams });
};
export const getAllRestaurantBookings = (params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get("/restaurant", { params: queryParams });
};
export const getRestaurantBookingsByDateRange = (params) => Api.get("/restaurant/date-range", { params });
export const getAvailableTables = (params) => Api.get("/restaurant/available-tables", { params });
export const getRestaurantBookingById = (id) => Api.get(`/restaurant/${id}`);
export const updateRestaurantBooking = (id, data) => Api.put(`/restaurant/${id}`, data);
export const deleteRestaurantBooking = (id) => Api.delete(`/restaurant/${id}`);
export const createRestaurantBooking = (data) => Api.post("/restaurant", data);

// Table Management APIs
export const getAllTables = (params) => Api.get("/tables", { params });
export const getAvailableTablesByCriteria = (params) => Api.get("/tables/available", { params });
export const createTable = (data) => Api.post("/tables", data);
export const getTableById = (id) => Api.get(`/tables/${id}`);
export const updateTable = (id, data) => Api.put(`/tables/${id}`, data);
export const deleteTable = (id) => Api.delete(`/tables/${id}`);

// Menu APIs
export const getAllMenuItems = (params = {}) => Api.get("/menu", { params });
export const searchMenuItems = (query) => Api.get("/menu/search", { params: { q: query } });
export const getMenuItemsByCategory = (category) => Api.get(`/menu/category/${category}`);
export const getMenuItemsByDietaryType = (dietaryType) => Api.get(`/menu/dietary/${dietaryType}`);
export const createMenuItem = (data) => Api.post("/menu", data, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const getMenuItemById = (id) => Api.get(`/menu/${id}`);
export const updateMenuItem = (id, data) => Api.put(`/menu/${id}`, data, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const deleteMenuItem = (id) => Api.delete(`/menu/${id}`);
export const uploadMenuItemImage = (formData) => Api.post("/menu/upload/image", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});

// Dashboard Stats APIs
export const getDashboardStats = async () => {
  try {
    const [usersRes, propertiesRes, propertyListingsRes, hotelRoomsRes, bookingsRes, restaurantBookingsRes, tablesRes, menuItemsRes] = await Promise.allSettled([
      getAllUsers(),
      getPropertyStats(),
      getPropertyListingStats(),
      getHotelRoomStats(),
      getBookingStats(),
      getAllRestaurants(),
      getAllTables(),
      getAllMenuItems()
    ]);

    return {
      users: usersRes.status === 'fulfilled' ? usersRes.value.data.data?.length || 0 : 0,
      properties: propertiesRes.status === 'fulfilled' ? propertiesRes.value.data.data?.totalProperties || 0 : 0,
      propertyListings: propertyListingsRes.status === 'fulfilled' ? propertyListingsRes.value.data.data?.totalListings || 0 : 0,
      hotelRooms: hotelRoomsRes.status === 'fulfilled' ? hotelRoomsRes.value.data.data?.totalRooms || 0 : 0,
      bookings: bookingsRes.status === 'fulfilled' ? bookingsRes.value.data.data?.totalBookings || 0 : 0,
      restaurantBookings: restaurantBookingsRes.status === 'fulfilled' ? restaurantBookingsRes.value.data.data?.length || 0 : 0,
      tables: tablesRes.status === 'fulfilled' ? tablesRes.value.data.data?.length || 0 : 0,
      menuItems: menuItemsRes.status === 'fulfilled' ? menuItemsRes.value.data.data?.length || 0 : 0,
      orders: 0 // Will be updated when billing is implemented
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      users: 0,
      properties: 0,
      propertyListings: 0,
      hotelRooms: 0,
      bookings: 0,
      restaurantBookings: 0,
      tables: 0,
      menuItems: 0,
      orders: 0
    };
  }
};

// Export the configured axios instance
export default Api;

// Billing/Order APIs
export const createOrderFromBooking = (data) => Api.post('/billing/create-from-booking', data);
export const getAllOrders = (params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get('/billing', { params: queryParams });
};
export const getOrderById = (id) => Api.get(`/billing/${id}`);
export const updateOrder = (id, data) => Api.put(`/billing/${id}`, data);
export const deleteOrder = (id) => Api.delete(`/billing/${id}`);
export const generateBill = (id) => Api.get(`/billing/${id}/bill`);
export const updateOrderPayment = (id, data) => Api.put(`/billing/${id}`, data);

// Profile APIs
export const getUserProfile = () => Api.get('/profile');
export const updateUserProfile = (data) => Api.put('/profile', data);
export const uploadProfilePicture = (formData) => Api.post('/profile/picture', formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const uploadDocument = (formData) => Api.post('/profile/document', formData, {
  headers: { "Content-Type": "multipart/form-data" }
});

export const getBillStats = async () => {
  try {
    const statsRes = await Api.get('/billing/stats');
    
    if (statsRes.data.success && statsRes.data.data) {
      const stats = statsRes.data.data;
      return {
        totalOrders: stats.totalOrders || 0,
        pendingOrders: stats.pendingOrders || 0,
        paidOrders: stats.paidOrders || 0,
        totalRevenue: stats.totalRevenue || 0
      };
    } else {
      // Fallback to getting total orders from getAllOrders if stats endpoint fails
      const ordersRes = await getAllOrders({ page: 1, limit: 1 });
      return {
        totalOrders: ordersRes.data.pagination?.totalItems || 0,
        pendingOrders: 0,
        paidOrders: 0,
        totalRevenue: 0
      };
    }
  } catch (error) {
    console.error('Error fetching bill stats:', error);
    // Fallback to getting total orders from getAllOrders
    try {
      const ordersRes = await getAllOrders({ page: 1, limit: 1 });
      return {
        totalOrders: ordersRes.data.pagination?.totalItems || 0,
        pendingOrders: 0,
        paidOrders: 0,
        totalRevenue: 0
      };
    } catch (fallbackError) {
      console.error('Error in fallback stats fetch:', fallbackError);
      return {
        totalOrders: 0,
        pendingOrders: 0,
        paidOrders: 0,
        totalRevenue: 0
      };
    }
  }
};

// Query Management APIs
export const getAllQueries = (params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get("/queries", { params: queryParams });
};

export const getQueryStats = () => Api.get("/queries/stats");

export const getQueryById = (id) => Api.get(`/queries/${id}`);

export const updateQueryStatus = (id, data) => Api.put(`/queries/${id}/status`, data);

export const deleteQuery = (id) => Api.delete(`/queries/${id}`);

// Additional APIs for enhanced functionality

// Notification APIs
export const getAllNotifications = (params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get('/notifications', { params: queryParams });
};

export const markNotificationAsRead = (id) => Api.put(`/notifications/${id}/read`);

export const markAllNotificationsAsRead = () => Api.put('/notifications/read-all');

export const deleteNotification = (id) => Api.delete(`/notifications/${id}`);

export const getUnreadNotificationsCount = () => Api.get('/notifications/unread-count');

// Activity Log APIs
export const getAllActivities = (params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get('/activities', { params: queryParams });
};

export const getActivityById = (id) => Api.get(`/activities/${id}`);

export const getUserActivities = (userId, params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get(`/activities/user/${userId}`, { params: queryParams });
};

// Settings APIs
export const getSystemSettings = () => Api.get('/settings');

export const updateSystemSettings = (data) => Api.put('/settings', data);

export const getSettingByKey = (key) => Api.get(`/settings/${key}`);

export const updateSettingByKey = (key, data) => Api.put(`/settings/${key}`, data);

// Reports APIs
export const generateReport = (reportType, params = {}) => {
  return Api.post(`/reports/${reportType}/generate`, params, {
    responseType: 'blob'
  });
};

export const getReportHistory = (params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get('/reports/history', { params: queryParams });
};

export const downloadReport = (reportId) => {
  return Api.get(`/reports/download/${reportId}`, {
    responseType: 'blob'
  });
};

// Export APIs
export const exportData = (dataType, format = 'csv', params = {}) => {
  return Api.get(`/export/${dataType}`, {
    params: { format, ...params },
    responseType: 'blob'
  });
};

// Import APIs
export const importData = (dataType, formData) => {
  return Api.post(`/import/${dataType}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getImportHistory = (params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get('/import/history', { params: queryParams });
};

// Cache Management APIs
export const clearCache = () => Api.post('/cache/clear');

export const getCacheStats = () => Api.get('/cache/stats');

export const refreshCache = (cacheKey) => Api.post(`/cache/refresh/${cacheKey}`);

// System Health APIs
export const getSystemHealth = () => Api.get('/health');

export const getSystemMetrics = () => Api.get('/metrics');

export const getSystemLogs = (params = {}) => {
  const { page = 1, limit = 50, level, ...filters } = params;
  const queryParams = { page, limit, level, ...filters };
  return Api.get('/logs', { params: queryParams });
};

// Enhanced Property APIs
export const getPropertyInquiries = (propertyId, params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get(`/properties/${propertyId}/inquiries`, { params: queryParams });
};

export const createPropertyInquiry = (propertyId, data) => Api.post(`/properties/${propertyId}/inquiries`, data);

export const updatePropertyInquiry = (propertyId, inquiryId, data) => Api.put(`/properties/${propertyId}/inquiries/${inquiryId}`, data);

export const deletePropertyInquiry = (propertyId, inquiryId) => Api.delete(`/properties/${propertyId}/inquiries/${inquiryId}`);

// Property Viewing APIs
export const schedulePropertyViewing = (propertyId, data) => Api.post(`/properties/${propertyId}/viewings`, data);

export const getPropertyViewings = (propertyId, params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get(`/properties/${propertyId}/viewings`, { params: queryParams });
};

export const updatePropertyViewing = (propertyId, viewingId, data) => Api.put(`/properties/${propertyId}/viewings/${viewingId}`, data);

export const cancelPropertyViewing = (propertyId, viewingId) => Api.delete(`/properties/${propertyId}/viewings/${viewingId}`);

// Enhanced Hotel APIs
export const getHotelRoomTypes = () => Api.get('/hotel/room-types');

export const createHotelRoomType = (data) => Api.post('/hotel/room-types', data);

export const updateHotelRoomType = (id, data) => Api.put(`/hotel/room-types/${id}`, data);

export const deleteHotelRoomType = (id) => Api.delete(`/hotel/room-types/${id}`);

export const getHotelAmenities = () => Api.get('/hotel/amenities');

export const getHotelFloorStats = () => Api.get('/hotel/floors/stats');

// Enhanced Restaurant APIs
export const getRestaurantCategories = () => Api.get('/restaurant/categories');

export const createRestaurantCategory = (data) => Api.post('/restaurant/categories', data);

export const updateRestaurantCategory = (id, data) => Api.put(`/restaurant/categories/${id}`, data);

export const deleteRestaurantCategory = (id) => Api.delete(`/restaurant/categories/${id}`);

export const getRestaurantOrders = (params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get('/restaurant/orders', { params: queryParams });
};

export const getRestaurantOrderById = (id) => Api.get(`/restaurant/orders/${id}`);

export const updateRestaurantOrder = (id, data) => Api.put(`/restaurant/orders/${id}`, data);

export const deleteRestaurantOrder = (id) => Api.delete(`/restaurant/orders/${id}`);

// Staff Management APIs
export const getAllStaff = (params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get('/staff', { params: queryParams });
};

export const getStaffById = (id) => Api.get(`/staff/${id}`);

export const createStaff = (data) => Api.post('/staff', data);

export const updateStaff = (id, data) => Api.put(`/staff/${id}`, data);

export const deleteStaff = (id) => Api.delete(`/staff/${id}`);

export const getStaffStats = () => Api.get('/staff/stats');

// Inventory Management APIs
export const getAllInventory = (params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get('/inventory', { params: queryParams });
};

export const getInventoryById = (id) => Api.get(`/inventory/${id}`);

export const createInventoryItem = (data) => Api.post('/inventory', data);

export const updateInventoryItem = (id, data) => Api.put(`/inventory/${id}`, data);

export const deleteInventoryItem = (id) => Api.delete(`/inventory/${id}`);

export const getInventoryStats = () => Api.get('/inventory/stats');

export const getLowStockItems = () => Api.get('/inventory/low-stock');

// Customer Management APIs
export const getAllCustomers = (params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get('/customers', { params: queryParams });
};

export const getCustomerById = (id) => Api.get(`/customers/${id}`);

export const createCustomer = (data) => Api.post('/customers', data);

export const updateCustomer = (id, data) => Api.put(`/customers/${id}`, data);

export const deleteCustomer = (id) => Api.delete(`/customers/${id}`);

export const getCustomerStats = () => Api.get('/customers/stats');

export const getCustomerOrders = (customerId, params = {}) => {
  const { page = 1, limit = 12, ...filters } = params;
  const queryParams = { page, limit, ...filters };
  return Api.get(`/customers/${customerId}/orders`, { params: queryParams });
};