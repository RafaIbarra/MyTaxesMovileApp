import React, { useState, useEffect,useContext } from 'react';
import { View,   StyleSheet, Alert,TouchableOpacity,Linking   } from 'react-native';
import { useCameraPermissions } from 'expo-camera';

import { AuthContext } from '../../../AuthContext';
import { useNavigation } from "@react-navigation/native";
import ScreensCabecera from '../../ScreensCabecera/ScreensCabecera';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome from '@expo/vector-icons/FontAwesome';

function QRScanner({ navigation }) {
  const[title,setTitle]=useState('CARGA QR')
  const[backto,setBackto]=useState('MainTabs2')
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [isFetching, setIsFetching] = useState(false); 
  const {  actualizarEstadocomponente } = useContext(AuthContext);
  const { estadocomponente } = useContext(AuthContext);
  const { navigate } = useNavigation();
  useEffect(() => {
    if (permission && !permission.granted) {
      Alert.alert("Permiso denegado", "No se concedió permiso para acceder a la cámara.");
    }
  }, [permission]);

 const ActivarCamara=()=>{
  // navigate("StackCamara")
  actualizarEstadocomponente('activecamara',true)
 }

  const startScanning = () => {
    if (permission && permission.granted) {
      setScanning(true); // Iniciar el escaneo
      setScannedData(null)
      
     
      
    } else {
      requestPermission(); // Solicitar permiso si no está concedido
    }
  };

  const handleBarcodeScanned = async ({ data }) => {
    if (data && !isFetching) { // Verifica que no se esté procesando otra solicitud
      setIsFetching(true); // Marca que la solicitud está en progreso
  
      try {
        

      
        const match = data.match(/Id=([^&]*)/);
        const idValue = match[1]
       
        const datacdc={
          'nombrecdc':idValue
        }
        actualizarEstadocomponente('datocdc',datacdc)
        actualizarEstadocomponente('isHeaderVisible',true)
        const url=data
        Linking.openURL(url).catch((err) => console.error("No se pudo abrir la URL:", err));
        
        // setScannedData(dataFetched['url']); // Guarda los datos para mostrarlos en la app
  
      } catch (error) {
        console.error("Error al realizar el fetch:", error);
      } finally {
        setIsFetching(false); // Restablece el estado de la petición después de que se complete
        setScanning(false); // Detiene el escaneo después de recibir la respuesta
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScreensCabecera title={title} backto={backto}></ScreensCabecera>
      <View style={styles.containerobjets}>

        
            <Fontisto name="qrcode" style={styles.qrIcon} />
            <TouchableOpacity style={[styles.botoncamara,{ backgroundColor:'#57DCA3'}]} onPress={ActivarCamara}>
                    <FontAwesome name="camera-retro" size={45} color="white" />
            </TouchableOpacity> 
          
         
        
        
      </View>
  
      
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  containerobjets:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'stretch',
    // width: '100%',
   
  },
  botoncamara:{
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(44,148,228,0.7)',
    width: 70,
    height: 70,
    marginLeft: '45%',
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius:20
    
  },

  scannedText: {
    marginTop: 20,
    fontSize: 18,
    color: 'green',
  },
 
  qrIcon: {
    fontSize: 250, // Ajusta el tamaño según lo necesario
    color: '#000', // Cambia el color si es necesario
    marginBottom: 20, // Añade espacio debajo del ícono
    marginLeft:'20%'
  }
});
export default QRScanner;
