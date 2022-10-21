const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];

// mouse

let mouse = {
    x:null,
    y:null,
    radius: 100
}

window.addEventListener('mousemove', function(event){
    mouse.x = event.x + canvas.clientLeft/2;
    mouse.y = event.y + canvas.clientTop/2;
});


function drawImage(){
    let imageWidth = png.width;
    let imageHeight = png.height;

    const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    class Particle{
        constructor(x, y, color, size){
            this.x = x + canvas.width/2 - png.width * 2,
            this.y = y + canvas.height/2 - png.height * 2,
            this.color = color,
            this.size = 2,

            this.baseX = x + canvas.width/2 - png.width * 2,
            this.baseY = y + canvas.height/2 - png.height * 2,
            this.density = (Math.random() * 10) + 2;
        }

        draw(){
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
            ctx.closePath();
            ctx.fill();
        }
        update(){
            ctx.fillStyle = this.color;

            // colission detection
            let dx =  mouse.x - this.x;
            let dy = mouse.y  - this.y;

            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            // max distance, past that the force will be 0
            const maxDistance = 100;
            let force = (maxDistance - distance) / maxDistance;
            if(force < 0) force = 0;


            let directionX = (forceDirectionX * force * this.density * 0.6);
            let directionY = (forceDirectionY * force * this.density * 0.6);

            if(distance < mouse.radius + this.size){
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX){
                    let dx = this.x - this.baseX;
                    this.x -= dx/20;
                } if(this.y !== this.baseY){
                    let dy = this.y - this.baseY;
                    this.y -= dy/20;
                }
            }
            this.draw()
        }
    }
    function init(){
        particleArray = [];

        for(let y = 0, y2 = data.height; y < y2; y++){
            for(let x = 0, x2 = data.width; x < x2; x++){
                if(data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
                    let positionX = x;
                    let positionY = y;
                    let color = "rgb(" + data.data[(y * 4 * data.width) + (x * 4)] + "," +
                                         data.data[(y * 4 * data.width) + (x * 4) + 1] + "," +
                                         data.data[(y * 4 * data.width) + (x * 4) + 2] + ")";
                    particleArray.push(new Particle(positionX * 4, positionY * 4, color));
                }
            }
        }
    }

    function animate(){
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0,0,0,.05)';
        ctx.fillRect(0, 0, innerWidth, innerHeight);

        for(let i = 0; i < particleArray.length; i++){
            particleArray[i].update();
        }
    }
    init();
    animate();

    // resize
    window.addEventListener('resize', function(){
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    });
}

const png = new Image();
png.src = "data:image/png;base64,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";

window.addEventListener('load', (event) =>{
    console.log('page loaded');
    ctx.drawImage(png, 0, 0);
    drawImage();
})