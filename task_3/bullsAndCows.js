// Задание 3. Быки и коровы
// Компьютер загадывает число из нескольких различающихся цифр (от 3 до 6). 
// Игроку дается несколько попыток на то, чтобы угадать это число.
// После каждой попытки компьютер сообщает количество совпавших цифр стоящих не на своих местах, 
// а также количество правильных цифр на своих местах.
// Например загаданное число: 56478 предположение игрока: 52976
// ответ: совпавших цифр не на своих местах - 1 (6), цифр на своих местах - 2 (5 и 7)
// игра ведется до окончания количества ходов либо до отгадывания

// *** Алгоритм программы ***
// gameStart() - Основная функция 
// Пользователь вводит количество ходов/попыток
// Компьютер загадывает число - hiddenNumber()
// Бесконечный цикл while
// Вызов функции сравнения введенного и загадданного чисел - check()

// hiddenNumber() - Функция загадывания числа компьютером 
// из нескольких различающихся цифр (от 3 до 6)
// Число не должно начинаться с "0"

// check() - Функция сравнение введенного компьютером и загадданного игроком чисел 
// Пользователь вводит число - getUserNumb()
// Проверка количества совпавших цифр стоящих не на своих местах
// Проверка количества правильных цифр на своих местах
// Проверка окончания игры

// getUserNumb() - Функция ввода числа пользователем
// Проверка на положительное число

const readlineSync = require('readline-sync');

const gameStart = function () {
  let turnsMax = getUserNumb('Enter number of moves: ');
  let hidNumber = hiddenNumber()
  console.log(`The number consists of ${hidNumber.length} digits`);
  let end = false
  let turns = 0
  let bulls = 0
  let cows = 0
  while (!end) {
    turns++
    end = check(hidNumber, turnsMax, turns, bulls, cows)
  }
}

const getUserNumb = function (Str) {
  let trueNumb = true
  let userNumb = ''
  while (trueNumb) {
    userNumb = parseInt(readlineSync.question(Str), 10)
    if (isNaN(userNumb) || userNumb <= 0) {
      console.log("The given number is not correct. Try again")
    } else {
      trueNumb = false
    }
  }
  return String(userNumb)
}

const hiddenNumber = function () {
  const countRND = Math.floor(Math.random() * 4 + 3)
  let numbers = ''
  while (numbers.length < countRND) {
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

const check = function (Numb, M_turn, turn, bull, cow) {
  let hiddenNumb = Numb
  let turnM = M_turn
  let move = turn
  let bulls = bull
  let cows = cow

  let userNumb = getUserNumb('Enter the number: ')

  for (let i = 0; i < hiddenNumb.length; i++) {
    if (userNumb[i] == hiddenNumb[i]) {
      bulls++
    } else if (hiddenNumb.indexOf(userNumb[i]) >= 0) {
      cows++
    }
  }
  if (move == turnM) {
    console.log(`Вы проиграли! Ходов: ${move} 
    Загаданное число: ${hiddenNumb}`)
    return true
  } else if (bulls == hiddenNumb.length) {
    console.log(`Вы выйграл! Ходов: ${move} 
		Введеное число: ${userNumb} 
		Загаданное число: ${hiddenNumb}`)
    return true
  } else {
    console.log(`Ход: ${move}
		Введенное число: ${userNumb}
		Количество быков (правильных цифр на своих местах): ${bulls}
		Количество коров (совпавших цифр): ${cows}`)
    return false
  }
}

gameStart()



