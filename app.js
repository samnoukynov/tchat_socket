const app = require('express')();
const http  = require('http').Server(app);
const io = require('socket.io')(http);
ID = [];
pseudo= [];
monTableau = [pseudo,ID];


io.on('connection', socket => {


    console.log('user connected : ', socket.id);
    socket.on('loaded', (data) => {
        console.log('data from client : ', data)
    })
    // quand l'évènement message est intercepté on recois un pseudo et et un message a envoyé aux clients
    socket.on('message', (data, pseudo) => {
        socket.broadcast.emit('message', pseudo + ": " + data)
    })
    // quand un client a choisi son pseudo celui va automatiquement mettre a jour la liste
    // des personnes connecté pour tout les clients
    socket.on('creation_pseudo', (pseudo, id) => {
        monTableau[0].push(pseudo);
        monTableau[1].push(id);
        io.emit("actualisation_liste", monTableau);
        console.log("liste utilisateur " + monTableau)
    })
    // quand un client ce déconnecte le serveur récupére son id et
    // en cherchant dans le 2 éme tableau c'est a dire ID[]
    // il va supprimer l'emplacement egale a l'ID ainsi que son homologue
    // dans le tableau pseudo avec le même index
    socket.on('disconnect', (reason) =>{
            socket.broadcast.emit('deconnection', socket.id),
            console.log(socket.id)
    for (i = 0; i < monTableau[0].length; i++) {
        if ( monTableau[1][i] == socket.id)
        {
            ID.splice(i,1),
            pseudo.splice(i,1),
            io.emit("actualisation_liste", monTableau);

        }

    }}
)

})



app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/views/index.html')
});

http.listen(9000, ()=> {
    console.log('Server is up and running on http://localhost:3000')
});
module.exports = app;