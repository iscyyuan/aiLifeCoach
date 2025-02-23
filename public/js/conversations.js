import { saveCurrentConversation } from './storage.js';
import { updateConversationList } from './ui.js';
import { addMessage } from './chat.js';
// import { updateStats } from './stats.js';  // 暂时注释掉

export function initConversations() {
    const newChatButton = document.getElementById('newChatButton');
    const clearButton = document.getElementById('clearButton');
    const exportButton = document.getElementById('exportButton');
    const chatMessages = document.getElementById('chatMessages');

    // 初始化时立即更新会话列表
    updateConversationList();
    // updateStats();  // 暂时注释掉

    newChatButton.addEventListener('click', () => {
        const currentHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        if (currentHistory.some(msg => msg.isUser)) {
            saveCurrentConversation();
        }
        localStorage.removeItem('chatHistory');
        chatMessages.innerHTML = '';
        addMessage("你好！我是你的AI生活教练。我可以帮助你解决生活中的困扰，提供情感支持和行动建议。让我们开始对话吧！", false, true);
        updateConversationList();
        // updateStats();  // 暂时注释掉
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