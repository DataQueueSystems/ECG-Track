import React, {useCallback, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Appearance,
  Alert,
  TouchableOpacity,
  Animated,
} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {useTheme, Portal} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../../customText/CustomText';
import {fonts} from '../../customText/fonts';
import {Iconify} from 'react-native-iconify';
import ImageModal from '../Modal/ImageModal';

const UserSheet = ({bottomSheetRef, user}) => {
  const snapPoints = ['50%', '70%'];
  const theme = useTheme();
  let iconsize = 70;
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  let themeColor = Appearance.getColorScheme();
  let iconColor = themeColor == 'dark' ? '#fff' : 'black';
  let navigation = useNavigation();
  const handleEdit = () => {
    bottomSheetRef.current.close();
    navigation.navigate('ControlUser', {
      screenName: 'Edit User',
      userData: user,
    });
  };

  const [visible, setVisible] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [previmage, setPrevimage] = useState(null);
  // Function to handle opening the modal with animation
  const handlePrevImage = () => {
    setVisible(true);
    let imageUri = doctor?.profile_image?.imageUri;
    setPrevimage(imageUri);
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  
  return (
    <>
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          enablePanDownToClose={true}
          index={-1} // Initially closed
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          backgroundStyle={{
            backgroundColor: theme.colors.background,
          }}
          handleIndicatorStyle={{backgroundColor: theme.colors.onBackground}}>
          <View
            style={[
              styles.bottomModelDiv,
              {backgroundColor: theme.colors.background},
            ]}>
            {/* action Icon */}
            <View style={styles.actionView}>
              <Iconify
                onPress={handleEdit}
                icon="mynaui:edit"
                size={27}
                color={theme.colors.error}
              />
            </View>

            {/* user Details */}
            {/* <View style={styles.profileContainer}>
            <View
              style={[
                styles.iconView,
                {backgroundColor: theme.colors.background},
              ]}>
              <Iconify icon="solar:user-outline" size={80} color={iconColor} />
            </View>

            <CustomText
              style={[
                styles.userName,
                {color: theme.colors.onBackground, fontFamily: fonts.Bold},
              ]}>
              {user?.name}
            </CustomText>
          </View> */}

            <View style={styles.profileContainer}>
              {user?.profile_image?.imageUri ? (
                <TouchableOpacity onPress={handlePrevImage}>
                  <Image
                    source={{uri: user?.profile_image?.imageUri}}
                    style={[
                      styles.profileImage,
                      {borderColor: theme.colors.appcolor},
                    ]}
                  />
                </TouchableOpacity>
              ) : (
                <>
                  <View
                    style={[
                      styles.iconView,
                      {backgroundColor: theme.colors.background},
                    ]}>
                    <Iconify
                      icon="fontisto:doctor"
                      size={iconsize}
                      color={iconColor}
                    />
                  </View>
                </>
              )}

              <CustomText
                style={[
                  styles.userName,
                  {
                    color: theme.colors.onBackground,
                    fontFamily: fonts.SemiBold,
                  },
                ]}>
                {user?.name || 'User Name'}
              </CustomText>
            </View>

            {/* Additional Information */}
            <View style={styles.infoContainer}>
              <CustomText
                style={[
                  styles.infoLabel,
                  {
                    color: theme.colors.onBackground,
                    fontFamily: fonts.SemiBold,
                  },
                ]}>
                Contact:
              </CustomText>
              <CustomText
                style={[
                  styles.infoValue,
                  {color: theme.colors.onBackground, fontFamily: fonts.Regular},
                ]}>
                {user?.contact || '+1 234 567 890'}
              </CustomText>
              <CustomText
                style={[
                  styles.infoLabel,
                  {
                    color: theme.colors.onBackground,
                    fontFamily: fonts.SemiBold,
                  },
                ]}>
                Email:
              </CustomText>
              <CustomText
                style={[
                  styles.infoValue,
                  {color: theme.colors.onBackground, fontFamily: fonts.Regular},
                ]}>
                {user?.email}
              </CustomText>

              <CustomText
                style={[
                  styles.infoLabel,
                  {
                    color: theme.colors.onBackground,
                    fontFamily: fonts.SemiBold,
                  },
                ]}>
                Address:
              </CustomText>
              <CustomText
                style={[
                  styles.infoValue,
                  {color: theme.colors.onBackground, fontFamily: fonts.Regular},
                ]}>
                {user?.address || "N/A"}
              </CustomText>
            </View>
          </View>
        </BottomSheet>
      </Portal>

      <ImageModal
        visible={visible}
        image={previmage}
        opacityAnim={opacityAnim}
        setVisible={setVisible}
      />
    </>
  );
};

export default UserSheet;

const styles = StyleSheet.create({
  bottomModelDiv: {
    padding: 20,
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconView: {
    paddingVertical: 10,
  },

  userName: {
    fontSize: 20,
  },
  userSpecialty: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  infoContainer: {
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 16,
    marginTop: 10,
  },
  infoValue: {
    fontSize: 14,
    marginTop: 5,
  },
  actionView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
  },
  iconView: {
    borderRadius: 100,
    alignItems: 'center',
    padding: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1,
  },
});
