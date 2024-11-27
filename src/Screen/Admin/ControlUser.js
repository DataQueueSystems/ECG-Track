import React, {useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Image,
} from 'react-native';
import {TextInput, Button, useTheme} from 'react-native-paper';
import Header from '../../Component/Header';
import CustomText from '../../customText/CustomText';
import {useNavigation} from '@react-navigation/native';
import {showToast} from '../../../utils/Toast';
import {fonts} from '../../customText/fonts';
import firestore from '@react-native-firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageModal from '../../Component/Modal/ImageModal';
import {Iconify} from 'react-native-iconify';
import {uploadImageToCloudinary} from '../../cloudinary';
import {useAuthContext} from '../../context/GlobaContext';

export default function ControlDoctor({route}) {
  const {screenName, userData} = route.params || {};
  const {Checknetinfo} = useAuthContext();
  const theme = useTheme();
  let navigation = useNavigation();
  const [spinner, setSpinner] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    contact: userData?.contact || '',
    address: userData?.address || '',
    profile_image: userData?.profile_image || '',
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
    if (!form.email) newErrors.email = 'Email is required';
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
    const isConnected = await Checknetinfo();
    if (!isConnected) {
      setSpinner(false);
      return; // Do not proceed if there is no internet connection
    }
    try {
      if (validateForm()) {
        // Add new user
        let defaultData = {
          ...form,
          Status: 'Active',
          create_date: new Date().toISOString(), // Current date and time in ISO format
        };

        if (selectedImageUri) {
          // Wait for the image upload to complete and get the image URL
          const uploadedImageUrl = await uploadImageToCloudinary(
            form?.name,
            // form?.profile_image,
            selectedImageUri,
            `ECG-${userData?.role}` || 'ECGTRACK',
          );
          defaultData.profile_image = uploadedImageUrl;
          // If the image upload failed, handle it
          if (!uploadedImageUrl) {
            console.error('Image upload failed');
            setSpinner(true);
            return;
          }
        }

        await firestore()
          .collection('users')
          .doc(userData?.id)
          .update(defaultData);
        showToast('Updated successfully ...');
        await setSpinner(false);

        // navigation.goBack();
      }
    } catch (error) {
      setSpinner(false);
      console.log('Error is :', error);
    }
  };

  const [visible, setVisible] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [previmage, setPrevimage] = useState(null);
  // Function to handle opening the modal with animation
  const handlePrevImage = () => {
    setVisible(true);
    setPrevimage(selectedImageUri);
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const [selectedImageUri, setSelectedImageUri] = useState(null);
  // Function to pick an image from the library
  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const imageUri = response.assets[0].uri;
        setSelectedImageUri(imageUri);
      }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1, backgroundColor: theme.colors.background}}>
      <Header screenName={screenName} />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={handlePrevImage}
          activeOpacity={0.8}
          style={styles.imageView}>
          {selectedImageUri ? (
            <Image
              source={{uri: selectedImageUri}}
              style={[
                styles.profileImage,
                {borderColor: theme.colors.onBackground},
              ]}
            />
          ) : form?.profile_image?.imageUri ? (
            <Image
              source={{uri: form?.profile_image?.imageUri}}
              style={[
                styles.profileImage,
                {borderColor: theme.colors.appcolor},
              ]}
            />
          ) : (
            <Image
              source={require('../../../assets/image/defaultAvtar.jpg')}
              style={[
                styles.profileImage,
                {borderColor: theme.colors.onBackground},
              ]}
            />
          )}

          <TouchableOpacity onPress={selectImage} style={[styles.editView]}>
            <Iconify
              icon="basil:edit-outline"
              size={25}
              color={theme.colors.outline}
            />
          </TouchableOpacity>
        </TouchableOpacity>

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
              {color: theme.colors.error, fontFamily: fonts.Light},
            ]}>
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
          <CustomText
            style={[
              styles.errorText,
              {color: theme.colors.error, fontFamily: fonts.Light},
            ]}>
            {errors.email}
          </CustomText>
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
              {color: theme.colors.error, fontFamily: fonts.Light},
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
              {color: theme.colors.error, fontFamily: fonts.Light},
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

        <ImageModal
          visible={visible}
          image={previmage}
          opacityAnim={opacityAnim}
          setVisible={setVisible}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 25,
  },
  errorText: {
    fontSize: 12,
    bottom: 10,
  },
  imageView: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 15,
    alignSelf: 'center',
  },
  editView: {
    alignSelf: 'flex-end',
    right: 14,
    top: -10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
    borderWidth: 1,
  },
});
