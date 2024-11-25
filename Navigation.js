import React,{useContext} from "react";
import { NavigationContainer,DefaultTheme,DarkTheme as NavigationDarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View,Text,TouchableOpacity } from "react-native";
import { useTheme,useColorScheme } from '@react-navigation/native';
import { AuthContext } from "./AuthContext";



import QRScanner from "./Componentes/Screens/Qr/QRScanner";

import XmlFileUploader from "./Componentes/XmlFileUploader/XmlFileUploader"
import ListadoFacturas from "./Componentes/Screens/ListadoFacturas/ListadoFacturas";
import ResumenMes from "./Componentes/Screens/ResumenMes/ResumenMes";
import CargaManual from "./Componentes/Screens/CargaManual/CargaManual";
import DetalleXml from "./Componentes/Screens/DetalleFacturaXml/DetalleXml";
import DetalleFactura from "./Componentes/Screens/DetalleFactura/DetalleFactura";
import Camara from "./Componentes/Screens/Camara/Camara";
import CargaArchivoXml from "./Componentes/Screens/CargaArchivoXml/CargaArchivoXml";
import Login from "./Componentes/Screens/Login/Login";
import RegistroUsuario from "./Componentes/Screens/RegistroUsuario/RegistroUsuario";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


const MyTheme = {
  ...DefaultTheme,
  fonts: {
    // regular: { fontFamily: 'EduRegular', fontWeight: 'normal' }, // Regular
    // medium: { fontFamily: 'EduMedium', fontWeight: 'normal' },   // Medium
    // light: { fontFamily: 'EduSemiBold', fontWeight: 'normal' },  // SemiBold
    // thin: { fontFamily: 'EduBold', fontWeight: 'normal'},  // Bold

    monserratbold: { fontFamily: 'MontserratBold', fontWeight: 'normal'},  // Bold
    monserratbolditalic: { fontFamily: 'MontserratItalic', fontWeight: 'normal'},

    // regular: { fontFamily: 'MontserratRegular', fontWeight: 'normal' },
    // regularbold: { fontFamily: 'MontserratSemiBold', fontWeight: 'normal' }, 

    regular: { fontFamily: 'SenRegular', fontWeight: 'normal' },
    regularbold: { fontFamily: 'MontserratSemiBold', fontWeight: 'normal' }, 
    
  },
    colors: {
      ...DefaultTheme.colors,
      // background: 'rgb(28,44,52)',
      // backgroundInpunt: 'rgb(28,44,52)',
      textbordercoloractive:'rgb(44,148,228)',
      textbordercolorinactive:'gray',
      text:'black',
      textsub:'gray',
      color:'red',
      primary:'white',
      tintcolor:'red',
      card: 'rgb(28,44,52)', //color de la barra de navegadores
      commentText:'red',
      bordercolor:'#d6d7b3',
      iconcolor:'white',
      botoncolor:'rgb(44,148,228)',
      subtitulo:'rgba(32,93,93,255)'
      
    },
    
};


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const StackCarga=createNativeStackNavigator();
const StackQr=createNativeStackNavigator();

function OpcionesCargaTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Manual" 
        component={CargaManual} 
        
        options={{
          tabBarLabel: 'Manual',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="hand-holding-medical" size={24} color="black" />
          ),
          
          // headerShown: false,
          }}
        />
      <Tab.Screen name="QR" 
        component={QRScanner} 
        options={{
          tabBarLabel: 'QR',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="qr-code-scanner" size={24} color="black" />
          ),
          
          //  headerShown: false,
          }}
      />
       
    </Tab.Navigator>
  );
}

function MainTabs({ navigation }) {
  const { colors } = useTheme();
  return (
    <Tab.Navigator>
      <Tab.Screen name="Resumen" 
        component={ResumenMes}
        options={{
          tabBarLabel: 'Resumen',
          tabBarIcon: ({ color, size }) => (
              <Ionicons name="book" color="black" size={30} />
          ),
          
          
          }}
      />
      <Tab.Screen name="Listado" 
        component={ListadoFacturas} 
        options={{
          
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="filetext1" size={24} color="black" />
          ),
          
          
          headerShown:false
          }}
        />
       
   
    </Tab.Navigator>
  );
}

function StackCargaOpciones(){
  return (
    <StackCarga.Navigator screenOptions={{ headerShown: false }}>
      <StackCarga.Screen name="OpcionesCarga" component={OpcionesCargaTabs} options={{title: 'Opciones de carga'}} />
      <StackCarga.Screen name="DetalleXml" component={DetalleXml} options={{title: 'DetalleXml',headerShown: true}} />
      
      <StackCarga.Screen name="CargaArchivoXml" component={CargaArchivoXml} options={{title: 'XmlFileUploader',headerShown: true}} />

      <StackCarga.Screen name="DetalleFactura" component={DetalleFactura} options={{title: 'DetalleFactura',headerShown: true}} />
      <StackCarga.Screen name="StackCamara" component={StackCamara} options={{title: 'StackCamara'}} />
      
    </StackCarga.Navigator>
  );
}
function StackCamara() {
  return (
    <StackQr.Navigator 
    screenOptions={{ headerShown: false }}
    
    >
      <StackQr.Screen 
        name="Camara" 
        component={Camara} 
        options={{
          // title: 'Escáner QR dffd',
          // Configura `headerShown: false` si quieres ocultarlo siempre
           headerShown: false,
        }}
      />
      <StackQr.Screen 
        name="CamraQRScanner" 
        component={QRScanner} 
        options={{
          // title: 'Escáner QR dffd',
          // Configura `headerShown: false` si quieres ocultarlo siempre
           headerShown: false,
        }}
      />
    </StackQr.Navigator>
  );
}
function MainNavigator() {
  const { estadocomponente } = useContext(AuthContext);
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{headerShown: false}}/>
      
      
      <Stack.Screen name="StackCargaOpciones" component={StackCargaOpciones} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

const StackInicio = createNativeStackNavigator();
function NavigationLogin(){

  return (
    <StackInicio.Navigator screenOptions={{ headerShown: true }}>
      <StackInicio.Screen name="Login" component={Login} options={{headerShown: false}}/>
      <StackInicio.Screen name="RegistroUsuario" component={RegistroUsuario} options={{headerShown: false}}/>
      
    </StackInicio.Navigator>
  );

}

function Navigation() {
  const { activarsesion, setActivarsesion } = useContext(AuthContext);
  return (

    <NavigationContainer theme={MyTheme }>
      {/* <NavigationLogin /> */}
      {activarsesion ? (<MainNavigator/>) : (<NavigationLogin  />)}
    </NavigationContainer>
  );
}

export default Navigation;