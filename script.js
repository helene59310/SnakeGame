window.onload = function()//fonction js qui se lance lorsque la fenêtre va s'afficher
{
    var canvasWidth = 900; //largeur du canvas
    var canvasHeight = 600; //hauteur du canvas
    var blockSize = 30; //taille de chaque bloc
    var ctx; // pour dessiner dans le canvas, on a besoin du contexte 
    var delay = 100;//délai en ms 
    var snakee; // variable pour créer le serpent

    
    // fonction pour initier le canvas
    function init()
    {
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth; 
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid"; // pour dessiner le tour du canvas
        document.body.appendChild(canvas); //pour faire apparaître le canvas dans html
        ctx = canvas.getContext('2d'); //le dessin sera en 2 dimensions
        snakee = new Snake([[6,4], [5,4], [4,4]]); //positions des blocs du serpent
        refreshCanvas();
    }

    //fonction pour rafraichir le canvas et faire avancer le serpent
    function refreshCanvas()
    {
        ctx.clearRect(0,0,canvasWidth, canvasHeight);//pour effacer le précédent rectangle à chaque refresh
        snakee.advance(); // pour faire avancer le serpent
        snakee.draw(); // pour dessiner le serpent
        setTimeout(refreshCanvas,delay);//pour rappeler la fonction refreshcanvas une fois le délai dépassé
    }

    //fonction pour dessiner les blocs
    function drawBlock(ctx, position)
    {
        var x = position[0] * blockSize; // x du bloc X la taille du bloc
        var y = position[1] * blockSize; // y du bloc X la taille du bloc
        ctx.fillRect(x,y, blockSize, blockSize); // pour remplir un rectangle à la position x et y et il fera la taille du blockSize
    }

    class Snake {
        constructor(body) {
            this.body = body; // corps du serpent
            this.draw = function () //méthode pour dessiner le serpent
            {
                ctx.save(); //pour sauvegarder le contexte du canvas(à savoir son contenu avant de rentrer dans la fonction)
                ctx.fillStyle = "#ff0000";
                for (var i = 0; i < this.body.length; i++) {
                    drawBlock(ctx, this.body[i]); //fonction permettant de dessiner un block (contexte + position du block)
                }
                ctx.restore();//permet de garder le contexte comme il était avant
            };
            this.advance = function () // méthode pour ajouter un bloc après et supprimer le 1er
            {
                var nextPosition = this.body[0].slice(); //variable pour définir la nouvelle position de la tête (la fonction slice permet de copier un élement)
                nextPosition[0] += 1; // pour faire avancer la position de 1
                this.body.unshift(nextPosition); //pour rajouter la nouvelle position du bloc
                this.body.pop(); // permet de supprimer le dernier élément du tableau
            };
        }
    }
    init(); //pour exécuter la fonction init 
    
}