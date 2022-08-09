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