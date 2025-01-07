

import Handelstorage from "../Storage/handelstorage";
import API_BASE from "./ApiBase";

async function Generarpeticion(endpoint,metodo,bodyoptions){
  
  let data={}
  let resp=0
  let datos={}
  let requestOptions = {};
  const datosstarage=await Handelstorage('obtener');
  
  const tokenstorage=datosstarage['token']
  const sesionstorage=datosstarage['sesion']
  
 
  if (bodyoptions instanceof FormData) {
        bodyoptions.append('SESION', sesionstorage);
    
   }else{
    bodyoptions.SESION=sesionstorage;
   }
  
  
  if (metodo.toUpperCase()==='GET'){
      requestOptions = {
          method: metodo.toUpperCase(),
          headers: {
                      'Authorization':`Bearer ${tokenstorage}`,
                  }
          }

  } else{

        if (endpoint==='UploadAudio/'){
            
            
            requestOptions = {
            method: metodo.toUpperCase(),
            headers: {  
                        'Content-Type': 'multipart/form-data',
                        
                        'Authorization':`Bearer ${tokenstorage}`,
                        },
            body: bodyoptions
            }

        }else{
            
            requestOptions = {
            method: metodo.toUpperCase(),
            headers: {  'Content-Type': 'application/json',
                        
                        'Authorization':`Bearer ${tokenstorage}`,
                    },
            body: JSON.stringify(bodyoptions)
            }
        }
  }
  

  const response = await fetch(`${API_BASE}/${endpoint}`, requestOptions);  
  
  data= await response.json();
  
  resp= response.status;
  
  datos={data,resp}
  return datos
}

export default Generarpeticion


