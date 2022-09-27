const canvas = document.querySelector('canvas');
const c = canvas?.getContext('2d');

const PLAYER_SPEED = 7;
const PLAYER_ROTATION = 0.15;
const PROJECTILE_SPEED = -15;
const IMAGE_WIDTH = 30;
const IMAGE_HEIGHT = 30;

// Set canvas size
canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0,
        };

        this.rotation = 0;

        const image = new Image();
        image.src = './assets/spaceship.png'
        image.onload = () => {
            const scale = 0.15;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;

            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - (image.height * scale) - 30,
            };
        }
    }

    draw() {
        // c.fillStyle = 'red';
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.save()
        c.translate(
            player.position.x + (player.width / 2),
            player.position.y + (player.height / 2)
        )
        c.rotate(this.rotation)

        c.translate(
            -player.position.x - (player.width / 2),
            -player.position.y - (player.height / 2)
        )

        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        c.restore()
    }
    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x;
        }
    }

}

class Projectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 3;
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'red';
        c.fill()
        c.closePath()
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Invader {
    constructor({ position }) {
        this.velocity = {
            x: 0,
            y: 0,
        };

        const image = new Image();
        image.src = './assets/invader.png'
        image.onload = () => {
            const scale = 1;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;

            this.position = {
                x: position.x,
                y: position.y,
            };
        }
    }

    draw() {
        // c.fillStyle = 'red';
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update({ velocity }) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }

}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0,
        }
        this.velocity = {
            x: 3,
            y: 0,
        }
        this.invaders = [];


        const columns = Math.floor(Math.random() * 10 + 5);
        const rows = Math.floor(Math.random() * 5 + 2);

        this.width = columns * IMAGE_WIDTH;

        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                this.invaders.push(new Invader({
                    position: {
                        x: i * IMAGE_WIDTH,
                        y: j * IMAGE_HEIGHT,
                    }
                }))
            }
        }
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y = 0;

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y += IMAGE_HEIGHT;
        }
    }
}

const player = new Player();
const projectiles = [];
const grids = [new Grid()];

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    space: {
        pressed: false,
    },
}

// game loop
function animate() {
    requestAnimationFrame(animate);

    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    player.update()

    projectiles.forEach((projectile, i) => {
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(i, 1)
            }, 0)
        } else {
            projectile.update();
        }
    })

    grids.forEach(grid => {
        grid.update()
        grid.invaders.forEach(invader => {
            invader.update({ velocity: grid.velocity })
        })
    })

    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -Math.abs(PLAYER_SPEED);
        player.rotation = -Math.abs(PLAYER_ROTATION);
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = PLAYER_SPEED;
        player.rotation = PLAYER_ROTATION;
    } else {
        player.velocity.x = 0;
        player.rotation = 0;
    }
}

animate();

// move player
window.addEventListener('keydown', (e) => {
    const key = e.key;

    switch (key) {
        case 'a':
            keys.a.pressed = true;
            break;
        case 'd':
            keys.d.pressed = true;
            break;
        case ' ':
            keys.space.pressed = true;
            projectiles.push(
                new Projectile({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y,
                    },
                    velocity: {
                        x: 0,
                        y: PROJECTILE_SPEED,
                    }
                }))
            break;
    }
})

window.addEventListener('keyup', (e) => {
    const key = e.key;
    switch (key) {
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
        case ' ':
            keys.space.pressed = false;
            break;
    }
})