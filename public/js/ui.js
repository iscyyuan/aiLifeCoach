// UI 相关功能
import { formatMessageTime } from './utils.js';
import { saveCurrentConversation } from './storage.js';
import { loadConversation } from './chat.js';

export function createMessageElement(content, isUser, timestamp) {
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${isUser ? 'user-message-wrapper' : ''}`;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'message-time';
    timestampDiv.textContent = formatMessageTime(timestamp);
    
    messageDiv.appendChild(messageContent);
    wrapper.appendChild(messageDiv);
    wrapper.appendChild(timestampDiv);
    
    return { wrapper, messageContent };
}

export function updateConversationList() {
    const conversationList = document.getElementById('conversationList');
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    conversationList.innerHTML = '';

    // 只显示最近6条对话
    const recentConversations = conversations.slice(0, 6);
    
    recentConversations.forEach(conv => {
        const item = document.createElement('div');
        item.className = 'conversation-item';
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'conversation-time';
        timeSpan.textContent = formatMessageTime(conv.timestamp);
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'conversation-title';
        titleDiv.textContent = conv.title;
        
        item.appendChild(titleDiv);
        item.appendChild(timeSpan);
        
        item.addEventListener('click', () => {
            const currentHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
            if (currentHistory.some(msg => msg.isUser)) {
                saveCurrentConversation();
            }
            loadConversation(conv);
        });
        
        conversationList.appendChild(item);
    });

    // 如果对话数量超过6条，添加"查看全部"按钮
    if (conversations.length > 6) {
        const viewAllButton = document.createElement('div');
        viewAllButton.className = 'view-all-button';
        viewAllButton.textContent = '查看全部...';
        viewAllButton.addEventListener('click', () => showAllConversations(conversations));
        conversationList.appendChild(viewAllButton);
    }
}

// 添加显示所有对话的函数
function showAllConversations(conversations) {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';

    // 添加标题
    const titleDiv = document.createElement('div');
    titleDiv.className = 'history-title';
    titleDiv.textContent = '历史对话';
    chatMessages.appendChild(titleDiv);

    // 显示所有对话
    conversations.forEach(conv => {
        const item = document.createElement('div');
        item.className = 'conversation-item';
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'conversation-time';
        timeSpan.textContent = formatMessageTime(conv.timestamp);
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'conversation-title';
        titleDiv.textContent = conv.title;
        
        item.appendChild(titleDiv);
        item.appendChild(timeSpan);
        
        item.addEventListener('click', () => {
            const currentHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
            if (currentHistory.some(msg => msg.isUser)) {
                saveCurrentConversation();
            }
            loadConversation(conv);
        });
        
        chatMessages.appendChild(item);
    });
}
export function initUI() {
    // 侧边栏展开/收起功能
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        // 保存状态到本地存储
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });

    // 恢复上次的状态
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
    }
}
