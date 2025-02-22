// 工具函数
export function formatMessageTime(timestamp) {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const timeStr = messageDate.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    if (messageDate.toDateString() === now.toDateString()) {
        return timeStr;
    }
    if (messageDate.toDateString() === yesterday.toDateString()) {
        return `昨天 ${timeStr}`;
    }
    
    return messageDate.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

export function createElement(tag, className, textContent = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}