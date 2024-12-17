// app.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// 中间件
// app.use(cors());
app.use(cors({
    origin: 'https://swdeep.cc', // Or '*' for all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));
app.use(express.json());

// MongoDB连接
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp', {
//     // useNewUrlParser: true,
//     useUnifiedTopology: true
// });
mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost:27017/todoapp')
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Todo模型
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todoSchema);

// 路由
// 获取所有待办事项
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find().sort({ created_at: -1 });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 添加待办事项
app.post('/api/todos', async (req, res) => {
    const todo = new Todo({
        title: req.body.title,
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 更新待办事项
app.put('/api/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (todo) {
            todo.completed = req.body.completed;
            const updatedTodo = await todo.save();
            res.json(updatedTodo);
        } else {
            res.status(404).json({ message: '待办事项未找到' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 删除待办事项
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (todo) {
            await todo.deleteOne();
            res.json({ message: '待办事项已删除' });
        } else {
            res.status(404).json({ message: '待办事项未找到' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});