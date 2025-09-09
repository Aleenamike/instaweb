import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ value, onChange, height = "400px", readOnly = false }) => {
  return (
    <div className="h-full">
      <Editor
        height={height}
        defaultLanguage="html"
        value={value}
        onChange={onChange}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: "on",
          readOnly: readOnly,
          automaticLayout: true,
          lineNumbers: "on",
          folding: true,
          selectOnLineNumbers: true,
          roundedSelection: false,
          cursorStyle: "line",
          contextmenu: true,
          mouseWheelZoom: true,
          smoothScrolling: true,
          renderWhitespace: "selection",
          renderControlCharacters: false,
          fontLigatures: true,
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true
          }
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading editor...</div>
          </div>
        }
      />
    </div>
  );
};

export default CodeEditor;
