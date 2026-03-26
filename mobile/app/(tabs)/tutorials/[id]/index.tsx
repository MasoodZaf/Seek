import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { tutorialService } from '../../../../services/tutorialService';
import { Badge } from '../../../../components/ui/Badge';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Colors, FontSize, Spacing, Radius } from '../../../../constants/theme';

export default function TutorialDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: tutorial, isLoading } = useQuery({
    queryKey: ['tutorial', id],
    queryFn: () => tutorialService.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.green} size="large" />
      </View>
    );
  }

  if (!tutorial) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Tutorial not found.</Text>
      </View>
    );
  }

  const difficulty = tutorial.difficulty as 'beginner' | 'intermediate' | 'advanced';
  const stepCount = tutorial.stepCount ?? tutorial.steps?.length ?? 0;
  const time = `${Math.floor((tutorial.estimatedTime ?? 0) / 60)}h ${(tutorial.estimatedTime ?? 0) % 60}m`;

  return (
    <SafeAreaView style={styles.screen}>
      {/* Back */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Badges */}
        <View style={styles.badgeRow}>
          <Badge label={tutorial.difficulty} variant={difficulty} />
          <Badge label={tutorial.language} />
        </View>

        {/* Title */}
        <Text style={styles.title}>{tutorial.title}</Text>
        <Text style={styles.desc}>{tutorial.description}</Text>

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color={Colors.text3} />
            <Text style={styles.metaText}>{time}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="layers-outline" size={16} color={Colors.text3} />
            <Text style={styles.metaText}>{stepCount} steps</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="star-outline" size={16} color={Colors.text3} />
            <Text style={styles.metaText}>{tutorial.rating?.average?.toFixed(1) ?? '4.5'}</Text>
          </View>
        </View>

        {/* Learning objectives */}
        {tutorial.learningObjectives?.length > 0 && (
          <Card style={styles.objectivesCard}>
            <Text style={styles.sectionTitle}>What you'll learn</Text>
            {tutorial.learningObjectives.map((obj: string, i: number) => (
              <View key={i} style={styles.objectiveRow}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.green} />
                <Text style={styles.objectiveText}>{obj}</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Prerequisites */}
        {tutorial.prerequisites?.length > 0 && (
          <Card style={styles.prereqCard}>
            <Text style={styles.sectionTitle}>Prerequisites</Text>
            {tutorial.prerequisites.map((p: string, i: number) => (
              <Text key={i} style={styles.prereqText}>• {p}</Text>
            ))}
          </Card>
        )}

        {/* Tags */}
        {tutorial.tags?.length > 0 && (
          <View style={styles.tagsRow}>
            {tutorial.tags.map((tag: string) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* CTA */}
        <Button
          title={`Start Learning · ${stepCount} steps`}
          onPress={() => router.push(`/(tabs)/tutorials/${id}/learn`)}
          fullWidth
          size="lg"
          style={styles.cta}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  backBtn: { padding: Spacing.md },
  content: { paddingHorizontal: Spacing.md, paddingBottom: 80 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.md },
  title: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm, lineHeight: 32 },
  desc: { fontSize: FontSize.md, color: Colors.text2, lineHeight: 24, marginBottom: Spacing.lg },
  metaRow: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.lg },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: FontSize.sm, color: Colors.text2 },
  objectivesCard: { marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  objectiveRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  objectiveText: { flex: 1, fontSize: FontSize.sm, color: Colors.text2, lineHeight: 20 },
  prereqCard: { marginBottom: Spacing.md },
  prereqText: { fontSize: FontSize.sm, color: Colors.text2, marginBottom: 4 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.xl },
  tag: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: Colors.bg3, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border },
  tagText: { fontSize: FontSize.xs, color: Colors.text3 },
  cta: { marginTop: Spacing.md },
  errorText: { color: Colors.text2, fontSize: FontSize.md },
});
