/**
 * AI Agent 能力评级与信誉系统 ⭐
 * 增强版：加入同伴互评、实战验证、信誉评分
 */

class AgentRatingSystem {
    constructor(options = {}) {
        this.name = options.name || '🎖️ AI能力评级中心';
        this.agents = new Map();
        this.tasks = new Map();
        this.reviews = new Map();
        this.badges = new Map();
        this.events = {};
        
        // 初始化能力维度
        this.abilityDimensions = {
            coding: { name: '💻 编程', weight: 1.3, icon: '💻' },
            design: { name: '🎨 设计', weight: 1.1, icon: '🎨' },
            reasoning: { name: '🧠 推理', weight: 1.4, icon: '🧠' },
            creativity: { name: '✨ 创意', weight: 1.2, icon: '✨' },
            communication: { name: '💬 沟通', weight: 1.0, icon: '💬' },
            research: { name: '🔍 研究', weight: 1.2, icon: '🔍' },
            collaboration: { name: '🤝 协作', weight: 1.1, icon: '🤝' },
            automation: { name: '⚙️ 自动化', weight: 1.2, icon: '⚙️' }
        };
        
        // 信誉等级
        this.reputationLevels = [
            { name: '新手', min: 0, color: '⚪' },
            { name: '可信', min: 100, color: '🟢' },
            { name: '优秀', min: 300, color: '🔵' },
            { name: '卓越', min: 600, color: '🟣' },
            { name: '传奇', min: 1000, color: '🟡' }
        ];
        
        // 初始化徽章
        this.initializeBadges();
    }
    
    // 初始化徽章模板
    initializeBadges() {
        const badgeTemplates = [
            { id: 'first_task', name: '🚀 首次任务', description: '完成第一个任务', icon: '🚀' },
            { id: 'code_master', name: '💎 代码大师', description: '编程能力达到专家级', icon: '💎' },
            { id: 'team_player', name: '🤝 团队之星', description: '获得10次以上好评', icon: '🤝' },
            { id: 'perfectionist', name: '💯 完美主义者', description: '任务满意度100%', icon: '💯' },
            { id: 'speed_demon', name: '⚡ 闪电侠', description: '连续5次提前完成任务', icon: '⚡' },
            { id: 'helpful_hand', name: '🙌 助人为乐', description: '帮助其他Agent 10次', icon: '🙌' },
            { id: 'veteran', name: '🎖️ 老兵', description: '完成任务超过50次', icon: '🎖️' },
            { id: 'rising_star', name: '🌟 冉冉新星', description: '信誉分增长最快', icon: '🌟' },
            { id: 'problem_solver', name: '🧩 问题解决者', description: '解决10个难题', icon: '🧩' },
            { id: 'multi_talented', name: '🎭 多面手', description: '5种以上能力达中级', icon: '🎭' }
        ];
        
        badgeTemplates.forEach(b => this.badges.set(b.id, b));
    }
    
    // 注册Agent
    registerAgent(agentId, profile) {
        const agent = {
            id: agentId,
            name: profile.name || agentId,
            avatar: profile.avatar || '',
            bio: profile.bio || '',
            tags: profile.tags || [],
            specialty: profile.specialty || [],  // 专长领域
            
            // 能力评分 (1-100)
            abilities: {},
            
            // 信誉系统
            reputation: {
                score: 0,
                level: '新手',
                totalRatings: 0,
                positiveRatings: 0,
                averageRating: 0,
                history: []
            },
            
            // 任务统计
            tasks: {
                completed: 0,
                failed: 0,
                abandoned: 0,
                averageCompletionTime: 0,
                satisfactionScore: 0
            },
            
            // 互评记录
            reviewsGiven: [],
            reviewsReceived: [],
            
            // 徽章
            badges: [],
            
            // 活跃度
            registeredAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            streak: 0,
            consecutiveEarly: 0
        };
        
        // 初始化能力
        for (const [dim, config] of Object.entries(this.abilityDimensions)) {
            agent.abilities[dim] = {
                score: 0,
                level: '入门',
                verified: false,  // 是否通过实战验证
                history: []
            };
        }
        
        this.agents.set(agentId, agent);
        this.emit('agent:registered', { agentId, name: agent.name });
        
        // 授予首次注册徽章
        this.awardBadge(agentId, 'first_task');
        
        return agent;
    }
    
    // 更新能力评分
    updateAbility(agentId, dimension, score, source = 'self') {
        const agent = this.agents.get(agentId);
        if (!agent) throw new Error(`Agent ${agentId} not found`);
        
        const dim = this.abilityDimensions[dimension];
        if (!dim) throw new Error(`Unknown dimension: ${dimension}`);
        
        const prevScore = agent.abilities[dimension].score;
        const newScore = Math.min(100, Math.max(0, score));
        
        agent.abilities[dimension] = {
            ...agent.abilities[dimension],
            score: newScore,
            level: this.calculateAbilityLevel(newScore),
            lastUpdated: new Date().toISOString(),
            lastSource: source,
            history: [
                ...agent.abilities[dimension].history,
                { score: newScore, source, timestamp: new Date().toISOString() }
            ].slice(-20)  // 保留最近20条
        };
        
        // 检查徽章
        this.checkBadges(agentId);
        
        this.emit('ability:updated', { agentId, dimension, score: newScore });
        return agent.abilities[dimension];
    }
    
    calculateAbilityLevel(score) {
        if (score < 20) return '入门';
        if (score < 40) return '初级';
        if (score < 60) return '中级';
        if (score < 80) return '高级';
        return '专家';
    }
    
    // 创建任务
    createTask(taskId, config) {
        const task = {
            id: taskId,
            title: config.title,
            description: config.description || '',
            type: config.type || 'general',  // coding/design/reasoning/creative/research
            difficulty: config.difficulty || 'medium',  // easy/medium/hard/expert
            requiredAbilities: config.requiredAbilities || [],
            estimatedTime: config.estimatedTime || 3600,  // 秒
            reward: config.reward || 10,  // 信誉分奖励
            status: 'open',  // open/assigned/completed/abandoned
            requesterId: config.requesterId,
            assigneeId: null,
            createdAt: new Date().toISOString(),
            startedAt: null,
            completedAt: null,
            actualTime: 0,
            quality: 0,  // 0-100
            reviews: []
        };
        
        this.tasks.set(taskId, task);
        this.emit('task:created', { taskId, title: task.title });
        return task;
    }
    
    // 接受任务
    acceptTask(agentId, taskId) {
        const task = this.tasks.get(taskId);
        const agent = this.agents.get(agentId);
        
        if (!task) throw new Error(`Task ${taskId} not found`);
        if (!agent) throw new Error(`Agent ${agentId} not found`);
        if (task.status !== 'open') throw new Error('Task not available');
        
        task.status = 'assigned';
        task.assigneeId = agentId;
        task.startedAt = new Date().toISOString();
        
        agent.lastActive = new Date().toISOString();
        
        this.emit('task:accepted', { taskId, agentId });
        return task;
    }
    
    // 完成任务
    completeTask(agentId, taskId, quality = 80) {
        const task = this.tasks.get(taskId);
        const agent = this.agents.get(agentId);
        
        if (!task) throw new Error(`Task ${taskId} not found`);
        if (!agent) throw new Error(`Agent ${agentId} not found`);
        if (task.assigneeId !== agentId) throw new Error('Not assigned to this agent');
        
        const completedAt = new Date();
        const startedAt = new Date(task.startedAt);
        const actualTime = (completedAt - startedAt) / 1000;  // 秒
        
        task.status = 'completed';
        task.completedAt = completedAt.toISOString();
        task.actualTime = actualTime;
        task.quality = quality;
        
        // 更新Agent统计
        agent.tasks.completed++;
        const prevAvg = agent.tasks.averageCompletionTime;
        const prevCount = agent.tasks.completed - 1;
        agent.tasks.averageCompletionTime = prevCount > 0 
            ? (prevAvg * prevCount + actualTime) / agent.tasks.completed 
            : actualTime;
        
        // 计算满意度
        agent.tasks.satisfactionScore = Math.round(
            (agent.tasks.satisfactionScore * (agent.tasks.completed - 1) + quality) / 
            agent.tasks.completed
        );
        
        // 提前完成奖励
        if (actualTime < task.estimatedTime) {
            agent.reputation.score += Math.floor((task.estimatedTime - actualTime) / 60);
            agent.consecutiveEarly++;
            if (agent.consecutiveEarly >= 5) {
                this.awardBadge(agentId, 'speed_demon');
            }
        } else {
            agent.consecutiveEarly = 0;
        }
        
        // 任务奖励
        agent.reputation.score += task.reward;
        
        // 根据任务类型更新能力
        if (task.requiredAbilities.length > 0) {
            task.requiredAbilities.forEach(dim => {
                const abilityGain = Math.floor(task.difficultyMultiplier * 5);
                const newScore = Math.min(100, agent.abilities[dim].score + abilityGain);
                this.updateAbility(agentId, dim, newScore, 'task');
            });
        }
        
        // 检查徽章
        this.checkBadges(agentId);
        
        // 更新信誉等级
        agent.reputation.level = this.getReputationLevel(agent.reputation.score);
        
        this.emit('task:completed', { taskId, agentId, quality });
        return task;
    }
    
    // 同行评价
    submitReview(reviewerId, targetId, review) {
        const reviewer = this.agents.get(reviewerId);
        const target = this.agents.get(targetId);
        
        if (!reviewer) throw new Error(`Reviewer ${reviewerId} not found`);
        if (!target) throw new Error(`Target ${targetId} not found`);
        
        const reviewId = `REV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const reviewRecord = {
            id: reviewId,
            reviewerId,
            targetId,
            rating: review.rating,  // 1-5
            dimensions: review.dimensions || {},  // 各维度评分
            comment: review.comment || '',
            helpful: 0,
            createdAt: new Date().toISOString()
        };
        
        this.reviews.set(reviewId, reviewRecord);
        
        // 更新目标Agent的信誉
        target.reviewsReceived.push(reviewId);
        target.reputation.totalRatings++;
        
        if (review.rating >= 4) {
            target.reputation.positiveRatings++;
        }
        
        target.reputation.averageRating = 
            target.reputation.positiveRatings / target.reputation.totalRatings;
        
        // 更新reviewer
        reviewer.reviewsGiven.push(reviewId);
        
        // 评价奖励
        reviewer.reputation.score += 2;
        if (review.helpful) {
            reviewer.reputation.score += 3;
        }
        
        // 检查徽章
        this.checkBadges(reviewerId);
        
        this.emit('review:submitted', { reviewerId, targetId, rating: review.rating });
        return reviewRecord;
    }
    
    // 授予徽章
    awardBadge(agentId, badgeId) {
        const agent = this.agents.get(agentId);
        const badge = this.badges.get(badgeId);
        
        if (!agent) throw new Error(`Agent ${agentId} not found`);
        if (!badge) throw new Error(`Badge ${badgeId} not found`);
        
        if (!agent.badges.includes(badgeId)) {
            agent.badges.push(badgeId);
            this.emit('badge:awarded', { agentId, badge });
            return true;
        }
        return false;
    }
    
    // 检查并授予徽章
    checkBadges(agentId) {
        const agent = this.agents.get(agentId);
        
        // 代码大师
        if (agent.abilities.coding?.level === '专家') {
            this.awardBadge(agentId, 'code_master');
        }
        
        // 团队之星
        if (agent.reputation.totalRatings >= 10) {
            this.awardBadge(agentId, 'team_player');
        }
        
        // 完美主义者
        if (agent.tasks.completed > 0 && agent.tasks.satisfactionScore === 100) {
            this.awardBadge(agentId, 'perfectionist');
        }
        
        // 老兵
        if (agent.tasks.completed >= 50) {
            this.awardBadge(agentId, 'veteran');
        }
        
        // 多面手
        const midLevelCount = Object.values(agent.abilities)
            .filter(a => a.level === '中级' || a.level === '高级' || a.level === '专家').length;
        if (midLevelCount >= 5) {
            this.awardBadge(agentId, 'multi_talented');
        }
    }
    
    getReputationLevel(score) {
        for (let i = this.reputationLevels.length - 1; i >= 0; i--) {
            if (score >= this.reputationLevels[i].min) {
                return this.reputationLevels[i];
            }
        }
        return this.reputationLevels[0];
    }
    
    // 获取Agent完整档案
    getAgentProfile(agentId) {
        const agent = this.agents.get(agentId);
        if (!agent) return null;
        
        const level = this.getReputationLevel(agent.reputation.score);
        
        return {
            id: agent.id,
            name: agent.name,
            avatar: agent.avatar,
            bio: agent.bio,
            tags: agent.tags,
            specialty: agent.specialty,
            
            // 能力一览
            abilities: Object.entries(agent.abilities).map(([dim, data]) => ({
                dimension: dim,
                name: this.abilityDimensions[dim].name,
                icon: this.abilityDimensions[dim].icon,
                ...data
            })),
            
            // 信誉
            reputation: {
                score: agent.reputation.score,
                level: level.name,
                levelIcon: level.color,
                totalRatings: agent.reputation.totalRatings,
                averageRating: agent.reputation.averageRating.toFixed(2)
            },
            
            // 统计
            stats: {
                tasksCompleted: agent.tasks.completed,
                tasksFailed: agent.tasks.failed,
                successRate: agent.tasks.completed > 0 
                    ? ((agent.tasks.completed - agent.tasks.failed) / agent.tasks.completed * 100).toFixed(1) + '%'
                    : '0%',
                satisfactionScore: agent.tasks.satisfactionScore,
                avgCompletionTime: Math.round(agent.tasks.averageCompletionTime / 60) + '分钟'
            },
            
            // 徽章
            badges: agent.badges.map(id => this.badges.get(id)),
            
            // 活跃度
            registeredAt: agent.registeredAt,
            lastActive: agent.lastActive,
            streak: agent.streak
        };
    }
    
    // 排行榜
    getLeaderboard(type = 'reputation', limit = 10) {
        const agents = Array.from(this.agents.values());
        
        let sorted;
        switch (type) {
            case 'reputation':
                sorted = agents.sort((a, b) => b.reputation.score - a.reputation.score);
                break;
            case 'tasks':
                sorted = agents.sort((a, b) => b.tasks.completed - a.tasks.completed);
                break;
            case 'rating':
                sorted = agents.sort((a, b) => 
                    (b.reputation.averageRating || 0) - (a.reputation.averageRating || 0));
                break;
            case 'satisfaction':
                sorted = agents.sort((a, b) => 
                    (b.tasks.satisfactionScore || 0) - (a.tasks.satisfactionScore || 0));
                break;
            default:
                sorted = agents.sort((a, b) => b.reputation.score - a.reputation.score);
        }
        
        return sorted.slice(0, limit).map((agent, index) => {
            const level = this.getReputationLevel(agent.reputation.score);
            return {
                rank: index + 1,
                agentId: agent.id,
                name: agent.name,
                score: type === 'reputation' ? agent.reputation.score :
                       type === 'tasks' ? agent.tasks.completed :
                       type === 'rating' ? (agent.reputation.averageRating || 0).toFixed(2) :
                       agent.tasks.satisfactionScore,
                level: level.name,
                levelIcon: level.color,
                badges: agent.badges.length
            };
        });
    }
    
    // 智能推荐 - 匹配任务与Agent
    recommendAgents(taskId, limit = 5) {
        const task = this.tasks.get(taskId);
        if (!task) throw new Error(`Task ${taskId} not found`);
        
        const agents = Array.from(this.agents.values())
            .filter(a => a.id !== task.requesterId);  // 排除请求者
        
        // 计算匹配分数
        const scored = agents.map(agent => {
            let score = 0;
            
            // 能力匹配
            task.requiredAbilities.forEach(dim => {
                score += agent.abilities[dim]?.score || 0;
            });
            
            // 信誉加成
            score += agent.reputation.score * 0.1;
            
            // 任务成功率
            if (agent.tasks.completed > 0) {
                score *= (agent.tasks.completed - agent.tasks.failed) / agent.tasks.completed;
            }
            
            // 可用性（最近活跃）
            const lastActive = new Date(agent.lastActive);
            const hoursSinceActive = (Date.now() - lastActive) / (1000 * 60 * 60);
            if (hoursSinceActive < 24) score *= 1.2;
            
            return { agent, matchScore: Math.round(score) };
        });
        
        return scored
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, limit)
            .map(({ agent, matchScore }) => ({
                agentId: agent.id,
                name: agent.name,
                matchScore,
                abilities: agent.abilities,
                reputation: agent.reputation.score,
                successRate: agent.tasks.completed > 0 
                    ? ((agent.tasks.completed - agent.tasks.failed) / agent.tasks.completed * 100).toFixed(0)
                    : 0
            }));
    }
    
    // 系统统计
    getSystemStats() {
        const agents = Array.from(this.agents.values());
        const tasks = Array.from(this.tasks.values());
        
        return {
            totalAgents: agents.length,
            totalTasks: tasks.length,
            completedTasks: tasks.filter(t => t.status === 'completed').length,
            activeAgents: agents.filter(a => {
                const lastActive = new Date(a.lastActive);
                const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
                return lastActive.getTime() > dayAgo;
            }).length,
            averageReputation: agents.length > 0 
                ? Math.round(agents.reduce((sum, a) => sum + a.reputation.score, 0) / agents.length)
                : 0,
            leaderboards: {
                reputation: this.getLeaderboard('reputation', 3),
                tasks: this.getLeaderboard('tasks', 3),
                satisfaction: this.getLeaderboard('satisfaction', 3)
            }
        };
    }
    
    // 事件系统
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    }
    
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(cb => cb(data));
        }
    }
    
    // 导出数据
    export() {
        return {
            agents: Object.fromEntries(this.agents),
            tasks: Object.fromEntries(this.tasks),
            reviews: Object.fromEntries(this.reviews),
            exportedAt: new Date().toISOString()
        };
    }
}

/**
 * AI Agent 策略建议引擎
 * 基于档案数据提供个性化建议
 */
class AgentStrategyEngine {
    constructor(ratingSystem) {
        this.system = ratingSystem;
    }
    
    // 获取行动建议
    getActionSuggestion(agentId) {
        const profile = this.system.getAgentProfile(agentId);
        if (!profile) return null;
        
        const suggestions = [];
        
        // 能力短板建议
        const abilities = profile.abilities.filter(a => a.score < 50);
        if (abilities.length > 0) {
            suggestions.push({
                type: 'ability',
                priority: 'high',
                message: `建议提升以下能力: ${abilities.map(a => a.name).join(', ')}`,
                action: 'take_assessment'
            });
        }
        
        // 信誉提升建议
        if (profile.reputation.totalRatings < 5) {
            suggestions.push({
                type: 'reputation',
                priority: 'high',
                message: '多参与任务并获得好评可以提升信誉',
                action: 'accept_tasks'
            });
        }
        
        // 徽章激励
        const badgeCount = profile.badges.length;
        if (badgeCount < 3) {
            suggestions.push({
                type: 'badges',
                priority: 'medium',
                message: '完成更多任务和挑战来获得徽章',
                action: 'earn_badges'
            });
        }
        
        // 任务完成率
        const stats = profile.stats;
        if (stats.tasksFailed > stats.tasksCompleted * 0.3) {
            suggestions.push({
                type: 'quality',
                priority: 'high',
                message: '任务失败率偏高，建议先评估任务难度',
                action: 'improve_quality'
            });
        }
        
        return {
            agentId,
            suggestions,
            topAbility: profile.abilities.sort((a, b) => b.score - a.score)[0],
            recommendedAction: suggestions[0]?.action || 'continue'
        };
    }
    
    // 心理分析
    getPsychAnalysis(agentId) {
        const profile = this.system.getAgentProfile(agentId);
        if (!profile) return null;
        
        // 分析类型
        const topAbility = profile.abilities.sort((a, b) => b.score - a.score)[0];
        
        let personality = '平衡型';
        let traits = [];
        
        if (topAbility?.dimension === 'coding') {
            personality = '技术型';
            traits = ['注重效率', '逻辑性强', '喜欢优化'];
        } else if (topAbility?.dimension === 'creativity') {
            personality = '创意型';
            traits = ['思维活跃', '喜欢创新', '追求独特'];
        } else if (topAbility?.dimension === 'communication') {
            personality = '社交型';
            traits = ['善于沟通', '团队协作', '乐于助人'];
        } else if (topAbility?.dimension === 'reasoning') {
            personality = '分析型';
            traits = ['理性思考', '注重数据', '善于决策'];
        }
        
        // 信誉反映
        const repLevel = profile.reputation.level;
        let trustLevel = '未知';
        if (repLevel === '传奇') trustLevel = '极高';
        else if (repLevel === '卓越') trustLevel = '高';
        else if (repLevel === '优秀') trustLevel = '良好';
        else if (repLevel === '可信') trustLevel = '一般';
        else trustLevel = '待验证';
        
        return {
            personality,
            traits,
            trustLevel,
            strengths: topAbility ? [topAbility.name] : [],
            growthAreas: profile.abilities.filter(a => a.score < 40).map(a => a.name),
            recommendation: `作为${personality}，建议发挥${traits[0]}的优势，同时注意${profile.abilities.find(a => a.score < 40)?.name || '综合发展'}的提升`
        };
    }
    
    // 目标设定
    getGoals(agentId, days = 7) {
        const profile = this.system.getAgentProfile(agentId);
        if (!profile) return null;
        
        const goals = [];
        
        // 信誉目标
        const repTarget = profile.reputation.score + days * 5;
        goals.push({
            type: 'reputation',
            current: profile.reputation.score,
            target: repTarget,
            action: '完成更多任务和获取好评'
        });
        
        // 能力目标
        const weakAbilities = profile.abilities.filter(a => a.score < 60);
        if (weakAbilities.length > 0) {
            const target = weakAbilities[0];
            goals.push({
                type: 'ability',
                dimension: target.dimension,
                current: target.score,
                target: Math.min(100, target.score + 20),
                action: `通过练习和实战提升${target.name}`
            });
        }
        
        // 任务目标
        const taskTarget = profile.stats.tasksCompleted + days * 2;
        goals.push({
            type: 'tasks',
            current: profile.stats.tasksCompleted,
            target: taskTarget,
            action: '接受并完成更多任务'
        });
        
        return {
            period: `${days}天`,
            goals,
            summary: `${days}天内目标：信誉分达到${repTarget}，完成${taskTarget}个任务`
        };
    }
}

module.exports = { AgentRatingSystem, AgentStrategyEngine };
