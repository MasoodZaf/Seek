import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Button, Input } from '../ui';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState([
    { id: 1, title: 'New tutorial available', time: '2 min ago', unread: true },
    { id: 2, title: 'Progress milestone reached', time: '1 hour ago', unread: false },
  ]);
  
  const unreadCount = notifications.filter(n => n.unread).length;
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search functionality
      // TODO: Implement search functionality
    }
  };
  
  return (
    <header className={`border-b shadow-sm transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-secondary-200'
    }`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button and search */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Bars3Icon className="h-6 w-6" />
            </Button>
            
            <div className="hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search tutorials, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={MagnifyingGlassIcon}
                  className="w-80"
                />
              </form>
            </div>
          </div>
          
          {/* Right side - Actions and user menu */}
          <div className="flex items-center space-x-4">
            {/* Search button for mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </Button>
            
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className={isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>
            
            {/* Notifications */}
            <Menu as="div" className="relative">
              <Menu.Button as={Button} variant="ghost" size="sm" className="relative">
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-error-500 text-white rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Menu.Button>
              
              <Transition
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-secondary-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-secondary-200">
                    <h3 className="text-sm font-semibold text-secondary-900">
                      Notifications
                    </h3>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <Menu.Item key={notification.id}>
                        {({ active }) => (
                          <div
                            className={clsx(
                              'px-4 py-3 transition-colors cursor-pointer',
                              active && 'bg-secondary-50',
                              notification.unread && 'bg-primary-50'
                            )}
                          >
                            <p className="text-sm text-secondary-900">
                              {notification.title}
                            </p>
                            <p className="text-xs text-secondary-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                  
                  <div className="px-4 py-2 border-t border-secondary-200">
                    <Button variant="ghost" size="sm" className="w-full text-left">
                      View all notifications
                    </Button>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            
            {/* User menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-secondary-50 transition-colors">
                <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-secondary-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {user?.role || 'Student'}
                  </p>
                </div>
              </Menu.Button>
              
              <Transition
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-secondary-200 py-2 z-50">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={clsx(
                          'flex items-center px-4 py-2 text-sm text-secondary-700 transition-colors',
                          active && 'bg-secondary-50'
                        )}
                      >
                        <UserIcon className="h-4 w-4 mr-3" />
                        View Profile
                      </Link>
                    )}
                  </Menu.Item>
                  
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={clsx(
                          'flex items-center px-4 py-2 text-sm text-secondary-700 transition-colors',
                          active && 'bg-secondary-50'
                        )}
                      >
                        <CogIcon className="h-4 w-4 mr-3" />
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                  
                  <div className="border-t border-secondary-200 my-1" />
                  
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={clsx(
                          'flex items-center w-full px-4 py-2 text-sm text-secondary-700 transition-colors',
                          active && 'bg-secondary-50'
                        )}
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;