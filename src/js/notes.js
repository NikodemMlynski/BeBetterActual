// trzeba zrobić funkcje która będzie imitować pobieranie danych z bazy danych, a naprawdę będzie pobierać dane ze zmiennych

window.onload = function(){
    console.log('cookie:', document.cookie);
    const user_email = document.cookie.slice(6); 
    if(document.cookie){
        notes.init(user_email);
    }else{
        setTimeout(
            () => location.href='../sites/logowanie.html',
            1000
        )
    }
}

class Notes {
    // imitacja pobierania z bazy danych
    diary_notes_container_from_database_list = [
        {
            diary_date: '5 Oct 2023',
            diary_notes: {
                general_about_day: 'Wstałem jak codzień rano i okazało się że świat pojebało poszłem do szkoły programowałem poszłem na siłownie.Wstałem poszłem do szkoły programowałem poszłem na siłownie.Wstałem poszłem do szkoły programowałem poszłem na siłownie.Wstałem poszłem do szkoły programowałem poszłem na siłownie.',
                whats_wrong_today: 'Zapomniałem przeczytać książki, zwyzywałem kogoś.',
                whats_good_today: 'Wycisnąłem 125kg na klatę',
                glass_of_whater: 30,
                amount_of_kcalories: 3138,
                amount_of_sleep: 7.45 * 60, // in minutes
                quality_of_sleep: 82,
            }
        },
        {
            diary_date: '6 Oct 2023',
            diary_notes: {
                general_about_day: 'Wstałem jak codzień rano i okazało się że świat pojebało ',
                whats_wrong_today: 'Zpizgałem się jak szmata',
                whats_good_today: 'Długo programowałem',
                glass_of_whater: 28,
                amount_of_kcalories: 7138,
                amount_of_sleep: 8.45 * 60, // in minutes
                quality_of_sleep: 80,
            }
        },
        {
            diary_date: '7 Oct 2023',
            diary_notes: {
                general_about_day: 'Wstałem jak codzień rano i okazało się że świat pojebało ',
                whats_wrong_today: 'Dostałem pizde z polskiego',
                whats_good_today: 'Długo programowałem',
                glass_of_whater: 28,
                amount_of_kcalories: 7138,
                amount_of_sleep: 8.45 * 60, // in minutes
                quality_of_sleep: 80,
            }
        },
        
    ]
    
    diary_notes_container_list = new Map();

    // long term goals
    long_term_goal_ul = document.querySelector('.notatnik_your_long_term_goal_list');
    long_term_goals_list = [];
    // diary_notes_container = {
    //     diary_date: null,
    //     diary_notes: {
    //         general_about_day: null,
    //         whats_wrong_today: null,
    //         whats_good_today: null,
    //         glass_of_whater: 0,
    //         amount_of_kcalories: 0,
    //         amount_of_sleep: 0, // in minutes
    //         quality_of_sleep: 0,
    //     }
    // }
    months_list = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    init(user_email){
        this.getLongTermGoalsFromDatabase(user_email);   
        this.getDiaryNotesFromDatabase(user_email);     
    }
     getLongTermGoalsFromDatabase(user_email){
        fetch('51.77.48.162:8080/long_term_goal_by_email', {
            method: 'POST',
            body: JSON.stringify({user_email: user_email}),
            headers: {
                'Content-type': 'application/json',
          }
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            this.long_term_goals_list = data;
            this.renderLongTermGoalToHTML(data);
        });
        
    }
    renderLongTermGoalToHTML(long_term_goals_list_from_database){
        long_term_goals_list_from_database.forEach((el) => {
            this.long_term_goal_ul.innerHTML += `<li class="notatnik_your_long_term_goal_list_item">${el.long_term_goal}</li>`; 
        })
    }
    
    getDiaryNotesFromDatabase(user_email){
        
        fetch('51.77.48.162:8080/diary_notes_by_email', {
            method: 'POST',
            body: JSON.stringify({user_email: user_email}),
            headers: {
                'Content-type': 'application/json',
          }
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            this.renderDiaryNotesToHTML(data)
        }).catch((err) => {
            const html_failder_to_fetch_error = document.querySelector('.notatnik_failed_to_fetch_error')
            html_failder_to_fetch_error.innerHTML = 'Nieudało się wczytać zawartości strony';
            html_failder_to_fetch_error.style.padding = '1em';

        });
        
        
    }
    // addDiaryNotesToArray(database_diary_notes){
    //     const {inner_diary_date, inner_diary_notes} = database_diary_notes;
    //     this.diary_notes_container_list.set(inner_diary_date, inner_diary_notes);
    // }
    
    getDiaryDate(diary_date_obj){

        const diary_note_days = new Date(diary_date_obj).getDate();
        const diary_note_months = this.months_list[new Date(diary_date_obj).getMonth()];
        const diary_note_year = new Date(diary_date_obj).getFullYear();
        const diary_note_hours = new Date(diary_date_obj).getHours();
        const diary_note_minutes = new Date(diary_date_obj).getMinutes();
        const fullDate = `${diary_note_days} ${diary_note_months} ${diary_note_year} o godzinie ${diary_note_hours}:${diary_note_minutes}`;
        return fullDate;
    }

    renderDiaryNotesToHTML(diary_notes_list){
        // trzeba też zrobić funkcje wyświetlającą listę pytań i odpowiedzi w html w zależności z ilu dni jest lista tyle bloków zostanie wyświetlone w html
        // diary_notes_container_list.forEach()
        console.log(diary_notes_list);
        if(diary_notes_list.length <= 0){
            return;
        }
        diary_notes_list.slice().reverse().forEach((diary_obj, index) => {
            if(index >= 3) return;
            const diary = diary_obj.diary;

            let amount_of_sleep_integer = diary.amount_of_sleep.replace(':', '.');
            amount_of_sleep_integer = Number(amount_of_sleep_integer) * 60;

            const fullDate = this.getDiaryDate(diary.note_date)

            const diary_note_html_structure = `
            <section class="notatnik_diary_note">
                    <h3 class="diary_note_date" id="diary_note_date">${fullDate}</h3>
                    <section class="general_diary_notes_container">
                        <h4 class="diary_note_question" class="general_about_day_question">Napisz swoje przemyślenia o dzisiejszym dniu</h4>
                        <p class="diary_note_answer" id="general_about_day">${diary.general}</p>
    
                        <h4 class="diary_note_question" class="whats_wrong_today_question">Co dzisiaj zrobiłeś źle</h4>
                        <p class="diary_note_answer" id="whats_wrong_today">${diary.good_decisions}</p>
    
                        <h4 class="diary_note_question" class="whats_good_today_question">Co dzisiaj zrobiłeś dobrze</h4>
                        <p class="diary_note_answer" id="whats_good_today">${diary.bad_decisions}</p>
    
                        <h4 class="diary_note_question" class="glass_of_whater_question">Ile dzisiaj wypiłeś szklanek wody?</h4>
                        <p class="diary_note_answer" id="glass_of_whater">${diary.amount_of_glass_of_water}</p>
    
                        <h4 class="diary_note_question" class="amount_of_kcalories_question">Ile dzisiaj zjadłeś kcalorii?</h4>
                        <p class="diary_note_answer" id="amount_of_kcalories">${diary.amount_of_kcalories}</p>
    
                        <h4 class="diary_note_question" class="amount_of_sleep_question">Ile dzisiaj spałeś</h4>
                        <p class="diary_note_answer" id="amount_of_sleep">${diary.amount_of_sleep}</p>
    
                        <h4 class="diary_note_question" class="quality_of_sleep_question">Jaką miałeś jakość snu</h4>
                        <p class="diary_note_answer" id="quality_of_sleep">${diary.quality_of_sleep}</p>
                    </section>
                    
                </section>`;
                const diary_notes_html_container = document.querySelector('.notatnik_diary_notes_container');
                diary_notes_html_container.innerHTML += diary_note_html_structure;
        })
        

        
    }
}

const notes = new Notes();