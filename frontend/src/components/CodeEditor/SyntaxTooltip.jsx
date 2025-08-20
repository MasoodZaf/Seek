import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SyntaxTooltip = ({ helpData, position, isVisible }) => {
  if (!helpData || !isVisible) return null;

  const getCategoryColor = (category) => {
    switch (category) {
      case 'keyword':
        return 'bg-blue-600';
      case 'method':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'keyword':
        return '🔑';
      case 'method':
        return '⚡';
      default:
        return '💡';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed z-50 max-w-xs sm:max-w-sm"
        style={{
          left: position.x,
          top: position.y - 10,
          transform: 'translateY(-100%)'
        }}
      >
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className={`${getCategoryColor(helpData.category)} text-white px-3 py-2`}>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{getCategoryIcon(helpData.category)}</span>
              <h3 className="font-semibold text-sm">{helpData.title}</h3>
              <span className="text-xs opacity-75 capitalize bg-white/20 px-2 py-0.5 rounded-full">
                {helpData.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 space-y-3">
            {/* Description */}
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {helpData.description}
            </p>

            {/* Syntax */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Syntax
              </h4>
              <code className="block text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1.5 rounded border font-mono whitespace-pre-wrap">
                {helpData.syntax}
              </code>
            </div>

            {/* Example */}
            {helpData.example && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Example
                </h4>
                <code className="block text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-2 py-1.5 rounded border font-mono whitespace-pre-wrap">
                  {helpData.example}
                </code>
              </div>
            )}
          </div>

          {/* Arrow pointing down */}
          <div 
            className="absolute -bottom-1 left-6 w-3 h-3 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-600 transform rotate-45"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SyntaxTooltip;