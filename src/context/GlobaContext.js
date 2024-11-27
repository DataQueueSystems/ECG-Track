import {Alert, Linking, Platform, StyleSheet, Text, View} from 'react-native';
import React, {createContext, useContext, useEffect, useState} from 'react';
import NetInfo, {useNetInfoInstance} from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
import {showToast} from '../../utils/Toast.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Authcontext = createContext();
export const AuthContextProvider = ({children}) => {
  const [isLogin, setIsLogin] = useState(false);
  const [userDetail, setUserDetail] = useState(null);

  const Checknetinfo = async () => {
    const state = await NetInfo.fetch(); // Get the current network state
    if (!state.isConnected) {
      showToast('No internet connection.', 'error');
      return false; // No internet connection
    }
    return true; // Internet connection is available
  };
  const GetUserDetail = async () => {
    const userToken = await AsyncStorage.getItem('token');

    if (!userToken) return;
    try {
      const unsubscribe = firestore()
        .collection('users') // Assuming agents are in the `users` collection
        .doc(userToken)
        .onSnapshot(async userDoc => {
          if (!userDoc.exists) {
            return;
          }
          const userData = {id: userDoc.id, ...userDoc.data()};
          // Set user details if the account is active
          await setUserDetail(userData);
        });

      // Clean up the listener when the component unmounts or userToken changes
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };
  const gotoSetting = () => {
    Alert.alert(
      'Notification Permission Denied',
      'Please grant permission for notifications in the app settings to continue.',
      [
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout', //title
      'Are you sure ,you want to logout ?', //message
      [
        {
          text: 'Cancel', // Cancel button
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK', // OK button
          onPress: () => {
            setIsLogin(true);
            AsyncStorage.setItem('IsLogin', 'false');
            AsyncStorage.clear();
            setUserDetail(null);
            showToast('Logout successfully!');
            // some logic
          },
        },
      ],
      {cancelable: false}, // Optionally prevent dismissing by tapping outside the alert
    );
  };

  useEffect(() => {
    GetUserDetail();
  }, []);

  const [bookingData, setBookingData] = useState([]);
  const [count, setRateCount] = useState(0);
  

  const getDoctorFeedback = async doctorId => {
    try {
      const snapshot = await firestore()
        .collection('feedback')
        .where('doctorId', '==', doctorId)
        .get();

      if (snapshot.empty) {
        console.log('No feedback found for this doctor.');
        return 0; // No feedback yet
      }
      // Extract ratings
      const ratings = snapshot.docs.map(doc => doc.data().rating);

      // Calculate average rating
      const total = ratings.reduce((sum, rating) => sum + rating, 0);
      const average = total / ratings.length;
      return average;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return 0; // Return 0 in case of error
    }
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      if (userDetail) {
        const doctorId = userDetail.id;
        const averageRating = await getDoctorFeedback(doctorId);
        console.log('Average Rating:', averageRating);
      }
    };
    fetchFeedback(); // Call the async function
  }, [userDetail]); // Runs whenever userDetail changes

  const CheckDataBase = async (setSpinner, setErrors, form) => {
    setSpinner(true);
    let isConnected = await Checknetinfo();
    if (!isConnected) {
      setSpinner(false);
      return false;
    }

    try {
      const snapShot = await firestore()
        .collection('users')
        .where('id', '!=', userDetail?.id)
        .get();
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
      if (contactExists) newErrors.contact = 'Contact number already exists.';
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


  const [allDoctor, setAllDoctor] = useState(null);
  const [allpatient, setAllPatient] = useState(null);

  return (
    <Authcontext.Provider
      value={{
        isLogin,
        setIsLogin,
        Checknetinfo,

        // User Detail
        userDetail,
        setUserDetail,
        // logout func
        handleLogout,
        gotoSetting,
        CheckDataBase,

        allDoctor, setAllDoctor,
        allpatient, setAllPatient
      }}>
      {children}
    </Authcontext.Provider>
  );
};

export const useAuthContext = () => useContext(Authcontext);
