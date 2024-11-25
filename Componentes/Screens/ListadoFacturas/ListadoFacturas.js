import React, { useContext,useEffect,useState } from 'react';

import {  View,Text,FlatList,TouchableOpacity,StyleSheet ,Animated,SafeAreaView } from "react-native";
import { Button } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import Generarpeticion from '../../../Apis/peticiones';
import { useTheme } from '@react-navigation/native';
import moment from 'moment';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
function ListadoFacturas({ navigation }){
    const { navigate } = useNavigation();
    const { colors,fonts } = useTheme();
    const [guardando,setGuardando]=useState(false)
    const [cargacompleta,setCargacopleta]=useState(false)
    const [datafacturas,setDatafacturas]=useState([])
    const [rotationValue] = useState(new Animated.Value(0));
    const ircarga=()=>{
        // navigate("StackCargaOpciones")
        navigate("StackCargaOpciones", { })
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
        
          setCargacopleta(false)
          setGuardando(true)
          const cargardatos=async()=>{
            
              //if(estadocomponente.compgastos){
  
                // const datestorage=await Handelstorage('obtenerdate');
                // const mes_storage=datestorage['datames']
                // const anno_storage=datestorage['dataanno']

                const mes_storage=0
                const anno_storage=2024

                
                const body = {};
                const endpoint='MovimientosFacturas/' + anno_storage +'/' + mes_storage + '/0/'
                const result = await Generarpeticion(endpoint, 'POST', body);
                const respuesta=result['resp']
                
                if (respuesta === 200){
                    const registros=result['data']
                    // console.log(registros)
                    
                    if(Object.keys(registros).length>0){
                        registros.forEach((elemento) => {
                          
                          elemento.key = elemento.id;
                          elemento.recarga='no'
                        })
                    }
  
                    setDatafacturas(registros)
                    // setDateegresoscompleto(registros)
                    // let totalgasto=0
                    // let cantgasto=0
                    // registros.forEach(({ monto_gasto }) => {totalgasto += monto_gasto,cantgasto+=1})
                    // setMontototalegreso(totalgasto)
                    // setcanttotalegreso(cantgasto)
                    // setGuardando(false)
                    // actualizarEstadocomponente('compgastos',false)
                    // actualizarEstadocomponente('datagastos',registros)
                    
                }else if(respuesta === 403 || respuesta === 401){
                    
                    setGuardando(false)
                    await Handelstorage('borrar')
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    setActivarsesion(false)
                }
            //   }else{
                  
            //       const registros=estadocomponente.datagastos
            //       setDataegresos(registros)
            //       setDateegresoscompleto(registros)
            //       let totalgasto=0
            //       let cantgasto=0
            //       registros.forEach(({ monto_gasto }) => {totalgasto += monto_gasto,cantgasto+=1})
            //       setMontototalegreso(totalgasto)
            //       setcanttotalegreso(cantgasto)
            //       setGuardando(false)
            //   }
              
            //  if (textobusqueda.length>0){
            //   realizarbusqueda(textobusqueda)
            //  }
             
              setCargacopleta(true)
           
  
             
          }
          
          cargardatos()
          
        })
        return unsubscribe;
  
        }, [navigation]);
    if(cargacompleta){

        return(
        <SafeAreaView  style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>

              <View style={styles.cabeceracontainer}>
              <Text style={[styles.titulocabecera, { color: colors.text, fontFamily: fonts.regularbold.fontFamily}]}>Registro Facturas</Text>
                      <TouchableOpacity style={[styles.botoncabecera,
                                              { 
                                                // backgroundColor:'rgb(218,165,32)'
                                              backgroundColor:colors.botoncolor
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

              
          </View>
        </SafeAreaView>
        
    )
    }
}
const styles = StyleSheet.create({
    // container: {
    //     flex: 1,

    //   },
    // contenedordatos:{
    //     flexDirection: 'row',
    //     marginBottom:10,
    //     marginRight:5,
    //     overflow: 'hidden', 
       
    // },
    // textocontenido:{
    //     fontSize:12.5,
    //     marginBottom:5,
        
    //   },
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
        borderBottomWidth: 1,
        marginTop:50

        
      },
      titulocabecera: {
        flex: 1,
        fontSize: 20,
        // fontWeight: 'bold',
        textAlign: 'center',
        // color:'white'
      },
})
export default ListadoFacturas