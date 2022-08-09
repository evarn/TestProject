let str = `Старший братец ПОНЕДЕЛЬНИК –
работяга, не бездельник.
Он неделю открывает
всех трудиться зазывает.

ВТОРНИК следует за братом
у него идей богато.

А потом СРЕДА-сестрица,
не пристало ей лениться.

Брат ЧЕТВЕРГ и так, и сяк,
он мечтательный чудак.

ПЯТНИЦА-сестра сумела
побыстрей закончить дело.

Предпоследний брат СУББОТА
не выходит на работу.

В гости ходит ВОСКРЕСЕНЬЕ,
очень любит угощенье
`;

const replaceDayWeek = function (str) {
    let newStr = str;
    const objDayWeek = {
        MONDAY: "ПОНЕДЕЛЬНИК",
        TUESDAY: "ВТОРНИК",
        WEDNESDAY: "СРЕДА",
        THURSDAY: "ЧЕТВЕРГ",
        FRIDAY: "ПЯТНИЦА",
        SATURDAY: "СУББОТА",
        SUNDAY: "ВОСКРЕСЕНЬЕ"
    };

    for (let key in objDayWeek) {
        let str1 = new RegExp(`${objDayWeek[key]}`, "gi");
        newStr = newStr.replace(str1, key);
    }
    return newStr;
};

console.log(replaceDayWeek(str));