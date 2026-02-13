import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Package, MessageCircle, Mail, BarChart2, CheckCircle, Clock, UserPlus, MessageSquare, Home, Calendar, Utensils, Square } from 'lucide-react';
import { getDashboardStats } from '../../utils/Api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalPropertyListings: 0,
    totalHotelRooms: 0,
    totalBookings: 0,
    totalRestaurantBookings: 0,
    totalTables: 0,
    totalMenus: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats from backend
        const statsData = await getDashboardStats();
        
        setStats({
          totalUsers: statsData.users,
          totalProperties: statsData.properties,
          totalPropertyListings: statsData.propertyListings,
          totalHotelRooms: statsData.hotelRooms,
          totalBookings: statsData.bookings,
          totalRestaurantBookings: statsData.restaurantBookings,
          totalTables: statsData.tables,
          totalMenus: statsData.menuItems
        });
        
        // Create mock recent activity for now (until we have specific endpoints)
        setRecentActivity([
          {
            id: 1,
            type: 'user',
            title: 'New user registered',
            description: 'john.doe@example.com',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            icon: UserPlus
          },
          {
            id: 2,
            type: 'booking',
            title: 'New booking confirmed',
            description: 'Room #101 - John Smith',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            icon: Briefcase
          },
          {
            id: 3,
            type: 'property',
            title: 'New property added',
            description: 'Luxury Villa in Miami',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            icon: Package
          },
          {
            id: 4,
            type: 'menu',
            title: 'Menu item updated',
            description: 'Special Burger - Restaurant A',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
            icon: MessageCircle
          },
          {
            id: 5,
            type: 'restaurant',
            title: 'Restaurant registered',
            description: 'Ocean View Restaurant',
            timestamp: new Date(Date.now() - 18000000).toISOString(),
            icon: Users
          }
        ]);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Some features may not work properly.');
        
        // Set default values
        setStats({
          totalUsers: 0,
          totalProperties: 0,
          totalPropertyListings: 0,
          totalHotelRooms: 0,
          totalBookings: 0,
          totalRestaurantBookings: 0,
          totalTables: 0,
          totalMenus: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { 
      name: 'Total Users', 
      value: stats.totalUsers, 
      icon: Users,
      color: 'bg-blue-500'
    },
    { 
      name: 'Properties', 
      value: stats.totalProperties, 
      icon: Home,
      color: 'bg-green-500'
    },
    { 
      name: 'Property Listings', 
      value: stats.totalPropertyListings, 
      icon: Package,
      color: 'bg-indigo-500'
    },
    { 
      name: 'Hotel Rooms', 
      value: stats.totalHotelRooms, 
      icon: Calendar,
      color: 'bg-purple-500'
    },
    { 
      name: 'Bookings', 
      value: stats.totalBookings, 
      icon: Briefcase,
      color: 'bg-yellow-500'
    },
    { 
      name: 'Restaurant Bookings', 
      value: stats.totalRestaurantBookings, 
      icon: Utensils,
      color: 'bg-red-500'
    },
    { 
      name: 'Tables', 
      value: stats.totalTables, 
      icon: Square,
      color: 'bg-pink-500'
    },
    { 
      name: 'Menu Items', 
      value: stats.totalMenus, 
      icon: MessageSquare,
      color: 'bg-teal-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600 mt-2">Welcome to Patil Associates Admin Panel</p>
        {error && (
          <div className="mt-2 text-sm text-yellow-600">{error}</div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-800">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-800">Recent Activity</h2>
          <p className="mt-1 text-sm text-gray-600">Latest actions in the system</p>
        </div>
        <div className="border-t border-gray-200">
          {recentActivity.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <li key={activity.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-gray-100 rounded-full p-2">
                        <Icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                          <div className="text-sm text-gray-500">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              No recent activity
            </div>
          )}
        </div>
      </div>

      {/* System Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <BarChart2 className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Data Summary</h3>
            </div>
            <p className="mt-2 text-gray-800">System is running smoothly with all components active.</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
            </div>
            <p className="mt-2 text-gray-800">{new Date().toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
            </div>
            <p className="mt-2 text-gray-800">Admin panel is currently active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;