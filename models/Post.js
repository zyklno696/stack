import mongoose from "mongoose";

// Констанца с настройками схемы пользователей. 
const PostSchema = new mongoose.Schema({
    title: {
        type: String, // Имя хранится в строке
        required: true, // Обязательно для заполнения
    },
    text: {
        type: String, // текст хранится в строке
        required: true, // Обязательно для заполнения
    },
    tags: {
        type: Array, // Тэг хранится в массиве
        default: [], // По умолчанию пустой массив
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Извлечние айди пользователя из базы данных
        ref: 'User', // Ссылка на модель пользователя
        required: true,
    },

    imageUrl: String,

}, {
    timestamps: true,
});

export default mongoose.model('Post', PostSchema);