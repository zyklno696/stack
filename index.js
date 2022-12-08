import express from 'express';

import mongoose from 'mongoose';

import {registerValidation, loginValidation, postCreateValidation} from './validation.js';

import checkAuth from './utils/checkAuth.js';

// Все мои методы сохрани в эту переменную UserController
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

mongoose.connect('mongodb+srv://admin:123123123@cluster0.hecarmt.mongodb.net/blog?retryWrites=true&w=majority')
    .then(()=>console.log('DB on'))
    .catch((err)=>console.log('DR error', err));
const app =express();

app.use(express.json());

// Авторизация
app.post('/auth/login', loginValidation, UserController.login);

// Регистрация
app.post('/auth/register', registerValidation, UserController.register);

// Если происходит запрос на '/auth/me', checkAuth решает, нужно ли выполнять остальные функции
app.get('/auth/me', checkAuth, UserController.getMe);


app.get('/posts', PostController.getAll);
// app.get('/posts:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
// app.delete('/posts', PostController.remove);
// app.patch('/posts', PostController.update);



app.listen(4444, (err) =>{
    if (err) {
        return console.log(err);
    }
    console.log('Server ON');
});

