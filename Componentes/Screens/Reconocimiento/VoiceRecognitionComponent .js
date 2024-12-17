import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Voice from '@react-native-voice/voice';

const VoiceRecognitionComponent = () => {
    let [started, setStarted] = useState(false);
    let [results, setResults] = useState([]);
  
    useEffect(() => {
      Voice.onSpeechError = onSpeechError;
      Voice.onSpeechResults = onSpeechResults;
  
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      }
    }, []);
  
    const startSpeechToText = async () => {
      try {
        console.log('fdf')
        await Voice.start("es-ES");
        setStarted(true);
      } catch (error) {
        console.error("Error starting speech recognition: ", error);
      }
    };
  
    const stopSpeechToText = async () => {
      await Voice.stop();
      setStarted(false);
    };
  
    const onSpeechResults = (result) => {
      setResults(result.value);
    };
  
    const onSpeechError = (error) => {
      console.log(error);
    };

  return (
    <View style={styles.container}>
    {!started ? <Button title='Start Speech to Text' onPress={startSpeechToText} /> : undefined}
    {started ? <Button title='Stop Speech to Text' onPress={stopSpeechToText} /> : undefined}
    {results.map((result, index) => <Text key={index}>{result}</Text>)}
    {/* <Text> VOZ </Text> */}
    
  </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default VoiceRecognitionComponent;