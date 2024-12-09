import React,{useContext} from "react";
import { NavigationContainer,DefaultTheme,DarkTheme as NavigationDarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View,Text,TouchableOpacity } from "react-native";
import { useTheme,useColorScheme } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";

import { AuthContext } from "./AuthContext";


import DrawerContentInicio from "./Componentes/DrawerContentInicio/DrawerContentInicio";
import QRScanner from "./Componentes/Screens/Qr/QRScanner";
import XmlFileUploader from "./Componentes/XmlFileUploader/XmlFileUploader"
import ListadoFacturas from "./Componentes/Screens/ListadoFacturas/ListadoFacturas";
import ResumenMes from "./Componentes/Screens/ResumenMes/ResumenMes";
import CargaManual from "./Componentes/Screens/CargaManual/CargaManual";
import CargaCdc from "./Componentes/Screens/CargaCdc/CargaCdc";
import DetalleXml from "./Componentes/Screens/DetalleFacturaXml/DetalleXml";
import DetalleFactura from "./Componentes/Screens/DetalleFactura/DetalleFactura";
import Camara from "./Componentes/Screens/Camara/Camara";
import CargaArchivoXml from "./Componentes/Screens/CargaArchivoXml/CargaArchivoXml";
import Login from "./Componentes/Screens/Login/Login";
import Loginv2 from "./Componentes/Screens/Login/Loginv2";
import Loginv3 from "./Componentes/Screens/Login/Loginv3";
import RegistroUsuario from "./Componentes/Screens/RegistroUsuario/RegistroUsuario";
//import NumberListener from "./Componentes/Screens/NumberListener/NumberListener";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Card } from "react-native-paper";


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
    regularbold: { fontFamily: 'SenBold', fontWeight: 'normal' }, 
    
  },
    colors: {
      ...DefaultTheme.colors,
       //background: '#f8f9fa',
       background: '#ebedef',
       //background: 'red',
      // backgroundInpunt: 'rgb(28,44,52)',
      textbordercoloractive:'rgb(44,148,228)',
      textbordercolorinactive:'gray',
      text:'black',
      textcard:'white',
      textsub:'gray',
      color:'red',
      primary:'white',
      tintcolor:'gray',
      // card: 'rgb(28,44,52)', //color de la barra de navegadores
      //card: '#57DCA3', //color de la barra de navegadores UENO
      card: '#2a2a2c', 
      

      commentText:'black',
      bordercolor:'#d6d7b3',
      iconcolor:'white',
      botoncolor:'rgb(44,148,228)',
      acctionsbotoncolor:'#57DCA3',
      subtitulo:'rgba(32,93,93,255)'
      
    },
    
};


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const StackCarga=createNativeStackNavigator();
const StackQr=createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerInicio({navigation}){
  const { colors,fonts } = useTheme();
  const sizeicon=25
  const {periodo, setPeriodo} = useContext(AuthContext);
  const { navigate } = useNavigation();
  
  

  return(

  <Drawer.Navigator
    screenOptions={{
      headerTitle: ({}) => (
        <View >
          <Text style={{ color: colors.textcard,fontSize:20,fontFamily: fonts.regularbold.fontFamily}}>{periodo}</Text>
          
        </View>
      ),
      headerRight:({})=>(
        <View style={{marginRight:20}}>

          <TouchableOpacity onPress={() => navigate('StackPeriodo')} >
                    <AntDesign name="setting" size={27} color={colors.iconcolor} />
                    
                </TouchableOpacity>
        </View>
      ),
      headerTitleAlign:'center',
      headerStyle:{elevation:0},
      headerTintColor: colors.textcard,
      drawerLabelStyle: {marginLeft: 0,fontFamily: fonts.regularbold.fontFamily},
      tabBarLabelStyle:{borderWidth:1,bordercolor:'red'},
      
      
      
      
    }}
    drawerContent={DrawerContentInicio}
  >
      <Drawer.Screen name="InicioHome" 
      component={OpcionesStackTabs}
      options={{
        drawerLabel: 'Inicio',
        
        drawerIcon: ({size, color})=>(<AntDesign name="home" size={sizeicon} color={colors.iconcolor} />),
        drawerItemStyle:{borderBottomWidth:1,borderBottomColor:'white',marginBottom:5,marginTop:20}
        
        }}
      />
  
  </Drawer.Navigator>
  )

}
const Staktabs= createNativeStackNavigator();
function OpcionesStackTabs({ navigation }){
  return(

  <Staktabs.Navigator screenOptions={{ headerShown: false }}>
    <Staktabs.Screen name="MainTabs2" component={MainTabs} options={{title: 'MainTabs'}} />
    <Staktabs.Screen name="StackCargaOpciones" component={StackCargaOpciones} options={{title: 'StackCargaOpciones'}} /> 


    <Staktabs.Screen name="DetalleXml" component={DetalleXml} options={{title: 'DetalleXml',headerShown: true}} />
      
      <Staktabs.Screen name="CargaArchivoXml" component={CargaArchivoXml} options={{title: 'XmlFileUploader',headerShown: false}} />

      <Staktabs.Screen name="DetalleFactura" component={DetalleFactura} options={{title: 'DetalleFactura',headerShown: false}} />
    
  </Staktabs.Navigator>
  )

}




function OpcionesCargaTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Manual" 
        component={CargaManual} 
        
        options={{
          tabBarLabel: 'Manual',
          tabBarIcon: ({ color, size,focused }) => {
            let colorico
            colorico = focused ? "white" : "gray";
            return(
              <FontAwesome5 name="hand-holding-medical" color={colorico} size={24} />
            )
          },
          
          
           headerShown: false,
          }}
        />
      <Tab.Screen name="QR" 
        component={QRScanner} 
        options={{
          tabBarLabel: 'QR',
          tabBarIcon: ({ color, size,focused }) => {
            let colorico
            colorico = focused ? "white" : "gray";
            return(
              <MaterialIcons name="qr-code-scanner" color={colorico} size={24} />
            )
          },
           headerShown: false,
          }}
      />
      {/* <Tab.Screen name="CargaCdc" 
        component={CargaCdc} 
        options={{
          tabBarLabel: 'CDC',
          tabBarIcon: ({ color, size,focused }) => {
            let colorico
            colorico = focused ? "white" : "gray";
            // <AntDesign name="filetext1" size={24} color="black" />
            return(

              <FontAwesome name="file-code-o" color={colorico} size={24} />
            )
          },
          
           headerShown: false,
          }}
      /> */}
        <Tab.Screen name="CargaCdc" 
        component={CargaCdc} 
        options={{
          tabBarLabel: 'CDC',
          tabBarIcon: ({ color, size,focused }) => {
            let colorico
            colorico = focused ? "white" : "gray";
            // <AntDesign name="filetext1" size={24} color="black" />
            return(

              <FontAwesome name="file-code-o" color={colorico} size={24} />
            )
          },
          
           //headerShown: false,
          }}
      />
    </Tab.Navigator>
  );
}

function MainTabs({ navigation }) {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
    initialRouteName="ListadoFacturas"
    >
      <Tab.Screen name="Resumen" 
        component={ResumenMes}
        options={{
          tabBarLabel: 'Resumen',
          tabBarIcon: ({ color, size,focused }) => {
            let colorico
            colorico = focused ? "white" : "gray";
            // <AntDesign name="filetext1" size={24} color="black" />
            return(

              <Ionicons name="book" color={colorico} size={30} />
            )
          },
          headerShown:false
          
          }}
      />
      <Tab.Screen name="ListadoFacturas" 
        component={ListadoFacturas} 
        options={{
          tabBarLabel: 'Facturas',
          tabBarIcon: ({ color, size,focused }) => {
            let colorico
            colorico = focused ? "white" : "gray";
            // <AntDesign name="filetext1" size={24} color="black" />
            return(

              <Fontisto name="list-1" size={22} color={colorico} />
            )
          }
          ,
          
          
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
      <StackInicio.Screen name="Login" component={Loginv3} options={{headerShown: false}}/>
      <StackInicio.Screen name="RegistroUsuario" component={RegistroUsuario} options={{headerShown: false}}/>
      
    </StackInicio.Navigator>
  );

}

function Navigation() {
  const { activarsesion, setActivarsesion } = useContext(AuthContext);
  const { estadocomponente } = useContext(AuthContext);
  return (

    <NavigationContainer theme={MyTheme }>
      
      {/* {activarsesion ? (<DrawerInicio/>) : (<NavigationLogin  />)} */}
      {activarsesion ? (
      estadocomponente.activecamara ? (
        <StackCamara />
      ) : (
        <DrawerInicio />
      )
    ) : (
      <NavigationLogin />
    )}




    </NavigationContainer>
  );
}

export default Navigation;