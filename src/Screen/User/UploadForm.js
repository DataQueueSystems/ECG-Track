import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../Component/Header';
import {RadioButton, useTheme, TextInput} from 'react-native-paper';
import CustomText from '../../customText/CustomText';
import {fonts} from '../../customText/fonts';
import {useNavigation} from '@react-navigation/native';
import {useAuthContext} from '../../context/GlobaContext';
import CustomDropdown from './DropeDown';

export default function UploadForm({route}) {
  let {setFormData} = route.params;
  let theme = useTheme();
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

  const [errors, setErrors] = useState({}); // State to store errors

  const handleChange = (field, value) => {
    setFormValues(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Check if required fields are filled
    if (!formValues.age) newErrors.age = 'Age is required';
    if (!formValues.gender) newErrors.gender = 'Gender is required';
    if (!formValues.chestpain)
      newErrors.chestpain = 'Chest Pain Type is required';
    if (!formValues.restingBP)
      newErrors.restingBP = 'Resting Blood Pressure is required';
    if (!formValues.serumcholestrol)
      newErrors.serumcholestrol = 'Serum Cholesterol is required';
    if (!formValues.fastingbloodsugar)
      newErrors.fastingbloodsugar = 'Fasting Blood Sugar is required';
    if (!formValues.electrocardiographic)
      newErrors.electrocardiographic =
        'Electrocardiographic Results are required';
    if (!formValues.maxheartrate)
      newErrors.maxheartrate = 'Max Heart Rate is required';
    if (!formValues.exerciseangia)
      newErrors.exerciseangia = 'Exercise Induced Angina is required';
    if (!formValues.oldpeak) newErrors.oldpeak = 'Old Peak is required';
    if (!formValues.slope) newErrors.slope = 'Slope of Peak is required';
    if (!formValues.noofmajorvessels)
      newErrors.noofmajorvessels = 'Number of Major Vessels is required';

    // Add any other specific validations if needed (like numeric validation)
    if (formValues.age && isNaN(formValues.age))
      newErrors.age = 'Age must be a number';

    // Set error messages
    setErrors(newErrors);

    // Return true if there are no errors, else false
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const isValid = validateForm(); // Validate form before submission
    if (!isValid) return; // Stop submission if validation fails
    await setFormData(formValues);
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
              mode="outlined"
              style={styles.input}
              placeholder="Enter Age"
              value={formValues.age}
              onChangeText={value => handleChange('age', value)}
              keyboardType="numeric"
              label={'Age'}
            />
            {errors.age && (
              <CustomText
                style={[styles.errorText, {color: theme.colors.error}]}>
                {errors.age}
              </CustomText>
            )}
            {/* Gender Selection with Radio Buttons */}
            <View style={styles.radioGroup}>
              <CustomText style={styles.radioLabel}>Gender</CustomText>
              <View style={styles.radioContainer}>
                <RadioButton
                  value="male"
                  status={formValues.gender === '0' ? 'checked' : 'unchecked'}
                  onPress={() => handleChange('gender', '0')}
                />
                <CustomText style={styles.radioLabel}>Male</CustomText>
              </View>
              <View style={styles.radioContainer}>
                <RadioButton
                  value="female"
                  status={formValues.gender === '1' ? 'checked' : 'unchecked'}
                  onPress={() => handleChange('gender', '1')}
                />
                <CustomText style={styles.radioLabel}>Female</CustomText>
              </View>
            </View>
            {errors.gender && (
              <CustomText
                style={[styles.errorText, {color: theme.colors.error}]}>
                {errors.gender}
              </CustomText>
            )}
            {/* Chest Pain Input */}
        
            <CustomDropdown
              label="Chest Pain Type"
              options={[
                {value: '0', label: 'Typical Angina'},
                {value: '1', label: 'Atypical Angina'},
                {value: '2', label: 'Non-Anginal Pain'},
                {value: '3', label: 'Asymptomatic'},
              ]}
              value={formValues.chestpain}
              onChange={value => handleChange('chestpain', value)}
            />

            {errors.chestpain && (
              <CustomText
                style={[styles.errorText, {color: theme.colors.error}]}>
                {errors.chestpain}
              </CustomText>
            )}
         
         
            {/* Resting Blood Pressure Input */}
            <TextInput
              mode="outlined"
              style={styles.input}
              placeholder="Enter Resting Blood Pressure [94-200 (in mm HG)]"
              value={formValues.restingBP}
              onChangeText={value => handleChange('restingBP', value)}
              keyboardType="numeric"
              label={'Resting Blood Pressure'}
            />
            {errors.restingBP && (
              <CustomText
                style={[styles.errorText, {color: theme.colors.error}]}>
                {errors.restingBP}
              </CustomText>
            )}
            {/* Serum Cholesterol Input */}
            <TextInput
              mode="outlined"
              style={styles.input}
              placeholder="Enter Serum Cholestrol (126-564 )"
              value={formValues.serumcholestrol}
              onChangeText={value => handleChange('serumcholestrol', value)}
              keyboardType="numeric"
              label={'Serum Cholestrol'}
            />
            {errors.serumcholestrol && (
              <CustomText
                style={[styles.errorText, {color: theme.colors.error}]}>
                {errors.serumcholestrol}
              </CustomText>
            )}
            {/* Fasting Blood Sugar Input */}
            <TextInput
              mode="outlined"
              style={styles.input}
              placeholder="Enter Fasting Blood Sugar (0 or 1)"
              value={formValues.fastingbloodsugar}
              onChangeText={value => handleChange('fastingbloodsugar', value)}
              keyboardType="numeric"
              label={'Fasting Blood Sugar'}
            />
            {errors.fastingbloodsugar && (
              <CustomText
                style={[styles.errorText, {color: theme.colors.error}]}>
                {errors.fastingbloodsugar}
              </CustomText>
            )}
            
            <CustomDropdown
  label="Electrocardiographic Results"
  options={[
    { value: '0', label: 'Normal' },
    { value: '1', label: 'ST-T Wave Abnormality' },
    { value: '2', label: 'Probable/Definite Left Ventricular Hypertrophy' },
  ]}
  value={formValues.electrocardiographic}
  onChange={(value) => handleChange('electrocardiographic', value)}
/>
{errors.electrocardiographic && (
  <CustomText
    style={[styles.errorText, { color: theme.colors.error }]}>
    {errors.electrocardiographic}
  </CustomText>
)}


            {/* Max Heart Rate Input */}
            <TextInput
              mode="outlined"
              style={styles.input}
              placeholder="Enter Max Heart Rate"
              value={formValues.maxheartrate}
              onChangeText={value => handleChange('maxheartrate', value)}
              keyboardType="numeric"
              label={'Max Heart Rate'}
            />
            {errors.maxheartrate && (
              <CustomText
                style={[styles.errorText, {color: theme.colors.error}]}>
                {errors.maxheartrate}
              </CustomText>
            )}
            {/* Exercise Induced Angina Input */}
            <TextInput
              mode="outlined"
              style={styles.input}
              placeholder="Enter Exercise Induced Angina (0 or 1)"
              value={formValues.exerciseangia}
              onChangeText={value => handleChange('exerciseangia', value)}
              keyboardType="numeric"
              label={' Exercise Induced Angina'}
            />
            {errors.exerciseangia && (
              <CustomText
                style={[styles.errorText, {color: theme.colors.error}]}>
                {errors.exerciseangia}
              </CustomText>
            )}
            {/* ST Depression (Old Peak) Input */}
            <TextInput
              mode="outlined"
              style={styles.input}
              placeholder="Enter Old Peak"
              value={formValues.oldpeak}
              onChangeText={value => handleChange('oldpeak', value)}
              keyboardType="numeric"
              label={'Old Peak'}
            />
            {errors.oldpeak && (
              <CustomText
                style={[styles.errorText, {color: theme.colors.error}]}>
                {errors.oldpeak}
              </CustomText>
            )}
            {/* Slope of Peak Exercise Input */}
        
            <CustomDropdown
  label="Slope of Peak Exercise"
  options={[
    { value: '1', label: 'Upsloping' },
    { value: '2', label: 'Flat' },
    { value: '3', label: 'Downsloping' },
  ]}
  value={formValues.slope}
  onChange={(value) => handleChange('slope', value)}
/>
{errors.slope && (
  <CustomText
    style={[styles.errorText, { color: theme.colors.error }]}>
    {errors.slope}
  </CustomText>
)}
            {/* Number of Major Vessels Input */}
            <TextInput
              mode="outlined"
              style={styles.input}
              placeholder="Enter Number of Major Vessels (0-3)"
              value={formValues.noofmajorvessels}
              onChangeText={value => handleChange('noofmajorvessels', value)}
              keyboardType="numeric"
              label={'Number of Major Vessels'}
            />
            {errors.noofmajorvessels && (
              <CustomText
                style={[styles.errorText, {color: theme.colors.error}]}>
                {errors.noofmajorvessels}
              </CustomText>
            )}
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
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  radioGroup: {
    marginBottom: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radioLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginLeft: 8,
  },
  selectedRadio: {
    borderColor: '#4caf50',
  },
  errorText: {
    fontSize: 12,
    bottom: 10,
    fontFamily: 'Poppins-Regular',
  },
});
