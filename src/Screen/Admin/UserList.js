import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Appearance,
  TouchableOpacity,
} from 'react-native';
import Header from '../../Component/Header';
import CustomText from '../../customText/CustomText';
import {fonts} from '../../customText/fonts';
import {Iconify} from 'react-native-iconify';
import {useNavigation} from '@react-navigation/native';
import {Appbar, useTheme} from 'react-native-paper';
import UserSheet from '../../Component/User/UserSheet';

const users = [
  {
    id: '1',
    name: 'John Doe',
    age: 30,
    email: 'john.doe@gmail.com',
    contact: '+1 123 456 789',
    address: '123 Main Street, New York, NY',
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 28,
    email: 'jane.smith@gmail.com',
    contact: '+1 987 654 321',
    address: '456 Elm Street, Los Angeles, CA',
  },
  {
    id: '3',
    name: 'Michael Brown',
    age: 35,
    email: 'michael.brown@gmail.com',
    contact: '+1 555 123 456',
    address: '789 Maple Avenue, Chicago, IL',
  },
  {
    id: '4',
    name: 'Emily White',
    age: 25,
    email: 'emily.white@gmail.com',
    contact: '+1 234 567 890',
    address: '101 Oak Street, Houston, TX',
  },
  {
    id: '5',
    name: 'Robert Johnson',
    age: 40,
    email: 'robert.johnson@gmail.com',
    contact: '+1 321 654 987',
    address: '202 Pine Avenue, San Francisco, CA',
  },
  {
    id: '6',
    name: 'Sophia Davis',
    age: 22,
    email: 'sophia.davis@gmail.com',
    contact: '+1 876 543 210',
    address: '303 Cedar Street, Seattle, WA',
  },
  {
    id: '7',
    name: 'William Garcia',
    age: 32,
    email: 'william.garcia@gmail.com',
    contact: '+1 654 321 987',
    address: '404 Birch Road, Boston, MA',
  },
  {
    id: '8',
    name: 'Olivia Martinez',
    age: 27,
    email: 'olivia.martinez@gmail.com',
    contact: '+1 789 123 456',
    address: '505 Spruce Lane, Miami, FL',
  },
  {
    id: '9',
    name: 'James Wilson',
    age: 29,
    email: 'james.wilson@gmail.com',
    contact: '+1 543 210 987',
    address: '606 Redwood Boulevard, Atlanta, GA',
  },
];

const UserList = () => {
  const renderUserItem = ({item, iconsize, iconColor, handlePress}) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => handlePress(item)}
          style={[styles.UserCard, {backgroundColor: theme.colors.transpgrey}]}
          activeOpacity={0.7}>
          <View
            style={[
              styles.iconView,
              {backgroundColor: theme.colors.background},
            ]}>
            <Iconify
              icon="solar:user-outline"
              size={iconsize}
              color={iconColor}
            />
          </View>

          <View style={styles.UserDetails}>
            <CustomText style={[styles.UserName, {fontFamily: fonts.Bold}]}>
              {item.name}
            </CustomText>
            <CustomText
              style={[styles.UserSpecialty, {fontFamily: fonts.SemiBold}]}>
              {item.age}
            </CustomText>
            <CustomText style={[styles.UserContact, {fontFamily: fonts.Light}]}>
              Contact: {item.contact}
            </CustomText>
            <CustomText style={[styles.UserContact, {fontFamily: fonts.Light}]}>
              Email: {item.email}
            </CustomText>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  let theme = useTheme();
  let navigation = useNavigation();
  let themeColor = Appearance.getColorScheme();
  let screenName = 'Users';
  let iconColor = themeColor == 'dark' ? '#fff' : 'black';
  let iconsize = 40;

  const bottomSheetRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const handlePress = async User => {
    bottomSheetRef.current?.expand(); // Use expand instead of open
    await setSelectedUser(User);
  };

  const renderAction = () => (
    <>
      <Appbar.Action
        onPress={() =>
          navigation.navigate('ControlUser', {screenName: 'Add User'})
        }
        animated={false}
        icon={() => (
          <Iconify
            icon="material-symbols:person-add"
            size={33}
            color={theme.colors.green}
          />
        )}
      />
    </>
  );

  return (
    <>
      <Header screenName={screenName} renderAction={renderAction} />

      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        {/* User List */}
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={users}
          renderItem={({item}) =>
            renderUserItem({item, iconColor, iconsize, handlePress})
          }
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <View style={styles.header}>
              <CustomText
                style={[styles.headerTitle, {fontFamily: fonts.Bold}]}>
                About User
              </CustomText>
              <CustomText
                style={[styles.headerSubtitle, {fontFamily: fonts.Regular}]}>
                Explore the list of available user
              </CustomText>
            </View>
          }
        />
      </View>

      {/* UserSheet */}
      <UserSheet bottomSheetRef={bottomSheetRef} user={selectedUser} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header: {
    marginVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 10,
  },
  UserCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 13,
  },
  UserImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  UserDetails: {
    flex: 1,
  },
  UserName: {
    fontSize: 18,
  },
  UserSpecialty: {
    fontSize: 16,
    color: '#555',
    marginTop: 2,
  },
  UserTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  UserContact: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  iconView: {
    padding: 10,
    borderRadius: 100,
    width: 60,
    height: 60,
    alignItems: 'center',
  },
});

export default UserList;
