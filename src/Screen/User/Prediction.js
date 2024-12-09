import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  ScrollView,
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
const Tab = createMaterialTopTabNavigator();

const HeartPredictionPage = () => {
  let theme = useTheme();
  const {ipAddress, formData, setFormData} = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [file, setFile] = useState(null);
  let navigation = useNavigation();

  const handleFileUpload = async () => {
    setCsvData(null);
    try {
      // Open document picker to select a CSV file
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // Allow all file types (adjust as needed)
      });

      console.log('Selected file URI:', res[0].uri);
      setFile(res[0].uri); // Store the file URI in state

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

      // Log FormData (to verify what is being sent)
      console.log('FormData:', formData);

      // Send the form data to your backend
      const response = await axios.post(`${ipAddress}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Backend Response:', response.data);

      // Check backend response status
      let status = response.data.status === 'success';
      if (status) {
        let csvData = response.data.records;
        setCsvData(csvData);
        showToast('Success '); // If the status is success, show success toast
      }
    } catch (err) {
      // Log the error object to understand the issue
      if (err.response) {
        // Backend error response
        const errorMessage = err.response.data.error || 'Something went wrong';
        // console.error('Response Data:', err.response.data);
        // console.error('Response Status:', err.response.status);
        // console.error('Response Headers:', err.response.headers);

        // Show the backend error message in a toast
        showToast(errorMessage);
      } else if (err.request) {
        // The request was made but no response was received
        // console.error('Request Error:', err.request);
        // Show a generic toast for no response
        showToast('No response from server');
      } else {
        // Something happened in setting up the request that triggered an error
        // console.error('General Error:', err.message);
        // Show the general error message in a toast
        showToast(err.message);
      }
    }
  };

  const [formValues, setFormValues] = useState({
    age: '',
    gender: '',
    chestpain: '',
    restingBP: '',
    serumcholestrol: '',
    fastingbloodsugar: '',
    electrocardiographic: '',
    maxheartrate: '',
    exerciseangia: '',
    oldpeak: '',
    slope: '',
    noofmajorvessels: '',
  });

  const handleSubmit = async () => {
    const defaultData = {
      age: 25, // Example age
      gender: 'Male', // Example gender
      chestpain: 'Typical Angina', // Example chest pain type
      restingBP: 120, // Resting blood pressure in mmHg
      serumcholestrol: 200, // Serum cholesterol in mg/dL
      fastingbloodsugar: 0, // 1 if fasting blood sugar > 120 mg/dL, else 0
      electrocardiographic: 1, // Resting electrocardiographic results (e.g., 0, 1, 2)
      maxheartrate: 150, // Maximum heart rate achieved
      exerciseangia: 0, // 1 for Yes, 0 for No
      oldpeak: 1.5, // ST depression induced by exercise relative to rest
      slope: 2, // The slope of the peak exercise ST segment (e.g., 0, 1, 2)
      noofmajorvessels: 0, // Number of major vessels colored by fluoroscopy (0-3)
    };

    setLoading(true); // Show loading state
    setResponse(null); // Clear previous response

    try {
      console.log('Submitting data:', defaultData);

      // Make the API request to upload the default data
      const response = await axios.post(`${ipAddress}/upload`, defaultData, {
        headers: {
          'Content-Type': 'application/json', // Indicate that we're sending JSON
        },
      });

      console.log('Backend Response:', response.data);

      // Handle the response
      let status = response.data.status === 'success';
      if (status) {
        let responseData = response.data.records;
        setResponse(responseData); // Set the response data
        showToast('Data submitted successfully!');
      } else {
        showToast('Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting data:', err);

      // Handle errors and display relevant messages
      if (err.response) {
        const errorMessage = err.response.data.error || 'Something went wrong';
        showToast(errorMessage);
      } else if (err.request) {
        showToast('No response from server');
      } else {
        showToast(err.message);
      }
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const handleNavigate = () => {
    // setFormData(null)
    navigation.navigate('FormUpload', {formValues, setFormValues});
  };
  // Form Prediction Tab Content
  const FormPredictionTab = () => (
    <View
      style={[
        {backgroundColor: theme.colors.background, padding: 10, flex: 1},
      ]}>
      <TouchableOpacity onPress={handleNavigate}>
        <CustomText
          style={[
            {
              fontFamily: fonts.SemiBold,
              fontSize: 16,
              color: theme.colors.primary,
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
        Complete your form upload process by navigating to the Form Upload page.
      </CustomText>
      {/* Dynamically display all form data */}
      {formData &&
        Object.keys(formData).map((key, index) => (
          <CustomText
            key={index}
            style={[{fontFamily: fonts.Regular, marginVertical: 5}]}>
            {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${formData[key]}`}
          </CustomText>
        ))}
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
    </View>
  );

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
                {item?.annotation}
              </CustomText>
              <CustomText
                style={[styles.tableCell, {fontFamily: fonts.Regular}]}>
                {item?.ds}
              </CustomText>
              <CustomText
                style={[styles.tableCell, {fontFamily: fonts.Regular}]}>
                {item?.ecg_value}
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
                onPress={handleFileUpload}>
                <CustomText
                  style={[
                    {
                      fontFamily: fonts.SemiBold,
                      color: theme.colors.background,
                    },
                  ]}>
                  Upload CSV
                </CustomText>
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
});

export default HeartPredictionPage;
