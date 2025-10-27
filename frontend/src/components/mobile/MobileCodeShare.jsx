import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShareIcon,
  ClipboardIcon,
  QrCodeIcon,
  LinkIcon,
  PhotoIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import TouchButton from '../ui/TouchButton';
import { hapticFeedback } from '../../utils/touchInteractions';

const MobileCodeShare = ({ 
  code, 
  language, 
  title = 'Code Snippet',
  isOpen, 
  onClose 
}) => {
  const [shareMethod, setShareMethod] = useState(null);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const shareOptions = [
    {
      id: 'native',
      label: 'Share',
      icon: ShareIcon,
      description: 'Use device share menu',
      available: !!navigator.share
    },
    {
      id: 'copy',
      label: 'Copy Code',
      icon: ClipboardIcon,
      description: 'Copy to clipboard',
      available: true
    },
    {
      id: 'link',
      label: 'Share Link',
      icon: LinkIcon,
      description: 'Generate shareable link',
      available: true
    },
    {
      id: 'qr',
      label: 'QR Code',
      icon: QrCodeIcon,
      description: 'Generate QR code',
      available: true
    },
    {
      id: 'image',
      label: 'Save Image',
      icon: PhotoIcon,
      description: 'Save as image',
      available: true
    }
  ];

  const handleShare = async (method) => {
    setShareMethod(method);
    hapticFeedback.light();

    try {
      switch (method) {
        case 'native':
          await handleNativeShare();
          break;
        case 'copy':
          await handleCopyCode();
          break;
        case 'link':
          await handleShareLink();
          break;
        case 'qr':
          await handleQRCode();
          break;
        case 'image':
          await handleSaveImage();
          break;
      }
    } catch (error) {
      console.error('Share failed:', error);
      hapticFeedback.error();
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: title,
        text: code,
        url: shareUrl || window.location.href
      });
      hapticFeedback.success();
      onClose();
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      hapticFeedback.success();
      
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 1500);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopied(true);
      hapticFeedback.success();
      
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 1500);
    }
  };

  const handleShareLink = async () => {
    // Generate a shareable link (this would typically involve your backend)
    const encodedCode = encodeURIComponent(code);
    const url = `${window.location.origin}/share?code=${encodedCode}&lang=${language}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setShareUrl(url);
      hapticFeedback.success();
      
      // Show success message
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      hapticFeedback.error();
    }
  };

  const handleQRCode = async () => {
    // Generate QR code for the code snippet
    const qrData = `${window.location.origin}/share?code=${encodeURIComponent(code)}&lang=${language}`;
    
    // This would typically use a QR code library
    // For now, we'll just show a placeholder
    hapticFeedback.medium();
    
    // In a real implementation, you'd generate and display the QR code
    alert('QR Code generation would be implemented here');
  };

  const handleSaveImage = async () => {
    // Generate an image of the code snippet
    // This would typically use html2canvas or similar
    hapticFeedback.medium();
    
    // In a real implementation, you'd generate and save the image
    alert('Image generation would be implemented here');
  };

  const getLanguageColor = (lang) => {
    const colors = {
      javascript: 'bg-yellow-100 text-yellow-800',
      python: 'bg-blue-100 text-blue-800',
      java: 'bg-red-100 text-red-800',
      cpp: 'bg-purple-100 text-purple-800',
      typescript: 'bg-blue-100 text-blue-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colors[lang] || colors.default;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Enhanced Share Panel with Glassmorphism */}
          <motion.div
            className="relative w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-t-3xl shadow-2xl border-t-2 border-white/50"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Enhanced Handle */}
            <div className="flex justify-center pt-4 pb-3">
              <div className="w-14 h-1.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full shadow-md" />
            </div>

            {/* Enhanced Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/20">
              <div>
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  Share Code
                </h3>
                <div className="flex items-center space-x-2 mt-2">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${getLanguageColor(language)}`}
                  >
                    {language}
                  </motion.span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
                    {code.split('\n').length} lines
                  </span>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <TouchButton
                  variant="ghost"
                  size="sm"
                  onPress={onClose}
                  haptic="light"
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </TouchButton>
              </motion.div>
            </div>

            {/* Code Preview */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-32 overflow-y-auto">
                <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {code.length > 200 ? `${code.substring(0, 200)}...` : code}
                </pre>
              </div>
            </div>

            {/* Enhanced Share Options */}
            <div className="px-6 py-5 space-y-3">
              {shareOptions
                .filter(option => option.available)
                .map((option, index) => {
                  const Icon = option.icon;
                  const isActive = shareMethod === option.id;

                  return (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <TouchButton
                        variant="ghost"
                        size="lg"
                        onPress={() => handleShare(option.id)}
                        haptic="light"
                        className={`w-full justify-start space-x-4 p-5 border-2 rounded-2xl relative overflow-hidden ${
                          isActive
                            ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg dark:from-indigo-900/20 dark:to-purple-900/20'
                            : 'border-gray-200 bg-white/50 hover:bg-white/80 dark:border-gray-700 dark:bg-gray-800/50'
                        }`}
                        disabled={isActive}
                      >
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
                        )}

                        <div className={`relative p-3 rounded-xl shadow-md ${
                          isActive
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                            : option.id === 'copy' && copied
                            ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {option.id === 'copy' && copied ? (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                            >
                              <CheckIcon className="h-6 w-6" />
                            </motion.div>
                          ) : (
                            <Icon className="h-6 w-6" />
                          )}
                        </div>

                        <div className="flex-1 text-left relative z-10">
                          <div className={`font-black ${
                            isActive ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-900 dark:text-white'
                          }`}>
                            {option.id === 'copy' && copied ? '✨ Copied!' : option.label}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-0.5">
                            {option.description}
                          </div>
                        </div>

                        {isActive && (
                          <motion.div
                            className="relative"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="w-6 h-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                          </motion.div>
                        )}
                      </TouchButton>
                    </motion.div>
                  );
                })}
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {shareUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="px-6 py-4 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center space-x-2">
                    <CheckIcon className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      Link copied to clipboard!
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Padding for Safe Area */}
            <div className="h-6" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileCodeShare;