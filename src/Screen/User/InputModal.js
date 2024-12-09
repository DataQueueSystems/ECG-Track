import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const InputFormModal = () => {
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [formValues, setFormValues] = useState({
    age: '',
    gender: '',
    chestpain: '',
    restingBP: '',
    serumcholestrol: '',
    fastingbloodsugar: '',
    electrocardiographic: '',
    maxheartrate: '',
    exerciseangia: '',
    oldpeak: '',
    slope: '',
    noofmajorvessels: '',
  });

  const handleChange = (field, value) => {
    setFormValues(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log(formValues); // Handle form submission
    setModalVisible(false); // Close the modal after submission
  };

  return (
    <View style={styles.container}>
      {/* Button to Open Modal */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.openButton}>
        <Text style={styles.buttonText}>Open Form</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Enter Patient Information</Text>

          {/* Age Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Age"
            value={formValues.age}
            onChangeText={value => handleChange('age', value)}
            keyboardType="numeric"
          />

          {/* Gender Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Gender"
            value={formValues.gender}
            onChangeText={value => handleChange('gender', value)}
          />

          {/* Chest Pain Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Chest Pain Type"
            value={formValues.chestpain}
            onChangeText={value => handleChange('chestpain', value)}
          />

          {/* Resting Blood Pressure Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Resting Blood Pressure"
            value={formValues.restingBP}
            onChangeText={value => handleChange('restingBP', value)}
            keyboardType="numeric"
          />

          {/* Serum Cholesterol Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Serum Cholestrol"
            value={formValues.serumcholestrol}
            onChangeText={value => handleChange('serumcholestrol', value)}
            keyboardType="numeric"
          />

          {/* Fasting Blood Sugar Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Fasting Blood Sugar"
            value={formValues.fastingbloodsugar}
            onChangeText={value => handleChange('fastingbloodsugar', value)}
            keyboardType="numeric"
          />

          {/* Resting Electrocardiographic Results Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Electrocardiographic Results"
            value={formValues.electrocardiographic}
            onChangeText={value => handleChange('electrocardiographic', value)}
            keyboardType="numeric"
          />

          {/* Max Heart Rate Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Max Heart Rate"
            value={formValues.maxheartrate}
            onChangeText={value => handleChange('maxheartrate', value)}
            keyboardType="numeric"
          />

          {/* Exercise Induced Angina Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Exercise Induced Angina"
            value={formValues.exerciseangia}
            onChangeText={value => handleChange('exerciseangia', value)}
            keyboardType="numeric"
          />

          {/* ST Depression (Old Peak) Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Old Peak"
            value={formValues.oldpeak}
            onChangeText={value => handleChange('oldpeak', value)}
            keyboardType="numeric"
          />

          {/* Slope of Peak Exercise Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Slope of Peak"
            value={formValues.slope}
            onChangeText={value => handleChange('slope', value)}
            keyboardType="numeric"
          />

          {/* Number of Major Vessels Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Number of Major Vessels"
            value={formValues.noofmajorvessels}
            onChangeText={value => handleChange('noofmajorvessels', value)}
            keyboardType="numeric"
          />

          {/* Submit Button */}
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  openButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: 250,
    height: 40,
    marginBottom: 10,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default InputFormModal;
