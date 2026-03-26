import React, { useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { tutorialService } from '../../../services/tutorialService';
import { TutorialCard } from '../../../components/tutorials/TutorialCard';
import { Colors, FontSize, Spacing, Radius } from '../../../constants/theme';

const LANGUAGES = ['', 'javascript', 'python', 'typescript', 'java', 'cpp', 'c'];
const LANG_LABELS: Record<string, string> = {
  '': 'All', javascript: 'JS', python: 'Python',
  typescript: 'TS', java: 'Java', cpp: 'C++', c: 'C',
};
const DIFFICULTIES = ['', 'beginner', 'intermediate', 'advanced'];

export default function TutorialsScreen() {
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState('');
  const [diff, setDiff] = useState('');

  const { data: tutorials = [], isLoading } = useQuery({
    queryKey: ['tutorials', { search, lang, diff }],
    queryFn: () => tutorialService.getList({
      ...(search && { search }),
      ...(lang && { language: lang }),
      ...(diff && { difficulty: diff }),
    }),
  });

  return (
    <SafeAreaView style={styles.screen}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={Colors.text3} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search tutorials..."
          placeholderTextColor={Colors.text3}
          keyboardAppearance="dark"
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={Colors.text3} />
          </TouchableOpacity>
        )}
      </View>

      {/* Language filter */}
      <FlatList
        horizontal
        data={LANGUAGES}
        keyExtractor={(l) => l || 'all'}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, item === lang && styles.chipActive]}
            onPress={() => setLang(item)}
          >
            <Text style={[styles.chipText, item === lang && styles.chipTextActive]}>
              {LANG_LABELS[item]}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Difficulty filter */}
      <FlatList
        horizontal
        data={DIFFICULTIES}
        keyExtractor={(d) => d || 'all'}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.filterRow, styles.filterRow2]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, item === diff && styles.chipActiveDiff]}
            onPress={() => setDiff(item)}
          >
            <Text style={[styles.chipText, item === diff && styles.chipTextActive]}>
              {item ? item.charAt(0).toUpperCase() + item.slice(1) : 'All Levels'}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Results */}
      {isLoading ? (
        <ActivityIndicator color={Colors.green} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={tutorials}
          keyExtractor={(t) => t._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <TutorialCard tutorial={item} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No tutorials found.</Text>
              <TouchableOpacity onPress={() => { setSearch(''); setLang(''); setDiff(''); }}>
                <Text style={styles.clearLink}>Clear filters</Text>
              </TouchableOpacity>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing.md, marginTop: Spacing.md,
    backgroundColor: Colors.bg2, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.text, paddingVertical: 12 },
  filterRow: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, gap: 8, paddingBottom: 4 },
  filterRow2: { paddingBottom: 4 },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: 6,
    borderRadius: Radius.full, backgroundColor: Colors.bg2,
    borderWidth: 1, borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primaryDim, borderColor: Colors.primary },
  chipActiveDiff: { backgroundColor: Colors.greenDim, borderColor: Colors.green },
  chipText: { fontSize: FontSize.sm, color: Colors.text2, fontWeight: '500' },
  chipTextActive: { color: Colors.text, fontWeight: '600' },
  list: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: 80 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: FontSize.md, color: Colors.text2 },
  clearLink: { fontSize: FontSize.md, color: Colors.green, fontWeight: '600' },
});
