const express = require("express");
const cors = require("cors");
const app = express();

const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const url = "mongodb://51.77.48.162:27017/";
const client = new MongoClient(url);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://51.77.48.162');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get("/", (req, res) =>{
    res.send(`Serwer działa`);
    
})

app.listen(8080, () => {
    console.log("Server started");
})

// long term goals

app.post('/long_term_goal_by_email', (req, res) => {
    const user_email = req.body.user_email;
    sendLongTermGoalToSite(req, res, user_email);
})

app.post('/long_term_goal', (req, res) =>{
    const long_term_goal_obj = req.body.long_term_goal;
    const user_email = req.body.user_email;
    console.log(long_term_goal_obj);
    addLongTermGoalToDatabase(long_term_goal_obj, user_email);
})

// tasks
app.delete('/task', (req, res) => {
    const task_obj = req.body.task_obj;
    const user_email = req.body.user_email;
    console.log(user_email);
    deleteTaskById(task_obj, req, res, user_email);
})

app.patch('/task', (req, res) => {
    const task_obj = req.body.task_obj;
    const user_email = req.body.user_email;
    console.log('zmiana: ', user_email);
    updateTaskIfCompleted(task_obj, req, res, user_email);
})

app.post('/task', (req, res) =>{
    const task_obj = req.body.task;
    const user_email = req.body.user_email;
    console.log(task_obj);
    console.log(user_email);
    addTaskToDatabase(task_obj, user_email);
})

app.post('/task_by_email', (req, res) => {
    console.log('body: ', req.body);
    const user_email = req.body.user_email;
    sendTaskToMainSite(req, res, user_email);
})




// diary_notes

app.post('/diary_notes', (req, res) => {
    const diary_note_obj = req.body.diary_note;
    console.log('diary note obj: ')
    console.log(diary_note_obj);
    const user_email = req.body.user_email;
    AddDiaryNotesToDatabase(diary_note_obj, user_email);
})

app.post('/diary_notes_by_email', (req, res) => {
    const user_email = req.body.user_email;
    sendDiaryNotesToSite(req, res, user_email);
})

// task_to_progres

app.post('/task_to_progres', (req, res) => {
    const task_to_progres_obj = req.body.task_to_progres_list;
    const user_email = req.body.user_email;
    console.log(req.body);
    AddProgresTaskDatabase(task_to_progres_obj, user_email);
})

app.post('/task_to_progres_by_email', (req, res) => {
    const user_email = req.body.user_email;
    sendProgresTaskToSite(req, res, user_email);
})

app.post('/users', (req, res) => {
    const users_obj = req.body;
    console.log(users_obj);
    addUserToDatabase(users_obj);
})

app.get('/users', (req, res) => {
    sendUsersEmailToFrontend(req, res);
})

app.get('/users_login', (req, res) => {
    sendUsersToFrontend(req, res);
})


// users 
const users_collection = client.db('BeBetter').collection('users');

async function addUserToDatabase(user_obj){
    try{
        await client.connect();
        const collection = users_collection;
        const {name, email,password} = user_obj;
        await collection.insertOne({
            name: name,
            email: email,
            password: password
        });
    }catch(err){
        console.log(err);
    }finally{
        await client.close();
    }
}

async function sendUsersEmailToFrontend(req, res){
    try{
        await client.connect();
        const users_from_database = users_collection.find();
        const result_users = await users_from_database.toArray();
        const result_users_email = [];
        result_users.forEach((user) => {
            console.log(user.email);
            result_users_email.push(user.email);
        })
        if(result_users.length > 0){     
            res.json(result_users_email);

        }else{  
            res.json({users: 'Nie masz jeszcze celów długoterminowych'});
            console.log('Nie masz jeszcze celów długoterminowych');

        }
    }catch(err){
        console.log(err);
    }finally{
        await client.close();
    }
}
async function sendUsersToFrontend(req, res){
    try{
        await client.connect();
        const users_from_database = users_collection.find();
        const result_users = await users_from_database.toArray();
        const result_users_keys = [];
        result_users.forEach((user) => {
            result_users_keys.push({email: user.email, password: user.password});
        })
        if(result_users.length > 0){     
            res.json(result_users_keys);

        }else{  
            res.json({users: 'Nie masz jeszcze celów długoterminowych'});
            console.log('Nie masz jeszcze celów długoterminowych');

        }
    }catch(err){
        console.log(err);
    }finally{
        await client.close();
    }
}



// long term goals

async function addLongTermGoalToDatabase(long_term_goal, user_email){
    try{
        await client.connect();
        const collection = client.db('BeBetter').collection(`long_term_goals${user_email}`);

        await collection.insertOne({
            long_term_goal: long_term_goal
        })
    }catch(err){
        console.log(err);
    }finally{
        await client.close();
    }
}

async function sendLongTermGoalToSite(req, res, user_email){
    try{
        await client.connect();
        const collection = client.db('BeBetter').collection(`long_term_goals${user_email}`);
        const long_term_goals_from_database = collection.find().limit(5);
        const result_long_term_goals = await long_term_goals_from_database.toArray();
        if(result_long_term_goals.length > 0){
            
            res.json(result_long_term_goals);
                
            
            console.log(result_long_term_goals);
        }else{
            
                res.json({long_term_goal: 'Nie masz jeszcze celów długoterminowych'});
            
            console.log('Nie masz jeszcze celów długoterminowych');

        }
    }catch(err){
        console.log(err);
    }finally{
        await client.close();
    }
}


// tasks 


async function addTaskToDatabase(task, user_email){
    try{
        await client.connect();
        const collection = client.db('BeBetter').collection(`tasks${user_email}`);

        await collection.insertOne({
            task: task
        })
    }catch(err){
        console.log(err);
    }finally{
        await client.close();
    }
}

async function sendTaskToMainSite(req, res, user_email){
    try{
        await client.connect();
        console.log(user_email);
        const collection = client.db('BeBetter').collection(`tasks${user_email}`);
        const task_from_database = collection.find().limit(10);
        const result_task = await task_from_database.toArray();
        console.log(result_task);
        if(result_task.length > 0){           
            res.json(result_task);
            console.log(result_task);
        }else{
            const result_task_err = []
            res.json(result_task_err);
            console.log('Nie masz jeszcze żadnych zadań');

        }
    }catch(err){
        console.log(err);
    }finally{
        await client.close();
    }
}
async function deleteTaskById(task, req, res, user_email){
    try{
        await client.connect();
        console.log(task);
        const collection = client.db('BeBetter').collection(`tasks${user_email}`);
        const result = await collection.deleteMany({task});
        console.log(`Deleted ${result.deletedCount}`);

    }catch(err){
        console.log(err);
    }finally{
        await client.close();
    }
}
async function updateTaskIfCompleted(task, req, res, user_email){
    try{
        await client.connect();
        const collection = client.db('BeBetter').collection(`tasks${user_email}`);
        console.log(task)
        console.log(task.completed);
        const to_complete = !task.completed;
        console.log('to_complete: ', to_complete);
        await collection.updateOne(
            {task}, 
            {$set: {
                task: {
                    taskTitle: task.taskTitle,
                    taskTime: task.taskTime,
                    taskDescription: task.taskDescription,
                    completed: to_complete,
                    task_date: task.task_date

                }
            }
        }
        )
        // WAŻNE !!!!!!!!! w main.js trzeba zrobić funkcję która, każdego dnia o godzinie 24 ustala we wszystkich zadaniach complete na false !!!!!!!!!!

    }catch(err){
        console.log(err);
    }finally{
        await client.close();
    }
}



// diary_notes

async function AddDiaryNotesToDatabase(diary_note, user_email){
    try{
        await client.connect();
        const collection = client.db('BeBetter').collection(`diary_notes${user_email}`);
        console.log(diary_note);
        await collection.insertOne({
            diary: diary_note
        })
    }catch(err){
        console.log(err);
    }finally{
        await client.close();
    }
}

async function sendDiaryNotesToSite(req, res, user_email){
    try{
        await client.connect();
        const collection = client.db('BeBetter').collection(`diary_notes${user_email}`);
        const diary_from_database = collection.find();
        const result_diary = await diary_from_database.toArray();
        if(result_diary.length > 0){           
            res.json(result_diary);
            console.log(result_diary);
        }else{
            
            console.log('Nie masz jeszcze żadnych wpisów');

        }
    }catch(err){
        console.log(err);
    }finally{
        await client.close();
    }
}


// task progres


async function AddProgresTaskDatabase(progres_tasks, user_email){
    try{
        await client.connect();
        const collection = client.db('BeBetter').collection(`task_to_progres${user_email}`);
        console.log(progres_tasks);
        await collection.insertMany(progres_tasks);
        
    }catch(err){
        console.log(err);
    }finally{
        await client.close();
    }
}

async function sendProgresTaskToSite(req, res, user_email){
    try{
        await client.connect();
        const collection = client.db('BeBetter').collection(`task_to_progres${user_email}`);
        const tasks_to_progres_from_database = collection.find();
        const result_progres_tasks = await tasks_to_progres_from_database.toArray();
        if(result_progres_tasks.length > 0){
            console.log(result_progres_tasks);
            res.json({result_progres_tasks});
        }else{
            console.log('Nie masz jeszcze żadnych nawyków do zmierzenia')
        }
    }catch(err){
        console.log(err);
    }finally{
        await client.close();
    }
}
