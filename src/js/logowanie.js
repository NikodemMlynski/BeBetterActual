window.onload = function(){
    
    login.init();
}

class Login{
    email = null;
    password = null;
    email_html = null;
    password_html = null;

    email_list = [];
    password_list = [];

    login_form = null;

    email_to_check = null;
    correct_sing_up_email_html = null;
    correct_sing_up_password_html = null;

    
    init(){
        this.email_html = document.querySelector('#login_email');
        this.password_html = document.querySelector('#login_password');
        this.login_form = document.querySelector('.sing_up_form');
        this.correct_sing_up_email_html = document.querySelector('#correct_sing_up_email');
        this.correct_sing_up_password_html = document.querySelector('#correct_sing_up_password');
        

        this.getUsersFromDatabase();

        this.login_form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.email = this.email_html.value;
            this.password = this.password_html.value;
            const email_exist = this.checkIfEmailExist();
            if(email_exist) {
                this.correct_sing_up_email_html.innerHTML = '';
                const correct_password = this.password_list[this.email_list.indexOf(this.email_to_check)];
                const correct_loged = this.checkIfPasswordCorrect(correct_password);
                if(correct_loged){
                    this.correct_sing_up_password_html.innerHTML = '';
                    const cookie_template = `email=${this.email}; path=/`
                    // console.log(cookie_template);
                    document.cookie = cookie_template;
                    // console.log(document.cookie);

                    setTimeout(() => {
                        location.href='/';

                    }, 500);
                }else {
                    this.correct_sing_up_password_html.innerHTML = 'hasło jest niepoprawne'
                }
            }else{
                this.correct_sing_up_email_html.innerHTML = 'taki email nie istnieje';
            }
            
        })
    }
    checkIfEmailExist(){
        let exist = false;
        this.email_list.forEach((email) => {
            if(email === this.email){
                exist = true;
                this.email_to_check = this.email;
                return;
            }
        })
        return exist;
    }
    checkIfPasswordCorrect(correct_password){
        if(this.password === correct_password){
            return true;
        }
        return false;
    }
    getUsersFromDatabase(){
        fetch('http://51.77.48.179:8080/users_login')
        .then(res => res.json())
        .then(users_arr => {
            // this.users_array = [...users_arr];
            users_arr.forEach((el) => {
                this.email_list.push(el.email);
                this.password_list.push(el.password);
                // console.log(el);
            });
        });
        // console.log(this.email_list);
        // console.log(this.password_list);
    }
}

const login = new Login();