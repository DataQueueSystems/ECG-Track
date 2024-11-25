


import {
    Animated,
    Dimensions,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
  } from 'react-native';
  import React, {useRef} from 'react';
  import {IconButton, useTheme} from 'react-native-paper';
import CustomText from '../../customText/CustomText';
  
  export default function ImageModal({visible, image, opacityAnim, setVisible}) {
    let theme = useTheme();
    // Function to close modal with animation
    const closeImageModal = () => {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    };
    return (
      <>
        {/* Modal for Aadhaar image */}
        <Modal visible={visible} transparent={true} animationType="fade">
          <View style={styles.fullScreenModal}>
            {/* App Bar */}
            <View
              style={[styles.appBar, {backgroundColor: theme.colors.background}]}>
              <IconButton
                icon="close"
                color={theme.colors.onPrimary}
                size={25}
                onPress={closeImageModal}
              />
              {/* <Text style={styles.appBarTitle}>Aadhaar Image</Text> */}
            </View>
            {/* Modal Content */}
            <TouchableWithoutFeedback onPress={closeImageModal}>
              <View
                style={[
                  styles.modalBackdrop,
                  {backgroundColor: theme.colors.background},
                ]}>
                <Animated.View
                  style={[styles.modalContent, {opacity: opacityAnim}]}>
                  {image ? (
                    <Image
                      source={{
                        uri: image,
                      }}
                      style={styles.aadharImage}
                    />
                  ) : (
                    <CustomText
                      style={{color: theme.colors.onBackground, fontSize: 16}}>
                      No Image Found
                    </CustomText>
                  )}
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </>
    );
  }
  
  const styles = StyleSheet.create({
    // Modal styles
    fullScreenModal: {
      flex: 1,
      justifyContent: 'center', // Align content at the top
    },
    appBar: {
      height: 56, // Height for app bar
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 4, // Shadow for Android
      shadowColor: '#000', // Shadow for iOS
      shadowOpacity: 0.2,
      shadowOffset: {width: 0, height: 2},
      shadowRadius: 2,
    },
    appBarTitle: {
      flex: 1,
      color: '#fff',
      fontSize: 18,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    modalBackdrop: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 56, // Space for app bar
    },
    modalContent: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('screen').height, // Control size of image content area
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    aadharImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain', // Make sure the image scales properly
      borderRadius: 10,
    },
  });