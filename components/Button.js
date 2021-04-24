import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';


const Button = ({ onPress, title,subTitle}) => {

    return(
        <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.text}>{title}</Text>
    <Text style={styles.text}>{subTitle}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button : {
        marginTop: 10,
        padding:10,
        width:'80%',
        backgroundColor: '#611a8a',
        borderRadius: 100,
        alignItems: 'center',
        color: "#fff",

    },
    text: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "700",
        alignSelf: "center",
       
    },
    
});

export {Button};