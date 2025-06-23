import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";

const classes = [
  { 
    id: "1", 
    name: "Mathematics", 
    teacher: "Mr. Smith", 
    time: "Mon, Wed 10:00-11:30",
    room: "Room 203",
    color: '#6C5CE7'
  },
  { 
    id: "2", 
    name: "English Literature", 
    teacher: "Mrs. Johnson", 
    time: "Tue, Thu 09:00-10:30",
    room: "Room 105",
    color: '#00B894'
  },
  { 
    id: "3", 
    name: "Physics", 
    teacher: "Dr. Brown", 
    time: "Fri 13:00-15:00",
    room: "Lab 301",
    color: '#FD79A8'
  },
];

const ClassesScreen = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.classCard}>
      <View style={[styles.classColor, {backgroundColor: item.color}]} />
      <View style={styles.classInfo}>
        <Text style={styles.className}>{item.name}</Text>
        <Text style={styles.classTeacher}>{item.teacher}</Text>
        <View style={styles.classDetails}>
          <View style={styles.detailItem}>
            <Image source={require('../../assets/icon_time.png')} style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
          <View style={styles.detailItem}>
            <Image source={require('../../assets/icon_location.png')} style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.room}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Classes</Text>
        <TouchableOpacity>
          <Image source={require('../../assets/icon_search.png')} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={classes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  listContent: {
    paddingBottom: 20,
  },
  classCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  classColor: {
    width: 5,
    height: '100%',
    borderRadius: 5,
    marginRight: 15,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 5,
  },
  classTeacher: {
    fontSize: 14,
    color: '#636E72',
    marginBottom: 10,
  },
  classDetails: {
    marginTop: 5,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: '#636E72',
  },
  detailText: {
    fontSize: 12,
    color: '#636E72',
  },
});

export default ClassesScreen;