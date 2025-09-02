import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

// Enhanced gradient shimmer effect
const shimmerAnimation = {
  background: [
    'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
  ],
  backgroundPosition: ['-200px 0', '200px 0'],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: 'linear'
  }
};

const SkeletonBase = ({ className, children, ...props }) => (
  <motion.div
    className={clsx(
      'relative overflow-hidden bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg',
      className
    )}
    animate={shimmerAnimation}
    {...props}
  >
    {children}
  </motion.div>
);

// Dashboard-specific skeletons
export const DashboardSkeleton = () => (
  <div className="space-y-8 p-6">
    {/* Header section */}
    <div className="space-y-4">
      <SkeletonBase className="h-8 w-64" />
      <SkeletonBase className="h-4 w-96" />
    </div>

    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <SkeletonBase className="h-6 w-6 rounded-full" />
            <SkeletonBase className="h-8 w-16 rounded-full" />
          </div>
          <SkeletonBase className="h-8 w-20 mb-2" />
          <SkeletonBase className="h-4 w-32" />
        </div>
      ))}
    </div>

    {/* Recent tutorials */}
    <div className="space-y-4">
      <SkeletonBase className="h-6 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <TutorialCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

export const TutorialCardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <SkeletonBase className="h-6 w-3/4" />
        <SkeletonBase className="h-6 w-6 rounded-full" />
      </div>
      <SkeletonBase className="h-4 w-full" />
      <SkeletonBase className="h-4 w-2/3" />
      
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <SkeletonBase className="h-3 w-16" />
          <SkeletonBase className="h-3 w-8" />
        </div>
        <SkeletonBase className="h-2 w-full rounded-full" />
      </div>

      {/* Tags */}
      <div className="flex space-x-2">
        <SkeletonBase className="h-6 w-16 rounded-full" />
        <SkeletonBase className="h-6 w-12 rounded-full" />
      </div>
    </div>
  </div>
);

export const CodeEditorSkeleton = () => (
  <div className="bg-gray-900 rounded-lg p-4 space-y-3">
    {/* Editor header */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex space-x-2">
        <SkeletonBase className="h-3 w-3 rounded-full bg-red-500" />
        <SkeletonBase className="h-3 w-3 rounded-full bg-yellow-500" />
        <SkeletonBase className="h-3 w-3 rounded-full bg-green-500" />
      </div>
      <SkeletonBase className="h-4 w-24 bg-gray-700" />
    </div>
    
    {/* Code lines */}
    {[...Array(12)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <SkeletonBase className="h-4 w-6 bg-gray-600" />
        <SkeletonBase 
          className={clsx(
            'h-4 bg-gray-700',
            i % 3 === 0 ? 'w-3/4' : i % 3 === 1 ? 'w-1/2' : 'w-5/6'
          )}
        />
      </div>
    ))}
  </div>
);

export const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto p-6 space-y-8">
    {/* Profile header */}
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-6">
        <SkeletonBase className="h-24 w-24 rounded-full" />
        <div className="space-y-3 flex-1">
          <SkeletonBase className="h-8 w-48" />
          <SkeletonBase className="h-4 w-32" />
          <div className="flex space-x-4">
            <SkeletonBase className="h-6 w-20 rounded-full" />
            <SkeletonBase className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>

    {/* Stats grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
          <SkeletonBase className="h-8 w-16 mx-auto mb-2" />
          <SkeletonBase className="h-4 w-20 mx-auto" />
        </div>
      ))}
    </div>

    {/* Recent activity */}
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <SkeletonBase className="h-6 w-32 mb-4" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <SkeletonBase className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <SkeletonBase className="h-4 w-3/4" />
              <SkeletonBase className="h-3 w-1/2" />
            </div>
            <SkeletonBase className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const PlaygroundSkeleton = () => (
  <div className="h-screen flex">
    {/* Sidebar */}
    <div className="w-80 bg-gray-50 p-4 border-r border-gray-200">
      <SkeletonBase className="h-8 w-32 mb-6" />
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <SkeletonBase className="h-5 w-5 rounded" />
            <SkeletonBase className={clsx('h-4', i % 2 === 0 ? 'w-24' : 'w-32')} />
          </div>
        ))}
      </div>
    </div>

    {/* Main content */}
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SkeletonBase className="h-6 w-32" />
          <SkeletonBase className="h-8 w-24 rounded-md" />
        </div>
        <div className="flex space-x-2">
          <SkeletonBase className="h-8 w-16 rounded-md" />
          <SkeletonBase className="h-8 w-20 rounded-md" />
        </div>
      </div>

      {/* Editor and output */}
      <div className="flex-1 flex">
        <div className="flex-1 p-4">
          <CodeEditorSkeleton />
        </div>
        <div className="w-96 bg-gray-50 p-4 border-l border-gray-200">
          <SkeletonBase className="h-6 w-20 mb-4" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonBase key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Animated skeleton with wave effect
export const WaveSkeleton = ({ className, ...props }) => (
  <motion.div
    className={clsx(
      'relative overflow-hidden bg-gray-200 rounded-lg',
      className
    )}
    {...props}
  >
    <motion.div
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
      animate={{ translateX: ['0%', '200%'] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  </motion.div>
);

export default SkeletonBase;