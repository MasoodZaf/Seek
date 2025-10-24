import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDownIcon,
  ChevronRightIcon,
  StarIcon,
  FireIcon,
  PuzzlePieceIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

const navigationSections = [
  {
    title: 'Learning',
    items: [
      { name: 'Dashboard', href: '/dashboard', iconType: 'home', badge: null },
      { name: 'Browse Tutorials', href: '/tutorials', iconType: 'book', badge: null },
      { name: 'Database Tutorials', href: '/database-tutorials', iconType: 'database', badge: 'New' },
      { name: 'Practice', href: '/practice', iconType: 'play', badge: null },
      { name: 'Challenges', href: '/challenges', iconType: 'puzzle', badge: 'New' },
      { name: 'My Progress', href: '/progress', iconType: 'chart', badge: null },
    ]
  },
  {
    title: 'Tools',
    items: [
      { name: 'Code Playground', href: '/playground', iconType: 'code', badge: null },
      { name: 'Code Translator', href: '/translator', iconType: 'language', badge: 'Beta' },
      { name: 'Achievements', href: '/achievements', iconType: 'trophy', badge: null },
    ]
  }
];

const bottomNavigation = [
  { name: 'Profile', href: '/profile', iconType: 'user' },
  { name: 'Settings', href: '/settings', iconType: 'cog' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [collapsedSections, setCollapsedSections] = useState({});

  // Icon mapping function to prevent object rendering
  const getIconComponent = (iconType) => {
    const iconMap = {
      code: CodeBracketIcon,
      language: LanguageIcon,
      book: BookOpenIcon,
      database: CircleStackIcon,
      home: HomeIcon,
      chart: ChartBarIcon,
      play: PlayIcon,
      puzzle: PuzzlePieceIcon,
      trophy: TrophyIcon,
      user: UserIcon,
      cog: CogIcon,
    };
    return iconMap[iconType] || HomeIcon;
  };

  const toggleSection = (sectionTitle) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };
  
  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.href}
      onClick={mobile ? onClose : undefined}
      className={({ isActive }) =>
        clsx(
          'group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover-lift',
          {
            'bg-gradient-to-r from-white/20 to-white/10 text-white shadow-lg backdrop-blur-sm border border-white/20': isActive,
            'text-white/70 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm': !isActive,
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
                  'mr-3 h-5 w-5 transition-all duration-300',
                  {
                    'text-white drop-shadow-sm': isActive,
                    'text-white/60 group-hover:text-white/90 group-hover:scale-110': !isActive,
                  }
                )}
              />
            );
          })()}
          <span className="truncate font-medium">{item.name}</span>
          {item.badge && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={clsx(
                'ml-auto px-2 py-0.5 text-xs font-semibold rounded-full',
                {
                  'bg-white/20 text-white': item.badge === 'New',
                  'bg-yellow-400/20 text-yellow-200': item.badge === 'Beta',
                }
              )}
            >
              {item.badge}
            </motion.span>
          )}
          {isActive && (
            <motion.div
              layoutId="activeTab"
              className="absolute left-0 w-1 bg-white rounded-r-full shadow-glow"
              style={{ height: '32px' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl"
            />
          )}
        </>
      )}
    </NavLink>
  );
  
  const SidebarContent = () => (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Gradient Background with Texture Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
             }} 
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center px-6 py-6 border-b border-white/10"
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="h-12 w-12 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-lg"
            >
              <AcademicCapIcon className="h-7 w-7 text-white drop-shadow-sm" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white drop-shadow-sm">Seek</span>
              <span className="text-xs text-white/60 font-medium">Learning Platform</span>
            </div>
          </div>
        </motion.div>
        
        {/* Enhanced User Profile */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="px-6 py-6 border-b border-white/10"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="h-12 w-12 bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg"
              >
                <span className="text-lg font-bold text-white drop-shadow-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white shadow-sm"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate drop-shadow-sm">
                {user?.firstName} {user?.lastName}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-1">
                  <StarIcon className="h-3 w-3 text-yellow-400" />
                  <span className="text-xs text-white/70 font-medium">
                    Level {user?.progress?.level || 1}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <FireIcon className="h-3 w-3 text-orange-400" />
                  <span className="text-xs text-white/70 font-medium">
                    {user?.progress?.streak || 0} day streak
                  </span>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-2 w-full bg-white/20 rounded-full h-1.5 backdrop-blur-sm">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(user?.progress?.xp % 100) || 25}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-1.5 rounded-full shadow-sm"
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Navigation Sections */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="space-y-6">
            {navigationSections.map((section, sectionIndex) => (
              <motion.div 
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + sectionIndex * 0.1 }}
              >
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold text-white/60 uppercase tracking-wider hover:text-white/80 transition-colors duration-200"
                >
                  <span>{section.title}</span>
                  <motion.div
                    animate={{ rotate: collapsedSections[section.title] ? 0 : 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {!collapsedSections[section.title] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-1 mt-2"
                    >
                      {section.items.map((item, itemIndex) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: itemIndex * 0.05 }}
                        >
                          <NavItem item={item} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </nav>
        
        {/* Bottom Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="px-4 py-4 border-t border-white/10 space-y-1"
        >
          {bottomNavigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </motion.div>
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
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 flex z-40 lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0"
            >
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
              />
            </motion.div>
            
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative flex-1 flex flex-col max-w-xs w-full shadow-2xl"
            >
              <SidebarContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;