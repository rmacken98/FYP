import {
    StyleSheet,
    View,
    TextInput,
    Text,
    Button
  } from 'react-native';
  import React from 'react';
  import {withFormik} from 'formik';
  import * as yup from 'yup';
  import { addSpot, updateSpot, uploadSpot } from './SkateSpotsApi'
  import MyImagePicker from './components/MyImagePicker';
  import Firebase from './config/Firebase';
  
  
  const EditForm = ( props)=> {
  
      setSpotImage = (image) => {
          props.setFieldValue('imageUri', image.uri);
      }
   const k = props.setLongitude
   const x = props.setLatitude
   const user = Firebase.auth().currentUser.email
  return (
      <View>
           <MyImagePicker image={props.spot.image} onImagePicked={setSpotImage} />
      <TextInput
      
      placeholder='Spot name'
     
      onChangeText = {text => { props.setFieldValue('name', text);  props.setFieldValue('longitude', k); props.setFieldValue('latitude', x), props.setFieldValue('createdBy',user) }}
      />
  
      <Text>{props.errors.name}</Text>
        <TextInput
      
      placeholder='Longitude'
       value =  {`${props.setLongitude}`}
      // onChangeText = {text => { props.setFieldValue('longitude', k) }}
      />
      <Text>{props.errors.longitude}</Text>
      <TextInput
     
      placeholder='Latitiude'
       value = {`${props.setLatitude}`}
      // onChangeText = {text => { props.setFieldValue('latitude', x) }}
      />
        <Text>{props.errors.latitude}</Text>
       
  <Button
  title='Submit'
  onPress={() => props.handleSubmit()}
  />
  
      </View>
      
  
  )
  }
  
  
  
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
       
          uploadSpot(values, props.onSpotUpdated, {updating: false})
  
      }
      },
  })(EditForm);
  
  
  