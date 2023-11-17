window.onload = function(){
    // console.log('cookie:', document.cookie);
    const user_email = document.cookie.slice(6); 
    if(document.cookie){
        tools.init(user_email);
    }else{
        setTimeout(
            () => location.href='../sites/logowanie.html',
            1000
        )
    }
}

class Tools{
    tools = {
        dailyHabbits: [`<input type="text" name="" id="taskTitle" placeholder="Dodaj tytuł" >
        <input type="time" name="" id="taskTime" value="15:00">
        <textarea name="" id="taskDescription" cols="30" rows="10" placeholder="Dodaj opis"></textarea>
        <button type="submit" id="taskSubmitButton">Zapisz</button>`],
        intelligentDiary: [
            `<h3 class="question">Napisz swoje przemyślenia o dzisiejszym dniu</h3>
            <textarea name="" id="taskDescription" class="diary_values" cols="30" rows="10" placeholder="Dodaj opis"></textarea>
            <button type="submit" id="taskSubmitButton">Zapisz</button>`,

            ` <h3 class="question">Co dzisiaj zrobiłeś źle</h3>
            <textarea name="" id="taskDescription" class="diary_values" cols="30" rows="10" placeholder="Nawet najlepsi popełniają błędy, zapisz chociaż jedną rzecz, aby w przyszłości jej nie powtarzać"></textarea>
            <button type="submit" id="taskSubmitButton">Zapisz</button>`,

            `<h3 class="question">Co dzisiaj zrobiłeś dobrze</h3>
            <textarea name="" id="taskDescription" class="diary_values" cols="30" rows="10" placeholder"Na pewno udało Ci się coś zrobić dobrze"></textarea>
            <button type="submit" id="taskSubmitButton">Zapisz</button>`,

            `<h3 class="question">Ile dzisiaj wypiłeś szklanek wody? <span class='question_title default_question_title'>${'Ilość szklanek wody'}<span></h3>
            <input type="number" class='diary_inputs diary_values'  name="" id="" placeholder="10-50">
            <button type="submit" id="taskSubmitButton">Zapisz</button>`,

            `<h3 class="question">Ile dzisiaj zjadłeś kcalorii? <span class='question_title default_question_title'>${'ilość kcalorii'}<span></h3>
            <input type="number" class='diary_inputs diary_values'  name="" id="" placeholder="500-6000">
            <button type="submit" id="taskSubmitButton">Zapisz</button>`,

            `<h3 class="question">Ile dzisiaj spałeś <span class='question_title default_question_title'>${'ilość snu'}<span></h3>
            <input type="time" value='07:30' class='diary_inputs diary_values' name="" id="amountOfSleep" placeholder="22:00-6:00">
            <button type="submit" id="taskSubmitButton">Zapisz</button>`,

            `<h3 class="question">Jaką miałeś jakość snu <span class='question_title default_question_title'>${'jakość snu'}<span></h3>
            <input type="range" class='diary_inputs diary_values' name="" id="qualityOfSleep" placeholder="1-100" min='0' max='100' value='70'>
            <span id='qualitySleepValue'>70</span>
            <button type="submit" id="taskSubmitButton">Zapisz</button>`

        ],
        longTermGoal: [`<h3 class="question">Jakie są twoje cele długoterminowe</h3>
        <textarea name="" id="taskDescription" class="longTermGoal" cols="30" rows="10" placeholder="Np. Mieszkam w wielkiej willi z basenem"></textarea>
        <button type="submit" id="taskSubmitButton">Zapisz</button>
        `],
        breathingExercises: [`
        <h3 class="question">Ćwiczenia oddechowe <br> <span id='breathingAnimationTimer'>0</span></h3>
        <div class="breathing_test_circle_container">
            <input type="radio" name="breathing_type" id="radio1" value="breathing_power_animation">
                <label for='radio1' class='set_breathing_type_buttons' id="set_breathing_type_button1" >
                    Spokój
                </label>
            </input>
            <input type="radio" name="breathing_type" id="radio2" value="breathing_chill_animation">
                <label for='radio2' class='set_breathing_type_buttons' id="set_breathing_type_button2" >
                    Energia
                </label>
            </input>
                        <section class="brething_test_circle">
            <span id='breath'>Inhale</span>
            
        </section>
        </div>
        <button id="breathingTestButton" type='submit'>Rozpocznij</button>
        `],
        afirmations: [
            `<h3 class="question">Afirmacje</h3>
            <p class="afirmation_text">Wybieram pozytywne myślenie i tworzenie dla siebie wspaniałego i obfitego życia.</p>
            <img src="../icons/iconmonstr-arrow-left-circle-lined-48.png" alt="" id="afirmations_arrow_left" class="afirmations_arrows">
            <img src="../icons/iconmonstr-arrow-right-circle-lined-48.png" alt="" id="afirmations_arrow_right" class="afirmations_arrows">
            `
        ]
    }

    
    
    // tasks
    task = {
        taskTitle: null,
        taskTime: 0,
        taskDescription: null,
        completed: false,
    }

    taskTitleHTML = null;
    taskTimeHTML = null;
    taskDescriptionHTML = null; 

    // diary
    diaryQuestionsHTML = null;

    diary = {
        general: null,
        good_decisions: null,
        bad_decisions: null,
        amount_of_glass_of_water: 0,
        amount_of_kcalories: 0,
        amount_of_sleep: 0,
        quality_of_sleep: 0,
    }
    iterable_diary = ['general', 'good_decisions', 'bad_decisions', 'amount_of_glass_of_water', 'amount_of_kcalories', 'amount_of_sleep', 'quality_of_sleep'];

    // progres task
    progres_tasks = [];


    // long term goals
    yourLongTermGoal = null;
    long_term_goals_list = [];

    longTermGoalQuestion = null;

    // general for tools
    toolsHTML = null;
    formHTML = null;
    actualInputAttributeIndex = 0;
    actualFormTool = 'dailyHabbits';

    

    // breathing exercises
    breathingAnimationTimer = 0;
    breathInterval = null;

    // afirmations 
    afirmationText = null;
    actualAfirmation = -1;
    afirmationArrowLeft = null;
    afirmationArrowRight = null;

    afirmationsList = [
        'Wybieram pozytywne myślenie i tworzenie dla siebie wspaniałego i obfitego życia.',
        'Sukcesem jest to, że pracuje z kim chce, kiedy chce, w jaki sposób chce i gdzie chce',
        'Mam w sobie pewność, że moja praca, moje produkty lub usługi, w znaczący sposób  zmieniają czyjeś życie na lepsze',
        'Klienci sami do mnie przychodzą, bo wiedzą o tym, że istnieje i co robię, znają mnie, zdają sobie sprawę, że ich rozumiem i ufają, że mogę im pomóc',
        'Moja intuicja podpowiada mi, jakie działania będą miały najlepsze przełożenie na rozwój mojego biznesu',
        'Wiem, że przestanę się bać, tylko jeśli zacznę działać, dlatego działam mimo lęku. Wiem, że zrobione jest lepsze od perfekcyjnego',
        'Każdy sukces i każde niepowodzenie, potocznie nazywane porażką, to ważna dla mnie lekcja',
        'Lubię wyzwania. Dzięki wyzwaniu jestem w stanie wiele się nauczyć i sprawdzić siebie, dzięki czemu mogę przejść w biznesie na wyższy poziom',
        'Każdego dnia wychodzę poza strefę swojego komfortu by się rozwijać. Każde wyzwanie, z którym się zmagam, jest okazją do rozwoju i doskonalenia siebie.',
        'W swoim biznesie skupiam się na tym, by wykonywać rzeczy które lubię, które mi dają pozytywną energię, które są moją pasją. Wiem, że wtedy mogę wykonywać swoje zadania w najlepszy sposób.',
        'Uważnie wybieram priorytety i działam konsekwentnie',
        'Otaczają mnie wspierający, pozytywni ludzie, którzy we mnie wierzą i chcą zobaczyć mój sukces',
    ]



    init(user_email){
        this.user_email = user_email;
        this.toolsHTML = document.querySelectorAll('.tool');
        this.formHTML = document.querySelector('#narzedzia_actual_selected_form');
        
        this.toolsHTML.forEach(el => {
            el.addEventListener('click', () => {
                this.actualInputAttributeIndex = 0;
                this.setActualFormTool(el.getAttribute('data-tool-name'));
                this.setToolsFormInputs()
            })
        });
        this.formHTML.addEventListener('submit', (e) => {
            e.preventDefault();
            switch(this.actualFormTool){
                case 'dailyHabbits':
                    this.taskTitleHTML = document.querySelector('#taskTitle');
                    this.taskTimeHTML = document.querySelector('#taskTime');
                    this.taskDescriptionHTML = document.querySelector('#taskDescription');

                    const taskValidator = this.validateTask();
                    if(taskValidator){
                        this.addTask(this.user_email);
                    }
                    
                    break;
                case 'intelligentDiary': 
                    this.diaryQuestionTitleHTML = document.querySelector('.question .question_title') ? document.querySelector('.question .question_title').textContent : null;
                    this.diaryQuestionsHTML = document.querySelector(".diary_values");
                    
                    const diaryValidator = this.validateDiary(); 
                    if(diaryValidator){
                        this.addDiaryAnswer(this.diaryQuestionTitleHTML);
                    }
                    break;
                case 'longTermGoal':
                    this.longTermGoalQuestion = document.querySelector(".longTermGoal")   
                    const longTermGoalValidator = this.validateLongTermGoal();
                    if(longTermGoalValidator){
                        this.addLongTermGoal();
                    }    
                    break;    
                case 'breathingExercises':
                    clearInterval(this.breathInterval);
                    function getCheckedRadioValue() {
                        var rads = document.getElementsByName('breathing_type');
                            
                        for (let i=0; i < rads.length; i++)
                           if (rads[i].checked)
                               return rads[i].value;
                        return null; 
                     }
                     
                    const checkedValue = getCheckedRadioValue();
                    if(checkedValue){
                        document.querySelector('#breathingTestButton').style.display = 'none';
                        let increaseBreathAnimationTimer = setInterval(() =>{
                            if(this.breathingAnimationTimer >= 100){
                                clearInterval(increaseBreathAnimationTimer);
                            } else{
                                this.breathingAnimationTimer++;
                                document.querySelector("#breathingAnimationTimer").innerHTML = this.breathingAnimationTimer;
    
                            }
    
                        }, 1000)
                        this.startBreathingExercise(checkedValue);
                    }
                    
                    break;
                case 'afirmations':
                    break;
                    
                  

            }
        });
    }


    // SWITCHING TOOLS

    displayQualityOfSleepValue(e){
        document.querySelector("#qualitySleepValue").innerHTML = e.target.value;
    }

    setToolsFormInputs(){
        switch(this.actualFormTool){
            case 'dailyHabbits':
            case 'longTermGoal':
                this.formHTML.innerHTML = this.tools[this.actualFormTool][0];
                break;
            case 'afirmations':
                this.formHTML.innerHTML = this.tools[this.actualFormTool][0];
                this.afirmationArrowLeft = document.querySelector("#afirmations_arrow_left");
                this.afirmationArrowRight = document.querySelector("#afirmations_arrow_right");
                this.afirmationText = document.querySelector('.afirmation_text');

                setInterval(() => this.increaseActualAfirmation(), 10000);

                this.afirmationArrowLeft.addEventListener('click', () => {
                    this.decreaseActualAfirmation();
                })
                this.afirmationArrowRight.addEventListener('click', () => {
                    this.increaseActualAfirmation();
                })
                break;

            case 'breathingExercises':
                this.formHTML.innerHTML = this.tools[this.actualFormTool][0];
                document.querySelector('.brething_test_circle').style.animationPlayState = 'paused';
                break;

            case 'intelligentDiary':
                if(this.actualInputAttributeIndex <= this.tools[this.actualFormTool].length -1) 
                    this.formHTML.innerHTML = this.tools[this.actualFormTool][this.actualInputAttributeIndex];
                if(this.actualInputAttributeIndex == 6) {
                    document.querySelector("#qualityOfSleep").addEventListener('input', (e) => this.displayQualityOfSleepValue(e));
                    this.getTaskFromDatabase(
                        (tasks) =>{
                            tasks.forEach((task) => {
                                this.tools[this.actualFormTool].push(
                                    `<h3 class="question"> Ile czasu poświęciłeś na: <span class='question_title'>${task.task.taskTitle}<span></h3>
                                    <input type="time" value='00:30' class='diary_inputs diary_values' name="" id="amountOf${task.task.taskTitle}" placeholder="0:30-2:00">
                                    <button type="submit" id="taskSubmitButton">Zapisz</button>`
                                );
                                this.iterable_diary.push(task.task.taskTitle);
                            });

                            
                    
                        }, this.user_email
                    );
                    // console.log(this.tools.intelligentDiary);
                    
                }
                    
                else if(this.actualInputAttributeIndex > this.tools[this.actualFormTool].length - 1){
                    this.addDiaryAnswersToDatabase(this.user_email);
                    // console.log(this.iterable_diary);
                    this.addProgresTaskFromDatabase(this.user_email);
                    
                }
                break;
        }
    }

    goNextToolsFormInput(){
        this.actualInputAttributeIndex++;
        this.setToolsFormInputs();
    }

    setActualFormTool(actualFormTool){
        this.actualFormTool = actualFormTool;
    }

    // TASK
    
    addTask(user_email){
         this.task.taskTitle = this.taskTitleHTML.value;

         this.task.taskTime = this.taskTimeHTML.value;
         if(this.task.taskTime[0] == 0) this.task.taskTime = this.task.taskTime.substring(1);
         this.task.taskDescription = this.taskDescriptionHTML.value || 'brak opisu';
        //  console.log(this.task);
         this.addTaskToDatabase(this.task, user_email);
         this.setTaskInputEmpty();
    }
    addTaskToDatabase(task_object_to_send, user_email){
        this.task.task_date = Date.now();
        fetch('http://51.77.48.162:8080/task', {
            method: 'POST',
            body: JSON.stringify({task: task_object_to_send, user_email: user_email}),
            headers: {
                'Content-type': 'application/json',
          }
        })
    }
    getTaskFromDatabase(diary_callback, user_email){
        try {
            fetch('http://51.77.48.162:8080/task_by_email',{
                method: 'POST',
                body: JSON.stringify({user_email: user_email}),
                headers: {
                    'Content-type': 'application/json',
              }
            })
            .then(response => response.json())
            .then((tasks) => {
                diary_callback(tasks);
                
            });
        }catch (err) {
            alert('Błąd serwera, spróbuj odświeżyć stronę');
            
        }
        
            
        
    }
    
    setTaskInputEmpty(){
        this.taskTitleHTML.value = '';
        this.taskTimeHTML.value = '';
        this.taskDescriptionHTML.value = '';
    }


    validateTask(){
        if(this.taskTitleHTML.value.length >= 2){
            this.taskTitleHTML.style.borderColor = 'rgba(170, 255, 255, 0.7)';
        }else {
            this.taskTitleHTML.style.borderColor = 'red';
            return false;
        }
        if(this.taskTimeHTML.value != '--:--'){
            this.taskTitleHTML.style.borderColor = 'rgba(170, 255, 255, 0.7)';
        }else {
            this.taskTimeHTML.style.borderColor = 'red';
            return false;
        }
        if(this.taskDescriptionHTML.value.length <= 100){
            this.taskDescriptionHTML.style.border= 'none';
        }else{
            this.taskDescriptionHTML.style.border = '1px solid red';
            return false;
        }
        return true;
    }


    // DIARY

    addDiaryAnswer(taskToProgresTitle){
        if(this.actualInputAttributeIndex <= this.iterable_diary.length - 1){
            if(this.actualInputAttributeIndex <= 2){
                this.diary[this.iterable_diary[this.actualInputAttributeIndex]] = this.diaryQuestionsHTML.value.trim();
            }else if(this.actualInputAttributeIndex <= 6){
                const diary_question_html = this.diaryQuestionsHTML.value.trim()
                this.diary[this.iterable_diary[this.actualInputAttributeIndex]] = this.diaryQuestionsHTML.value.trim();
                this.progres_tasks.push({title: taskToProgresTitle, duration: diary_question_html, date: Date.now()})
            }
            else{
                const diary_question_html = this.diaryQuestionsHTML.value.trim()
                this.progres_tasks.push({title: taskToProgresTitle, duration: diary_question_html, date: Date.now()})
                // console.log(this.progres_tasks);
            }
            this.goNextToolsFormInput();
            // console.log(this.diary);
            // console.log(this.actualInputAttributeIndex)
        }
        
    }
    addDiaryAnswersToDatabase(user_email){
        this.diary.note_date = Date.now();
        fetch('http://51.77.48.162:8080/diary_notes', {
            method: 'POST',
            body: JSON.stringify({diary_note: this.diary, user_email: user_email}),
            headers: {
                'Content-type': 'application/json',
            }
        })
    }
    
    
    validateDiary(){
        if(this.actualInputAttributeIndex < 3){
            if(this.diaryQuestionsHTML.value.length >= 10){
                this.diaryQuestionsHTML.style.border = 'none';
            }else {
                this.diaryQuestionsHTML.style.border = '1px solid red';
                return false;
            }
            return true;
        }else {
            if(this.diaryQuestionsHTML.value.length >= 2){
                this.diaryQuestionsHTML.style.border = 'none';
            }else {
                this.diaryQuestionsHTML.style.border = '1px solid red';
                return false;
            }
            return true;
        }
    }


    //LONG TERM GOAL

    addLongTermGoal(){
        this.yourLongTermGoal = this.longTermGoalQuestion.value.trim();
        
        this.addLongTermGoalToDatabase(this.yourLongTermGoal, this.user_email);
    }
    addLongTermGoalToDatabase(long_term_goal_to_send, user_email){
        fetch('http://51.77.48.162:8080/long_term_goal', {
            method: 'POST',
            body: JSON.stringify({long_term_goal: long_term_goal_to_send, user_email: user_email}),
            headers: {
                'Content-type': 'application/json',
            }
        })
    }

    validateLongTermGoal(){
        if(this.longTermGoalQuestion.value.length >= 4 && this.longTermGoalQuestion.value.length <= 40){
            this.longTermGoalQuestion.style.border = 'none';
            return true

        }else{
            this.longTermGoalQuestion.style.border = '1px solid red';
            return false;

        }
    }


    // BREATHING EXERCISES 

    startBreathingExercise(breathing_type){
        const animation_circle = document.querySelector('.brething_test_circle');
        animation_circle.style.animation = `${breathing_type} 10s infinite`;
        this.breathingAnimationTimer = 0;
        this.changeBreathingExerciseInnerHTML(breathing_type);
        animation_circle.style.animationPlayState = 'running';
        this.breathInterval = setInterval(() =>{
            if(this.breathingAnimationTimer >= 100) {
                clearInterval(this.breathInterval);
                animation_circle.style.animationPlayState = 'paused';
                clearInterval(this.breathIntervalText);
                document.querySelector('#breathingTestButton').style.display = 'block';
                return;
                
            }
            this.changeBreathingExerciseInnerHTML(breathing_type);
            document.querySelector('.brething_test_circle').style.animationPlayState = 'running';
            
        }, 10000);
    }
    changeBreathingExerciseInnerHTML(breathing_type){
        document.querySelector("#breath").innerHTML = 'Inhale';
        if(breathing_type === 'breathing_power_animation'){
            setTimeout(() => {
                document.querySelector("#breath").innerHTML = 'Hold';
            }, 1000);
            setTimeout(() => {
                document.querySelector("#breath").innerHTML = 'Exhale';
            }, 5000);
        }else if(breathing_type === 'breathing_chill_animation'){
            setTimeout(() => {
                document.querySelector("#breath").innerHTML = 'Hold';
            }, 4000);
            setTimeout(() => {
                document.querySelector("#breath").innerHTML = 'Exhale';
            }, 6500);
        }
        
        
    }
        

    // AFIRMATIONS

    changeAfirmation(){
        this.afirmationText.innerHTML = this.afirmationsList[this.actualAfirmation];
    }
    increaseActualAfirmation(){
        this.checkActualAfirmation();
        this.actualAfirmation++;
        this.changeAfirmation();
    }
    decreaseActualAfirmation(){
        
        this.checkActualAfirmationForDecrease();
        this.actualAfirmation--;
        this.changeAfirmation();
    }
    checkActualAfirmation(){
        if(this.actualAfirmation >= this.afirmationsList.length - 1) {
            this.actualAfirmation = -1;
        }
    }
    checkActualAfirmationForDecrease(){
        if(this.actualAfirmation <= 0){
            this.actualAfirmation = this.afirmationsList.length - 1;
        }
    }

    // progres task
    addProgresTaskFromDatabase(user_email){
        fetch('http://51.77.48.162:8080/task_to_progres', {
            method: 'POST',
            body: JSON.stringify({task_to_progres_list: this.progres_tasks, user_email: user_email}),
            headers: {
                'Content-type': 'application/json',
            }
        })
    }
    

}

const tools = new Tools();