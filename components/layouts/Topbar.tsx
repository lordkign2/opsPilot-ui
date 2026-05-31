'use client';

import { Bell, Search, User } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Topbar() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1.5 w-96">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2 border-l pl-4 ml-4">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-700">{user?.first_name || 'Admin'} {user?.last_name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role || 'Manager'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
