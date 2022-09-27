const canvas = document.querySelector('canvas');
const c = canvas?.getContext('2d');

// constants
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
        this.radius = 4;
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

class InvaderProjectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 3;
        this.height = 10;
    }

    draw() {
        c.fillStyle = 'white';
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
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
    shoot(invaderProjectiles) {
        invaderProjectiles.push(new InvaderProjectile(
            {
                position: {
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height,
                },
                velocity: {
                    x: 0,
                    y: 5,
                }
            }
        ))
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
const grids = [];
const invaderProjectiles = [];

// button press 
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

let frames = 0;
// interval for spawning enemies
let randomInterval = Math.trunc((Math.random() * 500) + 500);

// game loop
function animate() {
    requestAnimationFrame(animate);

    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    // update player
    player.update()

    // update projectiles
    invaderProjectiles.forEach((invaderProjectile, invaderProjectilesIndex) => {
        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            setTimeout(() => {
                // clear projectile if it goes outside of canvas
                invaderProjectiles.splice(invaderProjectilesIndex, 1)
            }, 0)
        } else {
            invaderProjectile.update();
        }

        if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y
            && invaderProjectile.position.x + invaderProjectile.width >= player.position.x
            && invaderProjectile.position.x <= player.position.x + player.width) {
            console.log('You lose');
        }
    })

    projectiles.forEach((projectile, i) => {
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                // clear projectile if it goes outside of canvas
                projectiles.splice(i, 1)
            }, 0)
        } else {
            projectile.update();
        }
    })

    // update grid
    grids.forEach((grid, gridIndex) => {
        grid.update()

        // spawn projectiles
        if (frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles);
        }

        grid.invaders.forEach((invader, invaderIndex) => {
            invader.update({ velocity: grid.velocity })

            // collision detection
            projectiles.forEach((projectile, projectileIndex) => {
                if (projectile.position.y - projectile.radius <= invader.position.y + invader.height
                    && projectile.position.x + projectile.radius >= invader.position.x
                    && projectile.position.x - projectile.radius <= invader.position.x + invader.width
                    && projectile.position.y + projectile.radius >= invader.position.y
                ) {
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(currentInvader => currentInvader === invader)
                        const projectileFound = projectiles.find(currentProjectile => currentProjectile === projectile)

                        // remove invader and projectile
                        if (invaderFound && projectileFound) {
                            grid.invaders.splice(invaderIndex, 1)
                            projectiles.splice(projectileIndex, 1)

                            if (grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0];
                                const lastInvader = grid.invaders[grid.invaders.length - 1];
                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;

                                grid.position.x = firstInvader.position.x;
                            } else {
                                // clear empty grids if empty
                                grids.splice(gridIndex, 1)
                            }
                        }
                    }, 0)
                }
            })
        })
    })
    // move player
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

    // spawning enemies
    if (frames % randomInterval === 0) {
        grids.push(new Grid())
        randomInterval = Math.trunc((Math.random() * 500) + 500);
        frames = 0;
    }

    frames++
}
// start game
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
// clear button press
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