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

// User Management APIs (admin only)
export const getAllUsers = () => Api.get("/users");
export const getUserById = (id) => Api.get(`/users/${id}`);
export const updateUser = (id, data) => Api.put(`/users/${id}`, data);
export const deleteUser = (id) => Api.delete(`/users/${id}`);

// Property APIs
export const getAllProperties = () => Api.get("/properties");
export const getPropertyStats = () => Api.get("/properties/stats");
export const createProperty = (data) => Api.post("/properties", data);
export const updateProperty = (id, data) => Api.put(`/properties/${id}`, data);
export const deleteProperty = (id) => Api.delete(`/properties/${id}`);
export const getPropertyById = (id) => Api.get(`/properties/${id}`);
export const uploadPropertyImages = (formData) => Api.post("/properties/upload/images", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});

// Property Listing APIs
export const getAllPropertyListings = () => Api.get("/property-listings");
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
export const getAllHotelRooms = () => Api.get("/hotel/rooms");
export const getHotelRoomStats = () => Api.get("/hotel/rooms/stats");
export const createHotelRoom = (data) => Api.post("/hotel/rooms", data);
export const getHotelRoomById = (id) => Api.get(`/hotel/rooms/${id}`);
export const updateHotelRoom = (id, data) => Api.put(`/hotel/rooms/${id}`, data);
export const deleteHotelRoom = (id) => Api.delete(`/hotel/rooms/${id}`);
export const getAvailableRooms = (params) => Api.get("/hotel/rooms/available", { params });

// Hotel Booking APIs
export const getAllBookings = () => Api.get("/hotel/bookings");
export const getBookingStats = () => Api.get("/hotel/bookings/stats");
export const getBookingById = (id) => Api.get(`/hotel/bookings/${id}`);
export const updateBooking = (id, data) => Api.put(`/hotel/bookings/${id}`, data);
export const deleteBooking = (id) => Api.delete(`/hotel/bookings/${id}`);
export const createBooking = (data) => Api.post("/hotel/bookings", data);
export const checkRoomAvailability = (params) => Api.get("/hotel/bookings/check-availability", { params });
export const getBookingsByDateRange = (params) => Api.get("/hotel/bookings/date-range", { params });

// Restaurant APIs
export const getAllRestaurants = () => Api.get("/restaurant");  // This returns booking data for the authenticated user
export const getAllRestaurantBookings = () => Api.get("/restaurant");  // Same endpoint for consistency
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
export const getAllMenuItems = () => Api.get("/menu");
export const searchMenuItems = (query) => Api.get("/menu/search", { params: { q: query } });
export const getMenuItemsByCategory = (category) => Api.get(`/menu/category/${category}`);
export const getMenuItemsByDietaryType = (dietaryType) => Api.get(`/menu/dietary/${dietaryType}`);
export const createMenuItem = (data) => Api.post("/menu", data);
export const getMenuItemById = (id) => Api.get(`/menu/${id}`);
export const updateMenuItem = (id, data) => Api.put(`/menu/${id}`, data);
export const deleteMenuItem = (id) => Api.delete(`/menu/${id}`);

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
      menuItems: menuItemsRes.status === 'fulfilled' ? menuItemsRes.value.data.data?.length || 0 : 0
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
      menuItems: 0
    };
  }
};

// Export the configured axios instance
export default Api;