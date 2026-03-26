import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { tutorialService } from '../../services/tutorialService';
import { TutorialCard } from '../../components/tutorials/TutorialCard';
import { Card } from '../../components/ui/Card';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: featured = [], isLoading } = useQuery({
    queryKey: ['tutorials', 'featured'],
    queryFn: () => tutorialService.getFeatured(),
  });

  const streak = user?.progress?.currentStreak ?? 0;
  const level = user?.progress?.level ?? 1;
  const points = user?.progress?.totalPoints ?? 0;
  const completions = user?.progress?.completedExercises ?? 0;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good {getTimeOfDay()}, {user?.firstName ?? 'Coder'} 👋</Text>
            <Text style={styles.subGreeting}>Keep the momentum going!</Text>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text style={styles.avatarText}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Streak', value: streak > 0 ? `🔥 ${streak}` : '—', sub: 'days' },
            { label: 'Level', value: `Lv ${level}`, sub: `${points} pts` },
            { label: 'Done', value: completions, sub: 'lessons' },
          ].map((s) => (
            <Card key={s.label} style={styles.statCard} padding={Spacing.md}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statSub}>{s.sub}</Text>
            </Card>
          ))}
        </View>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(tabs)/tutorials')}>
            <Text style={styles.quickEmoji}>📚</Text>
            <Text style={styles.quickText}>Tutorials</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(tabs)/playground')}>
            <Text style={styles.quickEmoji}>⚡</Text>
            <Text style={styles.quickText}>Playground</Text>
          </TouchableOpacity>
        </View>

        {/* Featured tutorials */}
        <Text style={styles.sectionTitle}>Featured Tutorials</Text>
        {isLoading ? (
          <ActivityIndicator color={Colors.green} style={{ marginTop: Spacing.lg }} />
        ) : (
          featured.map(t => <TutorialCard key={t._id} tutorial={t} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: 80 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  greeting: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text },
  subGreeting: { fontSize: FontSize.sm, color: Colors.text2, marginTop: 4 },
  avatar: {
    width: 44, height: 44, borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  statCard: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.text3, fontWeight: '500' },
  statSub: { fontSize: FontSize.xs, color: Colors.text3 },
  quickRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  quickBtn: {
    flex: 1, backgroundColor: Colors.bg2,
    borderRadius: Radius.lg, padding: Spacing.md,
    alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: Colors.border,
  },
  quickEmoji: { fontSize: 28 },
  quickText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
});
