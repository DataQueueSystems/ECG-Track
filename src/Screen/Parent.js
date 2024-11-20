import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useAuthContext} from '../context/GlobaContext';
import UserHome from './User/UserHome';
import AdminHome from './Admin/AdminHome';
import DoctorHome from './Doctor/DoctorHome';

export default function Parent() {
  const {userDetail} = useAuthContext();
  return (
    <>
      {userDetail?.role == 'admin' ? (
        <AdminHome />
      ) : userDetail?.role == 'user' ? (
        <UserHome />
      ) : (
        <DoctorHome />
      )}
    </>
  );
}

const styles = StyleSheet.create({});
