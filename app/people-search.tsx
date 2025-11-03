import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, User, Phone, ArrowLeft, FileText } from 'lucide-react-native';
import { databaseService } from '@/services/database';
import { PersonRecord } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SearchType = 'name' | 'phone';

export default function PeopleSearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchType, setSearchType] = useState<SearchType>('name');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [results, setResults] = useState<PersonRecord[]>([]);
  const [searchTime, setSearchTime] = useState<number>(0);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    setProgress(0);
    setResults([]);
    setHasSearched(true);

    try {
      const result = await databaseService.searchPeople(
        searchQuery,
        searchType,
        (prog) => setProgress(prog)
      );

      setResults(result.results);
      setSearchTime(result.searchTime);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f2027', '#203a43', '#2c5364']}
        style={styles.gradient}
      >
        <View style={[styles.safeArea, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <ArrowLeft size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>البحث عن الأشخاص</Text>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.searchTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  searchType === 'name' && styles.typeButtonActive,
                ]}
                onPress={() => setSearchType('name')}
                activeOpacity={0.7}
              >
                <User
                  size={20}
                  color={searchType === 'name' ? '#3b82f6' : '#94a3b8'}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    searchType === 'name' && styles.typeButtonTextActive,
                  ]}
                >
                  الاسم
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  searchType === 'phone' && styles.typeButtonActive,
                ]}
                onPress={() => setSearchType('phone')}
                activeOpacity={0.7}
              >
                <Phone
                  size={20}
                  color={searchType === 'phone' ? '#3b82f6' : '#94a3b8'}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    searchType === 'phone' && styles.typeButtonTextActive,
                  ]}
                >
                  رقم الهاتف
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder={
                  searchType === 'name'
                    ? 'أدخل الاسم للبحث'
                    : 'أدخل رقم الهاتف للبحث'
                }
                placeholderTextColor="#64748b"
                value={searchQuery}
                onChangeText={setSearchQuery}
                editable={!isSearching}
                keyboardType={searchType === 'phone' ? 'phone-pad' : 'default'}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
                disabled={isSearching}
                activeOpacity={0.8}
              >
                <Search size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {isSearching && (
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>جارٍ البحث...</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                </View>
                <Text style={styles.progressPercentage}>
                  {Math.round(progress * 100)}%
                </Text>
              </View>
            )}

            <ScrollView
              style={styles.resultsContainer}
              contentContainerStyle={styles.resultsContent}
              showsVerticalScrollIndicator={false}
            >
              {!isSearching && hasSearched && (
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultsHeaderText}>
                    {results.length > 0
                      ? `تم العثور على ${results.length} نتيجة`
                      : 'لا توجد نتائج'}
                  </Text>
                  {results.length > 0 && (
                    <Text style={styles.searchTimeText}>
                      وقت البحث: {searchTime}ms
                    </Text>
                  )}
                </View>
              )}

              {results.map((person) => (
                <View key={person.id} style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <View style={styles.resultIconContainer}>
                      <FileText size={24} color="#3b82f6" />
                    </View>
                    <View style={styles.resultTitleContainer}>
                      <Text style={styles.resultName}>{person.name}</Text>
                      <Text style={styles.resultTable}>
                        الجدول: {person.tableName}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.resultDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>الرقم الوطني:</Text>
                      <Text style={styles.detailValue}>
                        {person.nationalId || 'غير متوفر'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>الهاتف الأساسي:</Text>
                      <Text style={styles.detailValue}>{person.dial}</Text>
                    </View>
                    {person.dial2 && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>الهاتف الثانوي:</Text>
                        <Text style={styles.detailValue}>{person.dial2}</Text>
                      </View>
                    )}
                    {person.dial3 && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>الهاتف الثالث:</Text>
                        <Text style={styles.detailValue}>{person.dial3}</Text>
                      </View>
                    )}
                    {person.dial4 && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>الهاتف الرابع:</Text>
                        <Text style={styles.detailValue}>{person.dial4}</Text>
                      </View>
                    )}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>العنوان:</Text>
                      <Text style={styles.detailValue}>
                        {person.address || 'غير متوفر'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>تاريخ الميلاد:</Text>
                      <Text style={styles.detailValue}>
                        {person.dateOfBirth || 'غير متوفر'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>المهنة:</Text>
                      <Text style={styles.detailValue}>
                        {person.occupation || 'غير متوفر'}
                      </Text>
                    </View>
                    {person.notes && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>ملاحظات:</Text>
                        <Text style={styles.detailValue}>{person.notes}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  searchTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  typeButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3b82f6',
  },
  typeButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  typeButtonTextActive: {
    color: '#3b82f6',
  },
  searchInputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchButton: {
    width: 52,
    height: 52,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  progressPercentage: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    paddingBottom: 20,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsHeaderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  searchTimeText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultTitleContainer: {
    flex: 1,
  },
  resultName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 2,
  },
  resultTable: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  resultDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600' as const,
    flex: 1,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500' as const,
    flex: 2,
    textAlign: 'right',
  },
});
