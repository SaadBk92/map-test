import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import moment from 'moment';

const HomeScreen = () => {
  const [currentMonth, setCurrentMonth] = useState(moment().format('YYYY-MM'));
  const [dates, setDates] = useState(getDates(currentMonth));
  const [modalVisible, setModalVisible] = useState(false);

  function getDates(month) {
    const daysInMonth = moment(month).daysInMonth();
    const startOfMonth = moment(month).startOf('month');
    return Array.from({ length: daysInMonth }, (_, i) => startOfMonth.clone().add(i, 'days').format('YYYY-MM-DD'));
  }

  const changeMonth = (direction) => {
    const newMonth = direction === 'next' ? moment(currentMonth).add(1, 'month') : moment(currentMonth).subtract(1, 'month');
    setCurrentMonth(newMonth.format('YYYY-MM'));
    setDates(getDates(newMonth.format('YYYY-MM')));
  };

  const openMonthSelector = () => {
    setModalVisible(true);
  };

  const selectMonth = (month) => {
    setCurrentMonth(month);
    setDates(getDates(month));
    setModalVisible(false);
  };

  const months = moment.months();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthText}>{moment(currentMonth).format('MMMM YYYY')}</Text>
        <Button title="Select month" onPress={openMonthSelector} />
      </View>
      <FlatList
        data={dates}
        renderItem={({ item }) => {
          console.log('item',item) 
          return(
            <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{moment(item).format('D')}</Text>
            <Text style={styles.dayText}>{moment(item).format('ddd')[0]}</Text>
          </View>
          )
        }}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        style={{ height: 15 }}
      >
        <View  >
          <View >
            <Text >Select a Month</Text>
            <FlatList
              data={months}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => selectMonth(moment().month(index).startOf('month').format('YYYY-MM'))}>
                  <Text >{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  dateText: {
    fontSize: 16,
  },
});

export default HomeScreen;