import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "خطأ 404", headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={['#0f2027', '#203a43', '#2c5364']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text style={styles.title}>الصفحة غير موجودة</Text>
            <Text style={styles.subtitle}>عذراً، الصفحة التي تبحث عنها غير موجودة</Text>

            <Link href="/" style={styles.link}>
              <Text style={styles.linkText}>العودة إلى الصفحة الرئيسية</Text>
            </Link>
          </View>
        </LinearGradient>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 32,
    textAlign: 'center',
  },
  link: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  linkText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600" as const,
  },
});
