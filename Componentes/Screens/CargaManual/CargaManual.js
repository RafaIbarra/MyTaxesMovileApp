import React, { useContext,useState, useEffect } from 'react';




import { View,  StyleSheet } from 'react-native';



function CargaManual({ navigation }){
    
    const[title,setTitle]=useState('CARGA MANUAL')
    const[backto,setBackto]=useState('MainTabs2')


    return(


      <View style={styles.container}>
          
        
      </View>

   
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    
    },
    
  });
  
export default CargaManual
