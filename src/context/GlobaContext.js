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
  const [allDoctor, setAllDoctor] = useState(null);
  const [allpatient, setAllPatient] = useState(null);

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

  const GetAppointMent = async id => {
    if (!id) return () => {}; // Return a no-op function if no ID is provided.

    try {
      let query = firestore().collection('bookings');

      // Apply filter based on role
      if (userDetail?.role === 'user') {
        query = query.where('userId', '==', id);
      } else if (userDetail?.role === 'doctor') {
        query = query.where('doctorId', '==', id);
      }

      // Listen for real-time updates
      const unsubscribe = query.onSnapshot(async snapshot => {
        if (snapshot.empty) {
          setBookingData([]); // No bookings found
          return;
        }

        const bookings = await Promise.all(
          snapshot.docs.map(async doc => {
            const booking = {id: doc.id, ...doc.data()};

            if (userDetail?.role === 'doctor') {
              // Fetch user details for doctor role
              const userDoc = await firestore()
                .collection('users') // Assuming user details are stored in the 'users' collection
                .doc(booking.userId)
                .get();

              if (userDoc.exists) {
                booking.person = {id: userDoc.id, ...userDoc.data()};
              }
            } else if (userDetail?.role === 'user') {
              // Fetch doctor details for user role
              const doctorDoc = await firestore()
                .collection('users') // Assuming doctor details are stored in the 'users' collection
                .doc(booking.doctorId)
                .get();

              if (doctorDoc.exists) {
                booking.person = {id: doctorDoc.id, ...doctorDoc.data()};
              }
            }

            return booking;
          }),
        );

        setBookingData(bookings); // Set enriched bookings data
      });

      return unsubscribe; // Clean up listener
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };
  useEffect(() => {
    // Fetch appointments only if the user is not an admin
    let unsubscribe = () => {}; // Default to a no-op function.
    if (userDetail && userDetail?.role !== 'admin') {
      unsubscribe = GetAppointMent(userDetail?.id);
    }
    // Clean up the listener on component unmount or dependency change.
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [userDetail?.id, count]);

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

      console.log(`Average Rating for Doctor ${doctorId}:`, average);
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

  const GetListDetail = async () => {
    try {
      const subscriber = firestore()
        .collection('users')
        .where('Status', '==', 'Active')
        .onSnapshot(async snapshot => {
          let alluser = snapshot.docs.map(snapdata => ({
            id: snapdata.id,
            ...snapdata.data(),
          }));
          const alldoctor = alluser?.filter(user => user?.role === 'doctor');
          const allpatient = alluser?.filter(user => user?.role === 'user');
          setAllDoctor(alldoctor); // Set the filtered list as needed
          setAllPatient(allpatient); // Set the filtered list as needed
          // Sort doctors by their averageRating in descending order
          const recommendedDoctors = alldoctor?.sort(
            (a, b) => b?.averageRating - a?.averageRating,
          );
        });
      // Clean up the listener when the component unmounts
      return () => subscriber();
    } catch (error) {
      console.log('Error is:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = GetListDetail();
    return () => {
      if (unsubscribe) unsubscribe(); // Clean up to prevent memory leaks
    };
  }, []);

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

        // list of patient and doctor
        allDoctor,
        allpatient,
        CheckDataBase,

        bookingData,
        setRateCount,
      }}>
      {children}
    </Authcontext.Provider>
  );
};

export const useAuthContext = () => useContext(Authcontext);
