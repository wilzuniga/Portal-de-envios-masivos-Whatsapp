const { createBot, createProvider, createFlow, addKeyword, CoreClass} = require('@bot-whatsapp/bot')


const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const XLSX = require('xlsx');
const os = require('os');
const fs = require('fs');
const diacritics = require('diacritics');

const rutaArchivo = __dirname +"\\DatosBot.xlsx"
const excel = ()=>{
    try {
        if (fs.existsSync(rutaArchivo)) {
            const workbook = XLSX.readFile(rutaArchivo);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(sheet);
            return data
          } 
        
      } catch (error) {
        return false;
      }
}

const buscarRespuesta = (excel, palabraBuscada)=>{
    palabraBuscada = diacritics.remove(palabraBuscada)
    for (const obj of excel) {
      if (obj.Palabras == palabraBuscada) {
        return obj.Descripcion + '\n' + obj.Respuestas;
      }
    }
  }

const Palabras=()=> {      
    return excel().map(item => addKeyword(item.Palabras,{ sensitive: true })
        .addAnswer(item.Descripcion)
        .addAnswer(item.Respuestas)
    );
  }

const expresionRegular = '/[\s\S]*/';

const flowPrincipal = addKeyword(expresionRegular,{regex: true })
    .addAction(async (textoRes, { flowDynamic }) => {
                    return flowDynamic(buscarRespuesta(excel(),textoRes.body))
                })
const main = async () => {
    
    // const networkInterfaces = os.networkInterfaces();
    // const macAddress = networkInterfaces['Ethernet 2'][0].mac;
    // console.log(macAddress)
    // if (macAddress == "0a:00:27:00:00:0a") {
      const adapterProvider = createProvider(BaileysProvider)
      QRPortalWeb()
    // }
    
} 

main()
