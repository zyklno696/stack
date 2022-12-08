import mongoose from "mongoose";

// Констанца с настройками схемы пользователей. 
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String, // Имя хранится в строке
        required: true, // Обязательно для заполнения
    },
    email: {
        type: String, // Почта хранится в строке
        required: true, // Обязательно для заполнения
        unique: true, // имейл может быть только уникальным
    },
    passwordHash: {
        type: String, // хэш пароля хранится в строке
        required: true, // Обязательно для заполнения
    },
    avatarUrl: String,

}, {
    timestamps: true,
});

export default mongoose.model('User', UserSchema);