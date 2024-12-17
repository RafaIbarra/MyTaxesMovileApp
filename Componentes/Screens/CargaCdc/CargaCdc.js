import React, { useContext,useState, useEffect } from 'react';

// import { Button } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
// import { View, Text, Button, StyleSheet,Linking,Alert } from 'react-native';
import { View, Text, Button, StyleSheet, Platform, PermissionsAndroid, Alert,Linking } from 'react-native';

import ScreensCabecera from '../../ScreensCabecera/ScreensCabecera';

function CargaCdc({ navigation }){
    const[title,setTitle]=useState('CARGA CDC')
    const[backto,setBackto]=useState('MainTabs2')
    const [hasPermission, setHasPermission] = useState(false);
    const [recording, setRecording] = useState();
    const [recordings, setRecordings] = useState([]);
    

        const copiarAlPortapapeles = async () => {
            const valorACopiar = "01800319702001005008254822024103013609116639";
            await Clipboard.setStringAsync(valorACopiar);
            Alert.alert("Copiado", "El valor se ha copiado al portapapeles");
            const url='https://ekuatia.set.gov.py/consultas/'
        
        
                Linking.openURL(url).catch((err) => console.error("No se pudo abrir la URL:", err));
          };
        
    
    return(


        <View style={styles.container}>
            <ScreensCabecera title={title} backto={backto}></ScreensCabecera>
       
        </View>

   
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      
      
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 10,
      marginRight: 40
    },
    fill: {
      flex: 1,
      margin: 15
    }
  });
  
export default CargaCdc
