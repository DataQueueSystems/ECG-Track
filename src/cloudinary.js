

// import axios from 'axios';
// let cloudName = 'dkh8iurxw';
// let upload_preset = 'ECG-TRACK';

// export const uploadImageToCloudinary = async (
//   userName,
//   selectedImageUri,
//   roleType,
// ) => {
//   const randomNum = Date.now(); // Generate random number
//   const fileName = `${userName}_${randomNum}`; // Example: "AgentName_123456.png"
//   const data = new FormData();
//   data.append('file', {
//     uri: selectedImageUri,
//     type: 'image/png',
//     name: fileName,
//   });
//   data.append('upload_preset', upload_preset); // Replace with your Cloudinary unsigned preset
//   data.append('folder', roleType); // Specify folder name
//   try {
//     const res = await axios.post(
//       `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//       data,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       },
//     );
//     const uploadedData = {
//       imageUri: res.data.secure_url,
//       public_id: res.data.public_id,
//     }; // Get the uploaded image URL
//     return uploadedData; // Return the URL
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     return null; // Return null if there's an error
//   }
// };


import axios from 'axios';
import { showToast } from '../utils/Toast';
let cloudName = 'dkh8iurxw';
let upload_preset = 'ECG-TRACK';

export const uploadImageToCloudinary = async selectedImage => {
  if (!selectedImage) {
    return null;
  }
  const randomNum = Date.now(); // Generate random number
  const fileName = `Recyle_${randomNum}`; // Example: "AgentName_123456.png"
  const data = new FormData();
  data.append('file', {
    uri: selectedImage,
    type: 'image/png',
    name: fileName,
  });
  data.append('upload_preset', upload_preset); // Replace with your Cloudinary unsigned preset
  data.append('folder', 'RecyleImage'); // Specify folder name
  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    const uploadedUrl = res.data.secure_url; // Get the uploaded image URL
    return uploadedUrl; // Return the URL
  } catch (error) {
    console.error('Error uploading image:', error);
    showToast('Something went wrong');
    return null; // Return null if there's an error
  }
};

