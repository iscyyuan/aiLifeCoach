// 聊天相关功能
import { createMessageElement, updateConversationList } from './ui.js';
import { saveToHistory, saveCurrentConversation } from './storage.js';
import { updateStats } from './stats.js';

let chatMessages, userInput, sendButton;
let isProcessing = false;  // 添加状态标志

// 确保导出需要的函数
export function initChat() {
    chatMessages = document.getElementById('chatMessages');
    userInput = document.getElementById('userInput');
    sendButton = document.getElementById('sendButton');
    
    // 初始检查按钮状态
    checkButtonState();
    
    // 监听输入变化
    userInput.addEventListener('input', checkButtonState);
    
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isProcessing && userInput.value.trim()) {
                sendMessage();
            }
        }
    });
}

// 检查按钮状态
function checkButtonState() {
    const isEmpty = !userInput.value.trim();
    sendButton.disabled = isEmpty || isProcessing;
    userInput.disabled = isProcessing;
}

export async function sendMessage() {
    const message = userInput.value.trim();
    if (!message || isProcessing) return;
    
    try {
        isProcessing = true;
        checkButtonState();
        
        // 添加用户消息
        addMessage(message, true);
        userInput.value = '';
        
        // 发送到服务器
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }
        
        // 添加 AI 响应
        addMessage(data.response, false);
        
    } catch (error) {
        console.error('发送消息失败:', error);
        addMessage('抱歉，发生了错误，请稍后重试。', false);
    } finally {
        isProcessing = false;
        checkButtonState();
    }
}

export async function addMessage(content, isUser = false, save = true) {
    const message = save ? saveToHistory(content, isUser) : { content, isUser, timestamp: new Date().toISOString() };
    const { wrapper, messageContent } = createMessageElement(message.content, message.isUser, message.timestamp);
    chatMessages.appendChild(wrapper);

    if (!isUser && save) {
        messageContent.textContent = '';
        let index = 0;
        const typeWriter = () => {
            if (index < content.length) {
                messageContent.textContent += content.charAt(index);
                index++;
                chatMessages.scrollTop = chatMessages.scrollHeight;
                setTimeout(typeWriter, 30);
            }
        };
        typeWriter();
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

export function loadConversation(conversation) {
    chatMessages.innerHTML = '';
    localStorage.setItem('chatHistory', JSON.stringify(conversation.messages));
    conversation.messages.forEach(msg => {
        const { wrapper } = createMessageElement(msg.content, msg.isUser, msg.timestamp);
        chatMessages.appendChild(wrapper);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function loadInitialChat() {
    const currentHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    if (currentHistory.length === 0) {
        addMessage("你好！我是你的AI生活教练。我可以帮助你解决生活中的困扰，提供情感支持和行动建议。让我们开始对话吧！", false, true);
    } else {
        currentHistory.forEach(msg => {
            const { wrapper } = createMessageElement(msg.content, msg.isUser, msg.timestamp);
            chatMessages.appendChild(wrapper);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}