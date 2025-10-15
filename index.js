const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');

        // Game variables
        let score = 0;
        let gameOver = false;
        let win = false;

        // Player (basket)
        const player = {
            x: canvas.width / 2 - 25,
            y: canvas.height - 50,
            width: 50,
            height: 30,
            speed: 5
        };

        // Arrays for game objects
        let animals = [];
        let poachers = [];

        // Animal types (simple emojis for fun)
        const animalTypes = ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🦉', '🐸'];

        // Key handling
        const keys = {};
        document.addEventListener('keydown', (e) => {
            keys[e.key.toLowerCase()] = true;
        });
        document.addEventListener('keyup', (e) => {
            keys[e.key.toLowerCase()] = false;
        });

        // Create animal
        function createAnimal() {
            const animal = {
                x: Math.random() * (canvas.width - 20),
                y: -20,
                width: 20,
                height: 20,
                type: animalTypes[Math.floor(Math.random() * animalTypes.length)],
                speed: 2 + Math.random() * 2
            };
            animals.push(animal);
        }

        // Create poacher (obstacle)
        function createPoacher() {
            const poacher = {
                x: Math.random() * (canvas.width - 30),
                y: -30,
                width: 30,
                height: 30,
                speed: 3
            };
            poachers.push(poacher);
        }

        // Update player position
        function updatePlayer() {
            if (keys['a'] || keys['arrowleft']) {
                player.x -= player.speed;
            }
            if (keys['d'] || keys['arrowright']) {
                player.x += player.speed;
            }
            // Boundaries
            player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
        }

        // Update falling objects
        function updateObjects() {
            // Update animals
            for (let i = animals.length - 1; i >= 0; i--) {
                const animal = animals[i];
                animal.y += animal.speed;

                // Check collision with player
                if (animal.y + animal.height > player.y &&
                    animal.y < player.y + player.height &&
                    animal.x + animal.width > player.x &&
                    animal.x < player.x + player.width) {
                    score += 10;
                    animals.splice(i, 1);
                    scoreElement.textContent = `Score: ${score}`;
                    if (score >= 50) {
                        win = true;
                        gameOver = true;
                    }
                    continue;
                }

                // Remove if off screen
                if (animal.y > canvas.height) {
                    animals.splice(i, 1);
                }
            }

            // Update poachers
            for (let i = poachers.length - 1; i >= 0; i--) {
                const poacher = poachers[i];
                poacher.y += poacher.speed;

                // Check collision with player
                if (poacher.y + poacher.height > player.y &&
                    poacher.y < player.y + player.height &&
                    poacher.x + poacher.width > player.x &&
                    poacher.x < player.x + player.width) {
                    gameOver = true;
                    break;
                }

                // Remove if off screen
                if (poacher.y > canvas.height) {
                    poachers.splice(i, 1);
                }
            }
        }

        // Draw everything
        function draw() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw player (basket)
            ctx.fillStyle = '#8B4513'; // Brown for basket
            ctx.fillRect(player.x, player.y, player.width, player.height);

            // Draw animals
            animals.forEach(animal => {
                ctx.font = '20px Arial';
                ctx.fillText(animal.type, animal.x, animal.y + 20);
            });

            // Draw poachers (red squares)
            poachers.forEach(poacher => {
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(poacher.x, poacher.y, poacher.width, poacher.height);
            });

            // Draw game over or win message
            if (gameOver) {
                ctx.fillStyle = win ? '#FFD700' : '#FF0000';
                ctx.font = '30px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(win ? 'You Win! All Animals Saved!' : 'Game Over! Animals Lost...', canvas.width / 2, canvas.height / 2);
                ctx.font = '20px Arial';
                ctx.fillText('Refresh to play again', canvas.width / 2, canvas.height / 2 + 40);
                ctx.textAlign = 'left';
            }
        }

        // Game loop
        function gameLoop() {
            if (!gameOver) {
                updatePlayer();
                updateObjects();
            }
            draw();
            requestAnimationFrame(gameLoop);
        }

        // Spawn timers
        setInterval(() => {
            if (!gameOver) createAnimal();
        }, 1500); // Animal every 1.5s

        setInterval(() => {
            if (!gameOver && Math.random() < 0.3) createPoacher(); // Poacher occasionally
        }, 2000);

        // Start the game
        gameLoop();
