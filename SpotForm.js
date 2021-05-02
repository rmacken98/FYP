import {
  StyleSheet,
  View,
  TextInput,
  Text,
} from 'react-native';
import {Button} from './components/Button';
import React from './node_modules/react';
import { Component } from './node_modules/react';
  import {withFormik} from './node_modules/formik';
import * as yup from './node_modules/yup';
import { addSpot, updateSpot, uploadSpot } from './SkateSpotsApi'
import MyImagePicker from './components/myImagePicker';
import Firebase from './config/Firebase';



const SpotForm = ( props)=> {

 
  const setSpotImage = (image) => {
    props.setFieldValue('imageUri', image.uri);
  }
 
 const k = props.setLongitude
 const x = props.setLatitude
 const user = Firebase.auth().currentUser.uid

return (
    <View style={styles.container}>
         <MyImagePicker image={props.spot.image} onImagePicked={setSpotImage}
      />
    <TextInput
    style={styles.formInput}
    placeholder='Spot name'
   
    onChangeText = {text => { props.setFieldValue('name', text);  props.setFieldValue('longitude', k); props.setFieldValue('latitude', x), props.setFieldValue('createdBy',user) }}
    />

    <Text>{props.errors.name}</Text>
      <TextInput
    style={styles.formInput}
    placeholder='Longitude'
     value =  {`${props.setLongitude}`}
    />
    <Text>{props.errors.longitude}</Text>
    <TextInput
     style={styles.formInput}
    placeholder='Latitiude'
     value = {`${props.setLatitude}`}
    />
      <Text>{props.errors.latitude}</Text>
     
<Button
onPress={props.handleSubmit}
title={"Submit"}
>

</Button>



    </View>
    

)
}

const styles = StyleSheet.create({
  container: {
      marginTop:10,
      width: '100%',
      borderColor: '#eee',
      borderBottomWidth: 2,
      alignItems: 'center'
  },
  label: {
  padding:5,
  paddingBottom:0, 
  color:'#333',
  fontSize: 17,
  fontWeight : '700',
  width: '100%'
},
  input: {
      paddingRight: 5,
      paddingLeft : 5,
      paddingBottom :2,
      color: '#333',
      fontSize:18
  ,
  fontWeight: '700',
  width: '100%'
  },
  formInput: {
      width: 300,
      height: 50,
      borderColor: '#B5B4BC',
      borderWidth: 1,
      marginBottom: 16,
      padding: 8
    },
});

export default withFormik({
    mapPropsToValues: ()=>({name:'',
    createdBy:'',
     longitude:0,
     latitude:0,
     imageUri: null
    
    }),
    enableReinitialize: true,
    validationSchema : (props) => yup.object().shape({
        name : yup.string().required(),
         longitude: yup.number().required(),
         latitude: yup.number().required()
    }),
    handleSubmit: (values, {props}) => {
      if(props.spot.id){
      values.id = props.spot.id;
     // values.latitude= 88
      // values.latitude= props.setLatitude;
      // values.longitude= props.setLongitude;
      values.createdAt = props.spot.createdAt;
      values.image= props.spot.image;
      uploadSpot(values, props.onSpotUpdated, {updating: true})

      
  }
  else {
   
      uploadSpot(values, props.onSpotAdded, {updating: false})

  }
  },
})(SpotForm);