import React, { useState, useEffect,useContext } from 'react';
import { View, Button, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from '../../../AuthContext';
import AndroidXmlHandler from '../../XmlHandler/AndroidXmlHandler';

const CargaArchivoXml= ({ navigation }) => {
    const { estadocomponente } = useContext(AuthContext);
    const {  actualizarEstadocomponente } = useContext(AuthContext);
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasAccess, setHasAccess] = useState(true);
    const [status, setStatus] = useState('');
    
    const { navigate } = useNavigation();


    const checkDirectoryAccess = async () => {
        const access = await AndroidXmlHandler.hasDirectoryAccess();
        setHasAccess(access);
        if (access) {
          //loadXmlFiles();
          await filtrodatos()
        }
      };
    
      const loadXmlFiles = async () => {
        try {
         
          // const nombrecdc=estadocomponente.datocdc.nombrecdc
          
          const files = await AndroidXmlHandler.listXmlFiles();
          // Convertir la lista de URIs a objetos con información más detallada
          const formattedFiles = files.map(fileUri => ({
            uri: fileUri,
            fileName: decodeURIComponent(fileUri.split('%2F').pop()), // Decodifica el nombre del archivo
            timestamp: new Date().getTime() // Podrías obtener la fecha real del archivo si lo necesitas
          }));
          
          
          // console.log('resultado: ',resultado)
          
          return formattedFiles
        } catch (error) {
          setStatus(`Error al cargar archivos: ${error.message}`);
        }
      };
    
      const filtrodatos = async()=>{
        const datafiles=await loadXmlFiles()
        // const nombrecdc="01800319702001005008254822024103013609116639.xml"
        const nombrecdc=estadocomponente.datocdc.nombrecdc+'.xml'
        console.log(nombrecdc)
        if (datafiles){
          // console.log('listo para probar')
          const resultado = datafiles.filter(file => file.fileName === nombrecdc);
          console.log(resultado.length )
          if (resultado.length>0){

              handleUploadXml(resultado[0].uri)
          }else{
            Alert.alert(`No encontrado ${nombrecdc} `);
          }
          
          
          
        }
        // console.log(estadocomponente.datocdc.nombrecdc)
        // console.log('completos: ',datafiles)
    
      }
    
      const handleSelectDirectory = async () => {
        setIsProcessing(true);
        setStatus('Seleccionando directorio...');
        try {
          const directory = await AndroidXmlHandler.selectDirectory();
          if (directory) {
            setHasAccess(true);
            setStatus('Directorio seleccionado correctamente');
            await loadXmlFiles();
          }
        } catch (error) {
          setStatus(`Error: ${error.message}`);
        } finally {
          setIsProcessing(false);
        }
      };
    
      const handleUploadXml = async (fileUri) => {
        setIsProcessing(true);
        setStatus('Subiendo archivo...');
        try {
         const data= await AndroidXmlHandler.uploadXmlFile(
            fileUri);
          
          setStatus('Archivo subido correctamente');
          actualizarEstadocomponente('datafactura',data)
          navigate("DetalleFactura")
        } catch (error) {
          setStatus(`Error: ${error.message}`);
        } finally {
          setIsProcessing(false);
        }
      };
    
      
    
      return (
        <View style={styles.container}>
          {!hasAccess && (
            <Button 
              title="Seleccionar Directorio MyTaxes" 
              onPress={handleSelectDirectory}
              disabled={isProcessing}
            />
          )}
    
          
          {
            hasAccess&&(

                <Button 
                    title="Cargar archivo" 
                    onPress={checkDirectoryAccess}
                   
                  />
            )
          }
          
    
          {isProcessing && <ActivityIndicator style={styles.loader} />}
          
          <Text style={styles.status}>{status}</Text>
        </View>
      );
}
const styles = StyleSheet.create({
    container: {
      padding: 20,
      flex: 1,
    },
    header: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      color: '#333',
    },
    fileItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      backgroundColor: '#fff',
      borderRadius: 8,
    },
    fileInfo: {
      flex: 1,
      marginRight: 10,
    },
    fileName: {
      fontSize: 16,
      color: '#333',
      marginBottom: 4,
    },
    fileDate: {
      fontSize: 12,
      color: '#666',
    },
    separator: {
      height: 1,
      backgroundColor: '#eee',
      marginVertical: 4,
    },
    loader: {
      marginVertical: 10,
    },
    status: {
      marginTop: 10,
      textAlign: 'center',
      color: '#666',
    },
    noFiles: {
      textAlign: 'center',
      color: '#666',
      marginTop: 20,
    }
  });
export default CargaArchivoXml