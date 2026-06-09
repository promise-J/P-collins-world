import { useAuthStore } from '@/store/auth.store';
import { Card, Button } from '@/ui';
import Container from '@/ui/components/Container';
import { Wallet, ShoppingBag, Home, Target, TrendingUp, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardHomePage() {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Wallet Balance', value: '₦0.00', icon: Wallet, color: 'bg-green-500', link: '/wallet' },
    { label: 'Active Orders', value: '0', icon: ShoppingBag, color: 'bg-blue-500', link: '/orders' },
    { label: 'Saved Properties', value: '0', icon: Home, color: 'bg-purple-500', link: '/properties/favorites' },
    { label: 'Savings Goals', value: '0', icon: Target, color: 'bg-orange-500', link: '/savings' },
  ];

  const recentActivity = [
    { id: 1, action: 'Welcome to P Collins!', time: 'Just now', type: 'info' },
  ];

  return (
    <Container>
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link to={stat.link} key={stat.label}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-[var(--color-brand-text)] mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                    <Icon className={`${stat.color.replace('bg-', 'text-')}`} size={24} />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/wallet/fund">
            <Button variant="primary" className="w-full">
              Fund Wallet
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="secondary" className="w-full">
              Start Shopping
            </Button>
          </Link>
          <Link to="/properties">
            <Button variant="secondary" className="w-full">
              Browse Properties
            </Button>
          </Link>
          <Link to="/savings">
            <Button variant="secondary" className="w-full">
              Create Savings Goal
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-4">
          Recent Activity
        </h2>
        <Card>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell size={48} className="mx-auto mb-3 text-gray-300" />
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-gray-700">{activity.action}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recommendations */}
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-4">
          Recommended for You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/products">
            <Card className="text-center hover:shadow-md transition-shadow">
              <ShoppingBag size={40} className="mx-auto mb-3 text-[var(--color-brand-primary)]" />
              <h3 className="font-semibold">Shop Marketplace</h3>
              <p className="text-sm text-gray-500 mt-1">Discover great deals</p>
            </Card>
          </Link>
          <Link to="/savings">
            <Card className="text-center hover:shadow-md transition-shadow">
              <Target size={40} className="mx-auto mb-3 text-[var(--color-brand-primary)]" />
              <h3 className="font-semibold">Start Saving</h3>
              <p className="text-sm text-gray-500 mt-1">Reach your financial goals</p>
            </Card>
          </Link>
          <Link to="/properties">
            <Card className="text-center hover:shadow-md transition-shadow">
              <Home size={40} className="mx-auto mb-3 text-[var(--color-brand-primary)]" />
              <h3 className="font-semibold">Find Properties</h3>
              <p className="text-sm text-gray-500 mt-1">Browse verified listings</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
    </Container>
  );
}