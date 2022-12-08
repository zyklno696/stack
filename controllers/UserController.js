import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';


import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
    
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
    
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });
    
        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        },
        'secret123',
        {
            expiresIn: '30d'
        },
        );
        
        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
        message: 'Не удалось создать пользователя'
        });
    };
};

export const login = async (req, res)=>{
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        // Возврат сообщения об ошибке. Лучше описние ошибки делать более абстрактным, что-бы было для пользователя непонятно, что именно он ввел не правильно
        if (!user) {
            return res.status(404).json({
                message: 'Пользователя нету',
            });
        }
        // Если пользователь нашелся в базе данных, то проверить его пароль, сходится ли он с тем, что есть в базе данных
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);


        // Если они не сходятся, то вернуть ошибку для пользователя. Опять же, абстрактно. Мы знаем, что речь идет о пароле. Но пользователю, эти подробности не нужны
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        };

        // Если пользователь нашелся и пароль коректный, Генерируем токен.
        const token = jwt.sign(
        {
            _id: user._id,
        },
        'secret123',
        {
            expiresIn: '30d'
        },
        );
        // Вытаскиваем информацию о пользователе, выбираем passwordHash
        const {passwordHash, ...userData} = user._doc;

        // Возвращаем ответ
        res.json({
            ...userData,
            token,
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
        message: 'Не удалось авторизоваться'
        });
    };
};

export const getMe = async (req, res) => {
    try {

        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            })
        }
        const {passwordHash, ...userData} = user._doc;

        res.json(userData,);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа',
        })
    }
};