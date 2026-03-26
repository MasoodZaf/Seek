import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { codeService } from '../../services/codeService';
import { useAuthStore } from '../../store/authStore';
import { MobileCodeEditor } from '../../components/editor/MobileCodeEditor';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

const LANGUAGES = [
  { id: 'javascript', label: 'JS',   color: Colors.javascript },
  { id: 'python',     label: 'Py',   color: Colors.python },
  { id: 'typescript', label: 'TS',   color: Colors.typescript },
  { id: 'java',       label: 'Java', color: Colors.java },
  { id: 'cpp',        label: 'C++',  color: Colors.cpp },
  { id: 'c',          label: 'C',    color: Colors.c },
  { id: 'go',         label: 'Go',   color: Colors.go },
];

const DEFAULT_CODE: Record<string, string> = {
  javascript: `// JavaScript Playground
const message = "Hello, World!";
console.log(message);

const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((a, b) => a + b, 0);
console.log("Sum:", sum);`,
  python: `# Python Playground
message = "Hello, World!"
print(message)

numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(f"Sum: {total}")`,
  typescript: `// TypeScript Playground
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");

        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int n : numbers) sum += n;
        System.out.println("Sum: " + sum);
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
};

export default function PlaygroundScreen() {
  const { user } = useAuthStore();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [execTime, setExecTime] = useState<number | null>(null);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang] ?? '');
    setOutput('');
    setError('');
  };

  const runCode = async () => {
    if (!code.trim()) return;
    if (!user) { setError('Please log in to run code.'); return; }
    setIsRunning(true);
    setOutput('');
    setError('');
    try {
      const result = await codeService.execute({ code, language });
      setOutput(result.output ?? 'No output.');
      if (result.error) setError(result.error);
      if (result.executionTime) setExecTime(result.executionTime);
    } catch (e: any) {
      setError(e.message ?? 'Execution failed.');
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(DEFAULT_CODE[language] ?? '');
    setOutput('');
    setError('');
  };

  const currentLang = LANGUAGES.find(l => l.id === language)!;

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Playground</Text>
          <Text style={styles.subheading}>Write · Run · Learn</Text>
        </View>
        <TouchableOpacity style={styles.resetBtn} onPress={resetCode}>
          <Ionicons name="refresh-outline" size={18} color={Colors.text2} />
        </TouchableOpacity>
      </View>

      {/* Language selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langRow}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.id}
            style={[styles.langChip, language === lang.id && { borderColor: lang.color, backgroundColor: `${lang.color}22` }]}
            onPress={() => handleLanguageChange(lang.id)}
          >
            <View style={[styles.langDot, { backgroundColor: lang.color }]} />
            <Text style={[styles.langLabel, language === lang.id && { color: lang.color }]}>{lang.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Code editor */}
        <MobileCodeEditor
          value={code}
          onChange={setCode}
          language={language}
          height={Platform.OS === 'ios' ? 280 : 260}
        />

        {/* Run button */}
        <Button
          title={isRunning ? 'Running…' : `▶  Run  (${currentLang.label})`}
          onPress={runCode}
          loading={isRunning}
          disabled={!user}
          fullWidth
          style={[styles.runBtn, { backgroundColor: user ? Colors.green : Colors.bg3 }]}
          textStyle={user ? { color: '#111' } : { color: Colors.text2 }}
        />
        {!user && <Text style={styles.loginNote}>Login required to run code</Text>}

        {/* Output panel */}
        {(output || error) && (
          <Card style={styles.outputCard} padding={Spacing.md}>
            <View style={styles.outputHeader}>
              <Text style={[styles.outputStatus, error ? styles.statusError : styles.statusSuccess]}>
                {error ? '✗ Error' : '✓ Output'}
              </Text>
              {execTime && <Text style={styles.execTime}>{execTime.toFixed(0)}ms</Text>}
            </View>
            <Text style={[styles.outputText, error && styles.outputError]}>
              {error || output}
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingTop: Spacing.sm },
  heading: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text },
  subheading: { fontSize: FontSize.sm, color: Colors.text3 },
  resetBtn: { padding: 8, backgroundColor: Colors.bg2, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border },
  langRow: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: 8 },
  langChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.sm, paddingVertical: 6,
    borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.border,
  },
  langDot: { width: 8, height: 8, borderRadius: Radius.full },
  langLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text2 },
  content: { paddingHorizontal: Spacing.md, paddingBottom: 80 },
  runBtn: { marginTop: Spacing.sm, borderRadius: Radius.md },
  loginNote: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.text3, marginTop: 6 },
  outputCard: { marginTop: Spacing.md, backgroundColor: Colors.bg3 },
  outputHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  outputStatus: { fontSize: FontSize.xs, fontWeight: '700' },
  statusSuccess: { color: Colors.green },
  statusError: { color: Colors.red },
  execTime: { fontSize: FontSize.xs, color: Colors.text3 },
  outputText: { fontFamily: 'monospace', fontSize: 13, color: Colors.text, lineHeight: 20 },
  outputError: { color: Colors.red },
});
