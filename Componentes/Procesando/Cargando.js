import React,{useContext} from 'react';
import { View,StyleSheet,Text  } from 'react-native';
import { AuthContext } from '../../AuthContext';
import { useTheme } from '@react-navigation/native';
import { Video  } from 'expo-av';

function Cargando({ navigation }){
    const { estadocomponente } = useContext(AuthContext);
    const { colors,fonts } = useTheme();
    return(
        <View style={styles.overlay}>
             <Text style={[styles.texto,{fontFamily: fonts.regular.fontFamily,color: colors.textsub,}]}>{estadocomponente.tituloloading}</Text>
             <Video source={require('../../assets/cargando.mp4')}
                                      style={styles.video}
                                      shouldPlay
                                      isLooping
                                      resizeMode="contain"
                              />
        </View>
    )

}
const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 100,
      backgroundColor:'#e3ede2'
    },
    video: {
      flex: 1,
      width: '100%', // Ancho igual al de la pantalla
      height: '100%',
      position: 'absolute',
    },
    texto:{
        marginTop:150,
        marginLeft:'25%'
    }
  });
export default Cargando