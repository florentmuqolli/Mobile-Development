import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert,
  Animated, Easing
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BackArrowIcon } from '../../../assets/Icons';
import axiosInstance from '../../../services/axiosInstance';
import Toast from 'react-native-toast-message';
import ScreenWrapper from '../../../hooks/ScreenWrapper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AdminPendingRequestsScreen = () => {
  const navigation = useNavigation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchRequests();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/pending-requests');
      setRequests(res.data);
    } catch {
      Toast.show({ type: 'error', text1: 'Error fetching requests' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axiosInstance.post(`/admin/approve-request/${id}`);
      await fetchRequests();
      Toast.show({ type: 'success', text1: 'Request approved' });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Action failed',
        text2: err.response?.data?.message || 'Server error',
      });
    }
  };

  const handleDeny = async (id) => {
    try {
      await axiosInstance.delete(`/admin/deny-request/${id}`);
      await fetchRequests();
      Toast.show({ type: 'success', text1: 'Request denied' });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Action failed',
        text2: err.response?.data?.message || 'Server error',
      });
    }
  };

  const confirmAction = (action, id) => {
    Alert.alert(
      action === 'approve' ? 'Approve Request' : 'Deny Request',
      `Are you sure you want to ${action} this request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            action === 'approve' ? handleApprove(id) : handleDeny(id);
          },
        },
      ],
    );
  };

  const filtered = filter === 'all'
    ? requests
    : requests.filter(r => r.status === filter);

  const renderItem = ({ item, index }) => (
    <Animated.View 
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0]
            })
          }],
          marginTop: index === 0 ? 0 : 12
        }
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: getStatusColor(item.status).avatarBg }]}>
            <Icon 
              name={item.role === 'professor' ? 'school' : 'person'} 
              size={20} 
              color="#FFF" 
            />
          </View>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.role}>{item.role}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status).bg }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Icon name="email" size={16} color="#636E72" />
          <Text style={styles.email}>{item.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="calendar-today" size={16} color="#636E72" />
          <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      {item.status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.approveButton]}
            onPress={() => confirmAction('approve', item._id)}
          >
            <Icon name="check" size={18} color="#FFF" />
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.denyButton]}
            onPress={() => confirmAction('deny', item._id)}
          >
            <Icon name="close" size={18} color="#FFF" />
            <Text style={styles.buttonText}>Deny</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return { bg: '#E3F9E5', text: '#00B894', avatarBg: '#00B894' };
      case 'denied': return { bg: '#FFEBEE', text: '#D63031', avatarBg: '#D63031' };
      default: return { bg: '#FFF8E1', text: '#FDCB6E', avatarBg: '#FDCB6E' };
    }
  };

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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackArrowIcon/>
          </TouchableOpacity>
          <Text style={styles.title}>Requests Management</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.filterContainer}>
          {['all', 'pending', 'approved', 'denied'].map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterButton, filter === f && styles.activeFilter]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="inbox" size={48} color="#DFE6E9" />
              <Text style={styles.emptyText}>No requests found</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#F1F3F5',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: '#6C5CE7',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#636E72',
  },
  activeFilterText: {
    color: '#FFF',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  role: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cardBody: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: '#636E72',
    marginLeft: 8,
  },
  date: {
    fontSize: 12,
    color: '#636E72',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  approveButton: {
    backgroundColor: '#00B894',
  },
  denyButton: {
    backgroundColor: '#D63031',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#B2BEC3',
    marginTop: 16,
  },
});

export default AdminPendingRequestsScreen;