// Проект 2. RPG баттл
// Бой идет по ходам. Каждый ход компьютер (Лютый) случайно выбирает одно из доступных действий и сообщает, что он собирается делать. В ответ на это игрок (Евстафий) должен выбрать свое действие.
// После происходит взаимное нанесение урона. Магическая броня блокирует магический урон, физическая броня блокирует физический урон.
// После совершения действия, оно не может быть повторно выбрано в течение cooldown ходов
// Бой идет до победы одного из противников.
// Перед началом боя игрок выбирает сложность (начальное здоровье Евстафия)


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
};

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
};

const readlineSync = require('readline-sync');

function turn(character, monster) {
    let turns = 1
    let end = false

    const charMovesArr = JSON.parse(JSON.stringify(character.moves))
    let charEnableMoves = JSON.parse(JSON.stringify(charMovesArr))
    let charCooldownMoves = []

    const monsterMovesArr = JSON.parse(JSON.stringify(monster.moves))
    let monsterEnableMoves = JSON.parse(JSON.stringify(monsterMovesArr))
    let monsterCooldownMoves = []

    let characterXP = character.maxHealth
    let monsterXP = monster.maxHealth


    characterXP = difficulty(characterXP)

    while (!end) {
        console.log("_____________________________________");
        console.log(`turn ${turns}`)

        console.log(`______Character______ XP: ${characterXP}`)
        getLogSkill(charEnableMoves, charCooldownMoves)

        console.log(`______Monster______ XP: ${monsterXP}`)
        getLogSkill(monsterEnableMoves, monsterCooldownMoves)

        randNum = getRandomSkill(monsterEnableMoves)
        SkillsAns = getSkillCharater(charEnableMoves, charCooldownMoves)

        cooldownTurn(SkillsAns, charEnableMoves, charCooldownMoves, charMovesArr)
        cooldownTurn(randNum, monsterEnableMoves, monsterCooldownMoves, monsterMovesArr)

        characterXP = checkCharaterSkills(characterXP, SkillsAns, randNum, monsterMovesArr, charMovesArr)
        monsterXP = checkMonsterSkills(monsterXP, SkillsAns, randNum, monsterMovesArr, charMovesArr)


        end = gameOver(characterXP, monsterXP)
        turns++
    }
}

function gameOver(chMaxHealth, monsMaxHealth) {
    if (chMaxHealth <= 0 && monsMaxHealth <= 0) {
        console.log('the fight is over')
        console.log('nobody won')
        return true
    } else if (chMaxHealth <= 0) {
        console.log('the fight is over')
        console.log('monster win')
        return true
    } else if (monsMaxHealth <= 0) {
        console.log('the fight is over')
        console.log('charater win')
        return true
    }
}

function checkCharaterSkills(characterXP, SkillsAns, randNum, monsterMovesArr, charMovesArr) {
    characterXP = characterXP - monsterMovesArr[randNum].physicalDmg * (1 - (charMovesArr[SkillsAns].physicArmorPercents / 100));
    characterXP = characterXP - monsterMovesArr[randNum].magicDmg * (1 - (charMovesArr[SkillsAns].magicArmorPercents / 100));
    return characterXP
}

function checkMonsterSkills(monsterXP, SkillsAns, randNum, monsterMovesArr, charMovesArr) {
    monsterXP = monsterXP - charMovesArr[SkillsAns].physicalDmg * (1 - (monsterMovesArr[randNum].physicArmorPercents / 100));
    monsterXP = monsterXP - charMovesArr[SkillsAns].magicDmg * (1 - (monsterMovesArr[randNum].magicArmorPercents / 100));
    return monsterXP
}

function getRandomSkill(arr) {
    return randNumb = Math.floor(Math.random() * (arr.length) + 1) - 1;
}


function getSkillCharater(enableMoves, cooldownMoves) {
    let trueSkill = true
    let Skill = 0
    while (trueSkill) {
        if (isNaN(Skill = parseInt(readlineSync.question('What skill do you want to use? '), 10)) || Skill >= enableMoves.length || Skill < 0) {
            console.log("The skill is not correct. Try again")
            getLogSkill(enableMoves, cooldownMoves)
        } else {
            trueSkill = false
        }
    }
    trueSkill = true
    return Skill
}

function cooldownTurn(skillNumber, enableMoves, cooldownMoves, movesArr) {
    cooldownMoves.push(enableMoves[skillNumber])
    enableMoves.splice(skillNumber, 1)

    for (let index = 0; index < cooldownMoves.length; index++) {
        if (cooldownMoves[index].cooldown != 0) {
            cooldownMoves[index].cooldown -= 1
        } else {
            for (let i = 0; i < movesArr.length; i++) {
                if (cooldownMoves.length != 0) {
                    if (cooldownMoves[index].name == movesArr[i].name) {
                        cooldownMoves[index].cooldown = movesArr[i].cooldown
                        enableMoves.push(cooldownMoves[index])
                        cooldownMoves.splice(index, 1)
                        index--
                        break
                    }
                }
            }
        }
    }
}

function difficulty(characterXP) {
    let trueHeath = true
    while (trueHeath) {
        if (isNaN(characterXP = parseInt(readlineSync.question('Maximum XP of the charater? '), 10)) || characterXP <= 0) {
            console.log("The XP of the charater is not correct. Try again");
        } else {
            trueHeath = false
        }
    }
    trueHeath = true
    return characterXP
}


function getLogSkill(EnableMoves, cooldownMoves) {
    console.log("Enable Moves:")
    for (let index = 0; index < EnableMoves.length; index++) {
        console.log(`${index}: ${EnableMoves[index].name}`)
    }
    if (cooldownMoves.length != 0) {
        console.log("Cooldown Moves:")
        for (let index = 0; index < cooldownMoves.length; index++) {
            console.log(`${index}: ${cooldownMoves[index].name} cooldown: ${cooldownMoves[index].cooldown}`)
        }
    }
}

turn(character, monster)