let users = [];

const modal = document.querySelector('.modal');
const modalInfo = document.querySelector('.modal__container__info');
const searchRseultsPanel = document.querySelector('.search__results');
const searchField = document.querySelector('#search-field');

let currentUserIndex = 0;

window.onclick = (e) => {
    if (!searchRseultsPanel.classList.contains('hidden') && !e.target.closest('.search')){
        closeSearchResults();
    }
};

searchField.addEventListener('input', (e) => {
    buildSearchResults(e.target.value);
});

searchRseultsPanel.addEventListener('click', (e) => {
    if(e.target.closest('.search')){
        searchField.value = e.target.textContent;
        buildSearchResults(e.target.textContent);
        closeSearchResults();
    }
});

/**
 * adds a click event to the grid element to look for clicks on the employess to open the modal
 */
document.querySelector('.grid').addEventListener('click', (e) => {
    if (e.target.closest('.grid__item')){
        currentUserIndex = parseInt(e.target.closest('.grid__item').getAttribute('data-index'));
        buildModal(currentUserIndex);
        openModal();
    }
});

/**
 * adds a click event to the modal, if you click outside the employee box it will close and the X button will close it
 */
modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal__container__close')){
        closeModal();
    } else if (e.target.classList.contains('modal')){
        closeModal();
    } else if(e.target.closest('.next')){
        currentUserIndex++;
        if (currentUserIndex >= users.length)
            currentUserIndex = 0;
        buildModal(currentUserIndex);
    } else if(e.target.closest('.previous')){
        currentUserIndex--;
        if (currentUserIndex <= 0)
            currentUserIndex = users.length - 1;
        buildModal(currentUserIndex);
    }
});

getEmployees();
async function getEmployees(){
    try {
        const employeeResponse = await fetch('https://randomuser.me/api/?results=12&nat=us');
        const employeesJson = await employeeResponse.json();
        users = employeesJson.results;
        for(let i = 0; i < users.length; i++){
            buildEmployeeCard(users[i], i);
        }
    } catch(error){
        alert(`an error has occured, ${error}`);
    }
}

/**
 * takes a given user and builds the html to disply the information on the page
 * 
 * @param {object} user - the user to build the card for
 * @param {int} index - the index the use was in in the array
 */
function buildEmployeeCard(user, index){
    let div = document.createElement('div');
    div.className = 'grid__item';
    div.setAttribute('data-index', index);

    let img = createImageElement(user);
    img.className = 'img--small';
    div.appendChild(img);

    let divTwo = document.createElement('div');
    divTwo.className = 'grid__item__flex';

    divTwo.appendChild(createNameElement(user));
    divTwo.appendChild(createPElement(user.email));
    divTwo.appendChild(createPElement(user.location.city));

    div.appendChild(divTwo);

    document.querySelector('.grid').appendChild(div);
}

/**
 * closes the modal by removing the fucos and removing the tab index so you cant tab to the  modal
 */
function closeModal(){
    modal.blur();
    modal.removeAttribute('tabindex');    
}

/**
 * opens the modal by adding the tabindex attribute so we can then add the focus to it
 */
function openModal(){
    modal.setAttribute('tabindex', '0');
    document.querySelector('.modal').focus();
}

/**
 * builds the html to display in the modal
 * 
 * @param {int} index - the index the user is at in the array of users 
 */
function buildModal(index){
    modalInfo.innerHTML = '';
    const user = users[index];

    let img = createImageElement(user);
    img.className = 'img--large';
    modalInfo.appendChild(img);
    
    modalInfo.appendChild(createNameElement(user));
    modalInfo.appendChild(createPElement(user.email));
    modalInfo.appendChild(createPElement(user.location.city));
    modalInfo.appendChild(document.createElement('hr'));
    modalInfo.appendChild(createPElement(user.cell));
    modalInfo.appendChild(createPElement(`${user.location.street.number} ${user.location.street.name} ${user.location.city}, ${user.location.state} ${user.location.postcode}`));
    modalInfo.appendChild(createPElement(user.dob.date.substring(0, 10)));

}

/**
 * creates an img html element and returns it with the needed attributes
 * 
 * @param {object} user - the user to get the needed info from
 * @returns a hmtl img node
 */
function createImageElement(user){
    let img = document.createElement('img');
    img.setAttribute('src', user.picture.large);
    img.setAttribute('alt', `${user.name.first} ${user.name.last}`);
    return img;
}

/**
 * creates and returns a name element for the modal
 * 
 * @param {object} user -the user to get the name info from
 * @returns an html h2 tag with the users name in its textContent
 */
function createNameElement(user){
    const name = document.createElement('h2');
    name.textContent = `${user.name.first} ${user.name.last}`;
    return name;
}

/**
 * creates and returns a span elemeent
 * 
 * @param {object} textContent - the string to go inside the span element
 * @returns a span elemenet
 */
function createPElement(textContent){
    const p = document.createElement('p');
    p.textContent = textContent;
    return p;
}

/**
 * take a passed string and checks it against the names of the employees looking for a match
 * 
 * @param {string} name - the valu passsed for the search field 
 */
function buildSearchResults(name){
    searchRseultsPanel.innerHTML = '';
    const gridItems = document.querySelectorAll('.grid__item');
    users.foreach (user => {
        const userName = `${user.name.first} ${user.name.last}`.toLowerCase();
        if (!userName.includes(name.trim().toLowerCase())) {
            gridItems[i].style.display = 'none';
        } else {
            gridItems[i].removeAttribute('style');
            if(name.trim() !== ''){
                const p = createPElement(`${user.name.first} ${user.name.last}`);
                p.classList.add('search-result');
                searchRseultsPanel.appendChild(p);
            }
        }
    });
    if(searchRseultsPanel.innerHTML != ''){
        searchRseultsPanel.classList.remove('hidden');
    } else {
        closeSearchResults();
    }

}

/**
 * closes the panels that holds the results from the search field
 */
function closeSearchResults(){
    searchRseultsPanel.classList.add('hidden');
    searchRseultsPanel.innerHTML = '';
}