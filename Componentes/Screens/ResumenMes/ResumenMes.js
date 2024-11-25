import React, { useContext,useState } from 'react';
import {  View,Text  } from "react-native";
import Handelstorage from '../../../Storage/handelstorage';
import { Button, Dialog, Portal,PaperProvider,RadioButton } from 'react-native-paper';
import Generarpeticion from '../../../Apis/peticiones';
import Procesando from '../../Procesando/Procesando';
function ResumenMes({ navigation }){
    const [guardando,setGuardando]=useState(false)

    const registrar_concepto = async () => {
        
        setGuardando(true)

        const datosregistrar = {};
        
        const endpoint='RegistroMedioPago/'
        const result = await Generarpeticion(endpoint, 'POST', datosregistrar);
        
        // const respuesta=result['resp']
        
        // if (respuesta === 200) {
        //   actualizarEstadocomponente('mediospagoscomp',!estadocomponente.mediospagoscomp)
        //   reiniciarvalorestransaccion()
        //   concepto.recarga='si'
      
  
        //   navigation.goBack();
          
        // } else if(respuesta === 403 || respuesta === 401){

        //   await Handelstorage('borrar')
        //   await new Promise(resolve => setTimeout(resolve, 1000))
        //   setActivarsesion(false)
        // } else{
        //  setMensajeerror( result['data']['error'])
        //  showDialog(true)
        // }
        
        setGuardando(false)
     };
    return(
        <View>
            {guardando &&(<Procesando></Procesando>)}
            <Text>
                RESUMEN DEL MES
            </Text>
            <Button onPress={registrar_concepto}> Registrar  </Button>
        </View>
    )
}
export default ResumenMes