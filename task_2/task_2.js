// Задание 2
// https://jsbin.com/deyoteb/edit?html,css,js,output - исправить код таким образом, 
// чтобы при фокусе у инпутов добавлялась красная рамка. 
// Обработка событий должна происходить на formElement.

var formElement = document.forms['formElement']

formElement.addEventListener("focus", (e) => {
    e.target.classList.add('focused')
}, true
)

formElement.addEventListener("blur", () => {
    var activeElement = formElement.querySelector('.focused')
    if (activeElement) {
        activeElement.classList.remove('focused')
    }
}, true)