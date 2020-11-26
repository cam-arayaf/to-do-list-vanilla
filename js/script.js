document.addEventListener('DOMContentLoaded', () => {
    const newTask = document.querySelector('#newTask');
    const addTask = document.querySelector('#addTask');
    const h4 = document.querySelector('h4');

    newTask.focus();

    const setTextContent = (target, textContent) => target.textContent = textContent;

    const setValue = (target, value) => target.value = value;

    const checkEnter = event => {
        const { keyCode, target } = event;
        const { length } = target.value.trim();
        const { parentElement } = target.parentElement.parentElement;
        keyCode === 13 && length && buildElements(parentElement);
        keyCode === 13 && length && target.blur();
        keyCode === 13 && !length && target.classList.add('wrong');
    }

    const resizeHtmlBody = () => {
        const { activeElement, body, documentElement } = document;
        const { tagName } = activeElement;
        tagName === 'INPUT' ? documentElement.classList.add('reset-height') : documentElement.classList.remove('reset-height');
        tagName === 'INPUT' ? body.classList.add('reset-height') : body.classList.remove('reset-height');
        tagName === 'INPUT' ? body.classList.add('reset-place-items') : body.classList.remove('reset-place-items');
    }

    const trimFields = target => {
        const inputGroupLength = document.querySelectorAll('.my-tasks .input-group').length;
        setValue(target, target.value.trim());
        target.id !== 'newTask' && !target.value.length && inputGroupLength === 1 &&  setTextContent(h4, 'No Tasks');
        target.id !== 'newTask' && !target.value.length && inputGroupLength === 1 && target.parentElement.parentElement.remove();
        target.id !== 'newTask' && !target.value.length && inputGroupLength === 1 && newTask.focus();
        target.id !== 'newTask' && !target.value.length && inputGroupLength !== 1 && target.parentElement.remove();
        target.id === 'newTask' && !target.value.length && target.classList.remove('wrong');
    }

    const setFields = target => {
        target.value = target.value.replace(/[^a-zA-Z0-9 ]/, '');
        const { length } = target.value.trim();
        const elements = Object.values(target.parentElement.children);
        const classListElements = elements.filter(element => element.type !== 'text' && element.type !== 'checkbox');
        const disabledElements = elements.filter(element => element.type === 'submit' || element.type === 'checkbox');
        !length && setValue(target, '');
        length ? target.classList.remove('wrong') : target.classList.add('wrong');
        classListElements.forEach(element => length ? element.classList.remove('disabled') : element.classList.add('disabled'));
        disabledElements.forEach(element => length ? element.removeAttribute('disabled') : element.setAttribute('disabled', true));
        elements.forEach(element => !element.className && element.removeAttribute('class'));
    }

    const checkField = target => {
        const inputText = target.parentElement.children[2];
        target.checked ? inputText.setAttribute('disabled', true) : inputText.removeAttribute('disabled');
        target.checked ? inputText.classList.add('completed') : inputText.classList.remove('completed');
    }

    const deleteTask = parentElement => {
        const inputGroupLength = document.querySelectorAll('.my-tasks .input-group').length;
        inputGroupLength === 1 ? parentElement.parentElement.remove() : parentElement.remove();
        inputGroupLength === 1 && setTextContent(h4, 'No Tasks');
        inputGroupLength === 1 && newTask.focus();
    }

    const buildElements = parentElement => {
        const myTasksDiv = document.querySelector('.my-tasks') || document.createElement('div');
        const inputGroup = document.createElement('div');
        const inputCheckbox = document.createElement('input');
        const labelCheckbox = document.createElement('label');
        const inputText = document.createElement('input');
        const buttonRemove = document.createElement('button');
        const inputGroupList = document.querySelectorAll('.my-tasks .input-group');
        const maxId = Math.max(...[...inputGroupList].map(e => parseInt(e.children[0].id.replace(/[^0-9]/g, ''))));
        const newId = maxId === -Infinity ? 1 : maxId + 1;
        !myTasksDiv.classList.length && myTasksDiv.classList.add('my-tasks');
        inputGroup.classList.add('input-group');
        inputCheckbox.setAttribute('type', 'checkbox');
        inputCheckbox.setAttribute('id', `chk${ newId }`);
        labelCheckbox.setAttribute('for', `chk${ newId }`);
        inputText.setAttribute('type', 'text');
        inputText.setAttribute('id', `txt${ newId }`);
        inputText.setAttribute('placeholder', 'Write your task');
        inputText.setAttribute('value', newTask.value);
        buttonRemove.classList.add('remove');
        buttonRemove.setAttribute('id', `btn${ newId }`);
        setTextContent(buttonRemove, '-');
        inputGroup.appendChild(inputCheckbox);
        inputGroup.appendChild(labelCheckbox);
        inputGroup.appendChild(inputText);
        inputGroup.appendChild(buttonRemove);
        myTasksDiv.appendChild(inputGroup);
        newId === 1 && parentElement.appendChild(myTasksDiv);
        newId === 1 && setTextContent(h4, 'My Tasks');
        setValue(newTask, '');
        addTask.classList.add('disabled');
        addTask.setAttribute('disabled', true);
        inputText.scrollIntoView();
        inputCheckbox.oninput = event => checkField(event.target);
        inputText.oninput = event => setFields(event.target);
        inputText.onblur = event => trimFields(event.target);
        buttonRemove.onclick = event => deleteTask(event.target.parentElement);
    };

    newTask.oninput = event => setFields(event.target);
    newTask.onblur = event => trimFields(event.target);
    newTask.onkeyup = event => checkEnter(event);
    addTask.onclick = event => buildElements(event.target.parentElement.parentElement.parentElement);
    window.onresize = /Android/.test(navigator.appVersion) && resizeHtmlBody;
});