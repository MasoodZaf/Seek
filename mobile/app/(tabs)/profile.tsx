import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        await logout();
        router.replace('/(auth)/login');
      }},
    ]);
  };

  if (!user) return null;

  const prog = user.progress;
  const completionPct = prog.totalExercises > 0
    ? Math.round((prog.completedExercises / prog.totalExercises) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar + name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.firstName[0]}{user.lastName[0]}</Text>
          </View>
          <Text style={styles.name}>{user.fullName ?? `${user.firstName} ${user.lastName}`}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Level', value: `${prog.level}`, icon: '⚡' },
            { label: 'Streak', value: prog.currentStreak > 0 ? `🔥 ${prog.currentStreak}d` : '—', icon: '' },
            { label: 'Points', value: `${prog.totalPoints}`, icon: '🏆' },
            { label: 'Done', value: `${prog.completedExercises}`, icon: '✅' },
          ].map((stat) => (
            <Card key={stat.label} style={styles.statCard} padding={Spacing.md}>
              <Text style={styles.statValue}>{stat.icon} {stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        {/* Progress bar */}
        <Card style={styles.progressCard} padding={Spacing.md}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Overall Progress</Text>
            <Text style={styles.progressPct}>{completionPct}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${completionPct}%` }]} />
          </View>
          <Text style={styles.progressSub}>
            {prog.completedExercises} of {prog.totalExercises} lessons completed
          </Text>
        </Card>

        {/* Settings links */}
        <Card style={styles.settingsCard} padding={0}>
          {[
            { icon: 'code-slash-outline', label: 'Preferred Language', value: user.preferences?.language ?? 'javascript' },
            { icon: 'star-outline', label: 'Best Streak', value: `${prog.longestStreak} days` },
            { icon: 'school-outline', label: 'Role', value: user.role },
          ].map((item, i) => (
            <View key={item.label} style={[styles.settingsRow, i > 0 && styles.settingsDivider]}>
              <Ionicons name={item.icon as any} size={18} color={Colors.text2} />
              <Text style={styles.settingsLabel}>{item.label}</Text>
              <View style={styles.flex1} />
              <Text style={styles.settingsValue}>{item.value}</Text>
            </View>
          ))}
        </Card>

        {/* Logout */}
        <Button
          title="Sign Out"
          variant="ghost"
          onPress={handleLogout}
          fullWidth
          style={styles.logoutBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: 80, gap: Spacing.md },
  avatarSection: { alignItems: 'center', gap: 6 },
  avatar: {
    width: 80, height: 80, borderRadius: Radius.full,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  avatarText: { fontSize: FontSize.xl, fontWeight: '700', color: '#fff' },
  name: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text },
  username: { fontSize: FontSize.md, color: Colors.text2 },
  email: { fontSize: FontSize.sm, color: Colors.text3 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statCard: { flex: 1, minWidth: '45%', alignItems: 'center', gap: 4 },
  statValue: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.text3, fontWeight: '500' },
  progressCard: {},
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  progressPct: { fontSize: FontSize.md, fontWeight: '700', color: Colors.green },
  progressTrack: { height: 6, backgroundColor: Colors.bg4, borderRadius: Radius.full, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: Colors.green, borderRadius: Radius.full },
  progressSub: { fontSize: FontSize.xs, color: Colors.text3 },
  settingsCard: { overflow: 'hidden' },
  settingsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.md, paddingVertical: 14 },
  settingsDivider: { borderTopWidth: 1, borderTopColor: Colors.border },
  settingsLabel: { fontSize: FontSize.md, color: Colors.text },
  settingsValue: { fontSize: FontSize.sm, color: Colors.text2 },
  flex1: { flex: 1 },
  logoutBtn: { borderColor: Colors.red },
});
