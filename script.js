window.onload = function(){//fonction js qui se lance lorsque la fenêtre va s'afficher (onload est un évènement)
    var canvasWidth = 900; //largeur du canvas
    var canvasHeight = 600; //hauteur du canvas
    var blockSize = 30; //taille de chaque bloc
    var ctx; // pour dessiner dans le canvas, on a besoin du contexte 
    var delay = 150;//délai en ms 
    var snakee; // variable pour créer le serpent
    var applee;
    var witdhInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var timeout;

    
    // fonction pour initier le canvas
    function init(){
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth; 
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray"; // pour dessiner le tour du canvas
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas); //pour faire apparaître le canvas dans html
        ctx = canvas.getContext('2d'); //le dessin sera en 2 dimensions
        snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4], [1,4]],"right"); //positions des blocs du serpent
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }

    //fonction pour rafraichir le canvas et faire avancer le serpent
    function refreshCanvas(){
        snakee.advance(); // pour faire avancer le serpent

        if(snakee.checkCollision()){
            gameOver();
        }
        else{
            if(snakee.isEatingApple(applee)){
                score++;
                snakee.eatApple = true;
                do{
                    applee.setNewPosition();
                }
                while(applee.isOneSnake(snakee))
            }
            ctx.clearRect(0,0,canvasWidth, canvasHeight);//pour effacer le précédent rectangle à chaque refresh
            drawScore();
            snakee.draw(); // pour dessiner le serpent
            applee.draw();
            timeout = setTimeout(refreshCanvas,delay);//pour rappeler la fonction refreshcanvas une fois le délai dépassé
        }
    }

    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight / 2;
        ctx.strokeText("Game Over", centerX, centerY - 180);
        ctx.fillText("Game Over", centerX, centerY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche 'Espace' pour rejouer", centerX, centerY - 120);
        ctx.fillText("Appuyer sur la touche 'Espace' pour rejouer", centerX, centerY - 120);
        ctx.restore();
    }

    function restart(){
        snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4], [1,4]],"right"); //positions des blocs du serpent
        applee = new Apple([10,10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    }

    function drawScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight / 2;
        ctx.fillText(score.toString(),centerX, centerY);
        ctx.restore();
    }
    //fonction pour dessiner les blocs
    function drawBlock(ctx, position){
        var x = position[0] * blockSize; // x du bloc X la taille du bloc
        var y = position[1] * blockSize; // y du bloc X la taille du bloc
        ctx.fillRect(x,y, blockSize, blockSize); // pour remplir un rectangle à la position x et y et il fera la taille du blockSize
    }

    class Snake {
            constructor(body, direction) {

            this.body = body; // corps du serpent
            this.direction = direction; // direction du serpent
            this.eatApple = false;
            this.draw = function () {
                ctx.save(); //pour sauvegarder le contexte du canvas(à savoir son contenu avant de rentrer dans la fonction)
                ctx.fillStyle = "#ff0000";
                for (var i = 0; i < this.body.length; i++) {
                    drawBlock(ctx, this.body[i]); //fonction permettant de dessiner un block (contexte + position du block)
                }
                ctx.restore(); //permet de garder le contexte comme il était avant
            };

            this.advance = function () {
                var nextPosition = this.body[0].slice(); //variable pour définir la nouvelle position de la tête (la fonction slice permet de copier un élement)
                switch (this.direction) {
                    case "left":
                        nextPosition[0] -= 1;
                        break;
                    case "right":
                        nextPosition[0] += 1;
                        break;
                    case "down":
                        nextPosition[1] += 1;
                        break;
                    case "up":
                        nextPosition[1] -= 1;
                        break;
                    default:
                        throw ("Invalid Direction");
                }
                this.body.unshift(nextPosition); //pour rajouter la nouvelle position du bloc
                if(!this.eatApple)
                {
                    this.body.pop(); // permet de supprimer le dernier élément du tableau
                }
                else
                {
                    this.eatApple = false;
                }   
            };

            this.setDirection = function (newDirection) {
                var allowedDirections; // directions permises
                switch (this.direction){ // le switch se fait en fonction de la direction actuelle
                    case "left":
                    case "right":
                        allowedDirections = ["up", "down"];
                        break;
                    case "down":
                    case "up":
                        allowedDirections = ["left", "right"];
                        break;
                    default:
                        throw ("Invalid Direction");
                }
                if (allowedDirections.indexOf(newDirection) > -1){
                    this.direction = newDirection;
                }
            };
            this.checkCollision = function(){
                var wallCollision = false; 
                var snakeCollision = false;
                var head = this.body[0];
                var rest = this.body.slice(1);
                var snakeX = head[0];
                var snakeY = head[1];
                var minX = 0;
                var minY = 0;
                var maxX = witdhInBlocks - 1;
                var maxY = heightInBlocks - 1;
                var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
                var isNotBetweenVerticals = snakeY < minY || snakeY > maxY;

                if(isNotBetweenHorizontalWalls || isNotBetweenVerticals){
                    wallCollision = true;
                }

                for(var i = 0; i<rest.length; i++){
                    if(snakeX == rest[i][0] && snakeY == rest[i][1]){
                        snakeCollision = true;
                    }
                }

                return wallCollision || snakeCollision;
            };
            this.isEatingApple = function(appleToEat){
                var head = this.body[0];
                if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
                    return true;
                }
                else{
                    return false;
                }
            };
        }
    }
    

    class Apple {
        constructor(position) {
            this.position = position;
            this.draw = function () {
                ctx.save();
                ctx.fillStyle = "#33cc33";
                ctx.beginPath();
                var radius = blockSize / 2;
                var x = this.position[0] * blockSize + radius;
                var y = this.position[1] * blockSize + radius;
                ctx.arc(x, y, radius, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.restore();
            };
            this.setNewPosition = function () {
                var newX = Math.round(Math.random()) * (witdhInBlocks - 1);
                var newY = Math.round(Math.random()) * (heightInBlocks - 1);
                this.position = [newX, newY];
            };
            this.isOneSnake = function(snakeToCheck) {
                var isOneSnake = false;

                for(var i = 0; i < snakeToCheck.body.length; i++){
                    if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1] ){
                        isOneSnake = true;
                    }
                }
                return isOneSnake;
            };
        }
    }
    init(); //pour exécuter la fonction init 

    //onkeydown veut dire quand l'utilisation appuie sur une touche de son clavier

    document.onkeydown = function handleKeyDown(e){
    
        var key = e.keyCode;//keyCode est obsolète mais fonctionne encore
        var newDirection;
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break; 
            case 32:
                restart();
                return;
            default:
                return;   
        }
        snakee.setDirection(newDirection);
    }
}

