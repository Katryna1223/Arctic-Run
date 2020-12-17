// there will be a penguin running across the screen to the right. This penguin will have to catch fish as it goes along. As the penguin catches more fish the penguin will go faster. There will be a seal chasing the penguin. If the penguin hits one of the randomly spawned rocks, the seal will get closer for a while. Like temple run.  

var penguinImage, penguin, fish1, fish2, fish3,fish4, fish5, seal, sealImage, shark, sharkImage, arctic, arcticImage, left, right, up, bottom, score=0, gamestate="play", sharkGroup, fishGroup, distance, marker=0, reset, resetImage;

localStorage["Highest Score"]=0;

function preload(){
  penguinImage = loadImage("penguin.png");
  sealImage = loadImage("seal.png");
  sharkImage = loadImage("shark.png");
  arcticImage = loadImage("arctic.jpeg");
  fish1 = loadImage("fish1.png");
  fish2 = loadImage("fish2.png");
  fish3 = loadImage("fish3.jpeg");
  fish4 = loadImage("fish4.png");
  fish5 = loadImage("fish5.jpeg");
  resetImage = loadImage("reset_button.jpg");
}

function setup() {
  createCanvas(400, 400);
  distance = 250;
  //create edge sprites

  bottom = createSprite(200, 385, windowWidth, 10);
  up = createSprite(200, 15, windowWidth, 10);
  left = createSprite(5, 200,10, windowHeight);
  right = createSprite(395, 200, 10, windowHeight);
  
  bottom.visible = false;
  up.visible = false;
  left.visible = false;
  right.visible = false;
  
  //background
  arctic = createSprite(350,200);
  arctic.addImage("arctic", arcticImage);
  arctic.scale = 3;
 
  
  penguin = createSprite(50,340);
  penguin.addImage("penguin", penguinImage);
  penguin.scale = 0.06;
 //penguin.debug = true;
  
  seal = createSprite(penguin.x-150,penguin.y);
  seal.addImage("seal", sealImage);
  seal.scale = 0.3;
  seal.setCollider("rectangle", 0,0, 200,180);
  //seal.debug = true;
  
  fishGroup = createGroup();
  sharkGroup = createGroup();

  reset = createSprite(130,200);
  reset.addImage("reset", resetImage);
  reset.scale = 0.5;
}



function draw() {
  background(255,255,255);
  if(gamestate === "play"){
    //move background
     arctic.velocityX = -5;
    if(arctic.x<0){
     arctic.x = arctic.width/2;
     }
    
    //allow the penguin to move
    movePenguin();
    
    //penguin hits sides
  penguin.collide(bottom);
  penguin.collide(up);
  penguin.collide(right);
  penguin.collide(left);
    
  //call fish
 if(World.frameCount%70===0){ 
 fishTime(); 
 }
  //call shark
  if(World.frameCount%150===0){ 
  sharkTime();
  } 
    
  //seal trails behind the penguin
  seal.x = penguin.x - distance;
  seal.y = penguin.y;
  
  //seal comes closer to penguin if the seal touches the shark
   if(penguin.isTouching(sharkGroup)){
    sharkGroup.destroyEach();
    distance-=40;
    marker = score;
  }
   
  //score increases as penguin collects fish
   if(penguin.isTouching(fishGroup)){
    fishGroup.destroyEach();
    score++;
  }
  
  //seal backs up if the score is a multiple of 3  
  if(distance<250){ 
 if((score - marker)%3 === 0 && marker != score){
      distance++;  
    } 
 }
  //once the seal touches the penguin, the game state switches to end 
    if(seal.isTouching(penguin)){
    gamestate = "end";
  }
   
    //hide the reset button
    reset.visible = false;
    
    //set high score
  if(localStorage["Highest Score"]<score){
    localStorage["Highest Score"] = score;
  }
    
  } else if(gamestate === "end"){
     arctic.velocityX = 0;
     penguin.lifetime = -1;
     seal.lifetime = -1;

     fishGroup.destroyEach();
    sharkGroup.destroyEach();
    
    reset.visible = true;
    
    if(mousePressedOver(reset)){
    gamestate = "setup";
    }
    
     } else if(gamestate === "setup"){
           distance = 250;
           score = 0;
           gamestate = "play";
     }

  
 // console.log(marker+","+score+","+distance+","+gamestate+","+localStorage["Highest Score"]);
 drawSprites();
 
  
  //display the score and the highest score
  text("SCORE:" + score, 10,10);
  text("Highest Score: " + localStorage["Highest Score"], 270,10 );
  
  //ending text
  if(gamestate==="end"){
  fill(255,0,0);
  textSize(20);
  text("The seal has caught you!",40,50);
  text("You caught "+ score +" fish before capture!",30,100);
  text("Press the button to restart!",50,350);
  
  }
}


function fishTime(){
  var rand, fish;
  fish = createSprite(430, Math.round(random(50,350)));
  rand = Math.round(random(1,5));
  switch(rand){
    case 1: fish.addImage("fish1", fish1);
    break;
    case 2: fish.addImage("fish2", fish2);
    break;
    case 3: fish.addImage("fish3", fish3);
    break;
    case 4: fish.addImage("fish4", fish4);
    break;
    case 5: fish.addImage("fish5", fish5);
    break;  
    default: break;
  }
  fish.scale = 0.2;
  fish.velocityX = -10;
  fish.lifetime = 110;
  fishGroup.add(fish);
}

function movePenguin(){
    if(keyDown("up")){
      penguin.y-=10;
     }
  if(keyDown("down")){
      penguin.y+=10;
     }
  if(keyDown("right")){
      penguin.x+=5;
     }
  if(keyDown("left")){
      penguin.x-=5;
     }
}

function sharkTime(){
  var shark = createSprite(430, Math.round(random(50,350)));
  shark.addImage("shark", sharkImage);
  shark.scale = 0.3;
  shark.velocityX = -13;
  shark.lifetime = 100;
  sharkGroup.add(shark);
}