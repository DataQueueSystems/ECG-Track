import {Alert, Linking, Platform, StyleSheet, Text, View} from 'react-native';
import React, {createContext, useContext, useEffect, useState} from 'react';
import NetInfo, {useNetInfoInstance} from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
import {showToast} from '../../utils/Toast.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';


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
    'Logout', // Title
    'Are you sure you want to logout?', // Message
    [
      {
        text: 'Cancel', // Cancel button
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK', // OK button
        onPress: async () => {
          try {
            
            // Clear cache and temporary files
            const cacheDir = RNFS.CachesDirectoryPath;
            const tempDir = RNFS.TemporaryDirectoryPath;
            
            // Delete cache files
            await RNFS.unlink(cacheDir).catch(err =>
              console.warn('Cache clearing error:', err)
            );
            // Delete temporary files
            await RNFS.unlink(tempDir).catch(err =>
              console.warn('Temp clearing error:', err)
            );
            
            // Clear AsyncStorage
            await AsyncStorage.clear();
            // Update app state
            setIsLogin(true);
            AsyncStorage.setItem('IsLogin', 'false');
            setUserDetail(null);
            // Show success message
            showToast('App storage cleared and logged out successfully!');
          } catch (error) {
            console.error('Error during logout:', error);
            showToast('Failed to logout. Please try again!');
          }
        },
      },
    ],
    { cancelable: false }, // Prevent dismissing by tapping outside the alert
  );
};


// const handleLogout = () => {
//   Alert.alert(
//     'Logout', //title
//     'Are you sure ,you want to logout ?', //message
//     [
//       {
//         text: 'Cancel', // Cancel button
//         onPress: () => console.log('Cancel Pressed'),
//         style: 'cancel',
//       },
//       {
//         text: 'OK', // OK button
//         onPress: () => {
//           setIsLogin(true);
//           AsyncStorage.setItem('IsLogin', 'false');
//           AsyncStorage.clear();
//           setUserDetail(null);
//           showToast('Logout successfully!');
//           // some logic
//         },
//       },
//     ],
//     {cancelable: false}, // Optionally prevent dismissing by tapping outside the alert
//   );
// };



  const [count, setCount] = useState(0);

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

  const [allDoctor, setAllDoctor] = useState([]);
  const [allpatient, setAllPatient] = useState([]);
  const [adminDoctors, setAdminDoctors] = useState([]);
  const [adminPatient, setAdminPatient] = useState([]);

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
  useEffect(() => {
    if (userDetail && userDetail?.id) {
      GetUserDetail();
    }
  }, [count]);
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

        allDoctor,
        setAllDoctor,
        allpatient,
        setAllPatient,
        setCount,
        adminDoctors,
        setAdminDoctors,
        adminPatient,
        setAdminPatient,
      }}>
      {children}
    </Authcontext.Provider>
  );
};

export const useAuthContext = () => useContext(Authcontext);
