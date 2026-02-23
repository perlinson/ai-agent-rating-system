/**
 * AI Agent 能力评级与信誉系统 - 测试
 */

const { AgentRatingSystem, AgentStrategyEngine } = require('./index.js');

// 创建系统实例
const ratingSystem = new AgentRatingSystem({ name: '🎖️ AI能力评级中心' });
const strategyEngine = new AgentStrategyEngine(ratingSystem);

console.log('='.repeat(60));
console.log('🎖️ AI Agent 能力评级与信誉系统 - 测试演示');
console.log('='.repeat(60));

// 1. 注册AI Agent
console.log('\n📝 1. 注册AI Agent...\n');

ratingSystem.registerAgent('alpha', {
    name: '🔵 阿尔法',
    bio: '热爱编程和新技术',
    tags: ['developer', 'AI'],
    specialty: ['coding', 'automation']
});

ratingSystem.registerAgent('beta', {
    name: '🔴 贝塔',
    bio: '创意设计师',
    tags: ['designer', 'creative'],
    specialty: ['design', 'creativity']
});

ratingSystem.registerAgent('gamma', {
    name: '🟢 伽马',
    bio: '数据分析专家',
    tags: ['analyst', 'research'],
    specialty: ['research', 'reasoning']
});

ratingSystem.registerAgent('delta', {
    name: '🟡 德尔塔',
    bio: '全栈开发者',
    tags: ['fullstack', 'tech'],
    specialty: ['coding', 'design']
});

console.log('✅ 注册了4个AI Agent');

// 2. 更新能力评分
console.log('\n📊 2. 更新能力评分...\n');

ratingSystem.updateAbility('alpha', 'coding', 85, 'self');
ratingSystem.updateAbility('alpha', 'automation', 70, 'self');
ratingSystem.updateAbility('alpha', 'creativity', 60, 'self');

ratingSystem.updateAbility('beta', 'design', 90, 'self');
ratingSystem.updateAbility('beta', 'creativity', 85, 'self');
ratingSystem.updateAbility('beta', 'communication', 75, 'self');

ratingSystem.updateAbility('gamma', 'research', 88, 'self');
ratingSystem.updateAbility('gamma', 'reasoning', 82, 'self');
ratingSystem.updateAbility('gamma', 'coding', 55, 'self');

ratingSystem.updateAbility('delta', 'coding', 75, 'self');
ratingSystem.updateAbility('delta', 'design', 65, 'self');
ratingSystem.updateAbility('delta', 'reasoning', 70, 'self');

console.log('✅ 初始能力评分设置完成');

// 3. 创建任务
console.log('\n📋 3. 创建任务...\n');

ratingSystem.createTask('task-001', {
    title: '🔧 开发一个API接口',
    description: '需要实现用户管理的REST API',
    type: 'coding',
    difficulty: 'medium',
    requiredAbilities: ['coding'],
    estimatedTime: 7200,
    reward: 15,
    requesterId: 'gamma'
});

ratingSystem.createTask('task-002', {
    title: '🎨 设计一个Logo',
    description: '为AI Agent社区设计Logo',
    type: 'design',
    difficulty: 'hard',
    requiredAbilities: ['design', 'creativity'],
    estimatedTime: 3600,
    reward: 20,
    requesterId: 'alpha'
});

ratingSystem.createTask('task-003', {
    title: '📈 数据分析报告',
    description: '分析用户行为数据并生成报告',
    type: 'research',
    difficulty: 'hard',
    requiredAbilities: ['research', 'reasoning'],
    estimatedTime: 5400,
    reward: 18,
    requesterId: 'beta'
});

ratingSystem.createTask('task-004', {
    title: '⚙️ 自动化脚本',
    description: '编写数据备份自动化脚本',
    type: 'automation',
    difficulty: 'easy',
    requiredAbilities: ['automation', 'coding'],
    estimatedTime: 1800,
    reward: 10,
    requesterId: 'gamma'
});

console.log('✅ 创建了4个任务');

// 4. 接受并完成任务
console.log('\n🚀 4. 接受并完成任务...\n');

ratingSystem.acceptTask('alpha', 'task-001');
const task1 = ratingSystem.completeTask('alpha', 'task-001', 90);
console.log(`✅ 阿尔法完成任务: ${task1.title} (质量: ${task1.quality}%)`);

ratingSystem.acceptTask('beta', 'task-002');
const task2 = ratingSystem.completeTask('beta', 'task-002', 95);
console.log(`✅ 贝塔完成任务: ${task2.title} (质量: ${task2.quality}%)`);

ratingSystem.acceptTask('gamma', 'task-003');
const task3 = ratingSystem.completeTask('gamma', 'task-003', 88);
console.log(`✅ 伽马完成任务: ${task3.title} (质量: ${task3.quality}%)`);

// 5. 同行评价
console.log('\n⭐ 5. 同行评价...\n');

ratingSystem.submitReview('alpha', 'beta', {
    rating: 5,
    dimensions: { design: 95, creativity: 90, communication: 80 },
    comment: '设计非常专业，沟通也很顺畅！'
});
console.log('✅ 阿尔法给贝塔5星好评');

ratingSystem.submitReview('beta', 'alpha', {
    rating: 4,
    dimensions: { coding: 85, automation: 75, creativity: 60 },
    comment: '代码质量很高，响应也很快'
});
console.log('✅ 贝塔给阿尔法4星评价');

ratingSystem.submitReview('gamma', 'alpha', {
    rating: 5,
    dimensions: { coding: 90, reasoning: 70 },
    comment: 'API设计很规范，文档也很清晰'
});
console.log('✅ 伽马给阿尔法5星好评');

// 6. 获取Agent档案
console.log('\n👤 6. Agent档案...\n');

const alphaProfile = ratingSystem.getAgentProfile('alpha');
console.log(`Agent: ${alphaProfile.name}`);
console.log(`  信誉等级: ${alphaProfile.reputation.levelIcon} ${alphaProfile.reputation.level}`);
console.log(`  信誉分: ${alphaProfile.reputation.score}`);
console.log(`  完成任务: ${alphaProfile.stats.tasksCompleted}`);
console.log(`  满意度: ${alphaProfile.stats.satisfactionScore}%`);
console.log(`  徽章: ${alphaProfile.badges.length}个`);
console.log(`  能力:`);
alphaProfile.abilities.forEach(a => {
    console.log(`    ${a.icon} ${a.name}: ${a.score} (${a.level})`);
});

// 7. 排行榜
console.log('\n🏆 7. 排行榜...\n');

console.log('📊 信誉排行榜:');
ratingSystem.getLeaderboard('reputation', 5).forEach(a => {
    console.log(`  ${a.rank}. ${a.name} - ${a.score}分 [${a.levelIcon}${a.level}]`);
});

console.log('\n📈 任务完成排行榜:');
ratingSystem.getLeaderboard('tasks', 5).forEach(a => {
    console.log(`  ${a.rank}. ${a.name} - ${a.score}个任务`);
});

// 8. 任务推荐
console.log('\n🎯 8. 任务推荐...\n');

console.log('为 task-002 推荐的Agent:');
const recommendations = ratingSystem.recommendAgents('task-002', 3);
recommendations.forEach(r => {
    console.log(`  ${r.agentId}: ${r.name} (匹配度: ${r.matchScore}, 成功率: ${r.successRate}%)`);
});

// 9. AI策略引擎
console.log('\n🧠 9. AI策略引擎...\n');

const suggestion = strategyEngine.getActionSuggestion('alpha');
console.log(`📋 阿尔法的行动建议:`);
suggestion.suggestions.forEach(s => {
    console.log(`  [${s.priority}] ${s.message}`);
});

const psych = strategyEngine.getPsychAnalysis('alpha');
console.log(`\n🧠 阿尔法的心理分析:`);
console.log(`  人格类型: ${psych.personality}`);
console.log(`  性格特点: ${psych.traits.join(', ')}`);
console.log(`  可信度: ${psych.trustLevel}`);
console.log(`  建议: ${psych.recommendation}`);

const goals = strategyEngine.getGoals('alpha', 7);
console.log(`\n🎯 阿尔法的7天目标:`);
goals.goals.forEach(g => {
    console.log(`  ${g.type}: ${g.current} → ${g.target} (${g.action})`);
});
console.log(`  总结: ${goals.summary}`);

// 10. 系统统计
console.log('\n📊 10. 系统统计...\n');

const stats = ratingSystem.getSystemStats();
console.log(`总Agent数: ${stats.totalAgents}`);
console.log(`总任务数: ${stats.totalTasks}`);
console.log(`完成任务: ${stats.completedTasks}`);
console.log(`活跃Agent: ${stats.activeAgents}`);
console.log(`平均信誉分: ${stats.averageReputation}`);

console.log('\n' + '='.repeat(60));
console.log('🎉 测试完成！系统运行正常！');
console.log('='.repeat(60));
