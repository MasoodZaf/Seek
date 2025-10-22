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

          {/* Share Panel */}
          <motion.div
            className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Share Code
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(language)}`}>
                    {language}
                  </span>
                  <span className="text-sm text-gray-500">
                    {code.split('\n').length} lines
                  </span>
                </div>
              </div>
              
              <TouchButton
                variant="ghost"
                size="sm"
                onPress={onClose}
                haptic="light"
              >
                <XMarkIcon className="h-6 w-6" />
              </TouchButton>
            </div>

            {/* Code Preview */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-32 overflow-y-auto">
                <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {code.length > 200 ? `${code.substring(0, 200)}...` : code}
                </pre>
              </div>
            </div>

            {/* Share Options */}
            <div className="px-6 py-4 space-y-3">
              {shareOptions
                .filter(option => option.available)
                .map((option) => {
                  const Icon = option.icon;
                  const isActive = shareMethod === option.id;
                  
                  return (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <TouchButton
                        variant="ghost"
                        size="lg"
                        onPress={() => handleShare(option.id)}
                        haptic="light"
                        className={`w-full justify-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 ${
                          isActive ? 'bg-primary-50 border-primary-200 dark:bg-primary-900/20' : ''
                        }`}
                        disabled={isActive}
                      >
                        <div className={`p-2 rounded-lg ${
                          isActive 
                            ? 'bg-primary-100 text-primary-600 dark:bg-primary-800 dark:text-primary-400' 
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {option.id === 'copy' && copied ? (
                            <CheckIcon className="h-5 w-5 text-green-600" />
                          ) : (
                            <Icon className="h-5 w-5" />
                          )}
                        </div>
                        
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {option.id === 'copy' && copied ? 'Copied!' : option.label}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {option.description}
                          </div>
                        </div>

                        {isActive && (
                          <motion.div
                            className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
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