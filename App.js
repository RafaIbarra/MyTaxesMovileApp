
import React,{useEffect,useState} from "react";
import {  StyleSheet,Text  } from 'react-native';
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';

import { AuthProvider } from "./AuthContext";
import Navigation from "./Navigation";

import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import "react-native-gesture-handler";
SplashScreen.preventAutoHideAsync()
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'EduBold': require('./assets/fonts/EduAUVICWANTPre-Bold.ttf'),
          'EduMedium': require('./assets/fonts/EduAUVICWANTPre-Medium.ttf'),
          'EduRegular': require('./assets/fonts/EduAUVICWANTPre-Regular.ttf'),
          'EduSemiBold': require('./assets/fonts/EduAUVICWANTPre-SemiBold.ttf'),
          'MontserratBold': require('./assets/fonts/MontserratAlternates-Bold.ttf'),
          'MontserratItalic': require('./assets/fonts/MontserratAlternates-BoldItalic.ttf'),
          'MontserratRegular': require('./assets/fonts/MontserratAlternates-Regular.ttf'),
          'MontserratSemiBold': require('./assets/fonts/MontserratAlternates-SemiBold.ttf'),
          
         
          'SenRegular': require('./assets/fonts/Sen-Regular.ttf'),
          'SenBold': require('./assets/fonts/Sen-Bold.ttf'),




        });
        
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error cargando las fuentes:', error);
      } finally {
        SplashScreen.hideAsync(); // Esconde la pantalla de carga cuando todo esté listo
      }
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Mantén la pantalla vacía mientras las fuentes cargan
  }
  if (fontsLoaded){

    return (
        <SafeAreaView style={styles.container}>
          <AuthProvider>
            <Navigation /> 
          </AuthProvider>
        </SafeAreaView>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
     backgroundColor: 'rgba(28, 44, 52, 0.9)'
  }
});