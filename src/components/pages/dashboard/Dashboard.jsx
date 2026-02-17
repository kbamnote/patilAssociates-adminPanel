import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Package, MessageCircle, Mail, BarChart2, CheckCircle, Clock, UserPlus, MessageSquare, Home, Calendar, Utensils, Square, TrendingUp, DollarSign, PieChart, Activity } from 'lucide-react';
import { getDashboardOverviewStats, getDashboardRevenueAnalytics, getDashboardBookingAnalytics, getDashboardUserAnalytics, getDashboardPropertyAnalytics, getDashboardRealtimeStats } from '../../utils/Api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    overview: {},
    bookingStats: [],
    userRegistrationTrend: [],
    propertyTypeStats: [],
    recentQueries: []
  });
  
  const [analytics, setAnalytics] = useState({
    revenue: {},
    bookings: {},
    users: {},
    properties: {}
  });
  
  const [realtimeStats, setRealtimeStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modern Chart configurations
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#4B5563',
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Revenue by Service',
        color: '#1F2937',
        font: {
          size: 16,
          weight: '600',
          family: 'Inter, sans-serif',
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#4B5563',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `₹${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          }
        }
      },
      y: {
        grid: {
          color: '#E5E7EB',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          },
          callback: function(value) {
            return `₹${value.toLocaleString()}`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#4B5563',
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      title: {
        display: true,
        text: 'User Distribution',
        color: '#1F2937',
        font: {
          size: 16,
          weight: '600',
          family: 'Inter, sans-serif',
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#4B5563',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'point',
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#4B5563',
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Booking Trends Over Time',
        color: '#1F2937',
        font: {
          size: 16,
          weight: '600',
          family: 'Inter, sans-serif',
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#4B5563',
        borderWidth: 1,
        cornerRadius: 8,
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          color: '#E5E7EB',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  // Property chart options
  const propertyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#4B5563',
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Property Type Distribution',
        color: '#1F2937',
        font: {
          size: 16,
          weight: '600',
          family: 'Inter, sans-serif',
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#4B5563',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} properties`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  // Chart data preparation with null safety
  const revenueChartData = {
    labels: analytics.revenue.revenueByService?.map(service => 
      service._id ? service._id.charAt(0).toUpperCase() + service._id.slice(1) : 'Unknown'
    ) || [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: analytics.revenue.revenueByService?.map(service => service.totalRevenue || 0) || [],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 205, 86, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 205, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const userDistributionData = {
    labels: analytics.users.roleDistribution?.map(role => 
      role._id ? role._id.charAt(0).toUpperCase() + role._id.slice(1) : 'Unknown'
    ) || [],
    datasets: [
      {
        data: analytics.users.roleDistribution?.map(role => role.count || 0) || [],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const bookingTrendData = {
    labels: analytics.bookings.bookingTrends?.map(booking => 
      booking._id?.date || 'N/A'
    ) || [],
    datasets: [
      {
        label: 'Confirmed Bookings',
        data: analytics.bookings.bookingTrends
          ?.filter(booking => booking._id?.status === 'confirmed')
          .map(booking => booking.count || 0) || [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Pending Bookings',
        data: analytics.bookings.bookingTrends
          ?.filter(booking => booking._id?.status === 'pending')
          .map(booking => booking.count || 0) || [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const propertyTypeData = {
    labels: analytics.properties.propertyTypeStats?.map(type => 
      type._id ? type._id.charAt(0).toUpperCase() + type._id.slice(1) : 'Unknown'
    ) || [],
    datasets: [
      {
        label: 'Number of Properties',
        data: analytics.properties.propertyTypeStats?.map(type => type.count || 0) || [],
        backgroundColor: [
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(201, 203, 207, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderColor: [
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(201, 203, 207, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all dashboard data
        const [overviewRes, revenueRes, bookingRes, userRes, propertyRes, realtimeRes] = await Promise.allSettled([
          getDashboardOverviewStats(),
          getDashboardRevenueAnalytics({ period: 'month' }),
          getDashboardBookingAnalytics({ period: 'month' }),
          getDashboardUserAnalytics(),
          getDashboardPropertyAnalytics(),
          getDashboardRealtimeStats()
        ]);
        
        // Handle overview stats
        if (overviewRes.status === 'fulfilled' && overviewRes.value.data.success) {
          setStats(overviewRes.value.data.data);
        }
        
        // Handle analytics
        if (revenueRes.status === 'fulfilled' && revenueRes.value.data.success) {
          setAnalytics(prev => ({ ...prev, revenue: revenueRes.value.data.data }));
        }
        
        if (bookingRes.status === 'fulfilled' && bookingRes.value.data.success) {
          setAnalytics(prev => ({ ...prev, bookings: bookingRes.value.data.data }));
        }
        
        if (userRes.status === 'fulfilled' && userRes.value.data.success) {
          setAnalytics(prev => ({ ...prev, users: userRes.value.data.data }));
        }
        
        if (propertyRes.status === 'fulfilled' && propertyRes.value.data.success) {
          setAnalytics(prev => ({ ...prev, properties: propertyRes.value.data.data }));
        }
        
        // Handle realtime stats
        if (realtimeRes.status === 'fulfilled' && realtimeRes.value.data.success) {
          setRealtimeStats(realtimeRes.value.data.data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Some features may not work properly.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { 
      name: 'Total Users', 
      value: stats.overview?.totalUsers || 0, 
      icon: Users,
      color: 'bg-blue-500'
    },
    { 
      name: 'Hotel Rooms', 
      value: stats.overview?.totalHotelRooms || 0, 
      icon: Calendar,
      color: 'bg-purple-500'
    },
    { 
      name: 'Properties', 
      value: stats.overview?.totalProperties || 0, 
      icon: Home,
      color: 'bg-green-500'
    },
    { 
      name: 'Property Listings', 
      value: stats.overview?.totalPropertyListings || 0, 
      icon: Package,
      color: 'bg-indigo-500'
    },
    { 
      name: 'Total Queries', 
      value: stats.overview?.totalQueries || 0, 
      icon: MessageCircle,
      color: 'bg-yellow-500'
    },
    { 
      name: 'Total Orders', 
      value: stats.overview?.totalOrders || 0, 
      icon: Briefcase,
      color: 'bg-red-500'
    },
    { 
      name: 'Active Bookings', 
      value: stats.overview?.activeBookings || 0, 
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    { 
      name: 'Total Revenue', 
      value: `₹${(stats.overview?.totalRevenue || 0).toLocaleString()}`, 
      icon: DollarSign,
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Real-time Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800">Real-time Statistics</h2>
          <div className="flex items-center text-sm text-gray-500">
            <Activity className="h-4 w-4 mr-1" />
            <span>Last updated: {realtimeStats.lastUpdated ? new Date(realtimeStats.lastUpdated).toLocaleTimeString() : 'N/A'}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{realtimeStats.onlineUsers || 0}</div>
            <div className="text-sm text-blue-800">Online Users</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">{realtimeStats.pendingBookings || 0}</div>
            <div className="text-sm text-yellow-800">Pending Bookings</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">₹{(realtimeStats.todayRevenue || 0).toLocaleString()}</div>
            <div className="text-sm text-green-800">Today's Revenue</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{realtimeStats.activeQueries || 0}</div>
            <div className="text-sm text-purple-800">Active Queries</div>
          </div>
        </div>
      </div>

      {/* Modern Chart Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Bar Chart Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 mr-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Revenue Analytics</h3>
                <p className="text-sm text-gray-500">By Service Category</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                ₹{(analytics.revenue.revenueByService?.reduce((sum, service) => sum + (service.totalRevenue || 0), 0) || 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Total Revenue</div>
            </div>
          </div>
          <div className="h-80">
            <Bar options={barChartOptions} data={revenueChartData} />
          </div>
        </div>

        {/* User Distribution Pie Chart Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 mr-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">User Distribution</h3>
                <p className="text-sm text-gray-500">Role Breakdown</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {analytics.users.roleDistribution?.reduce((sum, role) => sum + (role.count || 0), 0) || 0}
              </div>
              <div className="text-xs text-gray-500">Total Users</div>
            </div>
          </div>
          <div className="h-80 flex items-center justify-center">
            <div className="w-full h-full">
              <Pie options={pieChartOptions} data={userDistributionData} />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Trends Line Chart Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 mr-4">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Booking Trends</h3>
              <p className="text-sm text-gray-500">Performance Over Time</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {analytics.bookings.bookingTrends?.filter(b => b._id?.status === 'confirmed').reduce((sum, b) => sum + (b.count || 0), 0) || 0}
              </div>
              <div className="text-xs text-gray-500">Confirmed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-yellow-600">
                {analytics.bookings.bookingTrends?.filter(b => b._id?.status === 'pending').reduce((sum, b) => sum + (b.count || 0), 0) || 0}
              </div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
          </div>
        </div>
        <div className="h-96">
          <Line options={lineChartOptions} data={bookingTrendData} />
        </div>
      </div>

      {/* Property Type Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 mr-4">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Property Distribution</h3>
              <p className="text-sm text-gray-500">By Property Type</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">
              {analytics.properties.propertyTypeStats?.reduce((sum, type) => sum + (type.count || 0), 0) || 0}
            </div>
            <div className="text-xs text-gray-500">Total Properties</div>
          </div>
        </div>
        <div className="h-80">
          <Bar 
            options={propertyChartOptions} 
            data={propertyTypeData} 
          />
        </div>
      </div>

      {/* Recent Queries Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <MessageCircle className="h-5 w-5 text-yellow-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">Recent Queries Distribution</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.recentQueries && stats.recentQueries.map((query, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-xl font-bold text-gray-800 capitalize">
                {query._id || 'Unknown'}</div>
              <div className="text-2xl font-semibold text-yellow-600 mt-2">
                {query.count || 0}</div>
              <div className="text-sm text-gray-600">queries</div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default Dashboard;