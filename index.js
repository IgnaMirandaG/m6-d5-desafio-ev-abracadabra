//importación módulo express
import express from 'express';
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


//instanciar express
const app = express();

//levantar servidor
app.listen(3000, ()=>{
  console.log('Servidor funcionando en http://localhost:3000'); 
})
//crear variable con array de posibles ususarios
const users = ['Juan', 'Jocelyn', 'Astrid', 'Maria', 'Ignacia', 'Javier', 'Brian']

//generar número raleatorio entre 1 y 4 con Math.random, redondeado a entero con Math.floor
const numberRandom = () => {
    const numero = Math.floor(Math.random() * (4)) + 1
    return numero
}

//MIDDLEWARES:
//para carpeta de imágenes publicas
app.use(express.static('public'))

//Verificación de que usuario existe en arreglo. Params para usuario dinámico
app.use('/abracadabra/juego/:usuario', (req, res, next) => {
    const usuario = req.params.usuario;
    let foundUser = users.find(user => user.toLocaleLowerCase() == usuario.toLocaleLowerCase());
    if(foundUser){
        next(); 
    }else{
        res.redirect('/who.jpeg');
    }
})


//ENDPOINTS:
//Para devolver JSON con arreglo de nombres alojado en el servidor:
app.get('/abracadabra/usuarios', (req, res) => {
    res.send({users});
})

//Una vez verificada la coincidencia de usuario, deriva a la siguiente ruta con estilo "loading":
app.get('/abracadabra/juego/:usuario', async (req, res) => {
    res.send(`
    <html>
    <body>
        <div class="container">
            <div class="hat-container">
                <img src="/sombrero.png" alt="sombrero" class="hat">
            </div>
            <h1>Has elegido a un usuario dentro de nuestra lista!!!</h1>
        </div>
        <style>
            body {
                background-color: #333;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .container {
                text-align: center;
            }
            .hat {
                width: 400px;
                height: auto;
                animation: float 3s ease-in-out infinite;
            }
            @keyframes float {
                0%,
                100% {
                    transform: translateY(0);
                }
    
                50% {
                    transform: translateY(-20px);
                }
            }
            h1 {
                color: white;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                font-size: 50px;
            }
        </style>
        <script>
            setTimeout(function () {
                window.location.href = '/';
            }, 3000);
        </script>
    </body>
    </html>
    `);
});

 //Ruta directa al juego (después de "loading") 
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

//Ruta respuesta según numero random obtenido
app.get('/abracadabra/conejo/:n', (req, res) => {
    //captar valor n de la ruta
    let n = req.params.n
    //llamado a la función numberRandom
    let number = numberRandom()
    //comparar n con number. True redirige a imagen conejito, False redirige a Voldemort.
    n == number ? res.redirect('/conejito.jpg') : res.redirect('/voldemort.jpg');
    
})

//Ruta default para páginas no creadas
app.use('*', (req, res) => {
    res.status(404).send('<h1>Esta página no existe...</h1>');
})
