const canvas = document.querySelector('canvas');
const c = canvas?.getContext('2d');

const PLAYER_SPEED = 7;
const PLAYER_ROTATION = 0.15;

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

const player = new Player();
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

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update()

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