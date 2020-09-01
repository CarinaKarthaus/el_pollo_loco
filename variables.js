let canvas;
let ctx;
let bg_elements = 0;
let collectedBottles = 0;
let placedBottles = [508, 1560, 2008, 3070, 4500, 5800, 6400];
let bottle_y = 430;
let bottleThrowTime = 0;
let thrownBottleX = 0;
let thrownBottleY = 0;

let character_image;  
let characterHeight;
let characterWidth;
let character_x = 150;
let character_y = 25;
let character_energy = 100;
let currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/I-1.png';
const characterGraphicsMoving = ['W-21.png', 'W-22.png','W-23.png', 'W-24.png','W-25.png', 'W-26.png'];
const characterGraphicsStanding = ['I-1.png','I-1.png','I-1.png','I-2.png','I-2.png','I-2.png','I-3.png','I-3.png','I-3.png','I-4.png','I-4.png','I-4.png','I-5.png','I-5.png','I-5.png','I-6.png','I-6.png','I-6.png','I-7.png','I-7.png','I-7.png','I-8.png','I-8.png','I-8.png','I-9.png','I-9.png','I-9.png','I-10.png','I-10.png','I-10.png'];
const characterGraphicsJumping = ['J-31.png','J-32.png','J-32.png','J-33.png','J-33.png','J-34.png','J-34.png','J-35.png','J-35.png','J-36.png','J-36.png','J-37.png','J-37.png','J-38.png','J-38.png','J-39.png','J-39.png'];
const characterGraphicsSleeping = ['I-11.png','I-11.png','I-11.png','I-12.png','I-12.png','I-12.png','I-13.png','I-13.png','I-13.png','I-14.png','I-14.png','I-14.png','I-15.png','I-15.png','I-15.png','I-16.png','I-16.png','I-16.png','I-17.png','I-17.png','I-17.png','I-18.png','I-18.png','I-18.png','I-19.png','I-19.png','I-19.png', 'I-20.png', 'I-20.png', 'I-20.png'];
const characterGraphicsWounded = ['H-41.png', 'H-41.png', 'H-41.png', 'H-42.png', 'H-42.png', 'H-42.png', 'H-43.png', 'H-43.png', 'H-43.png'];
const characterGraphicsDead = ['D-51.png','D-51.png','D-51.png','D-52.png','D-52.png','D-52.png','D-53.png','D-53.png','D-53.png','D-54.png','D-54.png','D-54.png','D-55.png','D-55.png','D-55.png','D-56.png','D-56.png', 'D-56.png','D-57.png','D-57.png','D-57.png'];
let characterGraphicIndex = 0;
let isMovingRight = false;
let isMovingLeft = false;
let isSleeping = false;
let isWounded = false;
let isDead = false;
let isJumping = false;
let timePassedSinceJump = 0; 
let lastJumpStarted = 0;

let chickens = [];
let bossTurning = false;
let bossIsWounded = false;
let boss_energy = 100;
let bossAttack = false;
let timeSinceLastBottleCollision = 1000;
let timeOfBottleCollision; 
let timeSinceLastCollision = 4000;
let timeOfCollision = 0;
let bossDefeatedAt = 0;
let characterDefeatedAt = 0;

const fondImg = ['1.png', '2.png'];
let cloudOffset = 0;
const skyGraphics = [''];
const chickenGraphics = ['1.Paso_derecho.png','1.Paso_derecho.png','1.Paso_derecho.png','1.Paso_derecho.png','1.Paso_derecho.png', '2.Centro.png', '2.Centro.png','2.Centro.png', '2.Centro.png', '2.Centro.png', '3.Paso_izquierdo.png', '3.Paso_izquierdo.png','3.Paso_izquierdo.png', '3.Paso_izquierdo.png', '3.Paso_izquierdo.png' ];
let currentChickenIndex = 0;
const bottleGraphicsStatic = ['1.Marcador.png', '2.Botella_enterrada1.png', '2.Botella_enterrada2.png'];
const bottleGraphicsRotating = ['botella_rotación1.png','botella_rotación2.png', 'botella_rotación3.png', 'botella_rotación4.png'];
const bossGraphicsWalking = ['G1.png', 'G1.png', 'G1.png', 'G2.png','G2.png','G2.png', 'G3.png', 'G3.png', 'G3.png', 'G4.png', 'G4.png', 'G4.png' ];
const bossGraphicsAngry = ['G5.png','G5.png','G5.png', 'G6.png', 'G6.png', 'G6.png', 'G7.png', 'G7.png', 'G7.png', 'G8.png', 'G8.png', 'G8.png', 'G9.png', 'G9.png', 'G9.png', 'G10.png', 'G10.png', 'G10.png', 'G11.png','G11.png','G11.png', 'G12.png', 'G12.png', 'G12.png' ];
const bossGraphicsAttacking = ['G13.png','G13.png','G13.png', 'G14.png', 'G14.png', 'G14.png', 'G15.png', 'G15.png', 'G15.png', 'G16.png', 'G16.png', 'G16.png', 'G17.png', 'G17.png', 'G17.png', 'G18.png', 'G18.png', 'G18.png', 'G19.png','G19.png','G19.png', 'G20.png', 'G20.png', 'G20.png'];
const bossGraphicsWounded = ['G21.png', 'G21.png', 'G21.png','G22.png', 'G22.png', 'G22.png','G23.png', 'G23.png', 'G23.png'];
const bossGraphicsDead = ['G24.png','G24.png','G24.png','G25.png','G25.png','G25.png','G26.png','G26.png','G26.png'];
let currentBossIndex = 0;
let bossImgPath = './img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/1.Caminata/G1.png';
let allImgArrays = [skyGraphics, fondImg, fondImg, fondImg, fondImg, characterGraphicsMoving, characterGraphicsStanding, characterGraphicsJumping, characterGraphicsSleeping, characterGraphicsWounded, characterGraphicsDead, chickenGraphics, chickenGraphics, bossGraphicsWalking, bossGraphicsAngry, bossGraphicsAttacking, bossGraphicsWounded, bossGraphicsDead];
const allImgArraysPaths = ['./img/5.Fondo/Capas/5.cielo_1920-1080px.png', './img/5.Fondo/Capas/3.Fondo3/', './img/5.Fondo/Capas/2.Fondo2/', './img/5.Fondo/Capas/1.suelo-fondo1/', './img/5.Fondo/Capas/4.nubes/' ,'./img/2.Secuencias_Personaje-Pepe-corrección/2.Secuencia_caminata/', './img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/', './img/2.Secuencias_Personaje-Pepe-corrección/3.Secuencia_salto/', './img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/LONG_IDLE/', './img/2.Secuencias_Personaje-Pepe-corrección/4.Herido/' ,'./img/2.Secuencias_Personaje-Pepe-corrección/5.Muerte/' ,'./img/3.Secuencias_Enemy_básico/Versión_Gallinita/', './img/3.Secuencias_Enemy_básico/Versión_pollito/', './img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/1.Caminata/', './img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/2.Ateción-ataque/1.Alerta/', './img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/2.Ateción-ataque/2.Ataque/', './img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/3.Herida/', './img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/4.Muerte/' ];
let bottle_base_image = new Image();
let background_base_image;
let images = []; 

let gameFinished = false;
let gameStarted = false;
let currentTime = new Date().getTime();
let timeSinceLastKeydown = 0;
let updateIntervals = []; // array of interval-functions that are carried out

// touch_processing.js variables
let touchpointX;
let Y_touchpoints = new Array();
let ongoingTouches = new Array();
let jumpOnMobile = false;
let clickTimer = null;


// ----------- Game config
const LEVEL_LENGTH = 8; // indicates how often canvas-length is repeated (canvas-length = 1080px)
const JUMP_TIME = 450; // in ms
const GAME_SPEED = 14;
const AUDIO_RUNNING = new Audio ('./audio/running.mp3');
const AUDIO_JUMP = new Audio ('./audio/jump.mp3');
const AUDIO_BOTTLE = new Audio ('./audio/bottle.mp3');
const AUDIO_THROW = new Audio ('./audio/throw.mp3');
const AUDIO_CHICKEN = new Audio ('./audio/chicken.mp3');
const AUDIO_BREAKING_BOTTLE = new Audio ('./audio/breaking_bottle.mp3');
const AUDIO_BACKGROUND_MUSIC = new Audio ('./audio/background_music.mp3');
const AUDIO_WIN = new Audio ('./audio/win.mp3');
const AUDIO_PAIN = new Audio ('./audio/pain.mp3');
const AUDIO_LOST = new Audio ('./audio/defeat.mp3');
const AUDIO_CHICKEN_SQUASHED = new Audio ('./audio/squash.mp3');
let BOSS_POSITION_X = 7000;
let BOSS_POSITION_Y = 130;
let BOSS_WIDTH = 350;
let BOSS_HEIGHT = 400;
const COLLISION_ENERGY_LOSS = 20;
const COLLISION_BOTTLE_FILL = 20;
const DURATION_WOUNDED_STATE = 750;

AUDIO_BACKGROUND_MUSIC.loop = true;
AUDIO_BACKGROUND_MUSIC.volume = 0.5;