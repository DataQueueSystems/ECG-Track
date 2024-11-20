import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Appearance,
  TouchableOpacity,
} from 'react-native';
import {Iconify} from 'react-native-iconify';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../customText/CustomText';
import {fonts} from '../../customText/fonts';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

const GradientCards = () => {
  let iconsize = 40;
  let theme = useTheme();
  let navigation = useNavigation();
  let themeColor = Appearance.getColorScheme();
  let iconColor = themeColor == 'dark' ? '#fff' : 'black';

  const handleNavigate = navigateScreen => {
    navigation.navigate(navigateScreen);
  };
  return (
    <View style={styles.container}>
      {/* Doctor Card */}
      <LinearGradient colors={['#cde5f5', '#78B3CE']} style={styles.card}>
        <View
          style={[styles.iconView, {backgroundColor: theme.colors.background}]}>
          <Iconify icon="fontisto:doctor" size={iconsize} color={iconColor} />
        </View>
        <CustomText style={[styles.roleText, {fontFamily: fonts.Bold}]}>
          Doctor
        </CustomText>
        <CustomText
          style={[
            styles.countText,
            {fontFamily: fonts.Regular, color: 'black'},
          ]}>
          45
        </CustomText>

        <TouchableOpacity
          onPress={() => handleNavigate('DoctorList')}
          style={styles.arrow}>
          <Iconify icon="ep:arrow-right-bold" size={20} color={iconColor} />
        </TouchableOpacity>
      </LinearGradient>

      {/* User Card */}
      <LinearGradient colors={['#cde5f5', '#78B3CE']} style={styles.card}>
        <View
          style={[styles.iconView, {backgroundColor: theme.colors.background}]}>
          <Iconify icon="mdi:patient" size={44} color={iconColor} />
        </View>
        <CustomText style={[styles.roleText, {fontFamily: fonts.Bold}]}>
          User
        </CustomText>
        <CustomText
          style={[
            styles.countText,
            {fontFamily: fonts.Regular, color: 'black'},
          ]}>
          120
        </CustomText>

        <TouchableOpacity
          onPress={() => handleNavigate('UserList')}
          style={styles.arrow}>
          <Iconify icon="ep:arrow-right-bold" size={20} color={iconColor} />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  card: {
    width: '45%',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  iconView: {
    padding: 10,
    borderRadius: 100,
    width: 60,
    height: 60,
    alignItems: 'center',
  },
  roleText: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 5,
    marginBottom: 2,
  },
  countText: {
    fontSize: 16,
  },
  arrow: {
    position: 'absolute',
    padding: 7,
    borderRadius: 100,
    right: 5,
    bottom: 5,
    elevation: 2,
    backgroundColor: '#bad6e9',
  },
});

export default GradientCards;