import React, { useContext } from 'react';
import {  View,Text,Linking,Alert  } from "react-native";
import { Button } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
function CargaManual({ navigation }){

    
        
        const copiarAlPortapapeles = async () => {
            const valorACopiar = "01800319702001005008254822024103013609116639";
            await Clipboard.setStringAsync(valorACopiar);
            Alert.alert("Copiado", "El valor se ha copiado al portapapeles");
            const url='https://ekuatia.set.gov.py/consultas/'
        
        
                Linking.openURL(url).catch((err) => console.error("No se pudo abrir la URL:", err));
          };
        
    
    return(
        <View>
            <Text>
                CARGA MANUAL
                <Button  onPress={ copiarAlPortapapeles}>REGISTRAR</Button>
            </Text>
        </View>
    )
}
export default CargaManual
