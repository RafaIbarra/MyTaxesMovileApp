import React, { useContext,useState, useEffect } from 'react';

// import { Button } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
// import { View, Text, Button, StyleSheet,Linking,Alert } from 'react-native';
import { View,  StyleSheet } from 'react-native';



function CargaManual({ navigation }){
    
    const[title,setTitle]=useState('CARGA MANUAL')
    const[backto,setBackto]=useState('MainTabs2')


    
   

    
    return(


      <View style={styles.container}>
          
        
      </View>

   
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: '#fff',
      // alignItems: 'center',
      // justifyContent: 'center',
    },
    
  });
  
export default CargaManual
