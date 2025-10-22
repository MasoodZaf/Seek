import React, { useState, useEffect } from 'react';
import { 
  BookmarkIcon,
  FolderIcon,
  TagIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  ClipboardIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon,
  ClockIcon,
  CodeBracketIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getLanguageById } from './languageConfig';

const CodeSnippetManager = ({ 
  isOpen, 
  onClose, 
  onLoadSnippet,
  currentCode,
  currentLanguage,
  className = ''
}) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [snippets, setSnippets] = useState([]);
  const [filteredSnippets, setFilteredSnippets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'name', 'language', 'favorites'
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');

  // Save dialog state
  const [saveForm, setSaveForm] = useState({
    name: '',
    description: '',
    category: 'general',
    tags: [],
    isPublic: false,
    isFavorite: false
  });

  // Load snippets from localStorage and API
  useEffect(() => {
    loadSnippets();
  }, [user]);

  // Filter and sort snippets
  useEffect(() => {
    let filtered = snippets.filter(snippet => {
      const matchesSearch = !searchTerm || 
        snippet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || snippet.category === selectedCategory;
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => snippet.tags.includes(tag));
      
      return matchesSearch && matchesCategory && matchesTags;
    });

    // Sort snippets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'language':
          return a.language.localeCompare(b.language);
        case 'favorites':
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        default: // recent
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });

    setFilteredSnippets(filtered);
  }, [snippets, searchTerm, selectedCategory, selectedTags, sortBy]);

  const loadSnippets = () => {
    // Load from localStorage
    const localSnippets = localStorage.getItem('code_snippets');
    if (localSnippets) {
      try {
        const parsed = JSON.parse(localSnippets);
        setSnippets(parsed);
      } catch (error) {
        console.error('Failed to load snippets:', error);
      }
    }

    // TODO: Load from API when available
    // if (user) {
    //   loadSnippetsFromAPI();
    // }
  };

  const saveSnippets = (newSnippets) => {
    setSnippets(newSnippets);
    localStorage.setItem('code_snippets', JSON.stringify(newSnippets));
    
    // TODO: Sync with API when available
    // if (user) {
    //   syncSnippetsWithAPI(newSnippets);
    // }
  };

  const saveSnippet = () => {
    if (!saveForm.name.trim()) return;

    const snippet = {
      id: editingSnippet?.id || Date.now().toString(),
      name: saveForm.name.trim(),
      description: saveForm.description.trim(),
      code: currentCode,
      language: currentLanguage,
      category: saveForm.category,
      tags: saveForm.tags,
      isPublic: saveForm.isPublic,
      isFavorite: saveForm.isFavorite,
      userId: user?.id,
      createdAt: editingSnippet?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: editingSnippet?.usageCount || 0
    };

    const newSnippets = editingSnippet
      ? snippets.map(s => s.id === editingSnippet.id ? snippet : s)
      : [...snippets, snippet];

    saveSnippets(newSnippets);
    setShowSaveDialog(false);
    setEditingSnippet(null);
    resetSaveForm();
  };

  const deleteSnippet = (id) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      const newSnippets = snippets.filter(s => s.id !== id);
      saveSnippets(newSnippets);
    }
  };

  const toggleFavorite = (id) => {
    const newSnippets = snippets.map(s => 
      s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
    );
    saveSnippets(newSnippets);
  };

  const loadSnippet = (snippet) => {
    // Update usage count
    const newSnippets = snippets.map(s => 
      s.id === snippet.id ? { ...s, usageCount: (s.usageCount || 0) + 1 } : s
    );
    saveSnippets(newSnippets);
    
    onLoadSnippet(snippet);
    onClose();
  };

  const copySnippet = async (snippet) => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopySuccess(snippet.id);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (error) {
      console.error('Failed to copy snippet:', error);
    }
  };

  const shareSnippet = async (snippet) => {
    try {
      const shareData = {
        title: snippet.name,
        text: snippet.description,
        url: `${window.location.origin}/playground?snippet=${snippet.id}`
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setCopySuccess(snippet.id);
        setTimeout(() => setCopySuccess(''), 2000);
      }
    } catch (error) {
      console.error('Failed to share snippet:', error);
    }
  };

  const exportSnippet = (snippet) => {
    const language = getLanguageById(snippet.language);
    const content = `// ${snippet.name}\n// ${snippet.description}\n// Language: ${language.name}\n// Created: ${new Date(snippet.createdAt).toLocaleDateString()}\n\n${snippet.code}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${snippet.name.replace(/[^a-z0-9]/gi, '_')}.${language.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const duplicateSnippet = (snippet) => {
    const duplicate = {
      ...snippet,
      id: Date.now().toString(),
      name: `${snippet.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    };
    
    const newSnippets = [...snippets, duplicate];
    saveSnippets(newSnippets);
  };

  const resetSaveForm = () => {
    setSaveForm({
      name: '',
      description: '',
      category: 'general',
      tags: [],
      isPublic: false,
      isFavorite: false
    });
  };

  const openSaveDialog = (snippet = null) => {
    if (snippet) {
      setEditingSnippet(snippet);
      setSaveForm({
        name: snippet.name,
        description: snippet.description,
        category: snippet.category,
        tags: snippet.tags,
        isPublic: snippet.isPublic,
        isFavorite: snippet.isFavorite
      });
    } else {
      setEditingSnippet(null);
      resetSaveForm();
    }
    setShowSaveDialog(true);
  };

  const categories = ['all', 'general', 'algorithms', 'data-structures', 'web', 'mobile', 'utilities', 'examples'];
  const allTags = [...new Set(snippets.flatMap(s => s.tags))];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-full max-w-4xl shadow-xl transform transition-transform duration-300 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <CodeBracketIcon className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Code Snippets</h2>
            <span className={`px-2 py-1 text-xs rounded-full ${
              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              {filteredSnippets.length} snippets
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => openSaveDialog()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Save Current</span>
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`p-6 border-b space-y-4 ${
          isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
        }`}>
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search snippets..."
              className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-3 py-2 border rounded-lg text-sm ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort by */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-3 py-2 border rounded-lg text-sm ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              <option value="recent">Recent</option>
              <option value="name">Name</option>
              <option value="language">Language</option>
              <option value="favorites">Favorites</option>
            </select>

            {/* Tag filter */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 5).map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTags(prev => 
                        prev.includes(tag) 
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Snippets List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredSnippets.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredSnippets.map((snippet) => {
                const language = getLanguageById(snippet.language);
                return (
                  <div
                    key={snippet.id}
                    className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-lg ${
                      isDarkMode 
                        ? 'border-gray-700 bg-gray-800 hover:bg-gray-750' 
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {/* Snippet Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold truncate">{snippet.name}</h3>
                          {snippet.isFavorite && (
                            <StarIconSolid className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <p className={`text-sm truncate ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {snippet.description || 'No description'}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={() => toggleFavorite(snippet.id)}
                          className={`p-1 rounded transition-colors ${
                            snippet.isFavorite
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : isDarkMode
                                ? 'text-gray-400 hover:text-yellow-500'
                                : 'text-gray-500 hover:text-yellow-500'
                          }`}
                        >
                          <StarIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Snippet Meta */}
                    <div className="flex items-center space-x-4 mb-3 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <span>{language.icon}</span>
                        <span>{language.name}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FolderIcon className="h-3 w-3" />
                        <span>{snippet.category}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <ClockIcon className="h-3 w-3" />
                        <span>{new Date(snippet.updatedAt).toLocaleDateString()}</span>
                      </span>
                      {snippet.usageCount > 0 && (
                        <span>Used {snippet.usageCount} times</span>
                      )}
                    </div>

                    {/* Tags */}
                    {snippet.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {snippet.tags.map(tag => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              isDarkMode 
                                ? 'bg-gray-700 text-gray-300' 
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Code Preview */}
                    <div className={`p-3 rounded border text-xs font-mono mb-3 ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-900 text-gray-300' 
                        : 'border-gray-200 bg-gray-50 text-gray-700'
                    }`}>
                      <pre className="truncate">
                        {snippet.code.split('\n')[0]}
                        {snippet.code.split('\n').length > 1 && '...'}
                      </pre>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => loadSnippet(snippet)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        Load
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => copySnippet(snippet)}
                          className={`p-1.5 rounded transition-colors ${
                            copySuccess === snippet.id
                              ? 'bg-green-600 text-white'
                              : isDarkMode
                                ? 'hover:bg-gray-700 text-gray-400'
                                : 'hover:bg-gray-200 text-gray-600'
                          }`}
                          title="Copy code"
                        >
                          {copySuccess === snippet.id ? 
                            <CheckIcon className="h-4 w-4" /> : 
                            <ClipboardIcon className="h-4 w-4" />
                          }
                        </button>
                        
                        <button
                          onClick={() => shareSnippet(snippet)}
                          className={`p-1.5 rounded transition-colors ${
                            isDarkMode
                              ? 'hover:bg-gray-700 text-gray-400'
                              : 'hover:bg-gray-200 text-gray-600'
                          }`}
                          title="Share snippet"
                        >
                          <ShareIcon className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => exportSnippet(snippet)}
                          className={`p-1.5 rounded transition-colors ${
                            isDarkMode
                              ? 'hover:bg-gray-700 text-gray-400'
                              : 'hover:bg-gray-200 text-gray-600'
                          }`}
                          title="Export snippet"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => duplicateSnippet(snippet)}
                          className={`p-1.5 rounded transition-colors ${
                            isDarkMode
                              ? 'hover:bg-gray-700 text-gray-400'
                              : 'hover:bg-gray-200 text-gray-600'
                          }`}
                          title="Duplicate snippet"
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => openSaveDialog(snippet)}
                          className={`p-1.5 rounded transition-colors ${
                            isDarkMode
                              ? 'hover:bg-gray-700 text-gray-400'
                              : 'hover:bg-gray-200 text-gray-600'
                          }`}
                          title="Edit snippet"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => deleteSnippet(snippet.id)}
                          className={`p-1.5 rounded transition-colors ${
                            isDarkMode
                              ? 'hover:bg-red-700 text-red-400'
                              : 'hover:bg-red-100 text-red-600'
                          }`}
                          title="Delete snippet"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <CodeBracketIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No snippets found</h3>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {searchTerm || selectedCategory !== 'all' || selectedTags.length > 0
                  ? 'Try adjusting your filters or search terms.'
                  : 'Save your first code snippet to get started.'}
              </p>
              <button
                onClick={() => openSaveDialog()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Current Code
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowSaveDialog(false)} />
          <div className={`relative w-full max-w-md rounded-lg shadow-xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className="text-lg font-semibold">
                {editingSnippet ? 'Edit Snippet' : 'Save Code Snippet'}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={saveForm.name}
                  onChange={(e) => setSaveForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter snippet name"
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={saveForm.description}
                  onChange={(e) => setSaveForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description (optional)"
                  rows={2}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={saveForm.category}
                  onChange={(e) => setSaveForm(prev => ({ ...prev, category: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={saveForm.tags.join(', ')}
                  onChange={(e) => setSaveForm(prev => ({ 
                    ...prev, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                  }))}
                  placeholder="react, hooks, example"
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={saveForm.isFavorite}
                    onChange={(e) => setSaveForm(prev => ({ ...prev, isFavorite: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Mark as favorite</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={saveForm.isPublic}
                    onChange={(e) => setSaveForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Make public</span>
                </label>
              </div>
            </div>
            
            <div className={`p-6 border-t flex justify-end space-x-3 ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                onClick={() => setShowSaveDialog(false)}
                className={`px-4 py-2 border rounded-lg ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={saveSnippet}
                disabled={!saveForm.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingSnippet ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeSnippetManager;