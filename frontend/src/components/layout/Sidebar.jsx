/* eslint-disable */
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ChatBubbleLeftRightIcon,
  BugAntIcon,
  ChartPieIcon,
  UserGroupIcon,
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
      { name: 'Practice', href: '/practice', iconType: 'play', badge: null },
      { name: 'Challenges', href: '/challenges', iconType: 'puzzle', badge: 'New' },
      { name: 'My Progress', href: '/progress', iconType: 'chart', badge: null },
    ]
  },
  {
    title: 'Community',
    items: [
      { name: 'Discussions', href: '/community', iconType: 'community', badge: 'Beta' },
    ]
  },
  {
    title: 'Tools',
    items: [
      { name: 'Code Playground', href: '/playground', iconType: 'code', badge: null },
      { name: 'AI Translator', href: '/translator', iconType: 'language', badge: 'Beta' },
      { name: 'Achievements', href: '/achievements', iconType: 'trophy', badge: null },
    ]
  },
  {
    title: 'Support',
    items: [
      { name: 'Send Feedback', href: '/feedback', iconType: 'feedback', badge: null },
      { name: 'Report a Bug', href: '/report-bug', iconType: 'bug', badge: null },
    ]
  }
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  // Resizing state
  const [isMini, setIsMini] = useState(false);
  const [width, setWidth] = useState(256); // 16rem = 256px
  const [isResizing, setIsResizing] = useState(false);

  // Dynamic bottom navigation based on user role
  const bottomNavigation = [
    ...(user?.role === 'admin' ? [{ name: 'Admin Dashboard', href: '/admin/dashboard', iconType: 'admin' }] : []),
    { name: 'Profile', href: '/profile', iconType: 'user' },
    { name: 'Settings', href: '/settings', iconType: 'cog' },
  ];

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
      feedback: ChatBubbleLeftRightIcon,
      bug: BugAntIcon,
      admin: ChartPieIcon,
      community: UserGroupIcon,
    };
    return iconMap[iconType] || HomeIcon;
  };

  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e) => {
      if (isResizing) {
        let newWidth = e.clientX;
        if (newWidth < 120) {
          setIsMini(true);
        } else {
          setIsMini(false);
          // Clamp width between 200px and 450px
          if (newWidth < 200) newWidth = 200;
          if (newWidth > 450) newWidth = 450;
          setWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  const toggleMini = () => {
    setIsMini(!isMini);
    if (isMini && width < 200) {
      setWidth(256);
    }
  };

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.href}
      title={isMini ? item.name : undefined}
      onClick={(e) => {
        if (mobile) onClose();
        // If clicking active icon in mini mode, expand sidebar seamlessly
        if (isMini) {
          const isActive = window.location.pathname === item.href || (item.href !== '/' && window.location.pathname.startsWith(item.href));
          if (isActive) {
            e.preventDefault();
            toggleMini();
          }
        }
      }}
      className={({ isActive }) =>
        clsx(
          'group relative flex items-center transition-all duration-300 w-full',
          isMini ? 'justify-center py-4 rounded-none border-b border-transparent' : 'px-4 py-3 text-sm font-medium rounded-xl hover-lift',
          {
            // Expanded active
            'bg-gradient-to-r from-white/20 to-white/10 text-white shadow-lg backdrop-blur-sm border border-white/20': isActive && !isMini,
            // Expanded inactive 
            'text-white/70 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm': !isActive && !isMini,
            // Mini active/inactive
            'text-white': isActive && isMini,
            'text-white/50 hover:text-white': !isActive && isMini,
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
                  'transition-all duration-300 flex-shrink-0',
                  isMini ? 'h-7 w-7' : 'h-5 w-5 mr-3',
                  {
                    'text-white drop-shadow-sm': isActive,
                    'group-hover:scale-110 !text-white/90': !isActive,
                  }
                )}
              />
            );
          })()}

          {!isMini && (
            <>
              <span className="truncate flex-1 font-medium whitespace-nowrap">{item.name}</span>
              {item.badge && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={clsx(
                    'ml-auto px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0',
                    {
                      'bg-white/20 text-white': item.badge === 'New',
                      'bg-yellow-400/20 text-yellow-200': item.badge === 'Beta',
                    }
                  )}
                >
                  {item.badge}
                </motion.span>
              )}
            </>
          )}

          {isActive && (
            <motion.div
              layoutId="activeTab"
              className={clsx(
                "absolute bg-white shadow-glow",
                isMini ? "left-0 top-0 bottom-0 w-1 rounded-none hover:w-1.5 transition-all" : "left-0 w-1 rounded-r-full"
              )}
              style={!isMini ? { height: '32px' } : undefined}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}

          {isActive && !isMini && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl pointer-events-none"
            />
          )}
        </>
      )}
    </NavLink>
  );

  const SidebarContent = () => (
    <div className="h-full flex flex-col relative overflow-hidden bg-transparent">
      {/* Background with Texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 -z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 h-full flex flex-col shadow-2xl">
        {/* Header / Logo */}
        <motion.div
          animate={{ padding: isMini ? "1.5rem 0" : "1.5rem 1.5rem" }}
          className="flex items-center justify-center border-b border-white/10"
        >
          <div className={clsx("flex items-center relative", isMini ? "justify-center w-full" : "space-x-3 w-full")}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              onClick={isMini ? toggleMini : undefined}
              className={clsx("flex-shrink-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-lg cursor-pointer", isMini ? "h-12 w-12" : "h-10 w-10")}
            >
              <AcademicCapIcon className={clsx("text-white drop-shadow-sm pointer-events-none", isMini ? "h-8 w-8" : "h-6 w-6")} />
            </motion.div>

            {!isMini && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-xl font-bold text-white drop-shadow-sm truncate">Seek</span>
                <span className="text-[10px] text-white/60 font-medium truncate">Learning Platform</span>
              </div>
            )}

            {/* Expander Arrow */}
            <div className={clsx("hidden lg:flex transition-all z-50", isMini ? "absolute -right-3 top-1/2 transform -translate-y-1/2 scale-110 shadow-xl border border-white/30" : "absolute right-0")}>
              <button
                onClick={toggleMini}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-md shadow"
              >
                {isMini ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-5 w-5 transform rotate-90" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* User Profile Area */}
        <motion.div
          animate={{ padding: isMini ? "1.5rem 0" : "1.5rem 1.5rem" }}
          className={clsx("border-b border-white/10 flex cursor-pointer hover:bg-white/5 transition-colors", isMini ? 'justify-center' : '')}
          onClick={isMini ? toggleMini : undefined}
          title={isMini ? "Click to expand" : undefined}
        >
          <div className={clsx("flex items-center", isMini ? "justify-center" : "space-x-4")}>
            <div className="relative flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={clsx(
                  "bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg",
                  isMini ? "h-10 w-10" : "h-12 w-12"
                )}
              >
                <span className={clsx("font-bold text-white drop-shadow-sm", isMini ? "text-sm" : "text-lg")}>
                  {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
                </span>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white shadow-sm"
              />
            </div>

            {!isMini && (
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-sm font-semibold text-white truncate drop-shadow-sm">
                  {user?.firstName || 'Admin'} {user?.lastName || 'User'}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <StarIcon className="h-3 w-3 text-yellow-400" />
                    <span className="text-xs text-white/70 font-medium whitespace-nowrap">
                      Level {user?.progress?.level || 1}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <FireIcon className="h-3 w-3 text-orange-400" />
                    <span className="text-xs text-white/70 font-medium whitespace-nowrap">
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
            )}
          </div>
        </motion.div>

        {/* Navigation Sections & Account Area */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar scroll-smooth">
          <div className="space-y-6">
            {navigationSections.map((section, sectionIndex) => (
              <div key={section.title}>
                {!isMini && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-3 py-2 text-[10px] font-bold text-white/60 uppercase tracking-widest"
                  >
                    {section.title}
                  </motion.div>
                )}

                <div className={clsx("space-y-1", !isMini && "mt-1")}>
                  {section.items.map((item) => (
                    <NavItem key={item.name} item={item} />
                  ))}
                </div>
              </div>
            ))}

            {/* Account / Admin Section integrated into scroll flow */}
            <div className="pt-4 mt-4 border-t border-white/10">
              {!isMini && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-3 py-2 text-[10px] font-bold text-white/60 uppercase tracking-widest"
                >
                  Account
                </motion.div>
              )}
              <div className={clsx("space-y-1", !isMini && "mt-1")}>
                {bottomNavigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </div>
            </div>
          </div>
        </nav>

      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Container with Resizer */}
      <div
        className={clsx(
          "hidden lg:flex lg:flex-shrink-0 relative h-screen z-50 group/sidebar shadow-2xl overflow-visible",
          !isResizing && "transition-[width] duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)]",
          isResizing && "select-none transition-none"
        )}
        style={{ width: isMini ? 72 : width }}
      >
        <div className="flex flex-col w-full h-full relative" onClick={(e) => {
          if (isMini && (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON' && !e.target.closest('a'))) {
            toggleMini();
          }
        }}>
          <SidebarContent />
        </div>

        {/* Draggable Resizer - only wide active zone */}
        <div
          className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-[60] flex items-center justify-center opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300"
          onMouseDown={startResizing}
          title="Drag to resize, click to toggle"
          onClick={(e) => { e.stopPropagation(); toggleMini(); }}
        >
          {/* Visual line indicating draggable area */}
          <div className={clsx(
            "h-full w-1 transition-colors duration-200",
            isResizing ? "bg-white/50 shadow-glow" : "bg-white/10 hover:bg-white/30"
          )} />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 flex z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />

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
