import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import Editor from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';
import './CodeEditor.css';

const CodeEditor = forwardRef(({
  value = '',
  language = 'javascript',
  theme = 'vs-dark',
  onChange,
  onValidate,
  onContentSizeChange,
  onRun,
  height = '400px',
  readOnly = false
}, ref) => {
  const editorRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Expose setValue so parent can imperatively update Monaco content
  useImperativeHandle(ref, () => ({
    setValue(newValue) {
      if (editorRef.current) {
        editorRef.current.setValue(newValue);
      }
    },
    getEditor() {
      return editorRef.current;
    }
  }));

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    setIsLoading(false);

    // Ctrl+Enter / Cmd+Enter → run code
    if (onRun) {
      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
        () => onRun()
      );
    }

    // Report content height changes to parent
    if (onContentSizeChange) {
      onContentSizeChange(editor.getContentHeight());
      editor.onDidContentSizeChange(() => {
        onContentSizeChange(editor.getContentHeight());
      });
    }

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
    <div className="code-editor" style={{ height }}>
      {isLoading && (
        <div className="editor-loading">
          <Loader2 className="loading-spinner" />
          <span>Loading editor...</span>
        </div>
      )}
      <Editor
        height="100%"
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
});

export default CodeEditor;
