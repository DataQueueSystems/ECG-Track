import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import CustomText from '../../customText/CustomText';
import {Button, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Header from '../../Component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthContext} from '../../context/GlobaContext';
import axios from 'axios';
import {showToast} from '../../../utils/Toast';
import firestore from '@react-native-firebase/firestore';
import {fonts} from '../../customText/fonts';

export default function Register() {
  let theme = useTheme();
  const {setIsLogin, Checknetinfo} = useAuthContext();
  let navigation = useNavigation();
  const [spinner, setSpinner] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
  });

  const handleChange = (field, value) => {
    setForm(prevForm => ({
      ...prevForm,
      [field]: value,
    }));
  };

  const CheckDataBase = async () => {
    setSpinner(true);
    let isConnected = await Checknetinfo();
    if (!isConnected) {
      setSpinner(false);
      return false;
    }

    try {
      const snapShot = await firestore().collection('users').get();
      // if (snapShot.empty) {
      //   showToast('No user found');
      //   setSpinner(false);
      //   return false;
      // };

      // Flags to track existence of each field
      let emailExists = false;
      let contactExists = false;

      // Check each document for matches on the given fields
      snapShot.docs.forEach(doc => {
        const data = doc.data();
        if (data.email === form.email) emailExists = true;
        if (data.contact === form.contact) contactExists = true;
      });

      let newErrors = {};
      // Display relevant messages for each existing field
      if (emailExists) newErrors.email = 'Email already exists.';
      if (contactExists)
        newErrors.contact = 'Contact number already exists.';

      setErrors(newErrors);

      setSpinner(false);
      // If any of the fields exist, return false; otherwise, return true
      return !(emailExists || contactExists);
    } catch (error) {
      showToast('Something went wrong');
      setSpinner(false);
      return false;
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';

    if (!form.contact)
      newErrors.contact = 'Contact number is required';
    else if (!/^\d{10}$/.test(form.contact))
      newErrors.contact = 'Contact number must be 10 digits';
    setErrors(newErrors);
    setSpinner(false);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    setSpinner(false);
    if (validateForm()) {
      let CanAdd = await CheckDataBase(); // Checks for existing user
      if (CanAdd) {
        try {
          // Prepare default data for new user
          let defaultData = {
            ...form,
            role: 'user',
            Status: 'Active',
            create_date: new Date().toISOString(), // Current date and time in ISO format
          };
          // Add new user to Firestore
          await firestore().collection('users').add(defaultData);
          showToast('Registration successful!');
          navigation.goBack();
        } catch (error) {
          showToast('Error creating user');
        } finally {
          setSpinner(false);
        }
      } else {
        showToast('User already exists');
        setSpinner(false);
      }
    } else {
      showToast('Some invalid data');
    }
  };

  const handleLogin = () => {
    // navigation.navigate('Login');
    navigation.goBack();
  };
  let screenName = 'Register';

  return (
    <>
      <Header screenName={screenName} />
      <View
        style={[
          styles.mainContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          {/* Heading */}

          <View style={styles.headingContainer}>
            <CustomText style={[styles.authHead, {fontFamily: fonts.Bold}]}>
              Join
              <CustomText
                style={[
                  styles.authHead,
                  {fontFamily: fonts.Bold, color: theme.colors.appColor},
                ]}>
                {' '}
                ECG Track
              </CustomText>
            </CustomText>
            <CustomText
              style={{
                fontFamily: fonts.Regular,
              }}>
              Create your account to monitor your heart health and connect with
              experts.
            </CustomText>
          </View>

          {/* Inputs */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.colors.onBackground,
                  borderColor: theme.colors.onBackground,
                },
              ]}
              onChangeText={value => handleChange('name', value)}
              placeholder="Name"
              placeholderTextColor="#888"
              value={form?.name}
            />

            {errors.name && (
              <CustomText style={[styles.errorText, {color: theme.colors.red}]}>
                {errors.name}
              </CustomText>
            )}

            <TextInput
              style={[
                styles.input,
                {
                  color: theme.colors.onBackground,
                  borderColor: theme.colors.onBackground,
                },
              ]}
              onChangeText={value => handleChange('email', value)}
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              value={form?.email}
            />

            {errors.email && (
              <CustomText style={[styles.errorText, {color: theme.colors.red}]}>
                {errors.email}
              </CustomText>
            )}

            <TextInput
              style={[
                styles.input,
                {
                  color: theme.colors.onBackground,
                  borderColor: theme.colors.onBackground,
                },
              ]}
              placeholder="Contact Number"
              placeholderTextColor="#888"
              value={form.contact}
              onChangeText={value => handleChange('contact', value)}
            />

            {errors.contact && (
              <CustomText style={[styles.errorText, {color: theme.colors.red}]}>
                {errors.contact}
              </CustomText>
            )}

            <TextInput
              style={[
                styles.input,
                {
                  color: theme.colors.onBackground,
                  borderColor: theme.colors.onBackground,
                },
              ]}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={form.password}
              onChangeText={value => handleChange('password', value)}
            />

            {errors.password && (
              <CustomText style={[styles.errorText, {color: theme.colors.red}]}>
                {errors.password}
              </CustomText>
            )}

            <View style={{paddingBottom: 50}}>
              <Button
                onPress={spinner ? () => {} : handleRegister}
                mode="contained"
                style={[styles.btn, {backgroundColor: theme.colors.error}]}>
                {spinner ? (
                  <ActivityIndicator
                    size={24}
                    color={theme.colors.background}
                  />
                ) : (
                  <CustomText
                    style={{
                      color: '#fff',
                      fontFamily: fonts.Bold,
                    }}>
                    Register
                  </CustomText>
                )}
              </Button>
              <View
                style={{
                  marginVertical: 2,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <CustomText style={{fontFamily: fonts.LightItalic}}>
                  Already have an account?{' '}
                </CustomText>
                <TouchableOpacity onPress={handleLogin}>
                  <CustomText
                    style={{
                      color: theme.colors.blue,
                      fontFamily: fonts.LightItalic,
                    }}>
                    Login
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headingContainer: {
    paddingVertical: 15,
    paddingHorizontal: 16,
  },

  authHead: {
    fontSize: 26,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  btn: {
    padding: 4,
    marginTop: 20,
  },

  errorText: {
    fontSize: 12,
    bottom: 10,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 100,
  },
});
