// Проект 1. Быки и коровы
// Компьютер загадывает число из нескольких различающихся цифр (от 3 до 6). Игроку дается несколько попыток на то, чтобы угадать это число.
// После каждой попытки компьютер сообщает количество совпавших цифр стоящих не на своих местах, а также количество правильных цифр на своих местах.
// Например загаданное число: 56478 предположение игрока: 52976
// ответ: совпавших цифр не на своих местах - 1 (6), цифр на своих местах - 2 (5 и 7)
// игра ведется до окончания количества ходов либо до отгадывания


const readlineSync = require('readline-sync');

const hiddenNumber = function() { 
  const countRND = Math.floor(Math.random()*4 + 3)
  let numbers = ''
  while (numbers.length < countRND){
    let numb = Math.floor(Math.random() * 10)
    if (numbers.indexOf(numb) < 0) {
      numbers = numbers + numb
    }
  } 
  if (numbers[0] == 0) {
    hiddenNumber() 
  } else {
    return numbers
  }
}

function getUserNumb(hidNumb){
    let trueSkill = true
    let userNumb = ''
    while(trueSkill) {
        if (isNaN(userNumb = parseInt(readlineSync.question('Enter the number: '), 10)) || userNumb.length > hidNumb.length || userNumb < 0) {
            console.log("The given number is not correct. Try again")
        } else { 
          trueSkill = false
        }
    }
    trueSkill = true
    return String(userNumb)
}

const check = function(hidNumb, turnMax, turn, bulls, cows) {
  let userNumb =  getUserNumb(hidNumb)
  for(let i = 0; i < hidNumb.length; i++) {
    if (userNumb[i] == hidNumb[i]) {
    bulls++
   } else if (hidNumb.indexOf(userNumb[i]) >= 0) {
     cows++
     }
  }
  if (turn == turnMax) {
    console.log( `Вы проиграли! Ходов: ${turn} 
    Загаданное число: ${hidNumb}`)
    return true;
  } else if (bulls == hidNumb.length) {
  console.log( `Вы выйграл! Ходов: ${turn} 
		Введеное число: ${userNumb} 
		Загаданное число: ${hidNumb}`)
    return true;
  } else {
  console.log( `Ход: ${turn}
		Введенное число: ${userNumb}
		Количество быков: ${bulls}
		Количество коров: ${cows}`);
    return false; 
  }
}

function gameStart() {
  let turnMax =  readlineSync.question('Enter number of moves: ');
  let hidNumber = hiddenNumber()
  console.log(`The number consists of ${hidNumber.length} digits`);
   let end = false
  let turn = 0
  let bulls = 0
  let cows = 0
   while (!end) {
    turn++
    end = check(hidNumber, turnMax, turn, bulls, cows)
  }
}

gameStart();



