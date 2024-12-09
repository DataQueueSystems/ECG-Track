import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useAuthContext} from '../context/GlobaContext';
import AdminHome from './Admin/AdminHome';
import DoctorHome from './Doctor/DoctorHome';
import BottomNavigator from './User/BottomNavigation';

export default function Parent() {
  const {userDetail} = useAuthContext();
  return (
    <>
      {userDetail?.role == 'admin' ? (
        <AdminHome />
      ) : userDetail?.role == 'user' ? (
        <BottomNavigator />
      ) : (
        <DoctorHome />
      )}
    </>
  );
}

const styles = StyleSheet.create({});
