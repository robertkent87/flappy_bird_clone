// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');

// Creates a new 'main' state that wil contain the game
var main_state = {

    // Function called first to load all the assets
    preload: function (){
        // change background colour of game
        this.game.stage.backgroundColor = '#71c5cf';

        // load bird sprite
        this.game.load.image('bird', 'assets/bird.png');

        // load the pipe sprite
        this.game.load.image('pipe', 'assets/pipe.png');
    },

    // Function called after 'preload' to setup the game
    create: function (){
        // display bird on screen
        this.bird = this.game.add.sprite(100, 245, 'bird');

        // create group (pool) of pipes
        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe');

        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

        // add gravity to bird to make it fall
        this.bird.body.gravity.y = 1000;

        // call the 'jump' function when spacebar hit
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this);
    },

    // Function called 60 times per second
    update: function (){
        // if the bird is outside the game, call restart_game function
        if (this.bird.inWorld == false){
            this.restart_game();
        }
    },

    // make the bird jump
    jump: function (){
        // add vertical velocity to the bird
        this.bird.body.velocity.y = -350;
    },

    add_one_pipe: function (x, y){
        // get first dead pipe
        var pipe = this.pipes.getFirstDead();

        // set position of pipe
        pipe.reset(x, y);

        // add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;

        // kill the pipe when it's no longer visible
        pipe.outOfBoundsKill = true;
    },

    add_row_of_pipes: function (){
        var hole = Math.floor(Math.random() * 5) + 1;

        for (var i = 0; i < 8; i++){
            if (i != hole && i != hole + 1){
                this.add_one_pipe(400, i * 60 + 10);
            }
        }
    },

    // restart the game
    restart_game: function (){
        // start 'main' state, which restarts the game
        this.game.state.start('main');

        this.game.time.events.remove(this.timer);
    }
};

// Add and start the 'main' state to start the game
game.state.add('main', main_state);
game.state.start('main'); 