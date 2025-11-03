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
import { Search, Car, FileText, ArrowLeft } from 'lucide-react-native';
import { Image } from 'expo-image';
import { databaseService } from '@/services/database';
import { CarRecord } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SearchType = 'plate' | 'model';

export default function CarsSearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchType, setSearchType] = useState<SearchType>('plate');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [results, setResults] = useState<CarRecord[]>([]);
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
      const result = await databaseService.searchCars(
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
              <Text style={styles.headerTitle}>البحث عن السيارات</Text>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.searchTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  searchType === 'plate' && styles.typeButtonActive,
                ]}
                onPress={() => setSearchType('plate')}
                activeOpacity={0.7}
              >
                <FileText
                  size={20}
                  color={searchType === 'plate' ? '#10b981' : '#94a3b8'}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    searchType === 'plate' && styles.typeButtonTextActive,
                  ]}
                >
                  رقم اللوحة
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  searchType === 'model' && styles.typeButtonActive,
                ]}
                onPress={() => setSearchType('model')}
                activeOpacity={0.7}
              >
                <Car
                  size={20}
                  color={searchType === 'model' ? '#10b981' : '#94a3b8'}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    searchType === 'model' && styles.typeButtonTextActive,
                  ]}
                >
                  الموديل
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder={
                  searchType === 'plate'
                    ? 'أدخل رقم اللوحة للبحث'
                    : 'أدخل موديل السيارة للبحث'
                }
                placeholderTextColor="#64748b"
                value={searchQuery}
                onChangeText={setSearchQuery}
                editable={!isSearching}
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

              {results.map((car) => (
                <View key={car.id} style={styles.resultCard}>
                  {car.imageUrl && (
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: car.imageUrl }}
                        style={styles.carImage}
                        contentFit="cover"
                        transition={200}
                      />
                    </View>
                  )}

                  <View style={styles.resultHeader}>
                    <View style={styles.resultIconContainer}>
                      <Car size={24} color="#10b981" />
                    </View>
                    <View style={styles.resultTitleContainer}>
                      <Text style={styles.resultPlate}>{car.plate}</Text>
                      <Text style={styles.resultModel}>{car.model}</Text>
                    </View>
                  </View>

                  <View style={styles.resultDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>اللون:</Text>
                      <Text style={styles.detailValue}>
                        {car.color || 'غير متوفر'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>السنة:</Text>
                      <Text style={styles.detailValue}>
                        {car.year || 'غير متوفر'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>اسم المالك:</Text>
                      <Text style={styles.detailValue}>
                        {car.ownerName || 'غير متوفر'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>هاتف المالك:</Text>
                      <Text style={styles.detailValue}>
                        {car.ownerPhone || 'غير متوفر'}
                      </Text>
                    </View>
                    {car.violations && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>المخالفات:</Text>
                        <Text style={styles.detailValue}>{car.violations}</Text>
                      </View>
                    )}
                    {car.notes && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>ملاحظات:</Text>
                        <Text style={styles.detailValue}>{car.notes}</Text>
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
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981',
  },
  typeButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  typeButtonTextActive: {
    color: '#10b981',
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
    backgroundColor: '#10b981',
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
    backgroundColor: '#10b981',
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
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  carImage: {
    width: '100%',
    height: '100%',
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
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultTitleContainer: {
    flex: 1,
  },
  resultPlate: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 2,
  },
  resultModel: {
    color: '#94a3b8',
    fontSize: 16,
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
