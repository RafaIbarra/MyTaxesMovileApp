import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, TextInput, ScrollView, PermissionsAndroid, Alert,Platform  } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../../../AuthContext';
import { useNavigation } from "@react-navigation/native";
// import RNFS from 'react-native-fs';
// import * as FileSystem from 'expo-file-system';

import * as FileSystem from 'expo-file-system';
//import * as RNFS from 'react-native-fs';
import * as MediaLibrary from 'expo-media-library'; // Para Expo SDK 42+
import SAF from 'react-native-saf-x';



//import * as SAF from "react-native-storage-access-framework";

function DetalleXml({ navigation }) {
  const { estadocomponente } = useContext(AuthContext);
  const {  actualizarEstadocomponente } = useContext(AuthContext);
  const [nombrecdc, setNombrecdc] = useState('');
  const [urlToLoad, setUrlToLoad] = useState(null);
  const { navigate } = useNavigation();

  // Solicitar permisos al montar el componente
  
const requestStoragePermission = async () => {
    console.log('la version es: ', Platform.Version)
    if (Platform.Version >= 33) {
      try {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
        ];
        const granted = await PermissionsAndroid.requestMultiple(permissions);
        
        return Object.values(granted).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Permiso de Almacenamiento",
            message: "La aplicación necesita acceso al almacenamiento para leer archivos XML",
            buttonNeutral: "Preguntarme Después",
            buttonNegative: "Cancelar",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
  };



// const createFolder = async () => {
//   const folderPath = `${RNFS.ExternalStorageDirectoryPath}/MyAppFolder`;

//   try {
//     // Verifica si la carpeta ya existe
//     const exists = await RNFS.exists(folderPath);
//     if (!exists) {
//       // Si no existe, créala
//       await RNFS.mkdir(folderPath);
//       console.log('Carpeta creada exitosamente:', folderPath);
//     } else {
//       console.log('La carpeta ya existe:', folderPath);
//     }
//   } catch (error) {
//     console.error('Error al crear la carpeta:', error);
//   }
// }
// // Crear la carpeta
// const crearCarpeta = async () => {
//   const baseDir = RNFS.ExternalStorageDirectoryPath;
//   const carpetaApp = `${baseDir}/MyTaxesApp`;
//     try {
//         const existe = await RNFS.exists(carpetaApp);
//         if (!existe) {
//             await RNFS.mkdir(carpetaApp);
//             console.log('Carpeta creada en:', carpetaApp);
//         }
//     } catch (error) {
//         console.error('Error al crear carpeta:', error);
//     }
// };



const CargarArchivoSAFTree= async () => {
  
  const nombrearc = estadocomponente.datocdc['nombrecdc'] + '.xml';
  try {
      // Solicitar acceso a la carpeta Download
      const granted = await SAF.openDocumentTree(true); // true para persistir el permiso
      // const granted = estadocomponente.obtuvopermiso
      console.log("buscarArchivoSafBasic");
      
      if (granted) {
          // Listar archivos
          const files = await SAF.listFiles(granted.uri);
          console.log(nombrearc)
          const archivo = files.find(file => file.name === nombrearc);
          
          if (archivo ) {
             const fileUri = archivo.uri;
             console.log(fileUri)
             
             
            //  const formData = new FormData();
            //  formData.append('file', {
              
            //   uri:fileUri,
            //    name: nombrearc,
            //    type: 'application/xml',
            //  });
            
            //  // Envía la solicitud POST
            //  // const response = await fetch('https://tax.rafaelibarra.xyz/api/LecturaArchivoXml/', {
            //  const response = await fetch('http://192.168.1.102:8000/api/LecturaArchivoXml/', {
            //    method: 'POST',
            //    headers: {
            //      'Content-Type': 'multipart/form-data',
            //    },
            //    body: formData,
            //  });
         
            //  // Maneja la respuesta del servidor
            //  if (response.ok) {
            //    const data = await response.json();
            //    // console.log("Respuesta del servidor:", data);
            //    actualizarEstadocomponente('datafactura',data)
            //    navigate("DetalleFactura")
            //    //Alert.alert('Éxito', 'Archivo enviado correctamente');
               
            //  } else {
            //    console.error("Error en la respuesta del servidor:", response.status);
            //    Alert.alert('Error', 'No se pudo enviar el archivo');
            //  }
             const fileContent = await RNFS.readFile(fileUri, 'utf8');
             console.log(fileContent)
             
            // const uriTrans =fileUri.replace('primary:Download/MyTaxes/', 'primary%3ADownload%2FMyTaxes%2F')
            // //  const uriTrans =fileUri.replace('primary:', 'primary%3A').replace('AppTaxes/', 'AppTaxes%2F');
            // //const uriTrans =fileUri.replace('primary:Documents/MyTaxesApp/', 'primary%3ADocuments%2FMyTaxesApp%2F')


            // const urifinal=uriTrans.replace('tree','document')
            // console.log('urifinal: ',urifinal)
            // const tempPath = `${RNFS.TemporaryDirectoryPath}/${nombrearc}`;

            
            // await RNFS.copyFile(urifinal, tempPath);
            // await EnviarArchivo(tempPath,nombrearc)
            
              


          } else {
              Alert.alert('Archivo no encontrado');
          }
      }
  } catch (error) {
      console.error("Error:", error);
      Alert.alert('Error', error.message);
  }
};



const CargarArchivoSAFDocument = async () => {
  const nombrearc = estadocomponente.datocdc['nombrecdc'] + '.xml';
  console.log('CargarArchivoSAFDocument')
  try {
    // Selecciona el archivo usando SAF
    const initial=`Download/MyTaxes/${nombrearc}`
    console.log(initial)
    const archivo = await SAF.openDocument({
      mimeType: 'application/xml',
      initialDirectory: 'Download/MyTaxes/',
      
    });

    if (archivo && archivo[0] && archivo[0].uri) {
      // console.log("Archivo seleccionado:", archivo);

      // URI del archivo en el sistema de archivos
      const fileUri = archivo[0].uri;
      console.log('URI: ',fileUri)
      // Define una ruta temporal para copiar el archivo
      const tempPath = `${RNFS.TemporaryDirectoryPath}/${nombrearc}`;

      // Copia el archivo desde la URI de contenido a la ruta temporal
      await RNFS.copyFile(fileUri, tempPath);
      // console.log("Archivo copiado a ruta temporal:", tempPath);

      // Crea el FormData para la solicitud POST
      await EnviarArchivo(tempPath,nombrearc)
      actualizarEstadocomponente('obtuvopermiso',true)
      
    } else {
      console.log("No se seleccionó ningún archivo");
    }
  } catch (error) {
    console.error("Error:", error);
    Alert.alert('Error', error.message);
  }
};


const EnviarArchivo= async(temparchivo,nombrearchivo)=>{
  const formData = new FormData();
    formData.append('file', {
      uri: `file://${temparchivo}`,
      name: nombrearchivo,
      type: 'application/xml',
    });

    // Envía la solicitud POST
    // const response = await fetch('https://tax.rafaelibarra.xyz/api/LecturaArchivoXml/', {
    const response = await fetch('http://192.168.1.102:8000/api/LecturaArchivoXml/', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    // Maneja la respuesta del servidor
    if (response.ok) {
      const data = await response.json();
      // console.log("Respuesta del servidor:", data);
      actualizarEstadocomponente('datafactura',data)
      navigate("DetalleFactura")
      //Alert.alert('Éxito', 'Archivo enviado correctamente');
      
    } else {
      console.error("Error en la respuesta del servidor:", response.status);
      Alert.alert('Error', 'No se pudo enviar el archivo');
    }

    // Limpia el archivo temporal después del envío
    await RNFS.unlink(temparchivo);
}

const checkFileExistence = async () => {
  try {
    const fileDir = `${RNFS.ExternalStorageDirectoryPath}/Download/MyTaxes`; // Ruta donde esperas que el archivo esté
    const fileName=estadocomponente.datocdc['nombrecdc'] + '.xml'
    const filePath = `${fileDir}/${fileName}`;
    const exists = await RNFS.exists(filePath);
    
    if (exists) {
      console.log("Archivo encontrado:", filePath);
      sendFile(filePath); // Retorna la ruta del archivo encontrado
    } else {
      console.log("El archivo no existe.");
      return null;
    }
  } catch (error) {
    console.error("Error al verificar el archivo:", error);
    return null;
  }
};



const consultaarchivo= async()=>{
  // if (estadocomponente.obtuvopermiso){
    
  //   CargarArchivoSAFTree()
  // }else{
  //   CargarArchivoSAFDocument()
  // }
  CargarArchivoSAFDocument()
}




  return (
    <ScrollView style={{ marginLeft: 20, marginRight: 5, marginTop: 5 }}>
      <View style={styles.row}>
        <Text style={styles.label}>RUC EMPRESA:</Text>
        <TextInput style={styles.value}></TextInput>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>CDC:</Text>
        <Text style={styles.value}>{estadocomponente.datositem.cdc}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Fecha Emisión:</Text>
        <Text style={styles.value}>{estadocomponente.datositem.fechaemision}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>RUC:</Text>
        <Text style={styles.value}>{estadocomponente.datositem.rucreceptor}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Total Operación:</Text>
        <Text style={styles.value}>{Number(estadocomponente.datositem.totaloperacion).toLocaleString('es-ES')}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Total Iva:</Text>
        <Text style={styles.value}>{Number(estadocomponente.datositem.totaliva).toLocaleString('es-ES')}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Cantidad Items:</Text>
        <Text style={styles.value}>{estadocomponente.datositem.cantidaditems}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Url:</Text>
        <TouchableOpacity >
          <Text style={[styles.value, styles.link]}>{estadocomponente.datourl}</Text>
        </TouchableOpacity>
      </View>
      <Button
        style={{
          marginTop: 10,
          marginBottom: 10,
          marginLeft: 10,
          marginRight: 10,
          backgroundColor: 'rgba(44,148,228,0.7)',
        }}
        icon={() => {
          return <MaterialCommunityIcons name="content-save-check" size={30} color="white" />
        }}
        mode="elevated"
        textColor="white"
        onPress={consultaarchivo}
      >
        REGISTRAR
      </Button>

   
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'column',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default DetalleXml;
