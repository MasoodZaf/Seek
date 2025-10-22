import React, { useState, useEffect } from 'react';
import { 
  Cog6ToothIcon, 
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  PaintBrushIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  CursorArrowRaysIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import { getThemeDisplayNames } from './themes/seekProfessional';

const EditorSettingsPanel = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange,
  onResetToDefaults 
}) => {
  const { isDarkMode } = useTheme();
  const [localSettings, setLocalSettings] = useState(settings);
  const [activeTab, setActiveTab] = useState('appearance');

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleNestedSettingChange = (parentKey, childKey, value) => {
    const newSettings = {
      ...localSettings,
      [parentKey]: {
        ...localSettings[parentKey],
        [childKey]: value
      }
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const resetToDefaults = () => {
    onResetToDefaults();
    setLocalSettings(settings);
  };

  const themeOptions = getThemeDisplayNames();
  const fontSizeOptions = [10, 12, 14, 16, 18, 20, 22, 24];
  const fontFamilyOptions = [
    { value: 'JetBrains Mono, Consolas, "Courier New", monospace', label: 'JetBrains Mono' },
    { value: 'Fira Code, Consolas, "Courier New", monospace', label: 'Fira Code' },
    { value: 'Source Code Pro, Consolas, "Courier New", monospace', label: 'Source Code Pro' },
    { value: 'Consolas, "Courier New", monospace', label: 'Consolas' },
    { value: '"Courier New", monospace', label: 'Courier New' },
    { value: 'Monaco, "Lucida Console", monospace', label: 'Monaco' }
  ];

  const tabSizeOptions = [2, 4, 8];
  const wordWrapOptions = [
    { value: 'off', label: 'Off' },
    { value: 'on', label: 'On' },
    { value: 'wordWrapColumn', label: 'At Column' },
    { value: 'bounded', label: 'Bounded' }
  ];

  const cursorStyleOptions = [
    { value: 'line', label: 'Line' },
    { value: 'block', label: 'Block' },
    { value: 'underline', label: 'Underline' },
    { value: 'line-thin', label: 'Thin Line' },
    { value: 'block-outline', label: 'Block Outline' },
    { value: 'underline-thin', label: 'Thin Underline' }
  ];

  const cursorBlinkingOptions = [
    { value: 'blink', label: 'Blink' },
    { value: 'smooth', label: 'Smooth' },
    { value: 'phase', label: 'Phase' },
    { value: 'expand', label: 'Expand' },
    { value: 'solid', label: 'Solid' }
  ];

  if (!isOpen) return null;

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: PaintBrushIcon },
    { id: 'editor', label: 'Editor', icon: DocumentTextIcon },
    { id: 'behavior', label: 'Behavior', icon: AdjustmentsHorizontalIcon },
    { id: 'advanced', label: 'Advanced', icon: CursorArrowRaysIcon }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-96 shadow-xl transform transition-transform duration-300 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <Cog6ToothIcon className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Editor Settings</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-md transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-1 py-3 px-2 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? isDarkMode
                    ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-400'
                    : 'bg-gray-50 text-blue-600 border-b-2 border-blue-600'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {activeTab === 'appearance' && (
            <>
              {/* Theme */}
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select
                  value={localSettings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  {themeOptions.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium mb-2">Font Family</label>
                <select
                  value={localSettings.fontFamily}
                  onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  {fontFamilyOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Font Size: {localSettings.fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  step="1"
                  value={localSettings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10px</span>
                  <span>24px</span>
                </div>
              </div>

              {/* Line Height */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Line Height: {localSettings.lineHeight}
                </label>
                <input
                  type="range"
                  min="1.2"
                  max="2.0"
                  step="0.1"
                  value={localSettings.lineHeight}
                  onChange={(e) => handleSettingChange('lineHeight', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1.2</span>
                  <span>2.0</span>
                </div>
              </div>

              {/* Font Ligatures */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Font Ligatures</label>
                <button
                  onClick={() => handleSettingChange('fontLigatures', !localSettings.fontLigatures)}
                  className={`p-1 rounded-md transition-colors ${
                    localSettings.fontLigatures
                      ? 'text-blue-600'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {localSettings.fontLigatures ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                </button>
              </div>
            </>
          )}

          {activeTab === 'editor' && (
            <>
              {/* Line Numbers */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Line Numbers</label>
                <button
                  onClick={() => handleSettingChange('lineNumbers', localSettings.lineNumbers === 'on' ? 'off' : 'on')}
                  className={`p-1 rounded-md transition-colors ${
                    localSettings.lineNumbers === 'on'
                      ? 'text-blue-600'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {localSettings.lineNumbers === 'on' ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                </button>
              </div>

              {/* Minimap */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Minimap</label>
                <button
                  onClick={() => handleNestedSettingChange('minimap', 'enabled', !localSettings.minimap.enabled)}
                  className={`p-1 rounded-md transition-colors ${
                    localSettings.minimap.enabled
                      ? 'text-blue-600'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {localSettings.minimap.enabled ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                </button>
              </div>

              {/* Word Wrap */}
              <div>
                <label className="block text-sm font-medium mb-2">Word Wrap</label>
                <select
                  value={localSettings.wordWrap}
                  onChange={(e) => handleSettingChange('wordWrap', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  {wordWrapOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tab Size */}
              <div>
                <label className="block text-sm font-medium mb-2">Tab Size</label>
                <select
                  value={localSettings.tabSize}
                  onChange={(e) => handleSettingChange('tabSize', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  {tabSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size} spaces
                    </option>
                  ))}
                </select>
              </div>

              {/* Insert Spaces */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Insert Spaces</label>
                <button
                  onClick={() => handleSettingChange('insertSpaces', !localSettings.insertSpaces)}
                  className={`p-1 rounded-md transition-colors ${
                    localSettings.insertSpaces
                      ? 'text-blue-600'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {localSettings.insertSpaces ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                </button>
              </div>

              {/* Rulers */}
              <div>
                <label className="block text-sm font-medium mb-2">Rulers (comma-separated)</label>
                <input
                  type="text"
                  value={localSettings.rulers.join(', ')}
                  onChange={(e) => {
                    const rulers = e.target.value.split(',').map(r => parseInt(r.trim())).filter(r => !isNaN(r));
                    handleSettingChange('rulers', rulers);
                  }}
                  placeholder="80, 120"
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                />
              </div>
            </>
          )}

          {activeTab === 'behavior' && (
            <>
              {/* Auto Save */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto Format on Type</label>
                <button
                  onClick={() => handleSettingChange('formatOnType', !localSettings.formatOnType)}
                  className={`p-1 rounded-md transition-colors ${
                    localSettings.formatOnType
                      ? 'text-blue-600'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {localSettings.formatOnType ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                </button>
              </div>

              {/* Format on Paste */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Format on Paste</label>
                <button
                  onClick={() => handleSettingChange('formatOnPaste', !localSettings.formatOnPaste)}
                  className={`p-1 rounded-md transition-colors ${
                    localSettings.formatOnPaste
                      ? 'text-blue-600'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {localSettings.formatOnPaste ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                </button>
              </div>

              {/* Auto Indent */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto Indent</label>
                <select
                  value={localSettings.autoIndent}
                  onChange={(e) => handleSettingChange('autoIndent', e.target.value)}
                  className={`px-3 py-1 border rounded-md text-sm ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="none">None</option>
                  <option value="keep">Keep</option>
                  <option value="brackets">Brackets</option>
                  <option value="advanced">Advanced</option>
                  <option value="full">Full</option>
                </select>
              </div>

              {/* Cursor Style */}
              <div>
                <label className="block text-sm font-medium mb-2">Cursor Style</label>
                <select
                  value={localSettings.cursorStyle}
                  onChange={(e) => handleSettingChange('cursorStyle', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  {cursorStyleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cursor Blinking */}
              <div>
                <label className="block text-sm font-medium mb-2">Cursor Blinking</label>
                <select
                  value={localSettings.cursorBlinking}
                  onChange={(e) => handleSettingChange('cursorBlinking', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  {cursorBlinkingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {activeTab === 'advanced' && (
            <>
              {/* Smooth Scrolling */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Smooth Scrolling</label>
                <button
                  onClick={() => handleSettingChange('smoothScrolling', !localSettings.smoothScrolling)}
                  className={`p-1 rounded-md transition-colors ${
                    localSettings.smoothScrolling
                      ? 'text-blue-600'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {localSettings.smoothScrolling ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                </button>
              </div>

              {/* Cursor Smooth Animation */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Cursor Smooth Animation</label>
                <button
                  onClick={() => handleSettingChange('cursorSmoothCaretAnimation', !localSettings.cursorSmoothCaretAnimation)}
                  className={`p-1 rounded-md transition-colors ${
                    localSettings.cursorSmoothCaretAnimation
                      ? 'text-blue-600'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {localSettings.cursorSmoothCaretAnimation ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                </button>
              </div>

              {/* Bracket Pair Colorization */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Bracket Pair Colorization</label>
                <button
                  onClick={() => handleNestedSettingChange('bracketPairColorization', 'enabled', !localSettings.bracketPairColorization.enabled)}
                  className={`p-1 rounded-md transition-colors ${
                    localSettings.bracketPairColorization.enabled
                      ? 'text-blue-600'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {localSettings.bracketPairColorization.enabled ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                </button>
              </div>

              {/* Render Whitespace */}
              <div>
                <label className="block text-sm font-medium mb-2">Render Whitespace</label>
                <select
                  value={localSettings.renderWhitespace}
                  onChange={(e) => handleSettingChange('renderWhitespace', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="none">None</option>
                  <option value="boundary">Boundary</option>
                  <option value="selection">Selection</option>
                  <option value="trailing">Trailing</option>
                  <option value="all">All</option>
                </select>
              </div>

              {/* Folding */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Code Folding</label>
                <button
                  onClick={() => handleSettingChange('folding', !localSettings.folding)}
                  className={`p-1 rounded-md transition-colors ${
                    localSettings.folding
                      ? 'text-blue-600'
                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {localSettings.folding ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex space-x-2">
            <button
              onClick={resetToDefaults}
              className={`flex-1 px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Reset to Defaults
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorSettingsPanel;