import React, { createContext, useState, useContext } from 'react';

// Creamos el contexto
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [activarsesion, setActivarsesion] = useState(false);
    const [versionsys,setVersionsys]=useState('Version 1.9')
    const [sesiondata, setSesiondata] = useState();
    const [periodo, setPeriodo] = useState(false);
    const [estadocomponente,setEstadocomponente]=useState({
        
        datositem:[],
        datourl:[],
        // datocdc:[],
        datocdc:{'nombrecdc':'01800319702001005008254822024103013609116639.xml'},
        
        obtuvopermiso:false,
        datafactura:[],
        isHeaderVisible:true,
        activecamara :false,
        qrdetected:false,
        
    
      })

      const reiniciarvalores=()=>{
        
        
        actualizarEstadocomponente('datositem',[])
        actualizarEstadocomponente('datourl',[])
        actualizarEstadocomponente('datocdc',[])
        actualizarEstadocomponente('obtuvopermiso',false)
    
        actualizarEstadocomponente('datafactura',[])
        actualizarEstadocomponente('isHeaderVisible',true)
        actualizarEstadocomponente('activecamara',false)
        actualizarEstadocomponente('qrdetected',false)
        
    
      }

    const actualizarEstadocomponente = (campo, valor) => {
        setEstadocomponente(prevState => ({
          ...prevState,
          [campo]: valor,
        }));
      };
    
    return (
        <AuthContext.Provider value={{ 
          activarsesion, setActivarsesion,
          versionsys,setVersionsys,
          sesiondata, setSesiondata,
          estadocomponente,actualizarEstadocomponente,
          reiniciarvalores,
          periodo, setPeriodo
          }}>
          {children}
        </AuthContext.Provider>
      );

}
