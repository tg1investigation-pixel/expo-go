import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Lock, User } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const insets = useSafeAreaInsets();

  const scrollAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: -width,
        duration: 15000,
        useNativeDriver: true,
      })
    ).start();
  }, [fadeAnim, scrollAnim]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      return;
    }

    const success = await login(username, password);
    if (success) {
      router.replace('/menu');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f2027', '#203a43', '#2c5364']}
        style={styles.gradient}
      >
        <View style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <Animated.View style={[styles.content, { opacity: fadeAnim, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
                <View style={styles.logoContainer}>
                  <View style={styles.iconWrapper}>
                    <Shield size={64} color="#fff" strokeWidth={1.5} />
                  </View>
                  <Text style={styles.title}>المنظومة الباحث الذكي</Text>
                  <Text style={styles.subtitle}>The Intelligent Search System</Text>
                  <View style={styles.divider} />
                </View>

                <View style={styles.formContainer}>
                  <View style={styles.inputContainer}>
                    <View style={styles.inputIconWrapper}>
                      <User size={20} color="#94a3b8" />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="اسم المستخدم"
                      placeholderTextColor="#64748b"
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      editable={!isLoading}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <View style={styles.inputIconWrapper}>
                      <Lock size={20} color="#94a3b8" />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="كلمة المرور"
                      placeholderTextColor="#64748b"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      autoCapitalize="none"
                      editable={!isLoading}
                      onSubmitEditing={handleLogin}
                    />
                  </View>

                  {error && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.warningContainer}>
                  <View style={styles.warningBar}>
                    <Animated.View
                      style={[
                        styles.warningTextContainer,
                        {
                          transform: [{ translateX: scrollAnim }],
                        },
                      ]}
                    >
                      <Text style={styles.warningText}>
                        ⚠️ تحذير: يحتوي هذا التطبيق على بيانات سرية. الوصول غير المصرح به أو مشاركة المعلومات ممنوعة وقد تؤدي إلى عواقب قانونية
                      </Text>
                      <Text style={[styles.warningText, styles.warningTextSpacing]}>
                        ⚠️ تحذير: يحتوي هذا التطبيق على بيانات سرية. الوصول غير المصرح به أو مشاركة المعلومات ممنوعة وقد تؤدي إلى عواقب قانونية
                      </Text>
                    </Animated.View>
                  </View>
                </View>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingTop: 60,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '400' as const,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputIconWrapper: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    color: '#fff',
    fontSize: 16,
    textAlign: 'right',
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    backgroundColor: '#64748b',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600' as const,
  },
  warningContainer: {
    marginTop: 24,
  },
  warningBar: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.4)',
    height: 48,
    justifyContent: 'center',
  },
  warningTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    color: '#fde047',
    fontSize: 14,
    fontWeight: '500' as const,
    paddingHorizontal: 16,
  },
  warningTextSpacing: {
    marginLeft: width,
  },
});
