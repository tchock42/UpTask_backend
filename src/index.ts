import server from './server'

const port = process.env.PORT || 4000       // Puerto donde se ejecutará el servidor

server.listen(port, () => {
    console.log((`REST API funcionando en el puerto ${port}`).rainbow)    // Mensaje que se mostrará en la consola al ejecutar el servidor
})