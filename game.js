var plataformas;
var player;
var cursores;
var estrelas;
var pontos = 0;
var placar;
var titulo;
var bombas;
var gameOver = false;

function preload() {
    this.load.image('fundo', 'assets/fundo.jpg');
    this.load.image('estrela', 'assets/star.png');
    this.load.image('chao', 'assets/plataforma.png');
    this.load.image('base', 'assets/base.png');
    this.load.image('bomba', 'assets/bomb.png');
    this.load.spritesheet('carinha', 'assets/carinha.png', {
        frameWidth: 32, frameHeight: 32,
    });
};

function create() {
    this.add.image(400, 300, 'fundo');

    plataformas = this.physics.add.staticGroup();

    plataformas.create(400, 600-10, 'base').refreshBody();
    plataformas.create(500, 500, 'chao');
    plataformas.create(400, 400, 'chao');
    plataformas.create(600, 250, 'chao');
    plataformas.create(150, 300, 'chao');
    plataformas.create(325, 100, 'chao');

    player = this.physics.add.sprite(100, 300, 'carinha');
    player.setBounce(0.3);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'anda_esquerda',
        frames: this.anims.generateFrameNumbers('carinha', {
            start: 0,
            end: 3,
        }),
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
       key: 'para' ,
       frames: [ { key: 'carinha', frame: 4 } ],
       frameRate: 20,
    });

    this.anims.create({
        key: 'anda_direita',
        frames: this.anims.generateFrameNumbers('carinha', {
            start: 5,
            end: 8,
        }),
        frameRate: 10,
        repeat: -1,
    });

    this.physics.add.collider(player, plataformas);
    cursores = this.input.keyboard.createCursorKeys();

    estrelas = this.physics.add.group({
        key: 'estrela',
        repeat: 8,
        setXY: { x: 80, y: 0, stepX: 80 }
    });

    estrelas.children.iterate((estrela) => {
        estrela.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(estrelas, plataformas);
    this.physics.add.overlap(player, estrelas, coletar, null, this);

    placar = this.add.text(650, 20, 'pontos: 0', {
        fontSize: '16px',
        fill: '#fff',
    });

    titulo = this.add.text(5, 10, 'http://github.com/ermogenes/carinha', {
        fontSize: '16px',
        fill: '#fff',
    });

    bombas = this.physics.add.group();
    this.physics.add.collider(bombas, plataformas);
    this.physics.add.overlap(player, bombas, explodir, null, this);
};

function coletar (player, estrela) {
    estrela.disableBody(true, true);

    pontos += 10;
    placar.setText(`pontos: ${pontos}`);

    if (estrelas.countActive(true) === 0) {
        estrelas.children.iterate((estrela) => {
            estrela.enableBody(true, estrela.x, 0, true, true);
        });

        const x = (player.x < 400 ? Phaser.Math.Between(400,800) : Phaser.Math.Between(0, 400));
        var bomba = bombas.create(x, 16, 'bomba');
        bomba.setBounce(1);
        bomba.setCollideWorldBounds(true);
        bomba.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
};

function explodir (player, bomba) {
    this.physics.pause();
    player.setTint(0x00ff00);
    player.anims.play('para');
    gameOver = true;
};

const update = () => {
    if (cursores.left.isDown) {
        player.setVelocityX(-100);
        player.anims.play('anda_esquerda', true);
    } else if (cursores.right.isDown) {
        player.setVelocityX(100);
        player.anims.play('anda_direita', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('para', true);
    }

    if (cursores.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
};

var game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },
    scene: {
        preload,
        create,
        update,
    },
});