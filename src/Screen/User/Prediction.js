import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useTheme} from 'react-native-paper';
import CustomText from '../../customText/CustomText';
import {fonts} from '../../customText/fonts';

import DocumentPicker from 'react-native-document-picker';
import {useAuthContext} from '../../context/GlobaContext';
import {showToast} from '../../../utils/Toast';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
const Tab = createMaterialTopTabNavigator();

const HeartPredictionPage = () => {
  let theme = useTheme();
  const {ipAddress} = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [isformError, setFormError] = useState(null);

  const [csvData, setCsvData] = useState(null);
  const [responseECG, setResponseECG] = useState(null);

  const [formPrediction, setFormPrediction] = useState(null);
  let navigation = useNavigation();

  const handleFileUpload = async () => {
    setLoading(true);
    setCsvData(null);
    try {
      // Open document picker to select a CSV file
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // Allow all file types (adjust as needed)
      });

      // Generate a file name (for example, based on timestamp)
      const randomNum = Date.now(); // Generate random number for unique file name
      const fileName = `ECG${randomNum}.csv`; // Example file name
      // Prepare FormData for the API request
      const formData = new FormData();
      formData.append('file', {
        uri: res[0].uri, // Use the selected file URI
        type: 'text/csv', // MIME type for CSV
        name: fileName, // Name of the file being uploaded
      });
      // Send the form data to your backend
      const response = await axios.post(`${ipAddress}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check backend response status
      let status = response.data.status === 'success';
      if (status) {
        let csvData = response.data.records;
        setCsvData(csvData);
        showToast('Success '); // If the status is success, show success toast
        setLoading(false);
      }
    } catch (err) {
      // Log the error object to understand the issue
      if (err.response) {
        // Backend error response
        const errorMessage = err.response.data.error || 'Something went wrong';
        // Show the backend error message in a toast
        showToast(errorMessage);
      } else if (err.request) {
        // Show a generic toast for no response
        showToast('No response from server');
      } else {
        // Show the general error message in a toast
        showToast(err.message);
      }
      setLoading(false);
    }
  };

  const handleUploadImage = async () => {
    setResponseECG(null);
    setLoading2(true);
    try {
      // Open document picker to select an image file
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images], // Allow image file types
      });

      // Generate a file name (for example, based on timestamp)
      const randomNum = Date.now(); // Generate a random number for unique file name
      const fileName = `ECG${randomNum}.png`; // Example file name with PNG extension

      // Prepare FormData for the API request
      const formData = new FormData();
      formData.append('image', {
        uri: res[0].uri, // Use the selected file URI

        type: 'image/png', // Set the file type correctly
        name: fileName, // Name of the file being uploaded
      });

      // Send the form data to your backend
      const response = await axios.post(
        `${ipAddress}/predict-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setResponseECG(response?.data.prediction);
      showToast('Success'); // Show success toast if the status is success
      setLoading2(false); // Hide the loading spinner
    } catch (err) {
      // console.log(err, "err");
      // Handle errors more gracefully
      if (err.response) {
        // If there's a response error from the server
        const errorMessage = err.response.data.error || 'Something went wrong';
        showToast(errorMessage);
      } else if (err.request) {
        // No response from the server
        showToast('No response from server');
      } else {
        // Any other kind of error
        showToast(err.message);
      }
      setLoading2(false); // Hide loading spinner on error
    }
  };

  const [formData, setFormData] = useState(null);
  const handleNavigate = () => {
    setFormError(null);
    setFormPrediction(null);
    setFormData(null);
    navigation.navigate('FormUpload', {setFormData});
  };

  const handleSubmit = async () => {
    setFormError('');
    const convertedFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, parseFloat(value)]),
    );
    try {
      const response = await axios.post(
        `${ipAddress}/predict`,
        convertedFormData,
        {
          headers: {
            'Content-Type': 'application/json', // Set JSON content type
          },
        },
      );
      // console.log('Backend Response:', response.data);
      setFormPrediction(response.data);
    } catch (err) {
      if (err.response) {
        // console.error('Error Response:', err.response.data);
        const errorMessage = err.response.data;
        showToast(errorMessage?.error);
        setFormError(errorMessage?.error);
      } else if (err.request) {
        // console.error('No response from server:', err.request);
        // showToast('No response from server');
        showToast('Something went wrong ...');
      } else {
        showToast(err.message);
      }
    }
  };

  // Form Prediction Tab Content
  const FormPredictionTab = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{flex: 1, backgroundColor: theme.colors.background}}>
      <View style={[{padding: 10}]}>
        <TouchableOpacity
          onPress={handleNavigate}
          style={[styles.button, {backgroundColor: theme.colors.onBackground}]}>
          <CustomText
            style={[
              {
                fontFamily: fonts.SemiBold,
                color: theme.colors.background,
              },
            ]}>
            Upload your Form
          </CustomText>
        </TouchableOpacity>
        <CustomText
          style={[
            {
              fontFamily: fonts.Regular,
              fontSize: 14,
              marginTop: 5,
              color: theme.colors.onSurface,
            },
          ]}>
          Complete your form upload process by navigating to the Form Upload
          page.
        </CustomText>
        {/* Dynamically display all form data */}
        {/* Dynamically display all form data in two columns with wrap */}
        {formData && (
          <View style={styles.formDataContainer}>
            {Object.keys(formData).map((key, index) => (
              <View key={index} style={styles.formItemContainer}>
                <CustomText
                  style={[
                    {fontFamily: fonts.Regular, marginVertical: 5}, // Key in black
                  ]}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                  <CustomText
                    style={[
                      {fontFamily: fonts.Regular, color: theme.colors.appColor}, // Value in green
                    ]}>
                    {' '}
                    {key === 'gender'
                      ? formData[key] === '0'
                        ? 'Male'
                        : 'Female'
                      : key === 'chestpain'
                      ? {
                          0: 'Typical Angina',
                          1: 'Atypical Angina',
                          2: 'Non-Anginal Pain',
                          3: 'Asymptomatic',
                        }[formData[key]]
                      : key === 'electrocardiographic'
                      ? {
                          0: 'Normal',
                          1: 'ST-T Wave Abnormality',
                          2: 'Probable/Definite Left Ventricular Hypertrophy',
                        }[formData[key]]
                      : key === 'slope'
                      ? {
                          1: 'Upsloping',
                          2: 'Flat',
                          3: 'Downsloping',
                        }[formData[key]]
                      : formData[key]}
                  </CustomText>
                </CustomText>
              </View>
            ))}
          </View>
        )}

        {formData && (
          <>
            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: theme.colors.onBackground},
              ]}
              onPress={handleSubmit}>
              <CustomText
                style={[
                  {fontFamily: fonts.SemiBold, color: theme.colors.background},
                ]}>
                Predict
              </CustomText>
            </TouchableOpacity>
          </>
        )}
        {isformError && (
          <CustomText
            style={[
              {
                color: theme.colors.error,
                fontFamily: fonts.Regular,
                marginVertical: 10,
              },
            ]}>
            {isformError}
          </CustomText>
        )}
        {formPrediction && (
          <View style={styles.predictionContainer}>
            {/* Heading */}
            <CustomText style={styles.predictionHeading}>
              Heart Disease Prediction Results
            </CustomText>
            {/* Prediction Text */}
            <CustomText style={styles.predictionText}>
              {formPrediction?.prediction_text}
            </CustomText>
          </View>
        )}
      </View>
    </ScrollView>
  );
  const notationMapping = {
    N: 'Normal', // Normal heartbeat
    Q: 'Abnormal', // Abnormal beat
    V: 'Ventricular', // Ventricular contraction
    A: 'Atrial', // Atrial contraction
    '~': 'Noise', // Signal noise
    '!': 'Ventricular bigeminy', // Ventricular bigeminy
    '/': 'Unknown', // Unknown rhythm
  };

  function getAnnotation(ecgValue) {
    if (ecgValue >= 0.03 && ecgValue <= 0.032) {
      return notationMapping['N']; // Normal
    } else if (ecgValue > 0.035 || ecgValue < 0.025) {
      return notationMapping['Q']; // Abnormal
    } else if (ecgValue >= 0.035 && ecgValue <= 0.045) {
      return notationMapping['V']; // Ventricular
    } else if (ecgValue > 0.03 && ecgValue < 0.035) {
      return notationMapping['A']; // Atrial
    } else if (ecgValue > 0.04) {
      return notationMapping['~']; // Noise
    } else if (ecgValue > 0.035 && ecgValue < 0.045) {
      return notationMapping['!']; // Ventricular bigeminy
    }
    return notationMapping['/']; // Unknown
  }

  // CSV Upload Tab Content
  const CSVUploadTab = () => (
    <>
      <View
        style={[
          styles.tableContainer,
          {backgroundColor: theme.colors.background, flex: 1},
        ]}>
        {/* CSV Data Rows */}

        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={csvData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.tableRow}>
              <CustomText
                style={[styles.tableCell, {fontFamily: fonts.Regular}]}>
                {item?.annotation ? getAnnotation(item?.ecg_value) : ''}
              </CustomText>
              <CustomText
                style={[styles.tableCell, {fontFamily: fonts.Regular}]}>
                <CustomText
                  style={[styles.tableCell, {fontFamily: fonts.Regular}]}>
                  {/* {item?.ds } */}
                  {item?.ds
                    ? moment(item.ds).format('YYYY-MM-DD HH:mm:ss')
                    : ''}
                </CustomText>
              </CustomText>
              <CustomText
                style={[styles.tableCell, {fontFamily: fonts.Regular}]}>
                {item?.ecg_value ? item?.ecg_value?.toFixed(5) : ''}
              </CustomText>
            </View>
          )}
          ListHeaderComponent={() => (
            <>
              <CustomText
                style={[
                  {fontSize: 16, marginVertical: 16},
                  {fontFamily: fonts.Medium},
                ]}>
                Upload a CSV file with the required data to predict heart
                disease.
              </CustomText>
              <TouchableOpacity
                style={[
                  styles.button,
                  {backgroundColor: theme.colors.onBackground},
                ]}
                onPress={loading ? () => {} : handleFileUpload}>
                {loading ? (
                  <ActivityIndicator color={theme.colors.background} />
                ) : (
                  <CustomText
                    style={[
                      {
                        fontFamily: fonts.SemiBold,
                        color: theme.colors.background,
                      },
                    ]}>
                    Upload CSV
                  </CustomText>
                )}
              </TouchableOpacity>

              {csvData ? (
                <>
                  <CustomText
                    style={[styles.tableHeader, {fontFamily: fonts.Medium}]}>
                    CSV Data
                  </CustomText>

                  {/* Table Header Row */}
                  <View style={styles.tableHeaderRow}>
                    <CustomText
                      style={[
                        styles.tableCell,
                        styles.tableHeaderCell,
                        {
                          color: theme.colors.appColor,
                          fontFamily: fonts.Regular,
                        },
                      ]}>
                      Annotation
                    </CustomText>
                    <CustomText
                      style={[
                        styles.tableCell,
                        styles.tableHeaderCell,
                        {
                          color: theme.colors.appColor,
                          fontFamily: fonts.Regular,
                        },
                      ]}>
                      Date
                    </CustomText>
                    <CustomText
                      style={[
                        styles.tableCell,
                        styles.tableHeaderCell,
                        {
                          color: theme.colors.appColor,
                          fontFamily: fonts.Regular,
                        },
                      ]}>
                      ECG Value
                    </CustomText>
                  </View>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        />
      </View>
    </>
  );

  const UploadECG = () => (
    <View
      style={[
        styles.tableContainer,
        {backgroundColor: theme.colors.background, flex: 1},
      ]}>
      <CustomText
        style={[
          {fontSize: 16, marginVertical: 16, textAlign: 'center'},
          {fontFamily: fonts.Medium},
        ]}>
        Please upload an ECG image to receive a heart disease prediction. Ensure
        the image is clear and the content is legible.
      </CustomText>

      {/* Upload Button */}
      <TouchableOpacity
        style={[styles.button, {backgroundColor: theme.colors.onBackground}]}
        onPress={loading2 ? () => {} : handleUploadImage}>
        {loading2 ? (
          <ActivityIndicator color={theme.colors.background} />
        ) : (
          <CustomText
            style={[
              {
                fontFamily: fonts.SemiBold,
                color: theme.colors.background,
                fontSize: 16,
              },
            ]}>
            Upload ECG Picture
          </CustomText>
        )}
      </TouchableOpacity>
      {responseECG && (
        <View style={styles.predictionContainer}>
          <CustomText style={styles.predictionHeading}>
            ECG Prediction Results
          </CustomText>
          <CustomText
            style={[
              styles.predictionText,
              {
                color: theme.colors.appColor,
                fontFamily: fonts.SemiBold,
                fontSize: 16,
              },
            ]}>
            {responseECG?.class_name}
          </CustomText>
          <CustomText style={styles.predictionText}>
            {responseECG?.definition}
          </CustomText>
        </View>
      )}
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      {/* Header Section */}
      <View style={[styles.header, {backgroundColor: theme.colors.appColor}]}>
        <CustomText
          style={[
            styles.headerTitle,
            {fontFamily: fonts.Medium, color: '#fff'},
          ]}>
          Heart Disease Prediction
        </CustomText>
        <CustomText
          style={[
            styles.headerSubtitle,
            {fontFamily: fonts.Regular, color: '#fff'},
          ]}>
          Use this tool to predict heart disease. Enter patient details or
          upload a CSV file for bulk prediction.
        </CustomText>
      </View>

      {/* Tab Navigator */}
      <Tab.Navigator
        screenOptions={{
          headerStyle: {},
          tabBarStyle: {},
          tabBarContentContainerStyle: {},
          tabBarLabelStyle: {
            fontFamily: 'Poppins-Medium',
          },
        }}>
        <Tab.Screen name="Prediction" component={FormPredictionTab} />
        <Tab.Screen name="CSVUpload" component={CSVUploadTab} />
        <Tab.Screen name="Upload ECG" component={UploadECG} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tableContainer: {
    padding: 16,
    paddingTop: 0,
  },
  tableHeader: {
    fontSize: 18,
    marginBottom: 8,
    marginTop: 20,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 8,
  },
  tableHeaderCell: {
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  tableCell: {
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },
  formDataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  formItemContainer: {
    width: '48%', // Each item takes almost half of the width
    marginBottom: 10, // Space between items
  },
  predictionContainer: {
    padding: 20,
    backgroundColor: '#f8f8f8', // Light background for better contrast
    borderRadius: 10,
    marginHorizontal: 2, // Add horizontal margin for spacing
    marginVertical: 10, // Add vertical margin to separate from other content
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, // Add elevation for Android shadow effect
  },
  predictionHeading: {
    fontFamily: fonts.SemiBold,
    fontSize: 18,
    color: '#333', // Dark text color for the heading
    marginBottom: 10, // Add space below the heading
  },
  predictionText: {
    fontFamily: fonts.Regular,
    fontSize: 16,
    color: '#666', // Lighter text color for the prediction content
    lineHeight: 22, // Add line height for better readability
    textAlign: 'justify', // Justify text for a clean look
  },
});

export default HeartPredictionPage;
