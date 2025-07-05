import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../../services/axiosInstance'; 
import ScreenWrapper from '../../hooks/ScreenWrapper';
import { SearchIcon, BackArrowIcon} from '../../assets/Icons';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';

const GradesScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/grades/my'); 
      setGrades(res.data);
    } catch (err) {
      console.error('Error fetching grades:', err);
      Toast.show({
        type: "error",
        text1: "Failed to fetch grades",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const filteredGrades = grades.filter(grade =>
    grade.class_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderGradeCard = ({ item }) => (
    <TouchableOpacity style={styles.gradeCard}>
      <LinearGradient
        colors={['#6C5CE7', '#A89BEC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradeGradient}
      >

        <View style={styles.gradeHeader}>
          <Text style={styles.classTitle} numberOfLines={1}>{item.class_title || 'No Class Title'}</Text>
          <View style={styles.gradePill}>
            <Text style={styles.gradeValue}>{item.grade || 'N/A'}</Text>
          </View>
        </View>
        
        <View style={styles.gradeDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Course ID:</Text>
            <Text style={styles.detailValue}>{item.id || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Student ID:</Text>
            <Text style={styles.detailValue}>{item.student_id || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>
              {item.graded_at ? new Date(item.graded_at).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <BackArrowIcon/>
          </TouchableOpacity>
          <Text style={styles.title}>Grades Overview</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <View style={styles.searchContainer}>
          <SearchIcon style={styles.searchIcon}/>
          <TextInput
            style={styles.searchInput}
            placeholder="Search grades..."
            placeholderTextColor="#A0A3BD"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{grades.length}</Text>
            <Text style={styles.statLabel}>Total Grades</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {grades.length > 0 ? 
                (grades.reduce((sum, grade) => sum + parseFloat(grade.grade || 0), 0) / grades.length).toFixed(1) : 
                '0.0'}
            </Text>
            <Text style={styles.statLabel}>Average</Text>
          </View>
        </View>

        {filteredGrades.length > 0 ? (
          <FlatList
            data={filteredGrades}
            renderItem={renderGradeCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No grades found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try a different search term' : 'Grades will appear here once added'}
            </Text>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3436',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6C5CE7',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#636E72',
  },
  listContainer: {
    paddingBottom: 30,
  },
  gradeCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  gradeGradient: {
    padding: 20,
  },
  gradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    flex: 1,
    marginRight: 10,
  },
  gradePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  gradeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  gradeDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#636E72',
    textAlign: 'center',
  },
});

export default GradesScreen;