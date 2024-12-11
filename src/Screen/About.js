import React from 'react';
import {View, StyleSheet, ScrollView, Image} from 'react-native';
import {useTheme} from 'react-native-paper';
import CustomText from '../customText/CustomText';
import {fonts} from '../customText/fonts';
import Header from '../Component/Header';

const AboutPage = () => {
  let theme = useTheme();

  return (
    <>
      <View
        style={[
          styles.maincontainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <Header screenName={'About '} />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={styles.container}>
          <View style={styles.headerContainer}>
            <CustomText
              style={[
                styles.title,
                {fontFamily: fonts.SemiBold, color: theme.colors.appColor},
              ]}>
              ECG Track of Heart Disease
            </CustomText>
          </View>

          <CustomText
            style={[
              styles.sectionTitle,
              {fontFamily: fonts.Medium, color: theme.colors.appColor},
            ]}>
            About the App
          </CustomText>
          <CustomText style={[styles.paragraph, {fontFamily: fonts.Regular}]}>
            "ECG Track of Heart Disease" is an advanced healthcare app designed
            to help users track their heart's health by analyzing ECG data.
            Users can upload their ECG data in CSV format, and the app provides
            precise predictions such as "Normal" or "Abnormal" based on the
            uploaded data. This app leverages modern technology to make health
            monitoring accessible and efficient.
          </CustomText>

          <CustomText
            style={[
              styles.sectionTitle,
              {fontFamily: fonts.Medium, color: theme.colors.appColor},
            ]}>
            Features
          </CustomText>
          <CustomText style={[styles.paragraph, {fontFamily: fonts.Regular}]}>
            - Upload ECG data in CSV format for accurate heart health
            predictions. - Receive instant feedback, including "Normal" or
            "Abnormal" status. - Get personalized doctor recommendations based
            on your health reports. - Schedule appointments with recommended
            doctors easily. - Doctors can view user appointments with details
            and scheduled dates. - A user-friendly interface designed for
            convenience and accuracy.
          </CustomText>

          <CustomText
            style={[
              styles.sectionTitle,
              {fontFamily: fonts.Medium, color: theme.colors.appColor},
            ]}>
            How It Works
          </CustomText>
          <CustomText style={[styles.paragraph, {fontFamily: fonts.Regular}]}>
            1. Upload your ECG data in CSV format. 2. The app processes your
            data and provides a prediction. 3. If required, book an appointment
            with a recommended doctor. 4. Doctors can view the appointment
            details, ensuring smooth communication and timely assistance.
          </CustomText>

          <CustomText
            style={[
              styles.sectionTitle,
              {fontFamily: fonts.Medium, color: theme.colors.appColor},
            ]}>
            Our Mission
          </CustomText>
          <CustomText style={[styles.paragraph, {fontFamily: fonts.Regular}]}>
            Our mission is to promote heart health by providing users with a
            simple yet effective tool to monitor their ECG readings and connect
            with healthcare professionals for timely intervention.
          </CustomText>

          <CustomText
            style={[
              styles.sectionTitle,
              {fontFamily: fonts.Medium, color: theme.colors.appColor},
            ]}>
            Contact Us
          </CustomText>
          <CustomText style={[styles.paragraph, {fontFamily: fonts.Regular}]}>
            If you have any questions or need assistance, feel free to reach out
            to us: Email: support@ecgtrackapp.com Phone: +1-800-123-4567
          </CustomText>

          <CustomText
            style={[
              styles.footer,
              {fontFamily: fonts.Medium, color: theme.colors.appColor},
            ]}>
            Thank you for choosing "ECG Track of Heart Disease" to safeguard
            your heart's health. Your well-being is our priority!
          </CustomText>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    // backgroundColor:'green'
  },
  headerContainer: {
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    marginTop: 10,
    CustomTextAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  footer: {
    fontSize: 16,
    marginTop: 20,
    CustomTextAlign: 'center',
  },
});

export default AboutPage;
