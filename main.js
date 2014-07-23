var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');

var main_state = {

    preload: function (){
        this.game.stage.backgroundColor = '#71c5cf';
        this.game.load.image('bird', 'assets/bird.png');
        this.game.load.image('pipe', 'assets/pipe.png');
    },

    create: function (){
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this);

        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe');
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

        this.bird = this.game.add.sprite(100, 245, 'bird');
        this.bird.body.gravity.y = 1000;
        this.bird.anchor.setTo(-0.2, 0.5);

        this.score = 0;
        var style = {font: "30px Arial", fill: "#ffffff"};
        this.label_score = this.game.add.text(20, 20, "0", style);
    },

    update: function (){
        if (this.bird.inWorld == false)
            this.restart_game();

        // always rotate bird down
        if (this.bird.angle < 20){
            this.bird.angle++;
        }

        this.game.physics.overlap(this.bird, this.pipes, this.hit_pipe, null, this);
    },

    jump: function (){
        if (this.bird.alive == false){
            return;
        }

        this.bird.body.velocity.y = -350;

        // change angle animation
        var animation = this.game.add.tween(this.bird);

        // Set the animation to change the angle of the sprite to -20° in 100 milliseconds
        animation.to({angle: -20}, 100);

        // start animation
        animation.start();
    },

    restart_game: function (){
        this.game.time.events.remove(this.timer);
        this.game.state.start('main');
    },

    add_one_pipe: function (x, y){
        var pipe = this.pipes.getFirstDead();
        pipe.reset(x, y);
        pipe.body.velocity.x = -200;
        pipe.outOfBoundsKill = true;
    },

    add_row_of_pipes: function (){
        var hole = Math.floor(Math.random() * 5) + 1;

        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1)
                this.add_one_pipe(400, i * 60 + 10);

        this.score += 1;
        this.label_score.content = this.score;
    },

    hit_pipe: function (){
        if (this.bird.alive == false){
            return;
        }

        this.bird.alive = false;

        // prevent more pipes appearing
        this.game.time.events.remove(this.timer);

        // stop all pipes
        this.pipes.forEachAlive(function (p){
            p.body.velocity.x = 0;
        }, this);
    }
};

game.state.add('main', main_state);
game.state.start('main'); 