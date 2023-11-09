window.onload = function(){
    console.log('cookie:', document.cookie);
    const user_email = document.cookie.slice(6); 
    if(document.cookie){
        progres.init(user_email);
    }else{
        setTimeout(
            () => location.href='../sites/logowanie.html',
            1000
        )
    }
}

class Progres {
    width_multipler = 20;
    progres_arrow_right = null;
    progres_arrow_left = null;
    actual_task_to_progres = -1;
    progres_title_html = null;

    progres_buttons_container = null;
    progres_buttons = null;
    progres_analistic_html = null;
    progres_analistic_date_container = null;
    progres_analistic_date_html = null;

    months = [];
    actual_month = 0;
    init(user_email){
        this.progres_buttons_container = document.querySelector('.progres_menu');
        this.progres_title_html = document.querySelector('.progres_title');
        this.progres_analistic_html = document.querySelector('.progres_analistic');
        this.progres_analistic_date_container = document.querySelector('.progres_analistic_date_container');
        this.progres_analistic_date_html = document.querySelector('.progres_date');
        const actual_date = new Date(Date.now());
        this.months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
        this.actual_month = actual_date.getMonth();
        this.actual_year = actual_date.getFullYear();
        this.progres_analistic_date_html.innerHTML = this.months[this.actual_month] + ` ${this.actual_year}`;

        

        this.progres_arrow_left = document.querySelector('#progres_arrow_left');
        this.progres_arrow_right = document.querySelector('#progres_arrow_right');

        

        this.getTaskToProgresFromDatabase((task_to_progres_array) => {
            this.progres_buttons = document.querySelectorAll('.progres_menu_button');
            this.progres_buttons.forEach((progres_button) => {
                progres_button.addEventListener('click', (e) => {
                    this.displayTaskToProgresAnalisticByTitlte(e.target.textContent, task_to_progres_array) // e.target.textContent to nazwa Nawyku do progresu
                    
                })
            })
            this.progres_arrow_left.addEventListener('click', () => this.decreaseTaskToProgresDate(task_to_progres_array));
            this.progres_arrow_right.addEventListener('click', () => this.increaseTaskToProgresDate(task_to_progres_array));
        }, user_email);
    }
    displayTaskToProgresAnalisticByTitlte(task_to_progres_title, task_to_progres_array){
        const durationList = [];
        const datesList = [];

        task_to_progres_array.forEach((task_to_progres) => {
            const actual_task_to_progres_date = new Date(task_to_progres.date);
            
            if(task_to_progres.title === task_to_progres_title && actual_task_to_progres_date.getMonth() === this.actual_month)
            {
                console.log(task_to_progres)
                const duration_to_push1 = task_to_progres.duration[0] == '0' ? task_to_progres.duration.substring(1) : task_to_progres.duration;
                const duration_to_push = duration_to_push1.replace(':', '.');
                durationList.push(duration_to_push);
                datesList.push(task_to_progres.date);
            }

        })
        this.fillTaskToProgresAnalistic(task_to_progres_title, durationList, datesList)
    }
    fillTaskToProgresAnalistic(title, duration_list, date_list){

        const days_in_month = 30;
        this.progres_analistic_html.innerHTML = '';
        this.progres_title_html.innerHTML = title;
        const widthsList = [...duration_list];
        const dateList = [...date_list];
        const dateDayList = [];
        console.log(widthsList, dateList);
        dateList.forEach((date) => {
            const full_date = new Date(date);
            dateDayList.push(full_date.getDate());
        })
        console.log('date day list');
        console.log(dateDayList);

        let max = widthsList[0];
        for(let i = 0; i <=widthsList.length; i++){
            const actualEl = widthsList[i]; 
            if(actualEl > max) max = actualEl;
        }
        console.log('max',max);
        let finalWidthsList = [];
        if(widthsList.length === 0) {
            this.progres_analistic_html.classList.add('empty_analistic');
        }else{
            this.progres_analistic_html.classList.remove('empty_analistic');
        }
        
        finalWidthsList = widthsList.map(width => width = width * 150 / max);
        
        for(let i = 0; i < days_in_month; i++){
            this.progres_analistic_html.innerHTML += `<div class='day_in_analistic no_value' id='day${i+1}'></div>`;
        }
        for(let i = 0; i < finalWidthsList.length; i++){
            const actualElement = document.querySelector(`#day${dateDayList[i]}`);
            actualElement.classList.remove('no_value');
            const block_height = finalWidthsList[i];
            if(Number.isNaN(block_height)) {
                actualElement.classList.add('no_value');
                return;
            }
            if(block_height == 0) actualElement.classList.add('no_value');
            else actualElement.classList.remove('no_value');
            
            console.log('block-height', block_height);
            actualElement.style.height = block_height + 20 + 'px';
            actualElement.style.transform = `translateY(${150  - block_height }px)`;
            actualElement.innerHTML = widthsList[i].replace('.', ':') + `<div class="progres_analistic_date" id="daydate${i+1}">${dateDayList[i]}</div>`;  // trzeba zrobić żeby data zadania była position absolut i wyświetlało się idealnie pod zadaniem, tak jak w spendly
            document.querySelector(`#daydate${i+1}`).style.top = `${block_height + 22}px`;
            ///     ZROB TAK KIEDYH WYKRES JEST PUSTY TO DODAJE SIE PADDING ZEBY STRZALKI BYLY W TYM SAMYM MIEJSCU NA STRONIE
        }  

    }
    getTaskToProgresFromDatabase(callback, user_email){
        fetch('http://51.77.48.162:8080/task_to_progres_by_email', {
            method: 'POST',
            body: JSON.stringify({user_email: user_email}),
            headers: {
                'Content-type': 'application/json',
          }
        })
        .then(response => response.json())
        .then((task_to_progres_titles_array) => this.renderTaskToProgresTitleButtonsInHTML(task_to_progres_titles_array, callback));
        // .catch(err)
    }
    renderTaskToProgresTitleButtonsInHTML(task_to_progres_array_from_db, callback){
        const task_to_progres_array = task_to_progres_array_from_db.result_progres_tasks;
        
        const task_to_progres_titles_set = new Set();
        task_to_progres_array.forEach((task_to_progres) => {
            task_to_progres_titles_set.add(task_to_progres.title);
        })
        const task_to_progres_iterable = [...task_to_progres_titles_set]
        task_to_progres_iterable.forEach((task_to_progres) => {
            this.progres_buttons_container.innerHTML += `<button class="progres_menu_button" id="${task_to_progres}">${task_to_progres}</button>`;
        })
        callback(task_to_progres_array);
        
    }
    increaseTaskToProgresDate(task_to_progres_array){
        if(this.actual_month < 11 ){
            this.actual_month += 1;
            this.progres_analistic_date_html.innerHTML = this.months[this.actual_month] + ` ${this.actual_year}`;
            this.displayTaskToProgresAnalisticByTitlte(this.progres_title_html.textContent, task_to_progres_array) // e.target.textContent to nazwa Nawyku do progresu
            
        }
    }
    decreaseTaskToProgresDate(task_to_progres_array){
        if(this.actual_month > 0){
            this.actual_month -=1
            this.progres_analistic_date_html.innerHTML = this.months[this.actual_month] + ` ${this.actual_year}`;
            this.displayTaskToProgresAnalisticByTitlte(this.progres_title_html.textContent, task_to_progres_array) // e.target.textContent to nazwa Nawyku do progresu

        }
    }
}
const progres = new Progres();

