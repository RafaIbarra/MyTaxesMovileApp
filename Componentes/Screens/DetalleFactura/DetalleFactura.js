import React, { useContext, useState, useEffect } from 'react';
import {  StyleSheet,View,TouchableOpacity,TextInput,Text,ScrollView } from "react-native";
import { DataTable,Dialog, Portal,PaperProvider,Button } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

import { AuthContext } from '../../../AuthContext';
import { useNavigation  } from "@react-navigation/native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ScreensCabecera from '../../ScreensCabecera/ScreensCabecera';
import Generarpeticion from '../../../Apis/peticiones';

function DetalleFactura({ navigation }){
    const [title,setTitle]=useState('DETALLE FACTURA')
    const [backto,setBackto]=useState('MainTabs2')
    const { colors,fonts } = useTheme();
    const { estadocomponente } = useContext(AuthContext);
    const {  actualizarEstadocomponente } = useContext(AuthContext);
    const { activarsesion, setActivarsesion } = useContext(AuthContext);

    const [detallefactura,setDetallefactura]=useState()
    const [nombreempresa,setNombreempresa]=useState('')
    const [rucempresa,setRucempresa]=useState('')
    const [fechaoperacion,setFechaoperacion]=useState('')
    const [nrofactura,setNrofactura]=useState('')
    const [conceptos,setConceptos]=useState('')
    const [cantidadconceptos,setCantidadconceptos]=useState(0)
    const [liqiva10,setLiqiva10]=useState('')
    const [datamontos,setDatamontos]=useState([])
    const { navigate } = useNavigation();

    const [visibledialogo, setVisibledialogo] = useState(false)
      const[mensajeerror,setMensajeerror]=useState('')
      
      const showDialog = () => setVisibledialogo(true);
      const hideDialog = () => setVisibledialogo(false);

    const volver=()=>{
      
      navigation.navigate('MainTabs2', {
        screen: 'ListadoFacturas', // Nombre exacto de la pantalla en el Tab
      });
      
    }
    const registrar= async ()=>{
      actualizarEstadocomponente('tituloloading','REGISTRANDO FACTURA..')
      actualizarEstadocomponente('loading',true)
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
    actualizarEstadocomponente('tituloloading','')
    actualizarEstadocomponente('loading',false)
    const respuesta=result['resp']
    if (respuesta === 200) {
      
      volver()
      // reiniciarvalorestransaccion()
      // item.recarga='si'
  

      // navigation.goBack();
      
    } else if(respuesta === 403 || respuesta === 401){

      await Handelstorage('borrar')
      setActivarsesion(false)
      
    } else{
      showDialog(true)
      setMensajeerror( result['data']['error'])
    //console.log(result['data']['error'])
    //volver()
    // navigate("MainTabs2", { })
    
    //navigation.goBack();
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
   
      }
      const from = 0;
      const to = 10;
      const tamañoletratabla=10
      const tamañoletraheadertabla=12
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
        const itemCount = Object.keys(conceptos).filter(key => key.startsWith('Item_')).length;
       
        setCantidadconceptos(itemCount)
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
      <PaperProvider >

        <View style={{ flex: 1 }}>
          <ScreensCabecera title={title} backto={backto} ></ScreensCabecera>
              <Portal>

                <Dialog visible={visibledialogo} onDismiss={hideDialog}>
                    <Dialog.Icon icon="alert-circle" size={50} color="red"/>
                    <Dialog.Title>ERROR</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">{mensajeerror}</Text>
                        
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>OK</Button>
                        
                    </Dialog.Actions>
                </Dialog>
              </Portal>
              
              <View style={[styles.contenedorcabeceradatos,{marginTop:20}]}>
                <Text style={[styles.labelcabeceradatos,{ fontFamily: fonts.regular.fontFamily }]}>
                      Local Compra:
                    </Text>
                    <TextInput
                      style={[styles.inputcabeceradatos,{color: colors.text,backgroundColor: colors.backgroundInpunt,fontFamily: fonts.regular.fontFamily,}]}
                      value={nombreempresa}
                      onChangeText={nombreempresa => textoempresa(nombreempresa)}
                      underlineColorAndroid="transparent"
                      editable={!detallefactura}
                      multiline={false} // Permite desplazamiento horizontal si es necesario
                      scrollEnabled={false} // Habilita el desplazamiento horizontal
                    />
              </View>
                          
              
              <View style={styles.contenedorcabeceradatos}>
                  <Text style={[styles.labelcabeceradatos,{ fontFamily: fonts.regular.fontFamily }]}>
                    RUC:
                  </Text>
                  <TextInput
                    style={[styles.inputcabeceradatos,{color: colors.text,backgroundColor: colors.backgroundInpunt,fontFamily: fonts.regular.fontFamily,}]}
                    value={rucempresa}
                    onChangeText={rucempresa => textoempresa(rucempresa)}
                    underlineColorAndroid="transparent"
                    editable={!detallefactura}
                    multiline={false} // Asegura que el campo no sea multilinea
                    scrollEnabled={false} // Desactiva el desplazamiento horizontal
                  />
              </View>

        
              <View style={styles.contenedorcabeceradatos}>
                <Text style={[styles.labelcabeceradatos,{ fontFamily: fonts.regular.fontFamily }]}>
                  N° Factura:
                </Text>
                <TextInput
                  style={[styles.inputcabeceradatos,{color: colors.text,backgroundColor: colors.backgroundInpunt,fontFamily: fonts.regular.fontFamily,}]}
                  value={nrofactura}
                  onChangeText={nrofactura => textoempresa(nrofactura)}
                  underlineColorAndroid="transparent"
                  editable={!detallefactura}
                  multiline={false} // Asegura que el campo no sea multilinea
                  scrollEnabled={false} // Desactiva el desplazamiento horizontal
                />
              </View>

              <View style={styles.contenedorcabeceradatos}>
                  <Text style={[styles.labelcabeceradatos,{ fontFamily: fonts.regular.fontFamily }]}>
                    Fecha Operacion:
                  </Text>
                  <TextInput
                    style={[styles.inputcabeceradatos,{color: colors.text,backgroundColor: colors.backgroundInpunt,fontFamily: fonts.regular.fontFamily,}]}
                    value={fechaoperacion}
                    onChangeText={fechaoperacion => textoempresa(fechaoperacion)}
                    underlineColorAndroid="transparent"
                    editable={!detallefactura}
                    multiline={false} // Permite desplazamiento horizontal si es necesario
                    scrollEnabled={false} // Habilita el desplazamiento horizontal
                  />
              </View>
              
              <View style={{ maxHeight: 250, overflow: 'hidden' }}>
                <DataTable>
                  <View style={{ backgroundColor: 'gray', marginLeft: 8, marginRight: 8, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                    <DataTable.Header>
                      <DataTable.Title style={{ flex: 2 }} textStyle={{ fontSize: tamañoletraheadertabla, fontFamily: fonts.regularbold.fontFamily }}>
                        Concepto
                      </DataTable.Title>
                      <DataTable.Title textStyle={{ fontSize: tamañoletraheadertabla, fontFamily: fonts.regularbold.fontFamily }} numeric>
                        Cant
                      </DataTable.Title>
                      <DataTable.Title textStyle={{ fontSize: tamañoletraheadertabla, fontFamily: fonts.regularbold.fontFamily }} numeric>
                        Total
                      </DataTable.Title>
                    </DataTable.Header>
                  </View>
                </DataTable>
                <ScrollView nestedScrollEnabled={true}>
                  <DataTable>
                    {conceptos.map((item) => (
                      <DataTable.Row key={item.key}>
                        <DataTable.Cell style={{ flex: 2 }} textStyle={{ fontSize: tamañoletratabla, fontFamily: fonts.regular.fontFamily }}>
                          {item.dDesProSer}
                        </DataTable.Cell>
                        <DataTable.Cell textStyle={{ fontSize: tamañoletratabla, fontFamily: fonts.regular.fontFamily }} numeric>
                          {item.dCantProSer}
                        </DataTable.Cell>
                        <DataTable.Cell textStyle={{ fontSize: tamañoletratabla, fontFamily: fonts.regular.fontFamily }} numeric>
                          {Number(item.dTotOpeItem).toLocaleString('es-ES')}
                        </DataTable.Cell>
                      </DataTable.Row>
                    ))}
                  </DataTable>
                </ScrollView>
              </View>

                  
              <View style={[styles.contenedordatos]}>
                  {datamontos && (
                      <View style={{ flexDirection: 'row', flex: 1 }}>
                      {/* Primera columna */}
                      <View style={[styles.columna, { flex: 1 }]}>

                          <Text style={[styles.textocontenido, { color: colors.text,fontFamily: fonts.regular.fontFamily }]}>Total Factura: {Number(datamontos.total_operacion).toLocaleString('es-ES')}</Text>
                          <Text style={[styles.textocontenido, { color: colors.text,fontFamily: fonts.regular.fontFamily }]}>Iva 10 %: {Number(datamontos.liq_iva10).toLocaleString('es-ES')}</Text>
                          <Text style={[styles.textocontenido, { color: colors.text,fontFamily: fonts.regular.fontFamily }]}>Iva 5%: {Number(datamontos.liq_iva5).toLocaleString('es-ES')}</Text>
                          <Text style={[styles.textocontenido, { color: colors.text,fontFamily: fonts.regular.fontFamily }]}>Cant Conceptos: {Number(cantidadconceptos).toLocaleString('es-ES')}</Text>
                      </View>

                      {/* Segunda columna */}
                      <View style={[styles.columna, { flex: 1, marginTop: 20 }]}>
                          <Text style={[styles.textototal, { color: colors.text, fontFamily: fonts.regularbold.fontFamily }]}>
                          Liq IVA Gs.: {Number(datamontos.total_iva).toLocaleString('es-ES')}
                          </Text>
                      </View>
                      </View>
                  )}
              </View>
      
              
              <View style={{ flex: 1 }}>
    

                  <TouchableOpacity 
                    style={{ 
                      position: 'absolute',
                      bottom: 30, // Margen de 10 píxeles sobre la barra inferior del celular
                      left: 10,   // Margen izquierdo (ajústalo si quieres centrar el botón)
                      right: 10,  // Margen derecho para ajustar el tamaño dinámico
                      backgroundColor: colors.acctionsbotoncolor, 
                      height: 40,
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      borderRadius: 20,
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                    }} 
                    onPress={registrar}
                  >
                    <Text style={{
                      fontSize: 16,
                      color: 'black', 
                      fontFamily: fonts.regularbold.fontFamily,
                      marginRight: 8, 
                    }}>
                      REGISTRAR
                    </Text>
                    <MaterialIcons name="save-alt" size={24} color="black" />
                  </TouchableOpacity>
              </View>
        </View>
      </PaperProvider>
    )

} 

    
    

}
const styles = StyleSheet.create({

   contenedorcabeceradatos:{
    flexDirection: 'row', alignItems: 'center',marginBottom:20,marginLeft:10,marginRight:10
   },
   labelcabeceradatos:{
    fontSize: 14, color: 'gray'
   },
   inputcabeceradatos:{
    textAlignVertical: 'center',
    paddingVertical: 1,
    lineHeight: 18,
    borderBottomWidth: 1,
    marginBottom: 5, // Reduce la separación con otros elementos
    paddingLeft: 10,
    flex: 1, // Esto hace que el TextInput ocupe el resto del espacio disponible
    marginLeft: 5, // Para dar un pequeño espacio entre el texto y el TextInput

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
        marginRight:5,
        marginLeft:5,
        borderRadius:15,
        overflow: 'hidden', 
        height: 100,
        padding: 10,
        
        
    },


  });

export default DetalleFactura