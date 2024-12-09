import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../Component/Header';
import {useTheme} from 'react-native-paper';
import CustomText from '../../customText/CustomText';
import {fonts} from '../../customText/fonts';
import {useNavigation} from '@react-navigation/native';
import { useAuthContext } from '../../context/GlobaContext';

export default function UploadForm() {
  let theme = useTheme();
  const {formData,setFormData}=useAuthContext();
  let navigation = useNavigation();
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

  const handleSubmit = async() => {
    console.log(formValues); // Handle form submission
   await setFormData(formValues)
    navigation.goBack();
  };
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1, backgroundColor: theme.colors.background}}>
        <Header screenName={'Form'} />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}>
          <View>
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
              onChangeText={value =>
                handleChange('electrocardiographic', value)
              }
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
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              {backgroundColor: theme.colors.onBackground},
            ]}
            onPress={handleSubmit}>
            <CustomText
              style={[
                {fontFamily: fonts.SemiBold, color: theme.colors.background},
              ]}>
              Submit
            </CustomText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
});
