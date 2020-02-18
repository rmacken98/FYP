import React from 'react';
import { View, StyleSheet, Text, TextInput} from 'react-native'



const Input = ({label, value, onChangeText, placeholder, secureTextEntry}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
            onChangeText={onChangeText}
            placeholder={placeholder}
            style={styles.formInput}
            secureTextEntry={secureTextEntry}
            value={value}
            ></TextInput>
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

export {Input};