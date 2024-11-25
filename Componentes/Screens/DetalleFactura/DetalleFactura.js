import React, { useContext, useState, useEffect } from 'react';
import {  StyleSheet,View,TouchableOpacity,TextInput,Text,Modal,ScrollView } from "react-native";
import { DataTable } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { AuthContext } from '../../../AuthContext';
import { useNavigation } from "@react-navigation/native";
import Generarpeticion from '../../../Apis/peticiones';
function DetalleFactura({ navigation }){
    const { colors } = useTheme();
    const { estadocomponente } = useContext(AuthContext);
    const {  actualizarEstadocomponente } = useContext(AuthContext);
    const [detallefactura,setDetallefactura]=useState()
    const [nombreempresa,setNombreempresa]=useState('')
    const [rucempresa,setRucempresa]=useState('')
    const [fechaoperacion,setFechaoperacion]=useState('')
    const [nrofactura,setNrofactura]=useState('')
    const [conceptos,setConceptos]=useState('')
    const [liqiva10,setLiqiva10]=useState('')
    const [datamontos,setDatamontos]=useState([])
    const { navigate } = useNavigation();

    const registrar= async ()=>{
      // console.log(conceptos)
      const detallefactura = conceptos.map(item => ({
        concepto: item.dDesProSer,
        cantidad: item.dCantProSer,
        total: Number(item.dTotOpeItem)
      }));
      
      const jsonData = JSON.stringify(detallefactura);
      const [dia, mes, anio] = fechaoperacion.split('/');
      const fechaFormateada = `${anio}-${mes}-${dia}`
      const datosregistrar = {
        codfactura:0,
        rucempresa:rucempresa,
        nombreempresa:nombreempresa,
        numero_factura:nrofactura,
        fecha_factura:fechaFormateada,
        total_factura:datamontos.monto_operacion,
        iva10:datamontos.liq_iva10,
        iva5:datamontos.liq_iva5,
        liquidacion_iva:datamontos.total_iva,
        cdc:estadocomponente.datocdc.nombrecdc,
        detallefactura:jsonData,
        tiporegistro:'QR'
        
    };
    const endpoint='RegistroFactura/'
    const result = await Generarpeticion(endpoint, 'POST', datosregistrar);
    
    const respuesta=result['resp']
    if (respuesta === 200) {
      
      navigate("Listado", { })
      // reiniciarvalorestransaccion()
      // item.recarga='si'
  

      // navigation.goBack();
      
    } else if(respuesta === 403 || respuesta === 401){

      // await Handelstorage('borrar')
      // await new Promise(resolve => setTimeout(resolve, 1000))
      // setActivarsesion(false)
      console.log('ERROR',respuesta)
      
    } else{
    //  setMensajeerror( result['data']['error'])
    //  showDialog(true)
    console.log(result['data']['error'])
    navigate("Listado", { })
    }
        //setGuardando(false)



    }



    const convertirFecha = (fechaISO) => {
        const fecha = new Date(fechaISO);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
        const año = fecha.getFullYear();
        return `${dia}/${mes}/${año}`;
      };
    const textoempresa=(valor)=>{
        setNombreempresa(valor)
        // if (!focus && valor !== '') {
        //   setFocus(true);
        // } else if (focus && valor === '') {
        //   setFocus(false);
        // }
      }
      const from = 0;
      const to = 10;
      const tamañoletratabla=10
    useEffect(() => {
        setDetallefactura(estadocomponente.datafactura)
        setNombreempresa(estadocomponente.datafactura.DataEmpresa.Empresa)
        setRucempresa(estadocomponente.datafactura.DataEmpresa.NroRuc)
        const fechaFormateada = convertirFecha(estadocomponente.datafactura.DataFactura.FechaOperacion);
        setFechaoperacion(fechaFormateada)
        setNrofactura(estadocomponente.datafactura.DataFactura.NroFactura)
        setLiqiva10(estadocomponente.datafactura.DataMontos.liq_iva10)
        
        setDatamontos(estadocomponente.datafactura.DataMontos)
        const conceptos = estadocomponente.datafactura.Conceptos;
        // console.log(conceptos)
        const itemsExtraidos = [];
        for (const key in conceptos) {
            if (conceptos.hasOwnProperty(key)) {
              // Obtenemos el item actual
              const item = conceptos[key];
          
              // Extraemos los valores requeridos y los agregamos a un nuevo objeto
              const itemData = {
                key: key, // Añadimos la clave del item correspondiente
                dDesProSer: item.dDesProSer,
                dCantProSer: item.dCantProSer,
                dTotOpeItem: item.dTotOpeItem,
              };
          
              // Agregamos el objeto al arreglo de items extraídos
              itemsExtraidos.push(itemData);
            }
          }
        //console.log(itemsExtraidos)
        setConceptos(itemsExtraidos)

        
        // console.log(!estadocomponente.datafactura)
      }, [detallefactura]);
   if (detallefactura){


    return(
      <View>

        <ScrollView style={{maxHeight:550}}>
            <TextInput style={[styles.inputtextactivo,{color: colors.text,
                                        backgroundColor:colors.backgroundInpunt, 
                                        marginTop:20,marginLeft:'5%',marginRight:10,
                                        // marginBottom:30,
                                        // borderBottomColor: isFocusedobs ? colors.textbordercoloractive : colors.textbordercolorinactive 
                                        }]}
                                        placeholder='Local de Compra'
                                        placeholderTextColor='gray'
                                        label='Local'
                                        value={nombreempresa}
                                        // textAlignVertical="center"
                                        onChangeText={nombreempresa => textoempresa(nombreempresa)}
                                        // onFocus={() => setIsFocusedobs(true)}
                                        // onBlur={() => setIsFocusedobs(false)}
                                        underlineColorAndroid="transparent"
                                        editable={!detallefactura}
                        />
            <TextInput style={[styles.inputtextactivo,{color: colors.text,
                                        backgroundColor:colors.backgroundInpunt, 
                                        // marginTop:20,
                                        marginLeft:'5%',marginRight:10,
                                        // marginBottom:30,
                                        // borderBottomColor: isFocusedobs ? colors.textbordercoloractive : colors.textbordercolorinactive 
                                        }]}
                                        placeholder='RUC'
                                        placeholderTextColor='gray'
                                        label='RUC'
                                        value={rucempresa}
                                        // textAlignVertical="center"
                                        onChangeText={rucempresa => textoempresa(rucempresa)}
                                        // onFocus={() => setIsFocusedobs(true)}
                                        // onBlur={() => setIsFocusedobs(false)}
                                        underlineColorAndroid="transparent"
                                        editable={!detallefactura}
                        />

            <TextInput style={[styles.inputtextactivo,{color: colors.text,
                                        backgroundColor:colors.backgroundInpunt, 
                                        // marginTop:20,
                                        marginLeft:'5%',marginRight:10,
                                        // marginBottom:5,
                                        // borderBottomColor: isFocusedobs ? colors.textbordercoloractive : colors.textbordercolorinactive 
                                        }]}
                                        placeholder='N° Factura'
                                        placeholderTextColor='gray'
                                        label='N° Factura'
                                        value={nrofactura}
                                        // textAlignVertical="center"
                                        onChangeText={nrofactura => textoempresa(nrofactura)}
                                        // onFocus={() => setIsFocusedobs(true)}
                                        // onBlur={() => setIsFocusedobs(false)}
                                        underlineColorAndroid="transparent"
                                        editable={!detallefactura}
                        />

            <TextInput style={[styles.inputtextactivo,{color: colors.text,backgroundColor:colors.backgroundInpunt, marginLeft:'5%',marginRight:10,
                                        
                                        }]}
                                        placeholder='Fecha Operacion'
                                        placeholderTextColor='gray'
                                        label='F. Operacion'
                                        value={fechaoperacion}
                                        // textAlignVertical="center"
                                        onChangeText={fechaoperacion => textoempresa(fechaoperacion)}
                                        // onFocus={() => setIsFocusedobs(true)}
                                        // onBlur={() => setIsFocusedobs(false)}
                                        underlineColorAndroid="transparent"
                                        editable={!detallefactura}
                        />

            <DataTable>
                <DataTable.Header>
                    <DataTable.Title style={{ flex: 2 }}>Concepto</DataTable.Title>
                    <DataTable.Title numeric>Cant</DataTable.Title>
                    <DataTable.Title numeric>Total</DataTable.Title>
                </DataTable.Header>

                {conceptos.slice(from, to).map((item) => (
                    <DataTable.Row key={item.key}>
                    <DataTable.Cell style={{ flex: 2 }}  textStyle={{ fontSize: tamañoletratabla }}>{item.dDesProSer}</DataTable.Cell>
                    <DataTable.Cell  textStyle={{ fontSize: tamañoletratabla }} numeric>{item.dCantProSer} </DataTable.Cell>
                    <DataTable.Cell  textStyle={{ fontSize: tamañoletratabla }} numeric>{Number(item.dTotOpeItem).toLocaleString('es-ES')}</DataTable.Cell>
                    </DataTable.Row>
                ))}

                {/* <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(items.length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${items.length}`}
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={itemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                    showFastPaginationControls
                    selectPageDropdownLabel={'Rows per page'}
                /> */}
                </DataTable>

                {/* <Text style={[styles.textocontenido,{ color: colors.text}]}> Liq IVA 10 %: {liqiva10}</Text> */}
                <View style={[styles.contenedordatos]}>
                    {datamontos && (
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                        {/* Primera columna */}
                        <View style={[styles.columna, { flex: 1 }]}>

                            <Text style={[styles.textocontenido, { color: colors.text }]}>Total Factura: {Number(datamontos.total_operacion).toLocaleString('es-ES')}</Text>
                            <Text style={[styles.textocontenido, { color: colors.text }]}>Iva 10 %: {Number(datamontos.liq_iva10).toLocaleString('es-ES')}</Text>
                            <Text style={[styles.textocontenido, { color: colors.text }]}>Iva 5%: {Number(datamontos.liq_iva5).toLocaleString('es-ES')}</Text>
                        </View>

                        {/* Segunda columna */}
                        <View style={[styles.columna, { flex: 1, marginTop: 20 }]}>
                            <Text style={[styles.textototal, { color: colors.text, fontWeight: 'bold' }]}>
                            Liq IVA Gs.: {Number(datamontos.total_iva).toLocaleString('es-ES')}
                            </Text>
                        </View>
                        </View>
                    )}
                    </View>
        </ScrollView>
        <Button  
                           style={[styles.button, [styles.buttonActivado],{height:50,marginTop:100} ]}
                           
                           onPress={ registrar}
                           >                                
                           <Text style={[styles.buttonText, [styles.buttonActivadoText]]}>REGISTRAR</Text>
                         </Button>
      </View>
    )

} 

    
    

}
const styles = StyleSheet.create({

   
    
    input: {
      borderBottomWidth: 1,
      borderColor: 'gray',
      backgroundColor: 'rgba(128, 128, 128, 0.3)',
      borderRadius: 5,
      fontSize: 15,
      height: 40,
      marginBottom: 7,
      //paddingHorizontal: 5, // Espacio interno horizontal
    },
    inputtextactivo:{
      //borderBottomColor: 'rgb(44,148,228)', // Cambia el color de la línea inferior aquí
      borderBottomWidth: 2,
      marginBottom:25,
      paddingLeft:10
      
    },
    textocontenido:{
        fontSize:12.5,
        marginBottom:5,
        // color:'white'
      },
    
      contenedordatos:{
        flexDirection: 'row',
        borderWidth:1,
        marginTop:10,
        marginBottom:10,
        marginRight:5,
        marginLeft:5,
        borderRadius:15,
        overflow: 'hidden', 
        height: 90,
        padding: 10,
        
        
    },


  });

export default DetalleFactura