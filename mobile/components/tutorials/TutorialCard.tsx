import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import type { Tutorial } from '../../types/tutorial';

const LANG_COLORS: Record<string, string> = {
  javascript: Colors.javascript,
  python: Colors.python,
  typescript: Colors.typescript,
  java: Colors.java,
  cpp: Colors.cpp,
  c: Colors.c,
  sql: Colors.sql,
  go: Colors.go,
};

interface Props {
  tutorial: Tutorial;
}

export function TutorialCard({ tutorial }: Props) {
  const router = useRouter();
  const langColor = LANG_COLORS[tutorial.language] ?? Colors.text3;
  const difficulty = tutorial.difficulty as 'beginner' | 'intermediate' | 'advanced';

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(tabs)/tutorials/${tutorial._id}`)}
      activeOpacity={0.85}
    >
      <Card style={styles.card}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={[styles.langDot, { backgroundColor: langColor }]} />
          <Badge label={tutorial.difficulty} variant={difficulty} />
          <View style={styles.flex1} />
          <Text style={styles.time}>
            {Math.floor((tutorial.estimatedTime ?? 0) / 60)}h {(tutorial.estimatedTime ?? 0) % 60}m
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>{tutorial.title}</Text>
        <Text style={styles.desc} numberOfLines={2}>{tutorial.description}</Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.authorRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {tutorial.author?.name?.split(' ').map(n => n[0]).join('') ?? 'ST'}
              </Text>
            </View>
            <Text style={styles.authorName}>{tutorial.author?.name ?? 'CodeArc Team'}</Text>
          </View>
          <Text style={styles.steps}>
            {tutorial.stepCount ?? (tutorial.steps?.length ?? 3)} steps
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.sm },
  langDot: { width: 10, height: 10, borderRadius: Radius.full },
  flex1: { flex: 1 },
  time: { fontSize: FontSize.xs, color: Colors.text3 },
  title: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  desc: { fontSize: FontSize.sm, color: Colors.text2, lineHeight: 20, marginBottom: Spacing.sm },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.xs },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: {
    width: 24, height: 24, borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  authorName: { fontSize: FontSize.sm, color: Colors.text2 },
  steps: { fontSize: FontSize.xs, color: Colors.text3, backgroundColor: Colors.bg3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.sm },
});
