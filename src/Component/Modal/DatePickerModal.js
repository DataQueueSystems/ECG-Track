import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DatePickerModal({
  showDatePicker,
  setShowDatePicker,
  selectedDate,
  setSelectedDate,
}) {

  console.log(showDatePicker,'showDatePicker');
  
  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date !== undefined) {
      setSelectedDate(date);
    }
  };

  return (
    <View>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
