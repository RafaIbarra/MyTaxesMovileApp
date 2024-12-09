import React, { useContext,useEffect,useState,useRef } from 'react';

import {  View,Text,FlatList,TouchableOpacity,StyleSheet ,Animated,SafeAreaView,TextInput } from "react-native";
import { Button } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '@react-navigation/native';

import Generarpeticion from '../../../Apis/peticiones';
import Handelstorage from '../../../Storage/handelstorage';
import Procesando from '../../Procesando/Procesando';
import { AuthContext } from '../../../AuthContext';
import moment from 'moment';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
function ListadoFacturas({ navigation }){
    const { navigate } = useNavigation();
    const { colors,fonts } = useTheme();
    const { estadocomponente } = useContext(AuthContext);
    const [guardando,setGuardando]=useState(false)
    const [cargacompleta,setCargacopleta]=useState(false)
    const [datafacturas,setDatafacturas]=useState([])
    const [rotationValue] = useState(new Animated.Value(0));
    const [montototaliva,setMontototaliva]=useState(0)
    const [canttotalfacturas,setCanttotalfacturas]=useState(0)
    const [datafacturacompleto,setDatafacturacompleto]=useState([])

    const [busqueda,setBusqueda]=useState(false)
    const [textobusqueda,setTextobusqueda]=useState('')
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const openbusqueda =()=>{
      setBusqueda(true);
    // Inicia la animación para mostrar el cuadro de búsqueda
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700, // Duración de la animación en milisegundos
      useNativeDriver: false,
    }).start();
    }

    const closebusqueda=()=>{
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start(() => setBusqueda(false));
      realizarbusqueda('')
    }    
const realizarbusqueda = (palabra) => {
    
    
    let formattedPalabra = palabra;
    
    const isFirstCharNumber = !isNaN(palabra.charAt(0)) && palabra.charAt(0) !== "";
    // Verificar si es un número
    if (isFirstCharNumber) {

        formattedPalabra = palabra.replace(/\D/g, ''); // Eliminar caracteres no numéricos

        if (formattedPalabra.length > 3 && formattedPalabra.length <= 6) {
            
            formattedPalabra = formattedPalabra.replace(/(\d{3})(\d+)/, '$1-$2');
        } else if (formattedPalabra.length > 6) {
            
            formattedPalabra = formattedPalabra.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
        }



  
    }
    setTextobusqueda(formattedPalabra);
    const pal = formattedPalabra.toLowerCase();

    let arrayencontrado = datafacturacompleto.filter(item => 
        item.numero_factura.toLowerCase().includes(pal) ||
        item.NombreEmpresa.toLowerCase().includes(pal)
    );

    setDatafacturas(arrayencontrado);
}
    const handlePress = () => {
        
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 200, // Duración de la animación en milisegundos
        useNativeDriver: true,
      }).start(() => {
        // Restaura la animación a su estado original
        rotationValue.setValue(0);
      });
      const item={'id':0}
      navigate("StackCargaOpciones", { })
      
    };
  
    // Interpola el valor de rotación para aplicarlo al estilo de transformación del icono
  const spin = rotationValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    } 
  );

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          console.log('entro en listado')
          setCargacopleta(false)
          setGuardando(true)
          const cargardatos=async()=>{
            if (estadocomponente.qrdetected){
              navigate("CargaArchivoXml", { })
            }else{

              const datestorage=await Handelstorage('obtenerdate');
              const anno_storage=datestorage['dataanno']
              const mes_storage=11
              const body = {};
              const endpoint='MovimientosFacturas/' + anno_storage +'/' + mes_storage + '/0/'
              const result = await Generarpeticion(endpoint, 'POST', body);
              const respuesta=result['resp']
              
              if (respuesta === 200){
                  const registros=result['data']
                  
                  
                  if(Object.keys(registros).length>0){
                      registros.forEach((elemento) => {
                        
                        elemento.key = elemento.id;
                        elemento.recarga='no'
                      })
                  }

                  setDatafacturas(registros)
                  setDatafacturacompleto(registros)
                  let totaliva=0
                  let cantfac=0
                  registros.forEach(({ liquidacion_iva }) => {totaliva += liquidacion_iva,cantfac+=1})
                  setMontototaliva(totaliva)
                  setCanttotalfacturas(cantfac)
                  setGuardando(false)
                  
                  
              }else if(respuesta === 403 || respuesta === 401){
                  
                  setGuardando(false)
                  await Handelstorage('borrar')
                  await new Promise(resolve => setTimeout(resolve, 1000))
                  setActivarsesion(false)
              }
            }
          }
          cargardatos()
          setCargacopleta(true)
          setGuardando(false)
          
        })
        return unsubscribe;
  
        }, [navigation]);
    if(cargacompleta){

        return(
        <SafeAreaView  style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
             {guardando &&(<Procesando></Procesando>)}
              <View style={[styles.cabeceracontainer,{backgroundColor:colors.card}]}>

              {!busqueda &&( 
                      <TouchableOpacity onPress={openbusqueda}>
                          
                          <FontAwesome name="search" size={24} color={colors.iconcolor}/>
                          
                      </TouchableOpacity>
              )}

              {!busqueda &&( <Text style={[styles.titulocabecera, { color: colors.textcard, fontFamily: fonts.regularbold.fontFamily}]}>Registro Facturas</Text>)}
              {busqueda &&(

              <Animated.View style={{ borderWidth:1,backgroundColor:'rgba(28,44,52,0.1)',borderRadius:10,borderColor:'white',flexDirection: 'row',alignItems: 'center',width:'80%',opacity: fadeAnim}}>
                <TextInput 
                      style={{color:'white',padding:5,flex: 1,fontFamily:fonts.regular.fontFamily}} 
                      placeholder="N° Factura o Empresa.."
                      placeholderTextColor='gray'
                      value={textobusqueda}
                      onChangeText={textobusqueda => realizarbusqueda(textobusqueda)}
                      >

                </TextInput>

                <TouchableOpacity style={{ position: 'absolute',right: 10,}} onPress={closebusqueda} >  
                  <AntDesign name="closecircleo" size={20} color={colors.iconcolor} />
                </TouchableOpacity>
              </Animated.View>
              )
              }
                
              <TouchableOpacity style={[styles.botoncabecera,
                                      { 
                                        backgroundColor:'#57DCA3'
                                      //backgroundColor:colors.botoncolor
                                      }]} onPress={handlePress}
              >
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                      <FontAwesome6 name="add" size={24} color="white" />
                  </Animated.View>
              </TouchableOpacity>
          </View>





              <View style={styles.container}>
                <FlatList
                  data={datafacturas}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        style={styles.contenedordatos}
                        onPress={() => {
                          navigate('GastosDetalle', { item });
                        }}
                      >
                        {/* Contenedor principal con alineación horizontal */}
                        <View style={styles.row}>
                          {/* Columna izquierda */}
                          <View style={{ flex: 3 }}>
                            <Text
                              style={[
                                styles.textocontenido,
                                { color: colors.text, fontFamily: fonts.regular.fontFamily },
                              ]}
                            >
                              N° Factura: {item.numero_factura}
                            </Text>
                            <Text
                              style={[
                                styles.textocontenido,
                                { color: colors.textsub, fontFamily: fonts.regular.fontFamily },
                              ]}
                            >
                              {item.NombreEmpresa}
                            </Text>
                          </View>

                          {/* Columna derecha */}
                          <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text
                              style={[
                                styles.textototal,
                                { color: colors.text, fontFamily: fonts.regularbold.fontFamily  },
                              ]}
                            >
                              Liq.: {Number(item.liquidacion_iva).toLocaleString('es-ES')}
                            </Text>
                            <Text
                              style={[
                                styles.textocontenido,
                                { color: colors.textsub, fontFamily: fonts.regular.fontFamily },
                              ]}
                            >
                              {item.fecha_factura}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={(item) => item.key}
                />
              </View>

              <View style={styles.resumencontainer}>

                    <Text style={[styles.contenedortexto,{ color:colors.text, fontFamily: fonts.regular.fontFamily}]}>
                      <Text style={[styles.labeltext,{ fontFamily: fonts.regularbold.fontFamily}]}>Cantidad Registros:</Text>{' '}
                        {Number(canttotalfacturas).toLocaleString('es-ES')}
                    </Text>
                    <Text style={[styles.contenedortexto,{ color:colors.text, fontFamily: fonts.regular.fontFamily}]}>
                      <Text style={[styles.labeltext,{ fontFamily: fonts.regularbold.fontFamily}]}>Total Liq IVA:</Text>{' '}
                        {Number(montototaliva).toLocaleString('es-ES')} Gs.
                    </Text>
                    
                </View>

              
          </View>
        </SafeAreaView>
        
      )
    
    }
}
const styles = StyleSheet.create({
   
    container: {
        flex: 1,
        padding:15
      },
      contenedordatos: {
        marginBottom: 30,
        marginRight: 5,
        overflow: 'hidden',
      },
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Espacio entre las dos columnas
        alignItems: 'center', // Alineación vertical consistente
      },
      textocontenido: {
        fontSize: 12.5,
        marginBottom: 5,
      },
      textototal: {
        fontSize: 14,
        
      },


      botoncabecera: {
        // backgroundColor: 'blue',
        width: 40, // Define el ancho del botón
        height: 40, // Define la altura del botón
        borderRadius: 20, // Define la mitad de la dimensión del botón para obtener una forma circular
        justifyContent: 'center', // Alinea el contenido (icono) verticalmente en el centro
        alignItems: 'center', // Alinea el contenido (icono) horizontalmente en el centro
      },

      cabeceracontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        height:55
        // borderBottomWidth: 1,
        //marginTop:25,
        // backgroundColor:'rgba(42,217,142,255)' //UENO
        



        
      },
      titulocabecera: {
        flex: 1,
        fontSize: 20,
        // fontWeight: 'bold',
        textAlign: 'center',
        // color:'white'
      },
      resumencontainer: {
        //flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth:0.5,
        borderTopRightRadius:50,
        borderColor:'#57DCA3',
        // backgroundColor:'#2a2a2c',
  
        paddingLeft:30
  
        
      },
      contenedortexto:{
        paddingBottom:10,
        fontSize:15,
        
      },

      labeltext:{
        
        fontSize:13
    },
  
})
export default ListadoFacturas