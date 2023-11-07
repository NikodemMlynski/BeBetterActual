window.onload = function(){
    user.init();
}

class User{
    name = null;
    email = null;
    password = null;
    repeated_password = null;

    name_html = null;
    email_html = null;
    password_html = null;
    repeated_password_html = null;

    registrasion_form_html = null;
    users_array = [];

    init(){
        this.name_html = document.querySelector('#register_name');
        this.email_html = document.querySelector('#register_email');
        this.password_html = document.querySelector('#register_password');
        this.repeated_password_html = document.querySelector('#register_repeated_password');

        this.registrasion_form_html = document.querySelector('.registration_form');

        this.registrasion_form_html.addEventListener('submit', (e) => {
            e.preventDefault();
            this.name = this.name_html.value;
            this.email = this.email_html.value.toLowerCase();
            this.password = this.password_html.value;
            this.repeated_password = this.repeated_password_html.value;
            const validated = this.validateUserData();
            if(validated){
                const user_obj = {
                    name: this.name,
                    email: this.email,
                    password: this.password
                }
                this.addUserToDatabase(user_obj);
            }else{
                return;
            }
            this.setInputsEmpty();
        })
        this.getUsersFromDatabase();

    }
    validateUserData(){
        // Warunki walidacji
        // name.length >= 3
        // email.length >= 5, zawiera @, zawiera .
        // email nie może być taki sam jak inne emaile z bazy danych, trzbe bedzie zrobić fetch method GET
        // password.length >= 4, zawiera litery i liczby
        // repeated_password.length >= 4, zawiera litery i liczby
        // password === repeated_password
        if(!(this.name.length >= 3)){
            this.name_html.classList.add('bad_validated');
            document.querySelector('#name_validate_info').innerHTML = 'Imię musi mieć co najmniej 3 litery';
            return false;
        }else{
            this.name_html.classList.remove('bad_validated');
            document.querySelector('#name_validate_info').innerHTML = '';
        }
        if(!(this.email.length >= 3 && this.email.indexOf('@') != -1)){
            this.email_html.classList.add('bad_validated');
            document.querySelector('#email_validate_info').innerHTML = `Email musi zawierać znaki '@' oraz '.'`;
            return false;
        }else{
            this.email_html.classList.remove('bad_validated');
            document.querySelector('#email_validate_info').innerHTML = ``;
        }
        if(!(this.password.length >= 4)){
            this.password_html.classList.add('bad_validated');
            document.querySelector('#password_validate_info').innerHTML = `Hasło musi zawierać co najmniej 4 litery`;
            return false;
        }else{
            this.password_html.classList.remove('bad_validated');
            document.querySelector('#password_validate_info').innerHTML = ``;
        }
        if(!(this.repeated_password.length >= 4)){
            this.repeated_password_html.classList.add('bad_validated');
            document.querySelector('#repeated_password_validate_info').innerHTML = `Hasło musi zawierać co najmniej 4 litery`;
            return false;
        }else{
            this.repeated_password_html.classList.remove('bad_validated');
            document.querySelector('#repeated_password_validate_info').innerHTML = ``;
        }
        if(!(this.repeated_password === this.password)){
            document.querySelector('#password_validate_info').innerHTML = `Hasło muszą być takie same`;
            document.querySelector('#repeated_password_validate_info').innerHTML = `Hasło muszą być takie same`;
            this.repeated_password_html.classList.add('bad_validated');
            this.password_html.classList.add('bad_validated');
            return false;
        }else{
            document.querySelector('#password_validate_info').innerHTML = ``;
            document.querySelector('#repeated_password_validate_info').innerHTML = ``;
            this.repeated_password_html.classList.remove('bad_validated');
            this.password_html.classList.remove('bad_validated');
        }
        let same_email = false;
        this.users_array.forEach(el => {
            if(el == this.email){
                same_email = true;
                return false;
            }
        })
        if(same_email){
            alert('Taki email już istnieje');
            return false;
        }
        return true;
    }
    setInputsEmpty(){
        this.name_html.value = '';
        this.email_html.value = '';
        this.password_html.value = '';
        this.repeated_password_html.value = '';
    }
    addUserToDatabase(user_obj){
        alert('Dodano do bazy danych');
        fetch('http://127.0.0.1:8080/users', {
            method: 'POST',
            body: JSON.stringify(user_obj),
            headers: {
                'Content-type': 'application/json',
            }
        })
        window.location.reload();
    }
    getUsersFromDatabase(){
        fetch('http://127.0.0.1:8080/users')
        .then(res => res.json())
        .then(users_arr => {
            // this.users_array = [...users_arr];
            users_arr.forEach((el) => {
                this.users_array.push(el)
            });
        });
        console.log(this.users_array);
    }
    
    
    
}

const user = new User();