import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

const SLIDES = [
  {
    key: 'learn',
    emoji: '📚',
    title: 'Learn by Doing',
    desc: 'Step-by-step tutorials across JavaScript, Python, TypeScript, Java, C++ and more. Every lesson has runnable code.',
  },
  {
    key: 'practice',
    emoji: '⚡',
    title: 'Code in Your Pocket',
    desc: 'A full code playground on your phone. Write, run, and debug code in 10+ languages — no laptop needed.',
  },
  {
    key: 'progress',
    emoji: '🔥',
    title: 'Build a Streak',
    desc: 'Daily coding habits compound fast. Track your streak, earn XP, and watch your level climb.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(i => i + 1);
    } else {
      router.replace('/(auth)/login');
    }
  };

  return (
    <View style={styles.screen}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(s) => s.key}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentIndex && styles.dotActive]}
          />
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={goNext}>
          <Text style={styles.primaryBtnText}>
            {currentIndex < SLIDES.length - 1 ? 'Next' : 'Get Started'}
          </Text>
        </TouchableOpacity>
        {currentIndex === 0 && (
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.skipText}>I already have an account</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg, justifyContent: 'space-between', paddingVertical: 60 },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 20 },
  emoji: { fontSize: 72 },
  title: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  desc: { fontSize: FontSize.md, color: Colors.text2, textAlign: 'center', lineHeight: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: Spacing.md },
  dot: { width: 8, height: 8, borderRadius: Radius.full, backgroundColor: Colors.bg4 },
  dotActive: { backgroundColor: Colors.green, width: 24 },
  actions: { paddingHorizontal: Spacing.xl, gap: Spacing.md, alignItems: 'center' },
  primaryBtn: {
    backgroundColor: Colors.green,
    paddingVertical: 15, paddingHorizontal: Spacing.xl,
    borderRadius: Radius.md, width: '100%', alignItems: 'center',
  },
  primaryBtnText: { color: '#111', fontSize: FontSize.md, fontWeight: '700' },
  skipText: { color: Colors.text3, fontSize: FontSize.sm },
});
