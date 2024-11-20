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

export default function ControlDoctor({route}) {
  const {screenName, userData} = route.params || {};
  const theme = useTheme();
  let navigation = useNavigation();
  const [spinner, setSpinner] = useState(false);
  const [errors, setErrors] = useState({});

  let isEdit = screenName == 'Edit Doctor';

  const [form, setForm] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    password: userData?.password || '',
    contact: userData?.contact || '',
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

  const handleSubmit = async () => {
    showToast('Submitting .....');
  };

  // Update the status in the form
  const handleStatus = status => {
    setForm(prevForm => ({
      ...prevForm,
      diagnosis: {
        ...prevForm.diagnosis,
        status: status,
      },
    }));
  };

  const handleuserPress = () => {
    showToast("You can't change the Status");
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
          <CustomText style={[styles.errorText, {color: theme.colors.red}]}>
            {errors.name}
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
          <CustomText style={[styles.errorText, {color: theme.colors.red}]}>
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
              <CustomText style={[styles.errorText, {color: theme.colors.red}]}>
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
          <CustomText style={[styles.errorText, {color: theme.colors.red}]}>
            {errors.contact}
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
