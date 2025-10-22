import React, { useState, useRef, useEffect } from 'react';
import { 
  ShareIcon,
  LinkIcon,
  QrCodeIcon,
  PhotoIcon,
  ClipboardIcon,
  CheckIcon,
  XMarkIcon,
  GlobeAltIcon,
  LockClosedIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getLanguageById } from './languageConfig';

const CodeSharingModal = ({ 
  isOpen, 
  onClose, 
  code, 
  language, 
  title = 'Untitled',
  className = ''
}) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [shareSettings, setShareSettings] = useState({
    isPublic: true,
    allowComments: true,
    allowForks: true,
    expiresIn: 'never', // 'never', '1day', '1week', '1month'
    theme: 'auto' // 'auto', 'light', 'dark'
  });
  const [shareUrl, setShareUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen && code) {
      generateShareUrl();
      generatePreviewImage();
    }
  }, [isOpen, code, language, shareSettings]);

  const generateShareUrl = async () => {
    setIsGenerating(true);
    try {
      // Create a shareable link with encoded data
      const shareData = {
        code,
        language,
        title,
        settings: shareSettings,
        timestamp: new Date().toISOString(),
        author: user?.firstName || 'Anonymous'
      };
      
      const encoded = btoa(JSON.stringify(shareData));
      const url = `${window.location.origin}/playground?share=${encoded}`;
      setShareUrl(url);
      
      // Generate QR code (using a simple QR code service)
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
      setQrCodeUrl(qrUrl);
      
    } catch (error) {
      console.error('Failed to generate share URL:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePreviewImage = async () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const languageInfo = getLanguageById(language);
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    if (shareSettings.theme === 'dark' || (shareSettings.theme === 'auto' && isDarkMode)) {
      gradient.addColorStop(0, '#1f2937');
      gradient.addColorStop(1, '#111827');
      ctx.fillStyle = gradient;
    } else {
      gradient.addColorStop(0, '#f9fafb');
      gradient.addColorStop(1, '#f3f4f6');
      ctx.fillStyle = gradient;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Header
    const headerHeight = 80;
    ctx.fillStyle = shareSettings.theme === 'dark' || (shareSettings.theme === 'auto' && isDarkMode) 
      ? '#374151' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, headerHeight);
    
    // Title
    ctx.fillStyle = shareSettings.theme === 'dark' || (shareSettings.theme === 'auto' && isDarkMode) 
      ? '#ffffff' : '#111827';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText(title, 30, 35);
    
    // Language badge
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(30, 45, 120, 25);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`${languageInfo.icon} ${languageInfo.name}`, 35, 62);
    
    // Author
    if (user) {
      ctx.fillStyle = shareSettings.theme === 'dark' || (shareSettings.theme === 'auto' && isDarkMode) 
        ? '#9ca3af' : '#6b7280';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText(`by ${user.firstName}`, canvas.width - 150, 35);
    }
    
    // Code area
    const codeY = headerHeight + 20;
    const codeHeight = canvas.height - codeY - 40;
    
    // Code background
    ctx.fillStyle = shareSettings.theme === 'dark' || (shareSettings.theme === 'auto' && isDarkMode) 
      ? '#1f2937' : '#f8fafc';
    ctx.fillRect(20, codeY, canvas.width - 40, codeHeight);
    
    // Code border
    ctx.strokeStyle = shareSettings.theme === 'dark' || (shareSettings.theme === 'auto' && isDarkMode) 
      ? '#374151' : '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, codeY, canvas.width - 40, codeHeight);
    
    // Code text
    ctx.fillStyle = shareSettings.theme === 'dark' || (shareSettings.theme === 'auto' && isDarkMode) 
      ? '#e5e7eb' : '#374151';
    ctx.font = '14px JetBrains Mono, monospace';
    
    const lines = code.split('\n').slice(0, 25); // Show first 25 lines
    lines.forEach((line, index) => {
      const y = codeY + 25 + (index * 18);
      if (y < codeY + codeHeight - 20) {
        // Line number
        ctx.fillStyle = shareSettings.theme === 'dark' || (shareSettings.theme === 'auto' && isDarkMode) 
          ? '#6b7280' : '#9ca3af';
        ctx.fillText((index + 1).toString().padStart(2, ' '), 30, y);
        
        // Code line
        ctx.fillStyle = shareSettings.theme === 'dark' || (shareSettings.theme === 'auto' && isDarkMode) 
          ? '#e5e7eb' : '#374151';
        ctx.fillText(line.substring(0, 80), 60, y); // Truncate long lines
      }
    });
    
    // Watermark
    ctx.fillStyle = shareSettings.theme === 'dark' || (shareSettings.theme === 'auto' && isDarkMode) 
      ? '#4b5563' : '#9ca3af';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('Generated by Seek Playground', canvas.width - 200, canvas.height - 15);
    
    // Convert to image
    const imageUrl = canvas.toDataURL('image/png');
    setPreviewImage(imageUrl);
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadPreview = () => {
    if (!previewImage) return;
    
    const link = document.createElement('a');
    link.download = `${title.replace(/[^a-z0-9]/gi, '_')}_preview.png`;
    link.href = previewImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareToSocial = (platform) => {
    const text = `Check out this ${getLanguageById(language).name} code: ${title}`;
    const url = shareUrl;
    
    let shareUrl_social = '';
    switch (platform) {
      case 'twitter':
        shareUrl_social = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl_social = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'reddit':
        shareUrl_social = `https://reddit.com/submit?title=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl_social = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl_social) {
      window.open(shareUrl_social, '_blank', 'width=600,height=400');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className={`absolute inset-4 rounded-lg shadow-xl overflow-hidden ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <ShareIcon className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Share Code</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-full">
          {/* Settings Panel */}
          <div className={`w-80 p-6 border-r overflow-y-auto ${
            isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
          }`}>
            <h3 className="text-lg font-semibold mb-4">Share Settings</h3>
            
            <div className="space-y-4">
              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium mb-2">Visibility</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={shareSettings.isPublic}
                      onChange={() => setShareSettings(prev => ({ ...prev, isPublic: true }))}
                      className="text-blue-600"
                    />
                    <GlobeAltIcon className="h-4 w-4" />
                    <span className="text-sm">Public - Anyone with the link can view</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={!shareSettings.isPublic}
                      onChange={() => setShareSettings(prev => ({ ...prev, isPublic: false }))}
                      className="text-blue-600"
                    />
                    <LockClosedIcon className="h-4 w-4" />
                    <span className="text-sm">Private - Only you can view</span>
                  </label>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium mb-2">Permissions</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={shareSettings.allowComments}
                      onChange={(e) => setShareSettings(prev => ({ ...prev, allowComments: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Allow comments</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={shareSettings.allowForks}
                      onChange={(e) => setShareSettings(prev => ({ ...prev, allowForks: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Allow forks</span>
                  </label>
                </div>
              </div>

              {/* Expiration */}
              <div>
                <label className="block text-sm font-medium mb-2">Expires</label>
                <select
                  value={shareSettings.expiresIn}
                  onChange={(e) => setShareSettings(prev => ({ ...prev, expiresIn: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="never">Never</option>
                  <option value="1day">1 Day</option>
                  <option value="1week">1 Week</option>
                  <option value="1month">1 Month</option>
                </select>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium mb-2">Preview Theme</label>
                <select
                  value={shareSettings.theme}
                  onChange={(e) => setShareSettings(prev => ({ ...prev, theme: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="auto">Auto</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Share to Social</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => shareToSocial('twitter')}
                  className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Twitter
                </button>
                <button
                  onClick={() => shareToSocial('linkedin')}
                  className="px-3 py-2 bg-blue-700 text-white text-sm rounded hover:bg-blue-800 transition-colors"
                >
                  LinkedIn
                </button>
                <button
                  onClick={() => shareToSocial('reddit')}
                  className="px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors"
                >
                  Reddit
                </button>
                <button
                  onClick={() => shareToSocial('facebook')}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Facebook
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Share URL */}
              <div>
                <label className="block text-sm font-medium mb-2">Share URL</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className={`flex-1 px-3 py-2 border rounded-lg text-sm ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-gray-50 text-gray-900'
                    }`}
                  />
                  <button
                    onClick={() => copyToClipboard(shareUrl, 'url')}
                    className={`px-3 py-2 border rounded-lg transition-colors ${
                      copySuccess === 'url'
                        ? 'bg-green-600 text-white border-green-600'
                        : isDarkMode
                          ? 'border-gray-600 hover:bg-gray-700'
                          : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {copySuccess === 'url' ? <CheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* QR Code */}
              <div>
                <label className="block text-sm font-medium mb-2">QR Code</label>
                <div className="flex items-start space-x-4">
                  {qrCodeUrl && (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="w-32 h-32 border rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Scan this QR code to quickly access the shared code on mobile devices.
                    </p>
                    <button
                      onClick={() => copyToClipboard(qrCodeUrl, 'qr')}
                      className={`px-3 py-1.5 text-sm border rounded transition-colors ${
                        copySuccess === 'qr'
                          ? 'bg-green-600 text-white border-green-600'
                          : isDarkMode
                            ? 'border-gray-600 hover:bg-gray-700'
                            : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {copySuccess === 'qr' ? 'Copied!' : 'Copy QR URL'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview Image */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Preview Image</label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={generatePreviewImage}
                      className={`px-3 py-1.5 text-sm border rounded transition-colors ${
                        isDarkMode
                          ? 'border-gray-600 hover:bg-gray-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <PaintBrushIcon className="h-4 w-4 inline mr-1" />
                      Regenerate
                    </button>
                    <button
                      onClick={downloadPreview}
                      disabled={!previewImage}
                      className={`px-3 py-1.5 text-sm border rounded transition-colors disabled:opacity-50 ${
                        isDarkMode
                          ? 'border-gray-600 hover:bg-gray-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 inline mr-1" />
                      Download
                    </button>
                  </div>
                </div>
                
                <div className={`border rounded-lg p-4 ${
                  isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                }`}>
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Code Preview" 
                      className="w-full max-w-md mx-auto rounded border"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center text-gray-500">
                      <PhotoIcon className="h-12 w-12 mb-2" />
                      <span>Generating preview...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Code Info */}
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <h4 className="font-medium mb-2">Code Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Title:</span> {title}
                  </div>
                  <div>
                    <span className="font-medium">Language:</span> {getLanguageById(language).name}
                  </div>
                  <div>
                    <span className="font-medium">Lines:</span> {code.split('\n').length}
                  </div>
                  <div>
                    <span className="font-medium">Characters:</span> {code.length}
                  </div>
                  {user && (
                    <div className="col-span-2">
                      <span className="font-medium">Author:</span> {user.firstName} {user.lastName}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden canvas for preview generation */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default CodeSharingModal;