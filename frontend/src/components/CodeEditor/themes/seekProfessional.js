// Professional Monaco Editor Themes for Seek Platform

export const SEEK_PROFESSIONAL_THEMES = {
  'seek-dark-professional': {
    name: 'Seek Dark Professional',
    base: 'vs-dark',
    inherit: true,
    rules: [
      // Comments
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
      { token: 'comment.line', foreground: '6A9955', fontStyle: 'italic' },
      { token: 'comment.block', foreground: '6A9955', fontStyle: 'italic' },
      
      // Keywords
      { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'keyword.control', foreground: 'C586C0', fontStyle: 'bold' },
      { token: 'keyword.operator', foreground: 'D4D4D4' },
      
      // Strings
      { token: 'string', foreground: 'CE9178' },
      { token: 'string.quoted', foreground: 'CE9178' },
      { token: 'string.template', foreground: 'CE9178' },
      
      // Numbers
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'number.hex', foreground: 'B5CEA8' },
      { token: 'number.float', foreground: 'B5CEA8' },
      
      // Functions
      { token: 'entity.name.function', foreground: 'DCDCAA', fontStyle: 'bold' },
      { token: 'support.function', foreground: 'DCDCAA' },
      
      // Variables
      { token: 'variable', foreground: '9CDCFE' },
      { token: 'variable.parameter', foreground: '9CDCFE' },
      { token: 'variable.other', foreground: '9CDCFE' },
      
      // Types
      { token: 'entity.name.type', foreground: '4EC9B0', fontStyle: 'bold' },
      { token: 'support.type', foreground: '4EC9B0' },
      { token: 'storage.type', foreground: '569CD6' },
      
      // Classes
      { token: 'entity.name.class', foreground: '4EC9B0', fontStyle: 'bold' },
      { token: 'support.class', foreground: '4EC9B0' },
      
      // Constants
      { token: 'constant', foreground: '4FC1FF' },
      { token: 'constant.numeric', foreground: 'B5CEA8' },
      { token: 'constant.language', foreground: '569CD6' },
      
      // Operators
      { token: 'operator', foreground: 'D4D4D4' },
      { token: 'delimiter', foreground: 'D4D4D4' },
      
      // Punctuation
      { token: 'punctuation', foreground: 'D4D4D4' },
      { token: 'punctuation.definition', foreground: 'D4D4D4' },
      
      // Tags (HTML/XML)
      { token: 'entity.name.tag', foreground: '569CD6' },
      { token: 'entity.other.attribute-name', foreground: '9CDCFE' },
      
      // JSON
      { token: 'support.type.property-name.json', foreground: '9CDCFE' },
      { token: 'string.quoted.double.json', foreground: 'CE9178' },
      
      // CSS
      { token: 'support.type.property-name.css', foreground: '9CDCFE' },
      { token: 'support.constant.property-value.css', foreground: 'CE9178' },
      
      // Error highlighting
      { token: 'invalid', foreground: 'F44747', fontStyle: 'bold' },
      { token: 'invalid.illegal', foreground: 'F44747', fontStyle: 'bold' }
    ],
    colors: {
      // Editor background
      'editor.background': '#0D1117',
      'editor.foreground': '#E6EDF3',
      
      // Line numbers
      'editorLineNumber.foreground': '#7D8590',
      'editorLineNumber.activeForeground': '#E6EDF3',
      
      // Current line
      'editor.lineHighlightBackground': '#161B22',
      'editor.lineHighlightBorder': '#21262D',
      
      // Selection
      'editor.selectionBackground': '#264F78',
      'editor.selectionHighlightBackground': '#264F7840',
      'editor.inactiveSelectionBackground': '#264F7840',
      
      // Find/replace
      'editor.findMatchBackground': '#515C6A',
      'editor.findMatchHighlightBackground': '#515C6A40',
      'editor.findRangeHighlightBackground': '#515C6A20',
      
      // Cursor
      'editorCursor.foreground': '#E6EDF3',
      
      // Whitespace
      'editorWhitespace.foreground': '#484F58',
      
      // Indentation guides
      'editorIndentGuide.background': '#21262D',
      'editorIndentGuide.activeBackground': '#30363D',
      
      // Brackets
      'editorBracketMatch.background': '#264F7840',
      'editorBracketMatch.border': '#264F78',
      
      // Gutter
      'editorGutter.background': '#0D1117',
      'editorGutter.modifiedBackground': '#E3B341',
      'editorGutter.addedBackground': '#238636',
      'editorGutter.deletedBackground': '#DA3633',
      
      // Scrollbar
      'scrollbarSlider.background': '#21262D80',
      'scrollbarSlider.hoverBackground': '#30363D80',
      'scrollbarSlider.activeBackground': '#484F5880',
      
      // Minimap
      'minimap.background': '#0D1117',
      'minimap.selectionHighlight': '#264F78',
      'minimap.findMatchHighlight': '#515C6A',
      
      // Suggest widget
      'editorSuggestWidget.background': '#161B22',
      'editorSuggestWidget.border': '#30363D',
      'editorSuggestWidget.foreground': '#E6EDF3',
      'editorSuggestWidget.selectedBackground': '#264F78',
      'editorSuggestWidget.highlightForeground': '#58A6FF',
      
      // Hover widget
      'editorHoverWidget.background': '#161B22',
      'editorHoverWidget.border': '#30363D',
      'editorHoverWidget.foreground': '#E6EDF3',
      
      // Error/warning squiggles
      'editorError.foreground': '#F85149',
      'editorWarning.foreground': '#E3B341',
      'editorInfo.foreground': '#58A6FF',
      'editorHint.foreground': '#7C3AED',
      
      // Overview ruler
      'editorOverviewRuler.border': '#21262D',
      'editorOverviewRuler.errorForeground': '#F85149',
      'editorOverviewRuler.warningForeground': '#E3B341',
      'editorOverviewRuler.infoForeground': '#58A6FF',
      
      // Ruler
      'editorRuler.foreground': '#21262D'
    }
  },
  
  'seek-light-professional': {
    name: 'Seek Light Professional',
    base: 'vs',
    inherit: true,
    rules: [
      // Comments
      { token: 'comment', foreground: '008000', fontStyle: 'italic' },
      { token: 'comment.line', foreground: '008000', fontStyle: 'italic' },
      { token: 'comment.block', foreground: '008000', fontStyle: 'italic' },
      
      // Keywords
      { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
      { token: 'keyword.control', foreground: 'AF00DB', fontStyle: 'bold' },
      { token: 'keyword.operator', foreground: '000000' },
      
      // Strings
      { token: 'string', foreground: 'A31515' },
      { token: 'string.quoted', foreground: 'A31515' },
      { token: 'string.template', foreground: 'A31515' },
      
      // Numbers
      { token: 'number', foreground: '098658' },
      { token: 'number.hex', foreground: '098658' },
      { token: 'number.float', foreground: '098658' },
      
      // Functions
      { token: 'entity.name.function', foreground: '795E26', fontStyle: 'bold' },
      { token: 'support.function', foreground: '795E26' },
      
      // Variables
      { token: 'variable', foreground: '001080' },
      { token: 'variable.parameter', foreground: '001080' },
      { token: 'variable.other', foreground: '001080' },
      
      // Types
      { token: 'entity.name.type', foreground: '267F99', fontStyle: 'bold' },
      { token: 'support.type', foreground: '267F99' },
      { token: 'storage.type', foreground: '0000FF' },
      
      // Classes
      { token: 'entity.name.class', foreground: '267F99', fontStyle: 'bold' },
      { token: 'support.class', foreground: '267F99' },
      
      // Constants
      { token: 'constant', foreground: '0070C1' },
      { token: 'constant.numeric', foreground: '098658' },
      { token: 'constant.language', foreground: '0000FF' },
      
      // Operators
      { token: 'operator', foreground: '000000' },
      { token: 'delimiter', foreground: '000000' },
      
      // Punctuation
      { token: 'punctuation', foreground: '000000' },
      { token: 'punctuation.definition', foreground: '000000' },
      
      // Tags (HTML/XML)
      { token: 'entity.name.tag', foreground: '800000' },
      { token: 'entity.other.attribute-name', foreground: 'FF0000' },
      
      // JSON
      { token: 'support.type.property-name.json', foreground: '0451A5' },
      { token: 'string.quoted.double.json', foreground: 'A31515' },
      
      // CSS
      { token: 'support.type.property-name.css', foreground: 'FF0000' },
      { token: 'support.constant.property-value.css', foreground: '0451A5' },
      
      // Error highlighting
      { token: 'invalid', foreground: 'CD3131', fontStyle: 'bold' },
      { token: 'invalid.illegal', foreground: 'CD3131', fontStyle: 'bold' }
    ],
    colors: {
      // Editor background
      'editor.background': '#FFFFFF',
      'editor.foreground': '#000000',
      
      // Line numbers
      'editorLineNumber.foreground': '#237893',
      'editorLineNumber.activeForeground': '#0B216F',
      
      // Current line
      'editor.lineHighlightBackground': '#F7F7F7',
      'editor.lineHighlightBorder': '#EEEEEE',
      
      // Selection
      'editor.selectionBackground': '#ADD6FF',
      'editor.selectionHighlightBackground': '#ADD6FF40',
      'editor.inactiveSelectionBackground': '#E5EBF1',
      
      // Find/replace
      'editor.findMatchBackground': '#A8AC94',
      'editor.findMatchHighlightBackground': '#EA5C0040',
      'editor.findRangeHighlightBackground': '#B4B4B420',
      
      // Cursor
      'editorCursor.foreground': '#000000',
      
      // Whitespace
      'editorWhitespace.foreground': '#BFBFBF',
      
      // Indentation guides
      'editorIndentGuide.background': '#D3D3D3',
      'editorIndentGuide.activeBackground': '#939393',
      
      // Brackets
      'editorBracketMatch.background': '#0064001A',
      'editorBracketMatch.border': '#B9B9B9',
      
      // Gutter
      'editorGutter.background': '#FFFFFF',
      'editorGutter.modifiedBackground': '#E2C08D',
      'editorGutter.addedBackground': '#2EA043',
      'editorGutter.deletedBackground': '#CF222E',
      
      // Scrollbar
      'scrollbarSlider.background': '#79797966',
      'scrollbarSlider.hoverBackground': '#64646466',
      'scrollbarSlider.activeBackground': '#00000066',
      
      // Minimap
      'minimap.background': '#FFFFFF',
      'minimap.selectionHighlight': '#ADD6FF',
      'minimap.findMatchHighlight': '#A8AC94',
      
      // Suggest widget
      'editorSuggestWidget.background': '#F3F3F3',
      'editorSuggestWidget.border': '#C8C8C8',
      'editorSuggestWidget.foreground': '#000000',
      'editorSuggestWidget.selectedBackground': '#0060C0',
      'editorSuggestWidget.highlightForeground': '#0066BF',
      
      // Hover widget
      'editorHoverWidget.background': '#F3F3F3',
      'editorHoverWidget.border': '#C8C8C8',
      'editorHoverWidget.foreground': '#000000',
      
      // Error/warning squiggles
      'editorError.foreground': '#E51400',
      'editorWarning.foreground': '#BF8803',
      'editorInfo.foreground': '#1A85FF',
      'editorHint.foreground': '#6C2DC7',
      
      // Overview ruler
      'editorOverviewRuler.border': '#7F7F7F4D',
      'editorOverviewRuler.errorForeground': '#E51400',
      'editorOverviewRuler.warningForeground': '#BF8803',
      'editorOverviewRuler.infoForeground': '#1A85FF',
      
      // Ruler
      'editorRuler.foreground': '#D3D3D3'
    }
  },
  
  'seek-high-contrast': {
    name: 'Seek High Contrast',
    base: 'hc-black',
    inherit: true,
    rules: [
      // Enhanced contrast for accessibility
      { token: 'comment', foreground: '7CA668', fontStyle: 'italic' },
      { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'entity.name.function', foreground: 'DCDCAA', fontStyle: 'bold' },
      { token: 'variable', foreground: '9CDCFE' },
      { token: 'entity.name.type', foreground: '4EC9B0', fontStyle: 'bold' },
      { token: 'invalid', foreground: 'FF0000', fontStyle: 'bold' }
    ],
    colors: {
      'editor.background': '#000000',
      'editor.foreground': '#FFFFFF',
      'editorLineNumber.foreground': '#FFFFFF',
      'editor.lineHighlightBackground': '#0F2027',
      'editor.selectionBackground': '#264F78',
      'editorCursor.foreground': '#FFFFFF',
      'editorBracketMatch.background': '#264F78',
      'editorBracketMatch.border': '#FFFF00'
    }
  }
};

// Theme utility functions
export const getThemeByName = (themeName) => {
  return SEEK_PROFESSIONAL_THEMES[themeName] || SEEK_PROFESSIONAL_THEMES['seek-dark-professional'];
};

export const getAllThemeNames = () => {
  return Object.keys(SEEK_PROFESSIONAL_THEMES);
};

export const getThemeDisplayNames = () => {
  return Object.entries(SEEK_PROFESSIONAL_THEMES).map(([key, theme]) => ({
    id: key,
    name: theme.name,
    base: theme.base
  }));
};

// Theme configuration for different programming languages
export const LANGUAGE_SPECIFIC_THEMES = {
  javascript: {
    additionalRules: [
      { token: 'support.function.js', foreground: 'DCDCAA' },
      { token: 'support.class.js', foreground: '4EC9B0' },
      { token: 'variable.language.js', foreground: '569CD6' }
    ]
  },
  typescript: {
    additionalRules: [
      { token: 'keyword.type.ts', foreground: '569CD6' },
      { token: 'entity.name.type.ts', foreground: '4EC9B0' },
      { token: 'support.type.ts', foreground: '4EC9B0' }
    ]
  },
  python: {
    additionalRules: [
      { token: 'support.function.builtin.python', foreground: 'DCDCAA' },
      { token: 'constant.language.python', foreground: '569CD6' },
      { token: 'variable.language.python', foreground: '569CD6' }
    ]
  },
  java: {
    additionalRules: [
      { token: 'storage.modifier.java', foreground: '569CD6' },
      { token: 'keyword.other.package.java', foreground: '569CD6' },
      { token: 'keyword.other.import.java', foreground: '569CD6' }
    ]
  }
};

export default {
  SEEK_PROFESSIONAL_THEMES,
  getThemeByName,
  getAllThemeNames,
  getThemeDisplayNames,
  LANGUAGE_SPECIFIC_THEMES
};