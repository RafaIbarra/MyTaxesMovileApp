import React, { useState, useEffect,useContext } from 'react';
import { View, Text,  StyleSheet, Alert,ActivityIndicator,TouchableOpacity,Linking   } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button } from 'react-native-paper';
import { AuthContext } from '../../../AuthContext';
import { useNavigation } from "@react-navigation/native";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome from '@expo/vector-icons/FontAwesome';
function QRScanner({ navigation }) {
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
  navigate("StackCamara")
 }

  const startScanning = () => {
    if (permission && permission.granted) {
      setScanning(true); // Iniciar el escaneo
      setScannedData(null)
      console.log('inicia la camara')
      console.log(estadocomponente.isHeaderVisible)
      // navigate("StackQrOpciones")
      // actualizarEstadocomponente('isHeaderVisible',false)
      // navigation.setOptions({
      //   tabBarVisible: false,
      //   headerShown: true,
      // });
      
    } else {
      requestPermission(); // Solicitar permiso si no está concedido
    }
  };

  const handleBarcodeScanned = async ({ data }) => {
    if (data && !isFetching) { // Verifica que no se esté procesando otra solicitud
      setIsFetching(true); // Marca que la solicitud está en progreso
      // console.log('LA DATA', data)
      try {
        

        console.log(data)
        const match = data.match(/Id=([^&]*)/);
        const idValue = match[1]
       
        const datacdc={
          'nombrecdc':idValue
        }
        actualizarEstadocomponente('datocdc',datacdc)
        actualizarEstadocomponente('isHeaderVisible',true)
        const url=data
        Linking.openURL(url).catch((err) => console.error("No se pudo abrir la URL:", err));
        navigate("DetalleXml")
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
      {!scanning ? (
        <>
          <Fontisto name="qrcode" style={styles.qrIcon} />
          {/* <Button title="Iniciar Escaneo" onPress={startScanning} /> */}
          <Button  style={{ marginTop: 10,marginBottom: 10,backgroundColor: 'rgba(44,148,228,0.7)',width: 70,height: 70,marginLeft: '45%',
                            justifyContent: 'center', alignItems: 'center', paddingLeft:15}}  
                  icon={() => {
                    // return <MaterialCommunityIcons name="content-save-check" size={30} color="white" />
                    return <FontAwesome name="camera-retro" size={45} color="white" />
                  }}
                  mode="elevated" 
                  textColor="white"
                  onPress={ActivarCamara}
                  >
                             
            </Button>
         
        </>
      ) : (
        <>
           <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              facing='back'
              onBarcodeScanned={handleBarcodeScanned} 
            />
            {isFetching && ( // Muestra el ActivityIndicator sobre la cámara
              <View style={styles.overlay}>
                <ActivityIndicator size="large" color="#006400" style={styles.spinner} />
                <Text style={styles.waitingText}>Detectado, esperando datos...</Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.closeIcon} 
              onPress={() => setScanning(false)}
            >
              <SimpleLineIcons name="close" size={40} color="red" />
            </TouchableOpacity>
          </View>
          {/* <Button title="Detener Escaneo" onPress={() => setScanning(false)} /> */}
          
        </>
      )}
  
      
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '100%',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative', // Permite el uso de posicionamiento absoluto para el spinner
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  scannedText: {
    marginTop: 20,
    fontSize: 18,
    color: 'green',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center', // Centra el contenido horizontalmente
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo semi-transparente para la superposición
  },
  spinner: {
    marginBottom: 10, // Espaciado entre el spinner y el texto
  },
  waitingText: {
    color: 'red', // Cambia el color del texto si es necesario
    fontSize: 25,
    textAlign: 'center', // Centra el texto
    fontWeight:'bold'
  },
  closeIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1, // Asegura que el icono esté al frente
  },
  
  qrIcon: {
    fontSize: 250, // Ajusta el tamaño según lo necesario
    color: '#000', // Cambia el color si es necesario
    marginBottom: 20, // Añade espacio debajo del ícono
    marginLeft:'20%'
  }
});
export default QRScanner;
