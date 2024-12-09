import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useTheme} from 'react-native-paper';
import CustomText from '../../customText/CustomText';
import {fonts} from '../../customText/fonts';

import DocumentPicker from 'react-native-document-picker';
import { useAuthContext } from '../../context/GlobaContext';
import { uploadImageToCloudinary } from '../../cloudinary';
const Tab = createMaterialTopTabNavigator();

const HeartPredictionPage = () => {
  let theme = useTheme();
  const {ipAddress}=useAuthContext();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [file, setFile] = useState(null);

 
const handleFileUpload = async () => {
   // Simulate CSV data with annotation, date (da), and ecg value
   const dummyCsvData = [
    { annotation: 'Annotation 1', da: 'Mon, 09 Dec 2874 22:43:06 GMT', ecgvalue: 0.831311820348805404 },
    { annotation: 'Annotation 2', da: 'Tue, 10 Dec 2874 14:30:10 GMT', ecgvalue: 0.755312311124712362 },
    { annotation: 'Annotation 3', da: 'Wed, 11 Dec 2874 09:12:50 GMT', ecgvalue: 0.912345987654341234 },
    { annotation: 'Annotation 4', da: 'Thu, 12 Dec 2874 18:04:55 GMT', ecgvalue: 0.678123121212122358 },
    { annotation: 'Annotation 5', da: 'Fri, 13 Dec 2874 07:56:30 GMT', ecgvalue: 0.924123991134522991 },
  ];

  setCsvData(dummyCsvData); // Set the dummy data for the table
    // try {
    //   // Open document picker to select an image
    //   const res = await DocumentPicker.pick({
    //     type: [DocumentPicker.types.images],
    //   });
    //   console.log(res[0].uri);
      
      
    //   setFile(res[0].uri); // Store the file in state (you can use this later if needed)
    
    //    // // Upload the selected image to Cloudinary
    //    const uploadedImageUrl = await uploadImageToCloudinary(res[0]?.uri);
    //    console.log('Uploaded Image URL:', uploadedImageUrl);
    //    // Prepare the form data for prediction
    //    const formData = new FormData();
    //    formData.append('file', {
    //      uri: uploadedImageUrl ,
    //      type: 'image/jpeg', // Use the correct MIME type based on your image
    //      name: 'image.jpg', // Use file name if available
    //    });
 
    //    console.log(ipAddress,'ipAddress');
    //   let response = await axios.post(
    //     // `http://10.0.2.2:5000/predict`,  //for Android
    //     `${ipAddress}/predict`, //Live
    //     formData,
    //     {
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     },
    //   );
    //   console.log(response,'response');
      
    //   // Log the response and handle the prediction result
    //   if (response.data && response.data) {
    //     setPrediction(response.data);
    //     // Update the UI with the prediction result
    //     // Example: setPrediction(response.data.prediction);
    //   } else {
    //   }
    // } catch (err) {
    //   // If DocumentPicker is cancelled, do nothing
    //   if (!DocumentPicker.isCancel(err)) {
    //     console.error('Error during file selection/upload:', err);
    //   }
    // }
  };
  // State for form values
  const [formValues, setFormValues] = useState({});
  console.log(formValues, 'formValues');

  // Handle input change
  const handleChange = (key, value) => {
    // setFormValues(prevValues => ({
    //   ...prevValues,
    //   [key]: value,
    // }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResponse(null); // Clear previous response
    console.log(formValues, 'formValues');

    // try {
    //   const res = await axios.post(
    //     'http://<your-backend-url>/predict',
    //     formData,
    //   );
    //   setResponse(res.data); // Save response to state
    // } catch (err) {
    //   setResponse({error: 'Something went wrong. Please try again later.'});
    // } finally {
    //   setLoading(false);
    // }
  };

  // Form Prediction Tab Content
  const FormPredictionTab = () => (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <View
        style={[
          {backgroundColor: theme.colors.background, padding: 10, flex: 1},
        ]}>
        {/* <FlatList
     keyboardShouldPersistTaps="handled" 
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={formFields}
        renderItem={renderInput}
        keyExtractor={item => item.key}
        ListFooterComponent={
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
        }
      /> */}

        {/* Age Input */}

        <TextInput
          style={styles.input}
          placeholder="Enter Age"
          value={formValues.age}
          //   keyboardType="numeric"
          onChangeText={value => handleChange('age', value)}
        />

        {/* Gender Input */}

        <TextInput
          style={styles.input}
            placeholder="Enter Gender"
          onChangeText={value => handleChange('gender', value)}
        />

        {/* Chest Pain Input */}

        <TextInput
          style={styles.input}
          placeholder="Enter Chest Pain Type"
          onChangeText={value => handleChange('chestpain', value)}
        />

        {/* Resting Blood Pressure Input */}

        <TextInput
          style={styles.input}
          placeholder="Enter Resting Blood Pressure"
          keyboardType="numeric"
          onChangeText={value => handleChange('restingBP', value)}
        />

        {/* Serum Cholestrol Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter Serum Cholestrol"
          keyboardType="numeric"
          onChangeText={value => handleChange('serumcholestrol', value)}
        />

        {/* Fasting Blood Sugar Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter Fasting Blood Sugar"
          keyboardType="numeric"
          onChangeText={value => handleChange('fastingbloodsugar', value)}
        />

        {/* Resting Electrocardiographic Results Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter Electrocardiographic Results"
          keyboardType="numeric"
          onChangeText={value => handleChange('electrocardiographic', value)}
        />

        {/* Max Heart Rate Achieved Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter Max Heart Rate"
          onChangeText={value => handleChange('maxheartrate', value)}
          keyboardType="numeric"
        />

        {/* Exercise Induced Angina Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter Exercise Induced Angina"
          keyboardType="numeric"
          onChangeText={value => handleChange('exerciseangia', value)}
        />

        {/* ST Depression (Old Peak) Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter Old Peak"
          keyboardType="numeric"
          onChangeText={value => handleChange('oldpeak', value)}
        />

        {/* Slope of Peak Exercise Input */}

        <TextInput
          style={styles.input}
          placeholder="Enter Slope of Peak"
          keyboardType="numeric"
          onChangeText={value => handleChange('slope', value)}
        />

        {/* Number of Major Vessels Input */}

        <TextInput
          style={styles.input}
          placeholder="Enter Number of Major Vessels"
          keyboardType="numeric"
          onChangeText={value => handleChange('noofmajorvessels', value)}
        />

        <TouchableOpacity
          style={[styles.button, {backgroundColor: theme.colors.onBackground}]}
          onPress={handleSubmit}>
          <CustomText
            style={[
              {fontFamily: fonts.SemiBold, color: theme.colors.background},
            ]}>
            Predict
          </CustomText>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
                {item.annotation}
              </CustomText>
              <CustomText
                style={[styles.tableCell, {fontFamily: fonts.Regular}]}>
                {item.da}
              </CustomText>
              <CustomText
                style={[styles.tableCell, {fontFamily: fonts.Regular}]}>
                {item.ecgvalue}
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
