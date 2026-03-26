import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

const SNIPPETS: Record<string, string[]> = {
  javascript: ['{}', '[]', '()', '=>', ';', '===', 'const ', 'function ', 'return '],
  typescript: ['{}', '[]', '()', '=>', ': ', 'interface ', 'const ', 'function ', 'return '],
  python:     [':', 'def ', 'for ', 'if ', 'return ', 'print(', 'range(', '#'],
  java:       ['{', '}', '()', ';', 'System.out.println(', 'public ', 'void ', 'return '],
  cpp:        ['{', '}', '()', ';', 'cout <<', '#include ', 'int main()', 'return 0;'],
  c:          ['{', '}', '()', ';', 'printf(', '#include ', 'int main()', 'return 0;'],
  go:         ['{', '}', '()', ':=', 'fmt.Println(', 'func ', 'package main', 'import '],
  sql:        ['SELECT ', 'FROM ', 'WHERE ', 'JOIN ', 'INSERT ', 'UPDATE ', 'DELETE ', '*'],
};

interface Props {
  value: string;
  onChange: (v: string) => void;
  language?: string;
  height?: number;
  readOnly?: boolean;
  placeholder?: string;
}

export function MobileCodeEditor({
  value,
  onChange,
  language = 'javascript',
  height = 280,
  readOnly = false,
  placeholder = '// Start coding here...',
}: Props) {
  const inputRef = useRef<TextInput>(null);
  const [fontSize, setFontSize] = useState(13);
  const snippets = SNIPPETS[language] ?? SNIPPETS.javascript;

  const insertSnippet = (snippet: string) => {
    onChange(value + snippet);
    inputRef.current?.focus();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.wrapper}
    >
      {/* Editor */}
      <View style={[styles.editorContainer, { height }]}>
        {/* Line numbers + code */}
        <ScrollView
          horizontal={false}
          style={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator
        >
          <View style={styles.codeRow}>
            {/* Line numbers */}
            <View style={styles.lineNumbers}>
              {(value || '\n').split('\n').map((_, i) => (
                <Text key={i} style={styles.lineNum}>{i + 1}</Text>
              ))}
            </View>
            {/* TextInput over transparent background */}
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={onChange}
              editable={!readOnly}
              multiline
              scrollEnabled={false}
              style={[styles.input, { fontSize }]}
              placeholder={placeholder}
              placeholderTextColor={Colors.text3}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              keyboardAppearance="dark"
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </View>

      {/* Snippet toolbar (hidden when read-only) */}
      {!readOnly && (
        <View style={styles.toolbar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.snippetRow}>
              {/* Font size controls */}
              <TouchableOpacity style={styles.snippetBtn} onPress={() => setFontSize(s => Math.max(10, s - 1))}>
                <Text style={styles.snippetText}>A-</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.snippetBtn} onPress={() => setFontSize(s => Math.min(20, s + 1))}>
                <Text style={styles.snippetText}>A+</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              {snippets.map((s) => (
                <TouchableOpacity key={s} style={styles.snippetBtn} onPress={() => insertSnippet(s)}>
                  <Text style={styles.snippetText}>{s.trim() || s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { borderRadius: Radius.md, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  editorContainer: { backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  codeRow: { flexDirection: 'row', minHeight: '100%' },
  lineNumbers: { paddingTop: Spacing.sm, paddingHorizontal: 8, backgroundColor: Colors.bg2, minWidth: 36 },
  lineNum: { fontSize: 11, fontFamily: 'monospace', color: Colors.text3, lineHeight: 20, textAlign: 'right' },
  input: {
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    color: Colors.text,
    padding: Spacing.sm,
    lineHeight: 20,
    minHeight: 200,
  },
  toolbar: {
    backgroundColor: Colors.bg3,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 6,
  },
  snippetRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.sm, gap: 4 },
  snippetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.bg4,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border2,
  },
  snippetText: { fontSize: FontSize.xs, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', color: Colors.text },
  divider: { width: 1, height: 20, backgroundColor: Colors.border2, marginHorizontal: 4 },
});
