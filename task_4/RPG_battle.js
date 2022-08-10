// Задание 4. RPG баттл
// Бой идет по ходам. 
// Каждый ход компьютер (Лютый) случайно выбирает одно из доступных действий
// и сообщает, что он собирается делать. 
// В ответ на это игрок (Евстафий) должен выбрать свое действие.
// После происходит взаимное нанесение урона. 
// Магическая броня блокирует магический урон, физическая броня блокирует физический урон.
// После совершения действия, оно не может быть повторно выбрано в течение cooldown ходов
// Бой идет до победы одного из противников.
// Перед началом боя игрок выбирает сложность (начальное здоровье Евстафия)

// *** Структура программы ***
// turn - Основная функция 
// Создание массивов навыков для "monster" и "character"
// Использован JSON.stringify,
// так как необходима глубокая копия объектов 'monster' и 'character'
// Выбор сложности - difficulty
// Бесконечный цикл while
// Отрисовка навыков - getLogSkill
// Выбор случайного навыка монстра - getRandomSkill
// Выбора навыка игроком - getSkillCharater
// Нанесение урона игроку и монстру - monsterDamage и charDamage
// Блокировка использованных навыков - cooldownTurn
// Проверки окончания игры - checkGameOver


const monster = {
    maxHealth: 10,
    name: "Лютый",
    moves: [
        {
            "name": "Удар когтистой лапой",
            "physicalDmg": 3, // физический урон
            "magicDmg": 0,    // магический урон
            "physicArmorPercents": 20, // физическая броня
            "magicArmorPercents": 20,  // магическая броня
            "cooldown": 0     // ходов на восстановление
        },
        {
            "name": "Огненное дыхание",
            "physicalDmg": 0,
            "magicDmg": 4,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "name": "Удар хвостом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 50,
            "magicArmorPercents": 0,
            "cooldown": 2
        },
    ],
}

const character = {
    maxHealth: 10,
    name: "Евстафий",
    moves: [
        {
            "name": "Удар боевым кадилом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 50,
            "cooldown": 0
        },
        {
            "name": "Вертушка левой пяткой",
            "physicalDmg": 4,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 4
        },
        {
            "name": "Каноничный фаербол",
            "physicalDmg": 0,
            "magicDmg": 5,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "name": "Магический блок",
            "physicalDmg": 0,
            "magicDmg": 0,
            "physicArmorPercents": 100,
            "magicArmorPercents": 100,
            "cooldown": 4
        },
    ],
}

const readlineSync = require('readline-sync')

const turn = function (char, monst) {
    let turns = 1
    let end = false

    // Массивы навыков для "monster" и "character"
    // MovesArr - массив всех навыков, необходим для подсчета cooldown
    // EnableMoves - массив доступных навыков
    // CooldownMoves - массив навыков в cooldown
    const charMovesArr = JSON.parse(JSON.stringify(char.moves))
    const charEnableMoves = JSON.parse(JSON.stringify(charMovesArr))
    const charCooldownMoves = []
    const monsterMovesArr = JSON.parse(JSON.stringify(monst.moves))
    const monsterEnableMoves = JSON.parse(JSON.stringify(monsterMovesArr))
    const monsterCooldownMoves = []

    // Начальное здоровье
    let characterXP = char.maxHealth
    let monsterXP = monst.maxHealth

    // Выбор сложности/максимального здоровья игрока
    characterXP = difficulty(characterXP)

    while (!end) {
        // Количство ходов
        console.log(`\nTurn ${turns}`)

        // Здоровье и навыки игрока
        console.log(`______Character______ \n ______XP: ${characterXP}______\n`)
        getLogSkill(charEnableMoves, charCooldownMoves)

        // Здоровье монстра
        console.log(`\n______Monster______ \n ______XP: ${monsterXP}______\n`)

        // Монстр выбирает навык
        monsterSkill = getRandomSkill(monsterEnableMoves)

        // Игрок выбирает навык
        userSkillChoice = getSkillCharater(charEnableMoves, charCooldownMoves)

        // Нанесение урона
        characterXP = monsterDamage(characterXP, userSkillChoice, monsterSkill, monsterEnableMoves, charEnableMoves)
        monsterXP = charDamage(monsterXP, userSkillChoice, monsterSkill, monsterEnableMoves, charEnableMoves)

        // Проверка cooldowns навыков
        cooldownTurn(userSkillChoice, charEnableMoves, charCooldownMoves, charMovesArr)
        cooldownTurn(monsterSkill, monsterEnableMoves, monsterCooldownMoves, monsterMovesArr)


        // Проверка окончания игры
        end = checkGameOver(characterXP, monsterXP)

        turns++
    }
}

// Функция проверки окончания игры
const checkGameOver = function (chXP, monstXP) {
    if (chXP <= 0 && monstXP <= 0) {
        console.log('\n**** The fight is over **** \n **** Nobody won ****')
        return true
    } else if (chXP <= 0) {
        console.log('\n**** The fight is over **** \n **** Monster win ****')
        return true
    } else if (monstXP <= 0) {
        console.log('\n**** The fight is over **** \n **** Charater win ****')
        return true
    }
}

// Функция нанесения урона игроку
const monsterDamage = function (charXP, charSkills, monstSkill, monsterMoves, charMoves) {
    let XP = charXP
    XP = XP - monsterMoves[monstSkill].physicalDmg * (1 - (charMoves[charSkills].physicArmorPercents / 100));
    XP = XP - monsterMoves[monstSkill].magicDmg * (1 - (charMoves[charSkills].magicArmorPercents / 100));
    return +XP.toFixed(2)
}

// Функция нанесения урона монстру
const charDamage = function (monsXP, charSkills, monstSkill, monsterMoves, charMoves) {
    let XP = monsXP
    XP = XP - charMoves[charSkills].physicalDmg * (1 - (monsterMoves[monstSkill].physicArmorPercents / 100));
    XP = XP - charMoves[charSkills].magicDmg * (1 - (monsterMoves[monstSkill].magicArmorPercents / 100));
    return +XP.toFixed(2)
}

// Функция выбора случайного навыка
const getRandomSkill = function (arr) {
    return randNumb = Math.floor(Math.random() * (arr.length) + 1) - 1;
}

// Функция выбора навыка игроком
const getSkillCharater = function (enableMoves, cooldownMoves) {
    let trueSkill = true
    let Skill = 0
    while (trueSkill) {
        Skill = parseInt(readlineSync.question('What skill do you want to use? '), 10)
        if (isNaN(Skill) || Skill >= enableMoves.length || Skill < 0) {
            console.log("The skill is not correct. Try again")
            getLogSkill(enableMoves, cooldownMoves)
        } else {
            trueSkill = false
        }
    }
    return Skill
}

// Функция блокировки использованных навыков
const cooldownTurn = function (skillNumber, enableMoves, cooldownMoves, movesArr) {
    // Добавление использованного навыка в массив cooldownMoves
    cooldownMoves.push(enableMoves[skillNumber])
    // Удаление использованного навыка из массива enableMoves
    enableMoves.splice(skillNumber, 1)
    // Проверка cooldown
    for (let index = 0; index < cooldownMoves.length; index++) {
        // Если cooldown не равен 0, то уменьшать на 1
        if (cooldownMoves[index].cooldown != 0) {
            cooldownMoves[index].cooldown -= 1
        } else {
            // Иначе пройтись по массиву всех навыков
            // При условии, что в массиве cooldownMoves есть элементы
            for (let i = 0; i < movesArr.length; i++) {
                if (cooldownMoves.length != 0) {
                    // Сравнение по имени
                    if (cooldownMoves[index].name == movesArr[i].name) {
                        // Запись исходного значения cooldown
                        cooldownMoves[index].cooldown = movesArr[i].cooldown
                        // Добавление навыка в массив enableMoves
                        enableMoves.push(cooldownMoves[index])
                        // Удаление навыка из массива cooldownMoves
                        cooldownMoves.splice(index, 1)
                        // Уменьшение индекса
                        index--
                        // Выход 
                        break
                    }
                }
            }
        }
    }
}

// Функция выбора сложности/максимального здоровья игрока
const difficulty = function (int) {
    let XP = int
    let trueHeath = true
    while (trueHeath) {
        XP = parseInt(readlineSync.question('Maximum XP of the charater? '), 10)
        if (isNaN(XP) || XP <= 0) {
            console.log("The XP of the charater is not correct. Try again");
        } else {
            trueHeath = false
        }
    }
    return XP
}

// Функция отрисовки доступных навыков
const getLogSkill = function (EnableMoves, cooldownMoves) {
    console.log("--> Enable Moves:")
    for (let index = 0; index < EnableMoves.length; index++) {
        console.log(`${index}: ${EnableMoves[index].name}`)
    }
    if (cooldownMoves.length != 0) {
        console.log("--X Cooldown Moves:")
        for (let index = 0; index < cooldownMoves.length; index++) {
            console.log(`(X): ${cooldownMoves[index].name} cooldown: ${cooldownMoves[index].cooldown}`)
        }
    }
}
// Старт игры
turn(character, monster)