/*Note: proierty is priority but don't touch it and change it */
/*avatar links */
const showSection = document.querySelectorAll('.showSection > div').length;
if(showSection > 0) deleteItem();

/*proierty */
const proierty = document.querySelectorAll(".proierty");
const proiertyArray = Array.from(proierty);
proiertyArray.forEach(link => {
    link.addEventListener('click',_ => {
        proiertyArray.forEach(element => {
            let firstElement = element.firstElementChild.classList;
            if(firstElement.contains(element.firstElementChild.dataset.proierty)){
                firstElement.remove(element.firstElementChild.dataset.proierty);
                element.lastElementChild.style.backgroundColor = 'transparent';
                element.lastElementChild.style.color = '#333';
                element.lastElementChild.style.fontWeight = 'normal';
            }
        })
        proiertyArray.forEach(isSelect => {
            if(isSelect.classList.contains('selected')) isSelect.classList.remove('selected')
        })
        link.classList.add('selected');
        link.firstElementChild.classList.add(link.firstElementChild.dataset.proierty);
        link.lastElementChild.style.cssText = `background-color:${link.lastElementChild.dataset.color};padding: 5px;border-radius: 5px;color: white;;font-weight: bolder;`;
    })
})

window.addEventListener('DOMContentLoaded', _ => {
    const avatarLinks = document.querySelectorAll(".avatar ul li");
    const avatarArray = Array.from(avatarLinks);
    avatarLinks.forEach(link => {
        link.addEventListener('click',_ => {
            avatarArray.forEach(element => {
                if(element.classList.contains('active')){
                    element.classList.remove('active');
                    element.firstElementChild.classList.remove(element.dataset.custom);
                }
            })
            link.classList.add('active');
            link.firstElementChild.classList.add(link.dataset.custom);
            filterItems(_.target);
        })
    })
    document.getElementById('add').addEventListener('click', event => {
        event.preventDefault();
        getInformation();
        clearContent();  
    });
    let len = localStorage.length;
    for(let i =0;i < len;i++){
        if(localStorage.getItem(i)){
            let title = JSON.parse(localStorage.getItem(i)).title;
            let content = JSON.parse(localStorage.getItem(i)).content;
            let priority = JSON.parse(localStorage.getItem(i)).priority;
            let cardColor = JSON.parse(localStorage.getItem(i)).cardColor;
            let priorityColor = JSON.parse(localStorage.getItem(i)).priorityColor;
            let id = JSON.parse(localStorage.getItem(i)).Postid;
            let Postdate = JSON.parse(localStorage.getItem(i)).Postdate;
            cardStructure(
                {
                    title: title, 
                    content: content, 
                    priority: priority, 
                    Postdate: Postdate,
                    color:cardColor, 
                    priorityColor : priorityColor,
                    Postid: id
                });
        }
    }
    deleteItem();
})

document.querySelector('textarea').addEventListener('keyup', _ => textAreaChecking(_));
document.querySelector('textarea').addEventListener('contextmenu', _ => _.preventDefault());

function textAreaChecking(_){
    const numofwords = document.getElementById('numberOfWords');
    let valueLength = _.target.value;
    let lineWidth = 0;
    numofwords.innerText = valueLength.replace(/[' ']/g,'').length;
    valueLength.replace(/[' ']/g,'').length < 200 ? lineWidth = valueLength.replace(/[' ']/g,'').length : lineWidth = 200;
    if(lineWidth > 200){
        numofwords.style.color = 'red';
        _.target.style.color = 'red';
        _.target.previousElementSibling.style.backgroundColor = 'red';
    }else{
        numofwords.style.color = '#333';
        _.target.style.color = '#333';
        document.querySelector('.line').style.width = `${(lineWidth*100)/200}%`;
        _.target.previousElementSibling.style.backgroundColor = 'rgb(32, 47, 255)';
    }
}



function getInformation(){
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const priority = document.querySelector('.selected').lastElementChild.innerText.toLowerCase();
    const cardColor = document.querySelector('.selected').firstElementChild.dataset.proierty;
    const priorityColor = document.querySelector('.selected').lastElementChild.dataset.color;
    const id = localStorage.length == 0 ? 0 : parseInt(localStorage.counter)+1;
    const Postdate = new Date();
    const Current = `${Postdate.getFullYear()}-${Postdate.getMonth()+1}-${Postdate.getDate()}`;
    const result = validation(title,content);
    result ? cardStructure({
        title: title,
        content: content,
        priority: priority,
        color: cardColor,
        Postdate: Current,
        priorityColor: priorityColor,
        Postid: id
    }) : 0;
    deleteItem();
    result ? storeThem({
        title: title,
        content: content,
        priority: priority,
        cardColor: cardColor,
        priorityColor: priorityColor,
        Postid: id,
        Postdate: Current
    }) : 0;
    return 0;
}

function validation(title, content){
    const validationArray = [false, false];
    content = content.replace(' ','');
    if(title != '' && title.length < 20){
        validationArray[0] = true;
    }
    if(content != '' && content.length <= 200){
        validationArray[1] = true;
    }
    
    const result = validationArray.filter(_ => _).length;
    return result == 2;
}

function cardStructure(information){
    const build = {
        parent: {
            class: ".showSection",
            invoke(){
                return document.querySelector(this.class);
            }
        },
        card: {
            type: 'div',
            class: ['card', `border-${information.color}`],
            invoke(){
                let element = document.createElement(this.type);
                element.classList.add(...this.class);
                element.setAttribute('data-id', information.Postid);
                return element;
            }
        },
        header: {
            type: 'div',
            class: 'header',
            invoke(){
                let element = document.createElement(this.type);
                element.classList.add(this.class);
                return element;
            }
        },
        deleteButton: {
            type: 'button',
            class: 'bg-red',
            innerText: 'Delete',
            invoke(){
                let element = document.createElement(this.type);
                element.classList.add('bg-red'),
                element.innerText = this.innerText;
                return element;
            }
        },
        cardTitle: {
            type: 'span',
            class: ['card-title',`bg-${information.color}`],
            innerText: information.title,
            invoke(){
                let element = document.createElement(this.type);
                element.classList.add(...this.class);
                element.innerText = this.innerText;
                return element;
            }
        },
        cardContent: {
            type: 'div',
            class: 'card-content',
            invoke(){
                let element = document.createElement(this.type);
                element.classList.add(this.class);
                return element;
            }
        },
        contentText: {
            type: 'p',
            class: null,
            innerText: information.content,
            invoke(){
                let element = document.createElement(this.type);
                element.innerText = this.innerText;
                return element;
            }
        },
        additionalInfo: {
            type: 'div',
            class: 'additional',
            invoke(){
                let element = document.createElement(this.type);
                element.classList.add(this.class);
                return element;
            }
        },
        priority:{
            type: 'span',
            class: null,
            cssRule: `display:flex;background-color:${information.priorityColor};padding: 5px;color: white;font-weight: bolder`,
            innerText: information.priority,
            invoke(){
                let element = document.createElement(this.type);
                element.style.cssText = this.cssRule;
                element.innerText = this.innerText;
                return element;
            }
        },
        Date:{
            type: 'span',
            class: 'ccDate',
            innerText: information.Postdate,
            invoke(){
                let element = document.createElement(this.type);
                element.classList.add(this.class);
                element.innerText = this.innerText;
                return element;
            }
        },
        buildCard(){
            const card = this.card.invoke();
            const header = this.header.invoke();
            const deleteButton = this.deleteButton.invoke();
            const cardTitle = this.cardTitle.invoke();
            const cardContent = this.cardContent.invoke();
            const contentText = this.contentText.invoke();
            const additionalInfo = this.additionalInfo.invoke();
            const priority = this.priority.invoke();
            const Date = this.Date.invoke();
            header.appendChild(cardTitle);
            header.appendChild(deleteButton);
            card.appendChild(header);
            cardContent.appendChild(contentText);
            additionalInfo.appendChild(priority);
            additionalInfo.appendChild(Date);
            cardContent.appendChild(additionalInfo);
            card.appendChild(cardContent);
            return this.parent.invoke().appendChild(card);
        }
    }
    return build.buildCard();
}
function storeThem(info){
    localStorage.counter == undefined ? localStorage.setItem('counter',0) : localStorage.setItem('counter', parseInt(localStorage.counter)+1) ;
    let i = localStorage.counter;
    localStorage.setItem(i, JSON.stringify(info));
}
function clearContent(){
    const line = document.querySelector('.line');
    const title = document.querySelector('#title');
    const planText = document.querySelector('#content');
    const numberOfWords = document.querySelector('#numberOfWords');
    line.style.width = '0';
    title.value = '';
    planText.value = '';
    numberOfWords.innerText = '';
}

function deleteItem(){
    let deleteArray = Array.from(document.querySelectorAll('.header button'));
    deleteArray.forEach(element => {
        element.addEventListener('click', _ => {
            let Postid = _.target.offsetParent.dataset.id;
            localStorage.removeItem(Postid);
            document.querySelector('.showSection').removeChild(document.querySelector(`[data-id="${Postid}"]`));
            localStorage.counter = localStorage.length <= 1 ? 0 : localStorage.counter;
        })
    })
}

function filterItems(item){
    let parentLength = Array.from(document.querySelectorAll('.showSection > div'));
    let filterBtn = item.innerText.toLowerCase();
    // This is old version of filtering
    // for(let i=0; i < parentLength.length;i++){
    //     let childproierty = document.querySelectorAll('.showSection > div .additional')[i].firstElementChild;
    //     if(childproierty.innerText != filter){
    //         childproierty.offsetParent.classList.add('hidden');
    //     }else{
    //         childproierty.offsetParent.classList.remove('hidden');
    //     }
    // }
    // if(filter == 'all'){
    //     for(let i=0; i < parentLength.length;i++){
    //         parentLength.forEach(element => {
    //             element.classList.remove('hidden');
    //         })
    //     }
    // }
    // This is new version with es6
    parentLength.forEach(element => {
        let filterInnerText = element.childNodes[1].lastElementChild.firstElementChild;
        let filterOffsetParent = filterInnerText.offsetParent;
        filterInnerText.innerText !== filterBtn ? filterOffsetParent.classList.add('hidden') : filterOffsetParent.classList.remove('hidden');
    })
    filterBtn === 'all' ? parentLength.forEach(element => element.classList.remove('hidden')) : false;
}