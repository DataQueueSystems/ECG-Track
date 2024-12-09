import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../Component/Header';
import {Appbar, Divider, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../customText/CustomText';
import {fonts} from '../customText/fonts';
import {Iconify} from 'react-native-iconify';
import ImageModal from '../Component/Modal/ImageModal';
import {useAuthContext} from '../context/GlobaContext';

export default function UAProfile() {
  let theme = useTheme();
  let navigation = useNavigation();
  let screenName = 'Profile Detail';
  const {userDetail} = useAuthContext();
  let iconsize = 26;
  let contentSize = 15;

  const renderAction = () => (
    <>
      <Appbar.Action
        onPress={() => navigation.navigate('EditProfile', {fromdoctor: true})}
        animated={false}
        icon={() => (
          <Iconify icon="mynaui:edit" size={28} color={theme.colors.green} />
        )}
      />
    </>
  );

  const [visible, setVisible] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [previmage, setPrevimage] = useState(null);
  // Function to handle opening the modal with animation
  const handlePrevImage = () => {
    setVisible(true);
    let imageUri = userDetail?.profile_image?.imageUri;
    setPrevimage(imageUri);
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  let isUser=userDetail?.role=="user"?true:false
  console.log(isUser,'isUser');
  
  return (
    <>
      <Header screenName={screenName} renderAction={renderAction} isUser={isUser} />
      <View
        style={[
          styles.maincontainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View style={styles.topcontainer}>
            <View style={styles.profileNameandSpecialist}>
              <CustomText
                numberOfLines={2}
                style={[{fontFamily: fonts.Bold, fontSize: 24, width: 200}]}>
                {userDetail?.name}
              </CustomText>
              <View style={[styles.specialistView]}>
                <CustomText
                  style={[
                    {
                      fontFamily: fonts.SemiBold,
                      fontSize: 14,
                    },
                  ]}>
                  {userDetail?.specialist}
                </CustomText>
              </View>
            </View>

            {userDetail?.profile_image?.imageUri ? (
              <TouchableOpacity onPress={handlePrevImage}>
                <Image
                  style={styles.image}
                  source={{uri: userDetail?.profile_image?.imageUri}}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.imageview}>
                <Iconify
                icon="fa-solid:user"
                  size={90}
                  color={theme.colors.onBackground}
                />
              </View>
            )}
          </View>

          <View
            style={[
              styles.otherDetailView,
              // {backgroundColor: theme.colors.transpgrey},
            ]}>
            <CustomText style={[{fontFamily: fonts.Bold, fontSize: 20}]}>
              Other Detail
            </CustomText>
            <View style={{marginTop: 10, marginHorizontal: 10}}>
              {userDetail?.contact && (
                <View style={styles.iconView}>
                  <Iconify
                    icon="mdi:phone"
                    size={iconsize}
                    color={theme.colors.onBackground}
                  />
                  <CustomText
                    style={[
                      {fontFamily: fonts.Regular, fontSize: contentSize},
                    ]}>
                    {userDetail?.contact}
                  </CustomText>
                </View>
              )}
              <View style={styles.iconView}>
                <Iconify
                  icon="mdi:email"
                  size={iconsize}
                  color={theme.colors.onBackground}
                />
                <CustomText
                  style={[{fontFamily: fonts.Regular, fontSize: contentSize}]}>
                  {userDetail?.email}
                </CustomText>
              </View>

              {userDetail?.address && (
                <View style={styles.iconView}>
                  <Iconify
                    icon="mingcute:location-line"
                    size={iconsize}
                    color={theme.colors.onBackground}
                  />
                  <CustomText
                    style={[
                      {fontFamily: fonts.Regular, fontSize: contentSize},
                    ]}>
                    {userDetail?.address}
                  </CustomText>
                </View>
              )}
            </View>
          </View>
          <View></View>
        </ScrollView>
      </View>
      <ImageModal
        visible={visible}
        image={previmage}
        opacityAnim={opacityAnim}
        setVisible={setVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 10,

    // backgroundColor:'green'
  },
  topcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  specialistView: {
    padding: 2,
    borderRadius: 10,
    marginHorizontal: 2,
    top: -2,
  },
  imageview: {
    padding: 30,
  },
  image: {
    height: 170,
    width: 170,
    borderRadius: 100,
  },
  otherDetailView: {
    marginVertical: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  iconView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  button: {
    marginTop: 10,
    padding: 15,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  star: {
    marginHorizontal: 5,
  },
});
