import { analyzeEmotion, getEmotionAdvice } from './emotion.js';

export function initStats() {
    // 移除原有的按钮事件监听
    generateStats(); // 初始化时生成统计
}

// 添加新的实时更新函数
export function updateStats() {
    generateStats();
}

function generateStats() {
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    const currentHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    
    const allMessages = [
        ...conversations.flatMap(conv => conv.messages),
        ...currentHistory
    ];
    
    const userMessages = allMessages.filter(msg => msg.isUser);
    
    if (userMessages.length === 0) {
        document.getElementById('moodSummary').innerHTML = '<p>暂无对话记录可供分析</p>';
        return;
    }

    userMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const emotionScores = userMessages.map(msg => ({
        time: new Date(msg.timestamp),
        score: analyzeEmotion(msg.content)
    }));

    createChart(emotionScores);
    updateSummary(emotionScores, userMessages.length);
}

function createChart(emotionScores) {
    const ctx = document.getElementById('moodChart').getContext('2d');
    if (window.moodLineChart) {
        window.moodLineChart.destroy();
    }

    window.moodLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: emotionScores.map(score => 
                new Date(score.time).toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            ),
            datasets: [{
                label: '情绪变化趋势',
                data: emotionScores.map(score => score.score),
                borderColor: 'rgb(65, 105, 225)',
                backgroundColor: 'rgba(65, 105, 225, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'white',
                pointBorderColor: 'rgb(65, 105, 225)',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: 'rgb(65, 105, 225)',
                pointHoverBorderColor: 'white'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    title: {
                        display: true,
                        text: '情绪指数',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: '时间',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '情绪变化趋势图',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                }
            }
        }
    });
}

function updateSummary(emotionScores, messageCount) {
    const totalScore = emotionScores.reduce((acc, curr) => acc + curr.score, 0);
    const averageScore = totalScore / emotionScores.length;

    let trend = '情绪平稳';
    if (averageScore > 0) trend = '总体积极乐观';
    if (averageScore < 0) trend = '需要多关注情绪';

    document.getElementById('moodSummary').innerHTML = `
        <h4>情绪分析摘要</h4>
        <p>总对话数：${messageCount}</p>
        <p>情绪指数：${averageScore.toFixed(2)}</p>
        <p>情绪趋势：${trend}</p>
        <p>建议：${getEmotionAdvice(averageScore)}</p>
    `;
}