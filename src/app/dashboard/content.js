'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import axios from '@/app/lib/axios';

export default function Beranda() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalTasks: 0,
    totalTopups: 0,
    totalWithdraws: 0,
    pendingTasks: 0,
    pendingTopups: 0,
    pendingWithdraws: 0,
    totalRevenue: 0,
    recentActivities: []
  });

  // Fetch data dari API
  const fetchDashboardData = async (isInitial = false) => {
    try {
      if (isInitial) {
        setIsInitialLoading(true);
      } else {
        setIsRefreshing(true);
      }
      
      const [usersRes, tasksRes, topupsRes, withdrawsRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/request/tasks'),
        axios.get('/api/admin/request/topups'),
        axios.get('/api/admin/request/withdraws')
      ]);

      // Process users data
      const users = usersRes.data?.usersData || [];
      const totalUsers = users.length;

      // Process tasks data
      const tasks = tasksRes.data?.data?.requestTasks || [];
      const totalTasks = tasks.length;
      const pendingTasks = tasks.filter(t => !t.isRead).length;

      // Process topups data
      const topups = topupsRes.data?.data?.topups || [];
      const totalTopups = topups.length;
      const pendingTopups = topups.filter(t => t.status === 'PENDING').length;
      const approvedTopups = topups.filter(t => t.status === 'APPROVED');
      const totalRevenue = approvedTopups.reduce((sum, t) => sum + (t.amount || 0), 0);

      // Process withdraws data
      const withdraws = withdrawsRes.data?.data?.withdraws || [];
      const totalWithdraws = withdraws.length;
      const pendingWithdraws = withdraws.filter(w => w.status === 'PENDING').length;

      // Combine recent activities
      const recentActivities = [
        ...tasks.map(t => ({
          id: t.id,
          type: 'task',
          username: t.user?.username || 'Unknown',
          description: `Request tugas ke-${t.user?.userLevel?.totalTasks || 0}`,
          status: t.isRead ? 'processed' : 'pending',
          createdAt: t.createdAt
        })),
        ...topups.map(t => ({
          id: t.id,
          type: 'topup',
          username: t.user?.username || 'Unknown',
          description: `Top Up Rp ${(t.amount || 0).toLocaleString('id-ID')}`,
          status: t.status.toLowerCase(),
          createdAt: t.createdAt
        })),
        ...withdraws.map(w => ({
          id: w.id,
          type: 'withdraw',
          username: w.user?.username || 'Unknown',
          description: `Withdraw Rp ${(w.amount || 0).toLocaleString('id-ID')}`,
          status: w.status.toLowerCase(),
          createdAt: w.createdAt
        }))
      ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

      setDashboardData({
        totalUsers,
        totalTasks,
        totalTopups,
        totalWithdraws,
        pendingTasks,
        pendingTopups,
        pendingWithdraws,
        totalRevenue,
        recentActivities
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // ✅ Handle 401
      if (error.response?.status === 401) {
        console.error('❌ Token expired, redirecting to login');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('adminId');
        localStorage.removeItem('adminName');
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    } finally {
      if (isInitial) {
        setIsInitialLoading(false);
      }
      setIsRefreshing(false);
    }
  };

  // ✅ Fetch HANYA SEKALI saat component mount
  useEffect(() => {
    fetchDashboardData(true);
  }, []); // Empty dependency = hanya run sekali

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, Admin! 👋</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              id: 1,
              title: 'Total Users',
              value: dashboardData.totalUsers.toLocaleString('id-ID'),
              icon: Users,
              color: 'blue',
            },
            {
              id: 2,
              title: 'Pending Tasks',
              value: dashboardData.pendingTasks.toLocaleString('id-ID'),
              icon: Clock,
              color: 'orange',
              trend: `${dashboardData.totalTasks} total permintaan`
            },
            {
              id: 3,
              title: 'Total Revenue',
              value: `Rp ${(dashboardData.totalRevenue / 1000000).toFixed(1)}M`,
              icon: DollarSign,
              color: 'green',
              trend: 'Dari approved topups'
            },
            {
              id: 4,
              title: 'Pending Requests',
              value: (dashboardData.pendingTopups + dashboardData.pendingWithdraws).toLocaleString('id-ID'),
              icon: Activity,
              color: 'purple',
              trend: `Topup: ${dashboardData.pendingTopups} | Withdraw: ${dashboardData.pendingWithdraws}`
            }
          ].map((stat) => {
            const Icon = stat.icon;
            const colors = {
              blue: 'bg-blue-50 text-blue-600',
              green: 'bg-green-50 text-green-600',
              purple: 'bg-purple-50 text-purple-600',
              orange: 'bg-orange-50 text-orange-600'
            };
            const colorClass = colors[stat.color] || colors.blue;
            
            return (
              <div 
                key={stat.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.trend}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Activities */}
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Recent Activities</h2>
                <button 
                  onClick={() => fetchDashboardData(false)}
                  disabled={isRefreshing}
                  className={`text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isRefreshing 
                      ? 'bg-blue-50 text-blue-400 cursor-wait' 
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>
            {/* ... Rest of table sama seperti sebelumnya ... */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dashboardData.recentActivities.map((activity) => {
                    // ... helper functions sama ...
                    const getActivityIcon = (type) => {
                      switch(type) {
                        case 'task': return <ShoppingCart className="w-4 h-4" />;
                        case 'topup': return <TrendingUp className="w-4 h-4" />;
                        case 'withdraw': return <DollarSign className="w-4 h-4" />;
                        default: return <Activity className="w-4 h-4" />;
                      }
                    };
                    
                    const getActivityBadge = (type) => {
                      const badges = {
                        task: 'bg-blue-100 text-blue-700',
                        topup: 'bg-green-100 text-green-700',
                        withdraw: 'bg-orange-100 text-orange-700'
                      };
                      return badges[type] || badges.task;
                    };
                    
                    const getStatusBadge = (status) => {
                      const badges = {
                        approved: 'bg-green-100 text-green-700',
                        pending: 'bg-yellow-100 text-yellow-700',
                        rejected: 'bg-red-100 text-red-700',
                        processed: 'bg-blue-100 text-blue-700'
                      };
                      return badges[status] || badges.pending;
                    };
                    
                    const getStatusText = (status) => {
                      const text = {
                        approved: 'Approved',
                        pending: 'Pending',
                        rejected: 'Rejected',
                        processed: 'Processed'
                      };
                      return text[status] || status;
                    };
                    
                    const getStatusIcon = (status) => {
                      if (status === 'approved' || status === 'processed') {
                        return <CheckCircle className="w-4 h-4" />;
                      }
                      if (status === 'rejected') {
                        return <XCircle className="w-4 h-4" />;
                      }
                      return <Clock className="w-4 h-4" />;
                    };
                    
                    const formatDate = (dateString) => {
                      if (!dateString) return '-';
                      try {
                        const date = new Date(dateString);
                        const now = new Date();
                        const diff = now - date;
                        const minutes = Math.floor(diff / 60000);
                        const hours = Math.floor(diff / 3600000);
                        const days = Math.floor(diff / 86400000);

                        if (minutes < 1) return 'Baru saja';
                        if (minutes < 60) return `${minutes} menit lalu`;
                        if (hours < 24) return `${hours} jam lalu`;
                        if (days < 7) return `${days} hari lalu`;
                        
                        return date.toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        });
                      } catch {
                        return '-';
                      }
                    };
                    
                    return (
                      <tr key={`${activity.type}-${activity.id}`} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${getActivityBadge(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">{activity.username}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{activity.description}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(activity.status)}`}>
                            {getStatusIcon(activity.status)}
                            {getStatusText(activity.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500">{formatDate(activity.createdAt)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {dashboardData.recentActivities.length === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="mt-2 text-gray-500 font-medium">Tidak ada aktivitas terbaru</p>
                  <p className="text-gray-400 text-sm">Aktivitas akan muncul di sini</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Grid - sama seperti sebelumnya */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* ... Copy semua Quick Stats Grid dari kode sebelumnya ... */}
        </div>
      </div>
    </div>
  );
}