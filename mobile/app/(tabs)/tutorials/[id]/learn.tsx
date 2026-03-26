import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { tutorialService } from '../../../../services/tutorialService';
import { codeService } from '../../../../services/codeService';
import { MobileCodeEditor } from '../../../../components/editor/MobileCodeEditor';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Colors, FontSize, Spacing, Radius } from '../../../../constants/theme';
import type { TutorialStep } from '../../../../types/tutorial';

type Phase = 'learn' | 'practice' | 'quiz';

export default function LearnScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('learn');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [runError, setRunError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  const { data: tutorial, isLoading } = useQuery({
    queryKey: ['tutorial', id],
    queryFn: () => tutorialService.getById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (tutorial?.steps?.[0]?.practice?.starterCode) {
      setCode(tutorial.steps[0].practice.starterCode);
    }
  }, [tutorial]);

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator color={Colors.green} size="large" /></View>;
  }

  const steps: TutorialStep[] = tutorial?.steps ?? [];
  const step = steps[stepIndex];
  if (!step) return <View style={styles.center}><Text style={styles.errorText}>No content found.</Text></View>;

  const isLast = stepIndex === steps.length - 1;

  const goNext = () => {
    if (!isLast) {
      const nextStep = steps[stepIndex + 1];
      setStepIndex(i => i + 1);
      setPhase('learn');
      setCode(nextStep?.practice?.starterCode ?? '');
      setOutput('');
      setRunError('');
      setSelectedOption(null);
      setQuizAnswered(false);
    } else {
      router.back();
    }
  };

  const runCode = async () => {
    if (!code.trim()) return;
    setIsRunning(true);
    setOutput('');
    setRunError('');
    try {
      const result = await codeService.execute({ code, language: tutorial?.language ?? 'javascript' });
      setOutput(result.output ?? '');
      if (result.error) setRunError(result.error);
    } catch (e: any) {
      setRunError(e.message ?? 'Execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{tutorial?.title}</Text>
          <Text style={styles.stepCount}>Step {stepIndex + 1} / {steps.length}</Text>
        </View>
      </View>

      {/* Step progress dots */}
      <View style={styles.dotsRow}>
        {steps.map((_, i) => (
          <View key={i} style={[styles.dot, i === stepIndex && styles.dotActive, i < stepIndex && styles.dotDone]} />
        ))}
      </View>

      {/* Phase tabs */}
      <View style={styles.phaseTabs}>
        {(['learn', 'practice', 'quiz'] as Phase[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.phaseTab, phase === p && styles.phaseTabActive]}
            onPress={() => setPhase(p)}
          >
            <Text style={[styles.phaseTabText, phase === p && styles.phaseTabTextActive]}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── LEARN PHASE ── */}
        {phase === 'learn' && (
          <View style={styles.phase}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepContent}>{step.content}</Text>

            {step.codeExamples?.map((ex, i) => (
              <View key={i} style={styles.codeBlock}>
                <Text style={styles.codeBlockLabel}>{ex.language}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator>
                  <Text style={styles.codeText}>{ex.code}</Text>
                </ScrollView>
                {ex.explanation && (
                  <Text style={styles.codeExplanation}>{ex.explanation}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ── PRACTICE PHASE ── */}
        {phase === 'practice' && step.practice && (
          <View style={styles.phase}>
            <Text style={styles.stepTitle}>Practice</Text>
            <Text style={styles.stepContent}>{step.practice.instructions}</Text>

            {step.practice.hints?.length > 0 && (
              <Card style={styles.hintsCard} padding={Spacing.md}>
                <Text style={styles.hintsTitle}>💡 Hints</Text>
                {step.practice.hints.map((h, i) => (
                  <Text key={i} style={styles.hintText}>• {h}</Text>
                ))}
              </Card>
            )}

            <MobileCodeEditor
              value={code}
              onChange={setCode}
              language={tutorial?.language ?? 'javascript'}
              height={260}
            />

            <Button
              title={isRunning ? 'Running…' : '▶  Run Code'}
              onPress={runCode}
              loading={isRunning}
              fullWidth
              style={styles.runBtn}
            />

            {(output || runError) && (
              <Card style={styles.outputCard} padding={Spacing.md}>
                <Text style={styles.outputLabel}>{runError ? '✗ Error' : '✓ Output'}</Text>
                <Text style={[styles.outputText, runError && styles.outputError]}>
                  {runError || output}
                </Text>
              </Card>
            )}
          </View>
        )}

        {/* ── QUIZ PHASE ── */}
        {phase === 'quiz' && step.quiz && (
          <View style={styles.phase}>
            <Text style={styles.stepTitle}>Quick Quiz</Text>
            <Text style={styles.stepContent}>{step.quiz.question}</Text>

            <View style={styles.optionsCol}>
              {step.quiz.options.map((opt, i) => {
                let bg = Colors.bg2;
                let border = Colors.border;
                if (quizAnswered) {
                  if (opt.isCorrect) { bg = Colors.greenDim; border = Colors.green; }
                  else if (i === selectedOption) { bg = 'rgba(252,165,165,0.15)'; border = Colors.red; }
                }
                return (
                  <TouchableOpacity
                    key={i}
                    disabled={quizAnswered}
                    onPress={() => { setSelectedOption(i); setQuizAnswered(true); }}
                    style={[styles.option, { backgroundColor: bg, borderColor: border }]}
                  >
                    <Text style={styles.optionText}>{opt.text}</Text>
                    {quizAnswered && opt.isCorrect && (
                      <Ionicons name="checkmark-circle" size={20} color={Colors.green} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {quizAnswered && (
              <Card style={styles.explanationCard} padding={Spacing.md}>
                <Text style={styles.explanationText}>{step.quiz.explanation}</Text>
              </Card>
            )}
          </View>
        )}

        {/* Next step button */}
        <Button
          title={isLast ? '✓ Complete Tutorial' : 'Next Step →'}
          onPress={goNext}
          fullWidth
          style={styles.nextBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: Colors.text2, fontSize: FontSize.md },
  header: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  stepCount: { fontSize: FontSize.xs, color: Colors.text3 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: Spacing.sm },
  dot: { width: 6, height: 6, borderRadius: Radius.full, backgroundColor: Colors.bg4 },
  dotActive: { backgroundColor: Colors.green, width: 18 },
  dotDone: { backgroundColor: Colors.green },
  phaseTabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.border },
  phaseTab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center' },
  phaseTabActive: { borderBottomWidth: 2, borderBottomColor: Colors.green },
  phaseTabText: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.text3 },
  phaseTabTextActive: { color: Colors.green, fontWeight: '600' },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: 80 },
  phase: { gap: Spacing.md },
  stepTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text },
  stepContent: { fontSize: FontSize.md, color: Colors.text2, lineHeight: 24 },
  codeBlock: { backgroundColor: Colors.bg, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  codeBlockLabel: { fontSize: FontSize.xs, color: Colors.text3, marginBottom: 8, textTransform: 'uppercase' },
  codeText: { fontFamily: 'monospace', fontSize: 13, color: Colors.text, lineHeight: 20 },
  codeExplanation: { fontSize: FontSize.sm, color: Colors.text2, marginTop: Spacing.sm, lineHeight: 20 },
  hintsCard: { backgroundColor: 'rgba(99,102,241,0.08)', borderColor: Colors.primaryDim },
  hintsTitle: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  hintText: { fontSize: FontSize.sm, color: Colors.text2, lineHeight: 22 },
  runBtn: { marginTop: Spacing.sm, backgroundColor: Colors.primary },
  outputCard: { backgroundColor: Colors.bg3 },
  outputLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.text3, marginBottom: 6 },
  outputText: { fontFamily: 'monospace', fontSize: 13, color: Colors.text, lineHeight: 20 },
  outputError: { color: Colors.red },
  optionsCol: { gap: 8 },
  option: {
    padding: Spacing.md, borderRadius: Radius.md,
    borderWidth: 1, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  optionText: { flex: 1, fontSize: FontSize.md, color: Colors.text, lineHeight: 22 },
  explanationCard: { backgroundColor: Colors.greenDim, borderColor: Colors.green },
  explanationText: { fontSize: FontSize.sm, color: Colors.text2, lineHeight: 22 },
  nextBtn: { marginTop: Spacing.xl },
});
