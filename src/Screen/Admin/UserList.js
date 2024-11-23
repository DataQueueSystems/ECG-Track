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
import {useAuthContext} from '../../context/GlobaContext';

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
              {item?.name}
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

  const {allpatient} = useAuthContext();

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



  return (
    <>
      <Header screenName={screenName}  />

      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        {/* User List */}
        {allpatient?.length == 0 ? (
          <>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <CustomText
                style={{
                  fontFamily: fonts.Regular,
                  fontSize: 18,
                  textAlign: 'center',
                }}>
                No User found
              </CustomText>
            </View>
          </>
        ) : (
          <>
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={allpatient}
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
                    style={[
                      styles.headerSubtitle,
                      {fontFamily: fonts.Regular},
                    ]}>
                    Explore the list of available user
                  </CustomText>
                </View>
              }
            />
          </>
        )}
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
