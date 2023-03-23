window.onload = function()//fonction js qui se lance lorsque la fenêtre va s'afficher
{
    var canvasWidth = 900; //largeur du canvas
    var canvasHeight = 600; //hauteur du canvas
    var blockSize = 30; //taille de chaque bloc
    var ctx; // pour dessiner dans le canvas, on a besoin du contexte 
    var delay = 100;//délai en ms 
    var snakee; // variable concernant le serpent

    init(); //pour exécuter la fonction init 

    function init()
    {
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth; 
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid"; // pour dessiner le tour du canvas
        document.body.appendChild(canvas); //pour faire apparaître le canvas dans html
        ctx = canvas.getContext('2d'); //le dessin sera en 2 dimensions
        snakee = new Snake([[6,4], [5,4], [4,4]]);
        refreshCanvas();
    }

    function refreshCanvas()
    {
        ctx.clearRect(0,0,canvasWidth, canvasHeight);//pour effacer le précédent rectangle à chaque refresh
        snakee.advance(); // pour faire avancer le serpent
        snakee.draw(); // pour dessiner le serpent
        setTimeout(refreshCanvas,delay);//pour rappeler la fonction refreshcanvas une fois le délai dépassé
    }

    function drawBlock(ctx, position)
    {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x,y, blockSize, blockSize);
    }

    function Snake(body)
    {
        this.body = body; // corps du serpent
        this.draw = function() //méthode pour dessiner le serpent dans le canvas
        {
            ctx.save(); //pour sauvegarder le contexte du canvas(à savoir son contenu avant de rentrer dans la fonction)
            ctx.fillStyle = "#ff0000";
            for(var i=0; i<this.body.length; i++)
            {
                drawBlock(ctx,this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function()
        {
            var nextPosition = this.body[0].slice();
            nextPosition[0] += 1;
            this.body.unshift(nextPosition);
            this.body.pop();
        };
    }
    
}