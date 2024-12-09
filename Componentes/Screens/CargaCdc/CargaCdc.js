import React, { useContext,useState, useEffect } from 'react';

// import { Button } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
// import { View, Text, Button, StyleSheet,Linking,Alert } from 'react-native';
import { View, Text, Button, StyleSheet, Platform, PermissionsAndroid, Alert,Linking } from 'react-native';

import { Audio } from 'expo-av';
import ScreensCabecera from '../../ScreensCabecera/ScreensCabecera';

function CargaCdc({ navigation }){
    const[title,setTitle]=useState('CARGA CDC')
    const[backto,setBackto]=useState('MainTabs2')
    const [hasPermission, setHasPermission] = useState(false);
    const [recording, setRecording] = useState();
    const [recordings, setRecordings] = useState([]);
    
    const checkMicrophonePermission = async () => {
        try {
          const { status } = await Audio.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        } catch (error) {
          console.error('Error al verificar permiso del micrófono:', error);
        }
      };



    
   

      async function startRecording() {
        try {
          const perm = await Audio.requestPermissionsAsync();
          if (perm.status === "granted") {
            await Audio.setAudioModeAsync({
              allowsRecordingIOS: true,
              playsInSilentModeIOS: true
            });
            const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            setRecording(recording);
          }
        } catch (err) {}
      }

      async function stopRecording() {
        setRecording(undefined);
    
        await recording.stopAndUnloadAsync();
        let allRecordings = [...recordings];
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        allRecordings.push({
          sound: sound,
          duration: getDurationFormatted(status.durationMillis),
          file: recording.getURI()
        });
    
        setRecordings(allRecordings);
      }


      function getDurationFormatted(milliseconds) {
        const minutes = milliseconds / 1000 / 60;
        const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
        return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`
      }
    
      function getRecordingLines() {
        return recordings.map((recordingLine, index) => {
          return (
            <View key={index} style={styles.row}>
              <Text style={styles.fill}>
                Recording #{index + 1} | {recordingLine.duration}
              </Text>
              <Button onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>
            </View>
          );
        });
      }
    
      function clearRecordings() {
        setRecordings([])
      }
        
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
        <Button title={recording ? 'Stop Recording' : 'Start Recording\n\n\n'} onPress={recording ? stopRecording : startRecording} />
        {getRecordingLines()}
        <Button title={recordings.length > 0 ? '\n\n\nClear Recordings' : ''} onPress={clearRecordings} />
            <Text style={styles.title}>
                Permiso del micrófono: {hasPermission ? 'Concedido' : 'Denegado'}
            </Text>
            <Button title="Verificar Permiso" onPress={checkMicrophonePermission} />
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
