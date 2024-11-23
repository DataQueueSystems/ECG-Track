import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {TextInput, Button, useTheme} from 'react-native-paper';
import Header from '../../Component/Header';
import CustomText from '../../customText/CustomText';
import {useNavigation} from '@react-navigation/native';
import {showToast} from '../../../utils/Toast';
import {fonts} from '../../customText/fonts';
import firestore from '@react-native-firebase/firestore';

export default function ControlDoctor({route}) {
  const {screenName, userData} = route.params || {};
  const theme = useTheme();
  let navigation = useNavigation();
  const [spinner, setSpinner] = useState(false);
  const [errors, setErrors] = useState({});

  let isEdit = screenName == 'Edit Doctor';

  const [form, setForm] = useState({
    name: userData?.name || '',
    specialist: userData?.specialist || '',
    email: userData?.email || '',
    password: userData?.password || '',
    contact: userData?.contact || '',
    address: userData?.address || '',
  });

  // Handle input changes for both top-level and nested fields
  const handleInputChange = (field, value, nestedField = null) => {
    if (nestedField) {
      // Update nested fields (e.g., diagnosis type and status)
      setForm(prevForm => ({
        ...prevForm,
        [field]: {
          ...prevForm[field],
          [nestedField]: value,
        },
      }));
    } else {
      // Update top-level fields
      setForm(prevForm => ({
        ...prevForm,
        [field]: value,
      }));
    }
  };

  // Simple validation function
  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.specialist) newErrors.specialist = 'Specialist is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (!form.address) newErrors.address = 'Address is required';
    if (!form.contact) newErrors.contact = 'Contact number is required';
    else if (!/^\d{10}$/.test(form.contact))
      newErrors.contact = 'Contact number must be 10 digits';
    setErrors(newErrors);
    setSpinner(false);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSpinner(true);
    try {
      if (validateForm()) {
        // Add new user
        let defaultData = {
          ...form,
          role: 'doctor',
          Status: 'Active',
          create_date: new Date().toISOString(), // Current date and time in ISO format
        };

        //If Edit Screen then update the detail otherwise Add new user
        if (isEdit) {
          // await firestore().collection('users');
          await firestore()
            .collection('users')
            .doc(userData?.id)
            .update(defaultData);
          showToast('Updated successfully ...');
        } else {
          await firestore().collection('users').add(defaultData);
          showToast('Doctor Added  ...');
        }
        setSpinner(false);
        // navigation.goBack();
      }
    } catch (error) {
      setSpinner(false);

      console.log('Error is :', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1, backgroundColor: theme.colors.background}}>
      <Header screenName={screenName} />
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          label="Name"
          value={form.name}
          onChangeText={value => handleInputChange('name', value)}
          style={styles.input}
          contentStyle={styles.inputContent}
          mode="outlined"
        />

        {errors.name && (
          <CustomText
            style={[
              styles.errorText,
              {color: theme.colors.red, fontFamily: fonts.Light},
            ]}>
            {errors.name}
          </CustomText>
        )}
        <TextInput
          label="Specialist"
          value={form.specialist}
          onChangeText={value => handleInputChange('specialist', value)}
          style={styles.input}
          contentStyle={styles.inputContent}
          mode="outlined"
        />

        {errors.specialist && (
          <CustomText
            style={[
              styles.errorText,
              {color: theme.colors.red, fontFamily: fonts.Light},
            ]}>
            {errors.specialist}
          </CustomText>
        )}

        <TextInput
          label="Email"
          value={form.email}
          onChangeText={value => handleInputChange('email', value)}
          style={styles.input}
          contentStyle={styles.inputContent}
          mode="outlined"
          keyboardType="email-address"
        />

        {errors.email && (
          <CustomText
            style={[
              styles.errorText,
              {color: theme.colors.red, fontFamily: fonts.Light},
            ]}>
            {errors.email}
          </CustomText>
        )}

        {!isEdit && (
          <>
            <TextInput
              label="Password"
              value={form.password}
              onChangeText={value => handleInputChange('password', value)}
              style={styles.input}
              contentStyle={styles.inputContent}
              mode="outlined"
              secureTextEntry
            />
            {errors.password && (
              <CustomText
                style={[
                  styles.errorText,
                  {color: theme.colors.red, fontFamily: fonts.Light},
                ]}>
                {errors.password}
              </CustomText>
            )}
          </>
        )}

        <TextInput
          label="Contact Number"
          value={form.contact}
          onChangeText={value => handleInputChange('contact', value)}
          style={styles.input}
          contentStyle={styles.inputContent}
          mode="outlined"
          keyboardType="phone-pad"
        />
        {errors.contact && (
          <CustomText
            style={[
              styles.errorText,
              {color: theme.colors.red, fontFamily: fonts.Light},
            ]}>
            {errors.contact}
          </CustomText>
        )}

        <TextInput
          numberOfLines={3}
          label="Address"
          value={form.address}
          onChangeText={value => handleInputChange('address', value)}
          style={[styles.input, {height: 100}]}
          contentStyle={styles.inputContent}
          mode="outlined"
        />
        {errors.address && (
          <CustomText
            style={[
              styles.errorText,
              {color: theme.colors.red, fontFamily: fonts.Light},
            ]}>
            {errors.address}
          </CustomText>
        )}

        <TouchableOpacity
          onPress={spinner ? () => {} : handleSubmit}
          style={[styles.button, {backgroundColor: theme.colors.onBackground}]}>
          {!spinner ? (
            <CustomText
              style={[
                {
                  color: theme.colors.background,
                  fontSize: 16,
                  fontFamily: fonts.SemiBold,
                },
              ]}>
              Submit
            </CustomText>
          ) : (
            <ActivityIndicator size={24} color={theme.colors.background} />
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  input: {
    marginBottom: 15,
  },
  inputContent: {
    fontFamily: 'Poppins-Regular', // Replace with the actual font family name
  },
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    bottom: 10,
  },
});
