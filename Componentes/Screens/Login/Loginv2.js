import React, {useState,useEffect, useContext,useRef} from "react";
import { View, Text, StyleSheet,Image,FlatList, Linking, TouchableOpacity,Animated,Easing,Keyboard,ImageBackground } from "react-native";
import { Button, TextInput,Dialog, Portal,PaperProvider } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";

import Handelstorage from "../../../Storage/handelstorage"
import ComprobarStorage from "../../../Storage/verificarstorage"
import Iniciarsesion from "../../../Apis/apiiniciosesion";
import Comprobarsesion from "../../../Apis/apicomprobarsesion";
import Procesando from "../../Procesando/Procesando";

import { AuthContext } from "../../../AuthContext";
import { Fontisto } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

// import '../assets/a'
export default function Loginv2({ navigation  }){
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { navigate } = useNavigation();
  const { activarsesion, setActivarsesion } = useContext(AuthContext);
  const { versionsys,setVersionsys } = useContext(AuthContext);
  const {sesiondata, setSesiondata} = useContext(AuthContext);
  const { reiniciarvalores } = useContext(AuthContext);
  const {periodo, setPeriodo} = useContext(AuthContext);
  

  const { colors,fonts  } = useTheme();
  const [username, setUsername] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [botonActivado, setBotonActivado] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  
  
  

  const [mensajeusuario,setMensajeusuario]=useState('Comprobando Sesion')
  const [comprobando,setComprobando]=useState(false)

  const [guardando,setGuardando]=useState(false)
  const [visibledialogo, setVisibledialogo] = useState(false)
  const[mensajeerror,setMensajeerror]=useState('')
  const [errorred,setErrorred]=useState(false)

  const showDialog = () => setVisibledialogo(true);
  const hideDialog = () => setVisibledialogo(false);

  const spinValueRef = useRef(new Animated.Value(0));

  let control=0
  const activarspin = () => {
        if (control===0){

            Animated.timing(spinValueRef.current, {
              toValue: 1,
              duration: 2000,
              easing: Easing.linear,
              useNativeDriver: true,
            }).start(() => {
                // Reinicia la animación una vez que haya terminado
                spinValueRef.current.setValue(0);
                activarspin();
              });
    
            setTimeout(() => {
                spinValueRef.current.stopAnimation();
                control=1
              }, 5000);
            
        }
      };
  const detenerSpin = () => {
        Animated.timing(spinValueRef.current).stop();
        
      };
  const spin = spinValueRef.current.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'], // Rango de rotación de 0 a 360 grados
      });
   
 
  const handleUserChange = (text) => {
    setUsername(text.trim());
    checkActivacionBoton(text, contrasena);
  };

  const handleContrasenaChange = (text) => {
    setContrasena(text);
     checkActivacionBoton(username, text);
  };

  const checkActivacionBoton = (doc, pass) => {
    if (doc !== '' && pass !== '') {
      setBotonActivado(true);
    } else {
      setBotonActivado(false);
    }
  };

  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const ingresar= async ()=>{
        
    setGuardando(true)
    const datos =await Iniciarsesion(username, contrasena)
 
    if(datos['resp']===200){
        
        // await AsyncStorage.setItem("user", (JSON.stringify(datos['data']['token'])));
        
        
        const userdata={
            token:datos['data']['token'],
            sesion:datos['data']['sesion'],
            refresh:datos['data']['refresh'],
            user_name:datos['data']['user_name'],
        }
        await Handelstorage('agregar',userdata,'')
        // setSesionname(datos['data']['user_name'])
        const datestorage=await Handelstorage('obtenerdate');
        const mes_storage=datestorage['datames']
        const anno_storage=datestorage['dataanno']
        
        setPeriodo(datestorage['dataperiodo'])
        if(mes_storage ===0 || anno_storage===0){

            await new Promise(resolve => setTimeout(resolve, 1500))
            
            const datestorage2=await Handelstorage('obtenerdate');
            
            setPeriodo(datestorage2['dataperiodo'])

        }
        reiniciarvalores()
        setGuardando(false)
        setSesiondata(datos['data']['datauser'])
        
        setActivarsesion(true)
        
       
    }else{
      
      setGuardando(false)

      showDialog(true)
      setMensajeerror( datos['data']['error'])
        
    }

    
  }

  const registrarse=()=>{
     navigate("RegistroUsuario")
  }

  const cargardatos=async()=>{
        
    setErrorred(false)
    setMensajeusuario('Comprobando Sesion')
    const datosstarage = await ComprobarStorage()
    
    const credenciales=datosstarage['datosesion']
    if (credenciales) {
        setComprobando(true)
        activarspin()
        
          const body = {};
          const endpoint='ComprobarSesionUsuario/'
          const result = await Comprobarsesion(endpoint, 'POST', body);
          const respuesta=result['resp']
          
          if (respuesta === 200){
              
              // setSesionname(datosstarage['user_name'])
              const datestorage=await Handelstorage('obtenerdate');
              setPeriodo(datestorage['dataperiodo'])
              
              setSesiondata(result['data']['datauser'])

              await new Promise(resolve => setTimeout(resolve, 7000))
              setMensajeusuario('Credenciales validas')
              detenerSpin()
              await new Promise(resolve => setTimeout(resolve, 2000))
              setComprobando(false)
              setActivarsesion(true)
              
          }else if (respuesta === 6000){
            setErrorred(true)
            setMensajeusuario('Conexion con el servidor')
              //setActivarsesion(true)
          } else {
              await new Promise(resolve => setTimeout(resolve, 7000))
              setMensajeusuario('Debes reiniciar sesion')
              detenerSpin()
              await Handelstorage('borrar')
              setActivarsesion(false)
              // setSesionname('')
              await new Promise(resolve => setTimeout(resolve, 2000))
              setComprobando(false)
          }
        

    

    } else {
        detenerSpin()
        setComprobando(false)
        await Handelstorage('borrar')
        setActivarsesion(false)
        // setSesionname('')
    }
}



  useEffect(() => {

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // Ocultar el botón cuando el teclado se muestra
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // Mostrar el botón cuando el teclado se oculta
      }
    );

    
    cargardatos()
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
      
  
  return (
    
    <PaperProvider>
    <View style={styles.containerPrincipal}>
      {/* Imagen de fondo */}
      <ImageBackground
        source={require('../../../assets/logo.png')}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle} // Ajustes de la imagen
        blurRadius={3} // Desenfoque
      >
        {/* Contenido sobre la imagen */}
        <View style={styles.overlay}>
          <Text style={[styles.welcomeText,{ fontFamily: fonts.monserratbolditalic.fontFamily }]}>¡Bienvenido!</Text>

          <View style={styles.containerSecundario}>
            <TextInput
              style={styles.Input}
              mode="outlined"
              textColor="white"
              label="Usuario"
              placeholder="Usuario"
              // Agrega aquí las props requeridas
            />
            <TextInput
              style={[styles.Input, { marginBottom: 30 }]}
              mode="outlined"
              textColor="white"
              label="Ingrese la Contraseña"
              placeholder="Contraseña"
              secureTextEntry
              // Agrega aquí las props requeridas
            />
            <Button style={styles.button}>Ingresar</Button>
          </View>
        </View>
      </ImageBackground>
    </View>
  </PaperProvider>
);
};

const styles = StyleSheet.create({
containerPrincipal: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
imageBackground: {
  flex: 1,
  width: '100%',
  height: '100%',
},
imageStyle: {
  opacity: 0.7, // Transparencia
},
overlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute', // Sobre la imagen
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.4)', // Fondo semitransparente sobre la imagen
},
welcomeText: {
  fontSize: 24,
  color: 'white',
  marginBottom: 20,
  textAlign: 'center',
  
},
containerSecundario: {
  width: '90%',
  alignItems: 'center',
  borderRadius: 15,
  padding: 20,
  backgroundColor: 'rgba(255,255,255,0.9)', // Fondo blanco translúcido
},
Input: {
  width: '100%',
  marginVertical: 10,
  backgroundColor: 'rgba(255,255,255,0.8)',
  borderRadius: 5,
  paddingHorizontal: 10,
},
button: {
  marginTop: 20,
  backgroundColor: 'rgba(44,148,228,0.7)',
  padding: 15,
  borderRadius: 10,
  width: '100%',
  alignItems: 'center',
},
});