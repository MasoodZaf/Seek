import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import { keyboardShortcutManager } from '../../utils/keyboardNavigation';
import { useModal } from '../../utils/accessibility';

/**
 * Keyboard shortcuts help modal
 */
const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
  const [shortcuts, setShortcuts] = useState([]);
  const modalRef = useModal(isOpen);

  useEffect(() => {
    if (isOpen) {
      const allShortcuts = keyboardShortcutManager.getShortcuts();
      
      // Group shortcuts by category
      const grouped = {
        navigation: [],
        accessibility: [],
        general: []
      };

      allShortcuts.forEach(shortcut => {
        if (shortcut.keys.startsWith('g ')) {
          grouped.navigation.push(shortcut);
        } else if (shortcut.keys.startsWith('alt+')) {
          grouped.accessibility.push(shortcut);
        } else {
          grouped.general.push(shortcut);
        }
      });

      setShortcuts(grouped);
    }
  }, [isOpen]);

  const formatKeys = (keys) => {
    return keys
      .split('+')
      .map(key => {
        // Format key names for display
        const keyMap = {
          'ctrl': 'Ctrl',
          'alt': 'Alt',
          'shift': 'Shift',
          'meta': 'Cmd',
          ' ': 'Space'
        };
        return keyMap[key] || key.toUpperCase();
      })
      .join(' + ');
  };

  const ShortcutGroup = ({ title, shortcuts, icon: Icon }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="w-5 h-5 text-primary-600" />}
        <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>
      </div>
      <div className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex items-center justify-between py-2 px-3 bg-secondary-50 rounded-lg">
            <span className="text-sm text-secondary-700">{shortcut.description}</span>
            <div className="flex items-center gap-1">
              {shortcut.keys.split('+').map((key, keyIndex) => (
                <React.Fragment key={keyIndex}>
                  {keyIndex > 0 && <span className="text-secondary-400 text-xs">+</span>}
                  <kbd className="px-2 py-1 text-xs font-mono bg-white border border-secondary-300 rounded shadow-sm">
                    {key === ' ' ? 'Space' : key.toUpperCase()}
                  </kbd>
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-secondary-200">
                <div className="flex items-center gap-3">
                  <CommandLineIcon className="w-6 h-6 text-primary-600" />
                  <h2 id="shortcuts-title" className="text-xl font-semibold text-secondary-900">
                    Keyboard Shortcuts
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
                  aria-label="Close shortcuts help"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Press <kbd className="px-2 py-1 text-xs font-mono bg-white border border-blue-300 rounded">?</kbd> anytime to open this help dialog.
                  </p>
                </div>

                {shortcuts.navigation?.length > 0 && (
                  <ShortcutGroup
                    title="Navigation"
                    shortcuts={shortcuts.navigation}
                    icon={CommandLineIcon}
                  />
                )}

                {shortcuts.accessibility?.length > 0 && (
                  <ShortcutGroup
                    title="Accessibility"
                    shortcuts={shortcuts.accessibility}
                  />
                )}

                {shortcuts.general?.length > 0 && (
                  <ShortcutGroup
                    title="General"
                    shortcuts={shortcuts.general}
                  />
                )}

                {/* Additional tips */}
                <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
                  <h4 className="font-medium text-secondary-900 mb-2">Additional Tips</h4>
                  <ul className="text-sm text-secondary-700 space-y-1">
                    <li>• Use <kbd className="px-1 py-0.5 text-xs font-mono bg-white border rounded">Tab</kbd> to navigate between interactive elements</li>
                    <li>• Use <kbd className="px-1 py-0.5 text-xs font-mono bg-white border rounded">Shift + Tab</kbd> to navigate backwards</li>
                    <li>• Use <kbd className="px-1 py-0.5 text-xs font-mono bg-white border rounded">Enter</kbd> or <kbd className="px-1 py-0.5 text-xs font-mono bg-white border rounded">Space</kbd> to activate buttons</li>
                    <li>• Use arrow keys to navigate within menus and lists</li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-secondary-200 bg-secondary-50">
                <p className="text-sm text-secondary-600 text-center">
                  These shortcuts work throughout the application to help you navigate more efficiently.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcutsHelp;