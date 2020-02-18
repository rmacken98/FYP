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
import myImagePicker from './components/myImagePicker';


const SpotForm = ( props)=> {

    setSpotImage = (image) => {
        props.setFieldValue('imageUri', image.uri);
    }


return (
    <View>
         <myImagePicker image={props.spot.image} onImagePicked={setSpotImage} />
    <TextInput
    
    placeholder='Spot name'
    onChangeText = {text => { props.setFieldValue('name', text) }}
    />

    <Text>{props.errors.name}</Text>
      <TextInput
    
    placeholder='Longitude'
    onChangeText = {text => {  props.setLongitude(text) }}
    />
    <Text>{props.errors.longitude}</Text>
    <TextInput
    placeholder='Latitiude'
    onChangeText = {text => { props.setFieldValue('name', text) }}
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
        values.createdAt = props.spot.createdAt;
        values.image= props.spot.image;
        uploadSpot(values, props.onSpotUpdated, {updating: true})

        // updateFood(values, props.onSpotUpdated);
    }
    else {
        // addSpot(values, props.onSpotAdded)
        uploadSpot(values, props.onSpotAdded, {updating: false})

    }
    },
})(SpotForm);


