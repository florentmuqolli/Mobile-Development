import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import ScreenWrapper from "../../hooks/ScreenWrapper";

const CalendarScreen = () => {
  return (
    <ScreenWrapper>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
        <TouchableOpacity style={styles.addButton}>
          <Image source={require('../../assets/icon_add.png')} style={styles.addIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.monthSelector}>
        <TouchableOpacity>
          <Image source={require('../../assets/icon_arrow_left.png')} style={styles.arrowIcon} />
        </TouchableOpacity>
        <Text style={styles.monthText}>June 2025</Text>
        <TouchableOpacity>
          <Image source={require('../../assets/icon_arrow_right.png')} style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekDays}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Text key={day} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {Array.from({length: 35}).map((_, index) => {
          const day = index + 1;
          const hasEvent = day === 15 || day === 20 || day === 25;
          
          return (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.dayCell, 
                day === 23 && styles.currentDay,
                hasEvent && styles.hasEventDay
              ]}
            >
              <Text style={[
                styles.dayText,
                day === 23 && styles.currentDayText
              ]}>
                {day <= 30 ? day : ''}
              </Text>
              {hasEvent && <View style={styles.eventDot} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.eventsSection}>
        <Text style={styles.eventsTitle}>Today's Events</Text>
        <View style={styles.eventCard}>
          <View style={[styles.eventColor, {backgroundColor: '#6C5CE7'}]} />
          <View style={styles.eventDetails}>
            <Text style={styles.eventTime}>10:00 - 11:30</Text>
            <Text style={styles.eventName}>Mathematics Class</Text>
            <Text style={styles.eventLocation}>Room 203</Text>
          </View>
        </View>
      </View>
    </View>
    </ScreenWrapper>
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
  addButton: {
    backgroundColor: '#6C5CE7',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFF',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekDayText: {
    width: 40,
    textAlign: 'center',
    color: '#636E72',
    fontSize: 12,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 20,
  },
  dayText: {
    color: '#2D3436',
    fontSize: 14,
  },
  currentDay: {
    backgroundColor: '#6C5CE7',
  },
  currentDayText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  hasEventDay: {
    position: 'relative',
  },
  eventDot: {
    position: 'absolute',
    bottom: 5,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6C5CE7',
  },
  eventsSection: {
    marginTop: 20,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 15,
  },
  eventCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventColor: {
    width: 5,
    height: '100%',
    borderRadius: 5,
    marginRight: 15,
  },
  eventDetails: {
    flex: 1,
  },
  eventTime: {
    color: '#636E72',
    fontSize: 12,
    marginBottom: 5,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 5,
  },
  eventLocation: {
    color: '#636E72',
    fontSize: 12,
  },
});

export default CalendarScreen;