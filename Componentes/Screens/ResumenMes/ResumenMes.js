import React, { useContext,useState,useEffect } from 'react';
import {  View,Text,StyleSheet,TouchableOpacity  } from "react-native";
import { Button, Dialog, Portal,PaperProvider,RadioButton,DataTable } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";
import Handelstorage from '../../../Storage/handelstorage';
import Generarpeticion from '../../../Apis/peticiones';
import Procesando from '../../Procesando/Procesando';
import { AuthContext } from '../../../AuthContext';
function ResumenMes({ navigation }){
    const [guardando,setGuardando]=useState(false)
    const { colors,fonts } = useTheme();
    const { navigate } = useNavigation();
    const [dataresumen,setDataresumen]=useState([])
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([2, 3, 4]);
    const {  actualizarEstadocomponente } = useContext(AuthContext);
    const { estadocomponente } = useContext(AuthContext);
    const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
    useEffect(() => {
      
      

        const unsubscribe = navigation.addListener('focus', () => {
        
          // console.log('el estado de estadocomponente.qrdetected', estadocomponente.qrdetected)
          const cargardatos=async()=>{
        
              if  (estadocomponente.qrdetected){
                console.log('debe navegar')
        
                 navigate("CargaArchivoXml", { })
              } else{

                const anno_storage=2024

                const body = {};
                const endpoint='ResumenPeriodo/' + anno_storage +'/'
                const result = await Generarpeticion(endpoint, 'POST', body);
                const respuesta=result['resp']
                
                if (respuesta === 200){
                    const registros=result['data']
                    
                    
                    if(Object.keys(registros).length>0){
                        registros.forEach((elemento) => {
                          
                          elemento.key = elemento.MesFactura;
                          elemento.recarga='no'
                        })
                    }
                    
                    setDataresumen(registros)
               
                    
                }else if(respuesta === 403 || respuesta === 401){
                    
                    setGuardando(false)
                    await Handelstorage('borrar')
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    setActivarsesion(false)
                }
       
              }
             
              setCargacopleta(true)
           
  
             
          }
          
          cargardatos()
          
        })
        return unsubscribe;
      
  
        }, [navigation,estadocomponente.qrdetected]);
        const from = 0;
      const to = 10;
      const tamañoletratabla=10
    return(
        <View style={{ flex: 1 }}>
            {guardando &&(<Procesando></Procesando>)}
            <View style={[styles.cabeceracontainer,{backgroundColor:colors.card}]}>
              <Text style={[styles.titulocabecera, { color: colors.textcard, fontFamily: fonts.regularbold.fontFamily}]}>Resumen</Text>
                     
            </View>

            <DataTable>
                <DataTable.Header>
                    <DataTable.Title style={{ flex: 1 }} textStyle={{ fontFamily: fonts.regularbold.fontFamily }}>Mes</DataTable.Title>
                    <DataTable.Title textStyle={{ fontFamily: fonts.regularbold.fontFamily }} numeric>Iva 5</DataTable.Title>
                    <DataTable.Title textStyle={{ fontFamily: fonts.regularbold.fontFamily }} numeric>Iva 10</DataTable.Title>
                    <DataTable.Title textStyle={{ fontFamily: fonts.regularbold.fontFamily }} numeric>Total Iva</DataTable.Title>
                    <DataTable.Title textStyle={{ fontFamily: fonts.regularbold.fontFamily }} numeric>Cant</DataTable.Title>
                </DataTable.Header>

                {dataresumen.slice(from, to).map((item) => (
                    <DataTable.Row key={item.key}>
                    <DataTable.Cell style={{ flex: 1 }}  textStyle={{ fontSize: tamañoletratabla,fontFamily: fonts.regular.fontFamily }}>{item.NombreMesFactura}</DataTable.Cell>
                    <DataTable.Cell  textStyle={{ fontSize: tamañoletratabla,fontFamily: fonts.regular.fontFamily }} numeric>{Number(item.TotalIva5).toLocaleString('es-ES')} </DataTable.Cell>
                    <DataTable.Cell  textStyle={{ fontSize: tamañoletratabla,fontFamily: fonts.regular.fontFamily }} numeric>{Number(item.TotalIva10).toLocaleString('es-ES')} </DataTable.Cell>
                    <DataTable.Cell  textStyle={{ fontSize: tamañoletratabla,fontFamily: fonts.regular.fontFamily }} numeric>{Number(item.TotalLiquidacionIva).toLocaleString('es-ES')}</DataTable.Cell>
                    <DataTable.Cell  textStyle={{ fontSize: tamañoletratabla,fontFamily: fonts.regular.fontFamily }} numeric>{Number(item.CantidadRegistros).toLocaleString('es-ES')}</DataTable.Cell>
                    </DataTable.Row>
                ))}

                </DataTable>
            
        </View>
    )
}
const styles = StyleSheet.create({
  cabeceracontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    height:55
  },
  titulocabecera: {
    flex: 1,
    fontSize: 20,
    // fontWeight: 'bold',
    textAlign: 'center',
    // color:'white'
  },

})

export default ResumenMes