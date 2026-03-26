import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({ username: '', firstName: '', lastName: '', email: '', password: '' });

  const update = (field: string) => (v: string) => {
    setForm(f => ({ ...f, [field]: v }));
    clearError();
  };

  const handleRegister = async () => {
    try {
      await register({
        ...form,
        email: form.email.trim().toLowerCase(),
        username: form.username.trim(),
      });
      router.replace('/(tabs)/');
    } catch {
      // error in store
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Create account</Text>
        <Text style={styles.sub}>Start your coding journey</Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          {([
            { key: 'firstName', label: 'First Name', placeholder: 'Alice' },
            { key: 'lastName',  label: 'Last Name',  placeholder: 'Smith' },
            { key: 'username',  label: 'Username',   placeholder: 'alice_codes' },
            { key: 'email',     label: 'Email',      placeholder: 'alice@example.com', keyboard: 'email-address' as const },
            { key: 'password',  label: 'Password',   placeholder: '••••••••', secure: true },
          ] as const).map((field) => (
            <View key={field.key}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={styles.input}
                value={form[field.key]}
                onChangeText={update(field.key)}
                placeholder={field.placeholder}
                placeholderTextColor={Colors.text3}
                secureTextEntry={'secure' in field}
                autoCapitalize={'keyboard' in field || 'secure' in field ? 'none' : 'words'}
                keyboardType={'keyboard' in field ? field.keyboard : 'default'}
                keyboardAppearance="dark"
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.primaryBtn, isLoading && styles.disabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.primaryBtnText}>{isLoading ? 'Creating account…' : 'Create Account'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.switchRow}>
          <Text style={styles.switchText}>Already have an account? </Text>
          <Text style={styles.switchLink}>Sign in</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  content: { flexGrow: 1, paddingHorizontal: Spacing.xl, paddingTop: 60, paddingBottom: 40, gap: 0 },
  back: { marginBottom: Spacing.lg },
  backText: { color: Colors.text2, fontSize: FontSize.md },
  heading: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  sub: { fontSize: FontSize.md, color: Colors.text2, marginBottom: Spacing.xl },
  errorBox: { backgroundColor: 'rgba(252,165,165,0.15)', borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.md },
  errorText: { color: Colors.red, fontSize: FontSize.sm },
  form: { gap: 4 },
  label: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.text2, marginBottom: 4, marginTop: Spacing.sm },
  input: {
    backgroundColor: Colors.bg2,
    borderWidth: 1, borderColor: Colors.border2,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: 13,
    fontSize: FontSize.md, color: Colors.text,
  },
  primaryBtn: { backgroundColor: Colors.green, borderRadius: Radius.md, paddingVertical: 15, alignItems: 'center', marginTop: Spacing.lg },
  primaryBtnText: { color: '#111', fontSize: FontSize.md, fontWeight: '700' },
  disabled: { opacity: 0.5 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  switchText: { color: Colors.text3, fontSize: FontSize.sm },
  switchLink: { color: Colors.green, fontSize: FontSize.sm, fontWeight: '600' },
});
