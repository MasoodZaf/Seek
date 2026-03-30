import React, { useState } from 'react';
import { Image } from 'react-native';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    try {
      await login({ email: email.trim().toLowerCase(), password });
      router.replace('/(tabs)/');
    } catch {
      // error is already in store
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoRow}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logoMark}
            resizeMode="cover"
          />
          <Text style={styles.logoText}>CodeArc</Text>
        </View>

        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.sub}>Sign in to continue coding</Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(v) => { setEmail(v); clearError(); }}
            placeholder="you@example.com"
            placeholderTextColor={Colors.text3}
            autoCapitalize="none"
            keyboardType="email-address"
            keyboardAppearance="dark"
            returnKeyType="next"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(v) => { setPassword(v); clearError(); }}
            placeholder="••••••••"
            placeholderTextColor={Colors.text3}
            secureTextEntry
            keyboardAppearance="dark"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity
            style={[styles.primaryBtn, isLoading && styles.disabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.primaryBtnText}>{isLoading ? 'Signing in…' : 'Sign In'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.switchRow}>
          <Text style={styles.switchText}>Don't have an account? </Text>
          <Text style={styles.switchLink}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  content: { flexGrow: 1, paddingHorizontal: Spacing.xl, paddingTop: 80, paddingBottom: 40, gap: 0 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: Spacing.xl },
  logoMark: { width: 38, height: 38, borderRadius: Radius.md, overflow: 'hidden' },
  logoText: { color: Colors.text, fontSize: FontSize.lg, fontWeight: '600' },
  heading: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  sub: { fontSize: FontSize.md, color: Colors.text2, marginBottom: Spacing.xl },
  errorBox: { backgroundColor: 'rgba(252,165,165,0.15)', borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.md },
  errorText: { color: Colors.red, fontSize: FontSize.sm },
  form: { gap: Spacing.sm },
  label: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.text2, marginBottom: 4 },
  input: {
    backgroundColor: Colors.bg2,
    borderWidth: 1, borderColor: Colors.border2,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: 13,
    fontSize: FontSize.md, color: Colors.text,
    marginBottom: Spacing.sm,
  },
  primaryBtn: {
    backgroundColor: Colors.green,
    borderRadius: Radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  primaryBtnText: { color: '#111', fontSize: FontSize.md, fontWeight: '700' },
  disabled: { opacity: 0.5 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  switchText: { color: Colors.text3, fontSize: FontSize.sm },
  switchLink: { color: Colors.green, fontSize: FontSize.sm, fontWeight: '600' },
});
