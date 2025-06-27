import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = () => {
  const navigation = useNavigation();

  const news = [
    {
      id: '1',
      title: 'Global Universities Adapt to Hybrid Learning Models',
      summary: 'Top institutions worldwide are blending online and in-person education post-pandemic',
      category: 'University News',
      date: 'May 15, 2023',
      image: require('../assets/news1.jpg')
    },
    {
      id: '2',
      title: 'New Study Reveals Benefits of Project-Based Learning',
      summary: 'Research shows 30% improvement in retention rates with hands-on approaches',
      category: 'Education Research',
      date: 'May 10, 2023',
      image: require('../assets/news2.jpg')
    }
  ];

  const tips = [
    {
      id: '1',
      title: '5 Time Management Strategies for Online Learners',
      icon: 'access-time'
    },
    {
      id: '2',
      title: 'How to Take Effective Digital Notes',
      icon: 'edit'
    },
    {
      id: '3',
      title: 'Building Productive Study Habits at Home',
      icon: 'home-work'
    }
  ];

  const featuredBooks = [
    {
      id: '1',
      title: 'Next Level Digital Tools',
      author: 'Rachel Karchmer-Klein',
      image: require('../assets/book1.jpg')
    },
    {
      id: '2',
      title: 'Academic Revolution',
      author: 'Justin Louis-Jean',
      image: require('../assets/book2.jpg')
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <ImageBackground 
        source={require('../assets/education-hero.jpg')}
        style={styles.heroContainer}
        imageStyle={styles.heroImage}
      >
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Education Insights</Text>
          <Text style={styles.heroSubtitle}>Stay informed about the latest in global education</Text>
          
          <View style={styles.authButtons}>
            <TouchableOpacity 
              style={[styles.authButton, styles.studentButton]}
              onPress={() => navigation.navigate('Login', { userType: 'student' })}
            >
              <Text style={styles.authButtonText}>Student Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.authButton, styles.teacherButton]}
              onPress={() => navigation.navigate('Login', { userType: 'teacher' })}
            >
              <Text style={styles.authButtonText}>Teacher Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Education News</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={news}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.newsCard}>
              <Image source={item.image} style={styles.newsImage} />
              <View style={styles.newsContent}>
                <Text style={styles.newsCategory}>{item.category}</Text>
                <Text style={styles.newsTitle}>{item.title}</Text>
                <Text style={styles.newsSummary}>{item.summary}</Text>
                <Text style={styles.newsDate}>{item.date}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.newsContainer}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Tips & Tricks</Text>
        <View style={styles.tipsContainer}>
          {tips.map(tip => (
            <View key={tip.id} style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Icon name={tip.icon} size={24} color="#6C5CE7" />
              </View>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <TouchableOpacity style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>Read More</Text>
                <Icon name="arrow-forward" size={16} color="#6C5CE7" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Books</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Browse All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={featuredBooks}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.bookCard}>
              <Image source={item.image} style={styles.bookImage} />
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthor}>{item.author}</Text>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.booksContainer}
        />
      </View>

      <View style={styles.newsletterContainer}>
        <Text style={styles.newsletterTitle}>Stay Updated</Text>
        <Text style={styles.newsletterText}>Subscribe to our weekly education digest</Text>
        <View style={styles.newsletterForm}>
          <TextInput
            placeholder="Your email address"
            placeholderTextColor="#999"
            style={styles.newsletterInput}
          />
          <TouchableOpacity style={styles.newsletterButton}>
            <Text style={styles.newsletterButtonText}>Subscribe</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  heroContainer: {
    height: 400,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  heroImage: {
    opacity: 0.9,
  },
  heroOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 24,
    borderRadius: 12,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 32,
  },
  authButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  authButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  studentButton: {
    backgroundColor: '#6C5CE7',
  },
  teacherButton: {
    backgroundColor: '#00B894',
  },
  authButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  section: {
    padding: 24,
    paddingBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3436',
  },
  seeAll: {
    color: '#6C5CE7',
    fontWeight: '600',
  },
  newsContainer: {
    paddingRight: 24,
  },
  newsCard: {
    width: 300,
    marginRight: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  newsImage: {
    width: '100%',
    height: 160,
  },
  newsContent: {
    padding: 16,
  },
  newsCategory: {
    color: '#6C5CE7',
    fontWeight: '600',
    fontSize: 12,
    marginBottom: 8,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 8,
  },
  newsSummary: {
    color: '#636E72',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  newsDate: {
    color: '#B2BEC3',
    fontSize: 12,
  },
  tipsContainer: {
    marginTop: 16,
  },
  tipCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F3F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 16,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    color: '#6C5CE7',
    fontWeight: '600',
    marginRight: 4,
  },
  booksContainer: {
    paddingRight: 24,
  },
  bookCard: {
    width: 160,
    marginRight: 16,
  },
  bookImage: {
    width: 160,
    height: 220,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#636E72',
    marginBottom: 8,
  },
  bookButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 12,
  },
  newsletterContainer: {
    margin: 24,
    padding: 24,
    backgroundColor: '#6C5CE7',
    borderRadius: 12,
  },
  newsletterTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  newsletterText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
  },
  newsletterForm: {
    flexDirection: 'row',
  },
  newsletterInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  newsletterButton: {
    backgroundColor: '#2D3436',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
  },
  newsletterButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default HomeScreen;