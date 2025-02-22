require('dotenv').config();  // 添加这行在最上面
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// 使用环境变量
const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

// 验证环境变量是否存在
if (!API_KEY || !API_URL) {
    console.error('错误: 缺少必要的环境变量');
    process.exit(1);
}

app.post('/chat', async (req, res) => {
    try {
        if (!req.body.message) {
            throw new Error('消息内容不能为空');
        }

        if (!API_KEY || !API_URL) {
            throw new Error('API配置缺失，请检查环境变量');
        }

        const response = await axios({
            method: 'post',
            url: API_URL,
            data: {
                model: "deepseek-r1-250120",
                messages: [
                    {
                        role: "system",
                        content: "你是一位专业的Life Coach，你的目标是通过对话帮助用户成长。你应该：1. 认真倾听用户的问题 2. 给出具体的建议和行动计划 3. 保持积极正面的态度 4. 适时提供鼓励和支持"
                    },
                    {
                        role: "user",
                        content: req.body.message
                    }
                ],
                temperature: 0.6,
                stream: false
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            timeout: 60000  // 修改为 60 秒
        });

        if (!response.data) {
            throw new Error('API 未返回数据');
        }

        if (!response.data.choices || !Array.isArray(response.data.choices) || response.data.choices.length === 0) {
            throw new Error('API 返回的数据格式不正确');
        }

        const aiResponse = response.data.choices[0].message?.content;
        if (!aiResponse) {
            throw new Error('API 返回的消息内容为空');
        }

        res.json({ response: aiResponse });
    } catch (error) {
        console.error('API 错误:', error);
        
        let statusCode = 500;
        let errorMessage = '服务器错误';

        if (error.response) {
            // API 响应错误
            statusCode = error.response.status;
            errorMessage = error.response.data?.error || error.message;
        } else if (error.request) {
            // 请求发送失败
            statusCode = 503;
            errorMessage = '无法连接到 API 服务';
        } else {
            // 其他错误
            errorMessage = error.message;
        }

        res.status(statusCode).json({ 
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});