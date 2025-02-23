// 存储相关功能
import { updateConversationList, createMessageElement } from './ui.js';

export function saveToHistory(content, isUser) {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const message = {
        content,
        isUser,
        timestamp: new Date().toISOString()
    };
    history.push(message);
    localStorage.setItem('chatHistory', JSON.stringify(history));
    return message;
}

export function saveCurrentConversation() {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    if (history.length === 0 || (history.length === 1 && !history[0].isUser)) return;

    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    const firstUserMessage = history.find(msg => msg.isUser);
    if (!firstUserMessage) return;
    
    const conversationExists = conversations.some(conv => 
        JSON.stringify(conv.messages) === JSON.stringify(history)
    );

    if (!conversationExists) {
        conversations.unshift({
            id: Date.now(),
            title: firstUserMessage.content.substring(0, 20) + '...',
            messages: [...history],  // 使用展开运算符创建新数组
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('conversations', JSON.stringify(conversations));
        updateConversationList();  // 保存后立即更新列表
    }
}

export function clearAllHistory() {
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('conversations');
}

export function initStorage() {
    // 初始化本地存储
    if (!localStorage.getItem('conversations')) {
        localStorage.setItem('conversations', '[]');
    }
    if (!localStorage.getItem('chatHistory')) {
        localStorage.setItem('chatHistory', '[]');
    }
    
    // 初始化历史会话列表
    updateConversationList();
}

export function startNewChat() {
    localStorage.setItem('chatHistory', '[]');
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
        // 添加默认欢迎消息
        const welcomeMessage = {
            content: "你好！我是你的AI生活教练。我可以帮助你解决生活中的困扰，提供情感支持和行动建议。让我们开始对话吧！",
            isUser: false,
            timestamp: new Date().toISOString()
        };
        saveToHistory(welcomeMessage.content, welcomeMessage.isUser);
        
        const { wrapper } = createMessageElement(welcomeMessage.content, welcomeMessage.isUser, welcomeMessage.timestamp);
        chatMessages.appendChild(wrapper);
    }
    updateConversationList();
}

export function clearHistory() {
    if (confirm('确定要清除所有历史记录吗？此操作不可恢复。')) {
        localStorage.setItem('conversations', '[]');
        localStorage.setItem('chatHistory', '[]');
        updateConversationList();  // 清除后更新列表
        location.reload();
    }
}

export function exportData() {
    const data = {
        conversations: JSON.parse(localStorage.getItem('conversations') || '[]'),
        chatHistory: JSON.parse(localStorage.getItem('chatHistory') || '[]')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_history_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}