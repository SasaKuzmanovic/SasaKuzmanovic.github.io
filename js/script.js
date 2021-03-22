// Each time this function is called a GameObject
// is create based on the arguments
// In JavaScript you can consider everything an Object
// including functions
var canvas = document.getElementById("the_canvas");
var ctx = canvas.getContext("2d");

var playerImage = new Image();
playerImage.src = "./img/playerCharacter.png";
var enemyImage = new Image();
enemyImage.src = "./img/EnemyCharacter.png";

var attackChance = 2;
var enemyAttackChance = 2;
////////////////////////////////////////////////////////////////////////////////////////
// Player related variables!
////////////////////////////////////////////////////////////////////////////////////////

var PlayerMoney = 0;
var PlayerMoneyIncrement = 1;
document.getElementById("myMoney").innerHTML = PlayerMoney;

var PlayerExperiencePoints = 0;
var PlayerExperiencePointsIncrement = 1;

var LevelUp = false;

var PlayerAttackDamage = 2;
var PlayerAttackDamageIncrement = 1;

var PlayerHealth = 25;
var RestoreHealthAmount = 10;
///////////////////////////////////////////////////////////////////////////////////////
// Enemy related variables
////////////////////////////////////////////////////////////////////////////////////////

var EnemyHealth = 25;

var EnemyAttackDamage = 2;

var EnemyExperiencePoints = 0;
var EnemyExperencePointsIncrement = 1;

var EnemyLevelUp = false;

// Functions
function AddMoneyToPlayer() {
	PlayerMoney = PlayerMoney + PlayerMoneyIncrement;
}

function AddDamagePointsToPlayer() {
	PlayerAttackDamage = PlayerAttackDamage + PlayerAttackDamageIncrement;	
}

function BuyDamagePoints() {
	if (PlayerMoney < 3) {
		alert("You do not have enough Money!");
	}
	
	if (PlayerMoney >= 3) {
		AddDamagePointsToPlayer();
		PlayerMoney = PlayerMoney - 3;
	}
}

function BuyExperiencePoints() {
	if (PlayerMoney < 2) {
		alert("You do not have enough Money!");
	}
	if (PlayerMoney >= 2) {
		AddExperiencePointsToPlayer();
		PlayerMoney = PlayerMoney - 2;
	}
}

function AddExperiencePointsToPlayer() {
	PlayerExperiencePoints = PlayerExperiencePoints + PlayerExperiencePointsIncrement;
}

function RestorePlayerHealth() {
	PlayerHealth = PlayerHealth + RestoreHealthAmount;
	
	if (PlayerHealth > 25) {
		PlayerHealth = 25;
	}
}

function LevelUpPlayer() {
	if (LevelUp == true) {
		AddDamagePointesToPlayer();
	}
}

function CheckXPForLevelUp() {
	if (ExperiencePoints == 5) {
		LevelUp = true;
	}
}

function getRandomInt(attackChance) {
	return Math.floor(Math.random() * Math.floor(attackChance));
}

function Tier1Attack() {
	EnemyHealth = EnemyHealth - PlayerAttackDamage;
	alert ("Damage Given: " + PlayerAttackDamage);
	alert ("Enemy Health: " + EnemyHealth);
	
	enemyAttackChoice();
}

function Tier2Attack() {
	if (getRandomInt(attackChance) == 1) {
		EnemyHealth = EnemyHealth - (PlayerAttackDamage + 2);
		var newDamage = PlayerAttackDamage + 2;
		alert("Damage given: " + newDamage);
		alert ("Enemy Health: " + EnemyHealth);
	}
	else {
		alert("Attack missed!");
	}
	
	enemyAttackChoice();
}

function Tier3Attack() {
	attackChance = 4;
	if (getRandomInt(attackChance) == 1) {
		EnemyHealth = EnemyHealth - (PlayerAttackDamage + 3);
		var newDamage = PlayerAttackDamage + 3;
		alert("Damage given: " + newDamage);
		alert ("Enemy Health: " + EnemyHealth);
	}
	else {
		alert("Attack missed!");
	}
	
	enemyAttackChoice();
}
/////////////////////////////////////////////////////////////////////////
// Enemy attacks
/////////////////////////////////////////////////////////////////////////
function enemyAttackChoice() {
	var randomAttackNumber = getRandomInt(3);
	
	if (randomAttackNumber == 0) {
		EnemyTier1Attack();
	}
	if (randomAttackNumber == 1) {
		EnemyTier2Attack();
	}
	if (randomAttackNumber == 2) {
		EnemyTier3Attack();
	}
}

function EnemyTier1Attack() {
	PlayerHealth = PlayerHealth - EnemyAttackDamage;
	alert ("Damage taken: " + EnemyAttackDamage);
	alert ("Your Health: " + PlayerHealth);
}

function EnemyTier2Attack() {
	if (1 == getRandomInt(enemyAttackChance)) {
		PlayerHealth = PlayerHealth - (EnemyAttackDamage + 2);
		
		var newDamage = EnemyAttackDamage + 2;
		alert("Damage taken: " + newDamage);
		alert ("Your Health: " + PlayerHealth);
	}
	else {
		alert("Enemy missed their attack");
	}
}
function EnemyTier3Attack() {
	attackChance = 4;
	if (1 == getRandomInt(enemyAttackChance)) {
		PlayerHealth = PlayerHealth - (EnemyAttackDamage + 3);
		var newDamage = EnemyAttackDamage + 3;
		alert("Damage taken: " + newDamage);
		alert ("Your Health: " + PlayerHealth);
	}
	else {
		alert("Enemy missed their attack");
	}
}

function checkHealth() {
	if (PlayerHealth <= 0) {
		gameOverLoss();
	}
	if (EnemyHealth <= 0) {
		gameOverWin();
	}
}

function gameOverLoss() {
	alert("You Lost! Refresh the browser to try again!");	
}

function gameOverWin() {
	alert("You Won!");
	alert("Congratulations!");
}

function endTurn() {
	// more to be added!
	AddMoneyToPlayer();
	document.getElementById("myMoney").innerHTML = PlayerMoney;
	console.log(PlayerHealth);
}
/////////////////////////////////////////////////////////////////////////
function drawPlayer() {
	ctx.drawImage(playerImage, 100, 100);
}

function drawEnemy() {
	ctx.drawImage(enemyImage, 1000, 100);
}

function gameloop() {
	checkHealth();
    drawPlayer();
	drawEnemy();
    window.requestAnimationFrame(gameloop);
}
console.log("Loadan script.js!");
// Handle Active Browser Tag Animation
window.requestAnimationFrame(gameloop);

