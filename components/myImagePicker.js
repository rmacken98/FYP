import React, { useState, useEffect } from 'react'
import {
  View,
  Button,
  Image,
  StyleSheet
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';


const MyImagePicker = ({ image, onImagePicked }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  const [selectedImage, setSelectedImage] = useState();
  
  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasCameraPermission("granted");
};


  useEffect(() => {
    _requestCameraPermission();

    if (image) {
      console.log("useEffect: " + image);
      setSelectedImage({ uri: image });
    }
  }, [image])

  
  _getPhotoLibrary = async () => {
    console.log('kkkkkhg')
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
      if (!result.cancelled) {
        console.log(result);
        setSelectedImage({ uri: result.uri });
        onImagePicked({ uri: result.uri });
      } else {
              console.log("Idfghhgft.uri")

            }
          
  
  };

  
  
 



  // pickImageHandler = () => {
  //   ImagePicker.showImagePicker({ title: 'Pick an Image', maxWidth: 800, maxHeight: 600 },
  //     response => {
  //       if (response.error) {
  //         console.log("image error");
  //       } else {
  //         console.log("Image: " + response.uri)
  //         setSelectedImage({ uri: response.uri });
  //         onImagePicked({ uri: response.uri });
  //       }
  //     }
  //   )
  // }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={selectedImage} style={styles.previewImage} />
      </View>
      <View styels={styles.button}>
        <Button title="Pick Image" onPress={this._getPhotoLibrary} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center'
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#eee',
    width: '80%',
    height: 150
  },
  button: {
    margin: 8
  },
  previewImage: {
    width: '100%',
    height: '100%'
  }
})

export default MyImagePicker;