import { c, canvas } from "../canvas.js";

export class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.opacity = 1;

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
        c.globalAlpha = this.opacity;
        c.translate(
            this.position.x + (this.width / 2),
            this.position.y + (this.height / 2)
        )
        c.rotate(this.rotation)

        c.translate(
            -this.position.x - (this.width / 2),
            -this.position.y - (this.height / 2)
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