import { Button } from '@/components/ui';
import { ShoppingCart, Users, DollarSign, TrendingUp } from 'lucide-react';

const stats = [
  { name: 'Total Revenue', value: '₦1,240,000', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
  { name: 'Active Customers', value: '450', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
  { name: 'Total Orders', value: '1,200', icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-100' },
  { name: 'Growth Rate', value: '12%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <Button>Generate Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-sm text-gray-500">{stat.name}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {/* Dummy data for illustration */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-700">Order #100{i}</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-700">₦25,000</p>
                  <p className="text-xs text-green-600">Completed</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4">View All Orders</Button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">AI Operational Insights</h2>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800 leading-relaxed">
              Based on your recent data, we noticed a 15% increase in orders from repeat customers in the Lagos area. 
              We recommend setting up an automated discount workflow for this segment to drive further retention.
            </p>
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-4">Ask AI Assistant</Button>
        </div>
      </div>
    </div>
  );
}
