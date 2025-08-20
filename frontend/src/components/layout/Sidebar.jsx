import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  BookOpenIcon,
  CodeBracketIcon,
  ChartBarIcon,
  UserIcon,
  CogIcon,
  AcademicCapIcon,
  TrophyIcon,
  PlayIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Code Playground', href: '/playground', iconType: 'code' },
  { name: 'Code Translator', href: '/translator', iconType: 'language' },
  { name: 'Browse Tutorials', href: '/tutorials', iconType: 'book' },
  { name: 'Dashboard', href: '/dashboard', iconType: 'home' },
  { name: 'My Progress', href: '/progress', iconType: 'chart' },
  { name: 'Practice', href: '/practice', iconType: 'play' },
  { name: 'Achievements', href: '/achievements', iconType: 'trophy' },
];

const bottomNavigation = [
  { name: 'Profile', href: '/profile', iconType: 'user' },
  { name: 'Settings', href: '/settings', iconType: 'cog' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  // Icon mapping function to prevent object rendering
  const getIconComponent = (iconType) => {
    const iconMap = {
      code: CodeBracketIcon,
      language: LanguageIcon,
      book: BookOpenIcon,
      home: HomeIcon,
      chart: ChartBarIcon,
      play: PlayIcon,
      trophy: TrophyIcon,
      user: UserIcon,
      cog: CogIcon,
    };
    return iconMap[iconType] || HomeIcon;
  };
  
  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.href}
      onClick={mobile ? onClose : undefined}
      className={({ isActive }) =>
        clsx(
          'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
          {
            'bg-primary-100 text-primary-700 shadow-sm': isActive,
            'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50': !isActive,
          }
        )
      }
    >
      {({ isActive }) => (
        <>
          {(() => {
            const IconComponent = getIconComponent(item.iconType);
            return (
              <IconComponent
                className={clsx(
                  'mr-3 h-5 w-5 transition-colors',
                  {
                    'text-primary-600': isActive,
                    'text-secondary-400 group-hover:text-secondary-600': !isActive,
                  }
                )}
              />
            );
          })()}
          <span className="truncate">{item.name}</span>
          {isActive && (
            <motion.div
              layoutId="activeTab"
              className="absolute left-0 w-1 bg-primary-600 rounded-r-full"
              style={{ height: '24px' }}
            />
          )}
        </>
      )}
    </NavLink>
  );
  
  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white border-r border-secondary-200">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-secondary-200">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
            <AcademicCapIcon className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-secondary-900">Seek</span>
            <span className="text-xs text-secondary-500">Learning Platform</span>
          </div>
        </div>
      </div>
      
      {/* User Profile */}
      <div className="px-6 py-4 border-b border-secondary-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-secondary-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-secondary-500 truncate">
              Level {user?.progress?.level || 1} Learner
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <div key={item.name} className="relative">
            <NavItem item={item} />
          </div>
        ))}
      </nav>
      
      {/* Bottom Navigation */}
      <div className="px-4 py-4 border-t border-secondary-200 space-y-1">
        {bottomNavigation.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
  
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent />
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0">
            <div 
              className="absolute inset-0 bg-secondary-600 opacity-75"
              onClick={onClose}
            />
          </div>
          
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative flex-1 flex flex-col max-w-xs w-full bg-white"
          >
            <SidebarContent />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;