import { saveCurrentConversation, startNewChat } from './storage.js';
import { updateConversationList } from './ui.js';
import { addMessage } from './chat.js';

export function initConversations() {
    const newChatButton = document.getElementById('newChatButton');
    const clearButton = document.getElementById('clearButton');
    const exportButton = document.getElementById('exportButton');
    const chatMessages = document.getElementById('chatMessages');

    // 初始化时立即更新会话列表
    updateConversationList();

    newChatButton.addEventListener('click', () => {
        const currentHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        if (currentHistory.some(msg => msg.isUser)) {
            saveCurrentConversation();
        }
        startNewChat();  // 使用 storage.js 中的函数
    });

    clearButton.addEventListener('click', () => {
        if (confirm('确定要清除所有聊天记录吗？')) {
            localStorage.removeItem('chatHistory');
            localStorage.removeItem('conversations');
            chatMessages.innerHTML = '';
            updateConversationList();
            updateStats(); // 添加这行来更新情绪统计
        }
    });
    exportButton.addEventListener('click', () => {
        const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        if (history.length === 0) {
            alert('没有可导出的对话记录！');
            return;
        }

        const jsonContent = JSON.stringify(history, null, 2);
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), jsonContent], { 
            type: 'application/json;charset=utf-8' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AI-Life-Coach-对话记录-${new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/[\/\s:]/g, '-')}.json`;
        
        a.click();
        URL.revokeObjectURL(url);
    });
}