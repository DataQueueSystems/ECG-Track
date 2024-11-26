
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from '../../customText/CustomText';
import { fonts } from '../../customText/fonts';

const StarRating = ({ totalStars = 5, onSubmit }) => {
  const [rating, setRating] = useState(0);

  const handleStarPress = (index) => {
    setRating(index + 1);
  };
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(rating);
    }
    console.log('User Rating:', rating);
  };

  return (
    <View style={styles.container}>
     
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  star: {
    marginHorizontal: 5,
  },
  starText: {
    fontSize: 40,
    color: '#ccc',
  },
 
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default StarRating;
