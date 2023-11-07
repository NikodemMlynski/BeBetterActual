window.onload = function(){
    const loading_icon_container = document.querySelector('#loading_icon_container');
    console.log('cookie:', document.cookie);
    const user_email = document.cookie.slice(6); // 6 żeby obcięło email=
    console.log(user_email);
    if(document.cookie){
        loading_icon_container.style.display = 'none';
        slider.init(user_email);
        taskDisplayer.init(user_email);
    }else{
        setTimeout(
            () => location.href='src/sites/logowanie.html',
            2000
        )
    }
    
}

class Slider{
    imagesSrcAndCitesToSlide = [
        {cite: 'Pamiętaj, że długi i dobrej jakości sen poprawi twoją produktywność w ciągu dnia', imgSrc: 'sleep', link: ''},
        {cite: 'Codzienne uprawianie sportu, a nawet krótkie spacery, poprawiają nasze zdrowie i przedłużają życie', imgSrc: 'sport', link: ''},
        {cite: 'Jeżeli codziennie będziesz czytał 10 stron książki. To w rok przeczytasz 10 średniej długości książek', imgSrc: 'books', link: ''},
    ];
    actualSlide = -1;
    sliderImageSrc = null;
    sliderCite = null;
    arrow_left = null;
    arrow_right = null;

    init(){
        this.sliderImageSrc = document.querySelector("#slider_image");
        this.sliderCite = document.querySelector("#cite");

        this.arrow_left = document.querySelector("#arrow_left");
        this.arrow_right = document.querySelector("#arrow_right");

        setInterval(() => this.increaseActualSlided(), 10000);

        this.arrow_left.addEventListener('click', () => {
            this.decreaseActualSlide();
        });
        this.arrow_right.addEventListener('click', () => {
            this.increaseActualSlided();
        });
    }

    changeSlide(){
        this.sliderImageSrc.src = `src/images/${this.imagesSrcAndCitesToSlide[this.actualSlide].imgSrc}.png`;
        this.sliderCite.innerHTML = this.imagesSrcAndCitesToSlide[this.actualSlide].cite;
    }
    increaseActualSlided(){
        this.checkActualSlide();
        this.actualSlide++;
        this.changeSlide();
    }
    decreaseActualSlide(){
        
        this.checkActualSlideForDecrease();
        this.actualSlide--;
        this.changeSlide();
    }
    checkActualSlide(){
        if(this.actualSlide >= this.imagesSrcAndCitesToSlide.length - 1) {
            this.actualSlide = -1;
        }
    }
    checkActualSlideForDecrease(){
        if(this.actualSlide <= 0){
            this.actualSlide = this.imagesSrcAndCitesToSlide.length - 1;
        }
    }

}
const slider = new Slider();

class TaskDisplayer {
    
    current_task = {
        taskTitle: null,
        taskTime: 0,
        taskDescription: null,
        completed: false,
    }
    taskContainerHTML = document.querySelector('.goals_container');
    check_off_task_button = null;
    delete_task_button = null;
    
    init(user_email){
        this.getTaskFromDatabase(() =>{
            this.check_off_task_button = document.querySelectorAll('.complete_goal_icon');
            this.delete_task_button = document.querySelectorAll('.delete_goal_icon');

            this.check_off_task_button.forEach(btn => {
                btn.addEventListener('click', () => this.checkOffTask(btn, user_email));
            })
            this.delete_task_button.forEach(btn => {
                btn.addEventListener('click', () => this.deleteTask(btn, user_email));
            })
            
        }, user_email);  
    }

    getTaskFromDatabase(deleteAndCheckOffCallback, user_email){
        try {
            fetch('http://127.0.0.1:8080/task_by_email', {
                method: 'POST',
                body: JSON.stringify({user_email: user_email}),
                headers: {
                    'Content-type': 'application/json',
              }
            })
            .then(response => response.json())
            .then((tasks) => {
                this.displayTaskAtSite(tasks, deleteAndCheckOffCallback)
                
            });
        }catch (err) {
            alert('Błąd serwera, spróbuj odświeżyć stronę');
            
        }
        
            
        
    }
    checkIfTaskCompleted(task){
        if(task.completed) {
            document.querySelector(`#task${task.task_date} .goal_title`).classList.add('finished')
            document.querySelector(`#task${task.task_date} .goal_time`).classList.add('finished')
            document.querySelector(`#task${task.task_date} .goal_description`).classList.add('finished')
        }else{
            document.querySelector(`#task${task.task_date} .goal_title`).classList.remove('finished')
            document.querySelector(`#task${task.task_date} .goal_time`).classList.remove('finished')
            document.querySelector(`#task${task.task_date} .goal_description`).classList.remove('finished')
        }
    }
    displayTaskAtSite(tasks, deleteAndCheckOffCallback){
        this.taskContainerHTML.innerHTML = '';
        if(tasks.length > 0){
            tasks.forEach(el => {
                console.log(el);
            })
            tasks.forEach(taskEl => {
                console.log(taskEl);
                const task = taskEl.task;
                const taskHTML = `
                <section class="goal" id='task${task.task_date}'>
                        <h4 class="goal_title">${task.taskTitle}</h4>
                        <svg data-goal-obj='${JSON.stringify(task)}' class="delete_goal_icon"  width="35px" height="35px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7.69231 8.70833H5V8.16667H9.84615M7.69231 8.70833V19H16.3077V8.70833M7.69231 8.70833H16.3077M16.3077 8.70833H19V8.16667H14.1538M9.84615 8.16667V6H14.1538V8.16667M9.84615 8.16667H14.1538" stroke="#ffffff" stroke-width="1.32" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M10 11V17" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 11V17" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 11V17" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        <svg data-goal-obj='${JSON.stringify(task)}'  class='complete_goal_icon' fill="#00ff00" width="30px" height="30px" viewBox="-192 -192 2304.00 2304.00" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M960 1807.059c-467.125 0-847.059-379.934-847.059-847.059 0-467.125 379.934-847.059 847.059-847.059 467.125 0 847.059 379.934 847.059 847.059 0 467.125-379.934 847.059-847.059 847.059M960 0C430.645 0 0 430.645 0 960s430.645 960 960 960 960-430.645 960-960S1489.355 0 960 0M854.344 1157.975 583.059 886.69l-79.85 79.85 351.135 351.133L1454.4 717.617l-79.85-79.85-520.206 520.208Z" fill-rule="evenodd"></path> </g></svg>
    
                        <div class="goal_time_container">
                            <svg width="33px" height="33px" viewBox="-4.8 -4.8 33.60 33.60" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 7V12L14.5 10.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#c8f9d7" stroke-width="1.44" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            <span class="goal_time">${task.taskTime}</span>
                        </div>
                        <p class="goal_description">${task.taskDescription}</p>
                    </section>`;
                this.taskContainerHTML.innerHTML += taskHTML;
                this.checkIfTaskCompleted(task);
                
                deleteAndCheckOffCallback();
                
            }) 
            


            
        }else {
        this.taskContainerHTML.innerHTML = '<h4 id="goals_container_no_goal_alert">Nie masz żadnych celi na dzisiaj, dodaj je <a class="add_goal_link" href="src/sites/narzedzia.html">Tutaj</a></h4>';
        }
        
        
    }
    deleteTask(e, user_email){
        const task_obj = JSON.parse(e.getAttribute('data-goal-obj'));
        console.log(task_obj);
        fetch('http://127.0.0.1:8080/task', { 
            method: "DELETE",
            headers: {
                "Content-Type" : "application/json"
                },
            body: JSON.stringify(
                {
                   task_obj,
                   user_email
                }
            )
        })
        window.location.reload();
        
    }

    checkOffTask(e, user_email){
        // WAŻNE !!!!!!!!! w main.js trzeba zrobić funkcję która, każdego dnia o godzinie 24 ustala we wszystkich zadaniach complete na false !!!!!!!!!!
        const task_obj = JSON.parse(e.getAttribute('data-goal-obj'));
        console.log(task_obj)
        fetch('http://127.0.0.1:8080/task', { 
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json"
                },
            body: JSON.stringify(
                {
                    task_obj,
                    user_email
                }
            )
        })
        window.location.reload();
    }

}
const taskDisplayer = new TaskDisplayer();