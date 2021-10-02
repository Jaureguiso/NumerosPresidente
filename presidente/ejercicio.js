const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('querystring');

const mime = 
{
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  : 'audio/mpeg3',
   'mp4'  : 'video/mp4'
};
const servidor=http.createServer((pedido ,respuesta) => 
{
    const objetourl = url.parse(pedido.url);
  let camino='public'+objetourl.pathname;
  if (camino=='public/')
    camino='public/index.html';
  encaminar(pedido,respuesta,camino);
});

servidor.listen(8888);
function encaminar (pedido,respuesta,camino) 
{
  console.log(camino);
  switch (camino) 
  {
    case 'public/recuperardatos': 
    {
      recuperar(pedido,respuesta);
      break;
    }	
    default : 
    {  
      fs.stat(camino, error => 
        {
        if (!error) 
        {
        fs.readFile(camino,(error, contenido) => 
        {
          if (error) 
          {
            respuesta.writeHead(500, {'Content-Type': 'text/plain'});
            respuesta.write('Error interno');
            respuesta.end();					
          } 
          else 
          {
            const vec = camino.split('.');
            const extension=vec[vec.length-1];
            const mimearchivo=mime[extension];
            respuesta.writeHead(200, {'Content-Type': mimearchivo});
            respuesta.write(contenido);
            respuesta.end();
          }
        });
      } 
      else 
        {
        respuesta.writeHead(404, {'Content-Type': 'text/html'});
        respuesta.write('<html><head></head><body>Recurso inexistente</body></html>');		
        respuesta.end();
        }
      });	
    }
  }	
}


function recuperar(pedido,respuesta) 
{
  let info = '';
  pedido.on('data', datosparciales => 
  {
    info += datosparciales;
    });
  pedido.on('end', () => 
  {
    const formulario = querystring.parse(info);
    const a=formulario['a'];
    const b=formulario['b'];
    let final=EsPrimo(a,b);
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    const pagina=`<html><head></head><body>${final}</body></html>`;
    respuesta.end(pagina);
    });
    
    
    function EsPrimo(a,b)
    {
        let primos=[];
        let dobleprimos=[];
        let resultado="";
        let menor=a;
        let mayor=b;   
        
        for(let x=menor;x<=mayor;x++)
        {
            let primo=true;
            for(let y=2;y<=x/2;y++)
            {
                if(x%y==0)
                {
                    primo=false;
                }
            }
               if(primo==true)
                {
                    primos.push(x);
                }
        }
        
        for(let x=0;x<primos.length;x++)
        {
            let sumar=0;
            let dobleprimo=true;
            let numeros=primos[x];

            while(numeros>0)
            {
                sumar+=(numeros%10);
                numeros=Math.floor(numeros/10);
            }
            for(let y=2;y<=sumar/2;y++)
            {
                if(sumar%y==0)
                {
                    dobleprimo=false;
                }
            }
            if(dobleprimo==true)
            {
                dobleprimos.push(primos[x]);
            }
        }
        
        for(let x=0;x<dobleprimos.length;x++)
        {
            resultado+=dobleprimos[x]+" - ";
        }
    return resultado;
    }
    
}
console.log('Servidor web iniciado');