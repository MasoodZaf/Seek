import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Loader2, Play, RotateCcw, HelpCircle } from 'lucide-react';
import './CodeEditor.css';

const CodeEditor = ({ 
  value = '',
  language = 'javascript',
  theme = 'vs-dark',
  onChange,
  onValidate,
  height = '400px',
  readOnly = false
}) => {
  const editorRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    setIsLoading(false);

    // Configure editor
    editor.updateOptions({
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      fontSize: 14,
      tabSize: 2,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderLineHighlight: 'all',
      formatOnPaste: true,
      formatOnType: true,
      suggestOnTriggerCharacters: true,
      folding: true,
      lineDecorationsWidth: 5,
      renderWhitespace: 'selection',
      automaticLayout: true,
      bracketPairColorization: {
        enabled: true
      }
    });

    // Focus editor
    editor.focus();
  };

  const handleEditorChange = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleEditorValidation = (markers) => {
    if (onValidate) {
      const errors = markers.map(marker => ({
        line: marker.startLineNumber,
        column: marker.startColumn,
        message: marker.message,
        severity: marker.severity
      }));
      onValidate(errors);
    }
  };

  return (
    <div className="code-editor">
      {isLoading && (
        <div className="editor-loading">
          <Loader2 className="loading-spinner" />
          <span>Loading editor...</span>
        </div>
      )}
      <Editor
        height={height}
        language={language}
        value={value}
        theme={theme}
        onChange={handleEditorChange}
        onValidate={handleEditorValidation}
        onMount={handleEditorDidMount}
        loading={<div className="editor-loading">Loading...</div>}
        options={{
          readOnly,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
        }}
      />
    </div>
  );
};

export default CodeEditor;
