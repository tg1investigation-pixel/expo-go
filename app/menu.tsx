import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Car, LogOut } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MenuScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f2027', '#203a43', '#2c5364']}
        style={styles.gradient}
      >
        <View style={[styles.safeArea, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View>
                <Text style={styles.welcomeText}>مرحباً، {user?.fullName}</Text>
                <Text style={styles.systemTitle}>المنظومة الباحث الذكي</Text>
              </View>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <LogOut size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>

            <View style={styles.menuContainer}>
              <Text style={styles.menuTitle}>اختر نوع البحث</Text>

              <TouchableOpacity
                style={styles.menuCard}
                onPress={() => router.push('/people-search')}
                activeOpacity={0.85}
              >
                <View style={styles.cardIconContainer}>
                  <Users size={48} color="#3b82f6" strokeWidth={1.5} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>البحث عن الأشخاص</Text>
                  <Text style={styles.cardSubtitle}>
                    البحث بالاسم أو رقم الهاتف
                  </Text>
                </View>
                <View style={styles.cardArrow}>
                  <Text style={styles.arrowText}>◀</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuCard}
                onPress={() => router.push('/cars-search')}
                activeOpacity={0.85}
              >
                <View style={styles.cardIconContainer}>
                  <Car size={48} color="#10b981" strokeWidth={1.5} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>البحث عن السيارات</Text>
                  <Text style={styles.cardSubtitle}>
                    البحث برقم اللوحة أو الموديل
                  </Text>
                </View>
                <View style={styles.cardArrow}>
                  <Text style={styles.arrowText}>◀</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>نظام محمي ومُشفر</Text>
            </View>
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  systemTitle: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '400' as const,
  },
  logoutButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -60,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 32,
  },
  menuCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#cbd5e1',
    fontWeight: '400' as const,
  },
  cardArrow: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 20,
    color: '#94a3b8',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  footerText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500' as const,
  },
});
