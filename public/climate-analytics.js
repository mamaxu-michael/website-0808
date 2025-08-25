/**
 * Climate Seal 网站访问统计工具 - 客户端追踪脚本
 * 版本: 2.0
 * 功能: 完整的用户行为追踪和数据收集
 */

(function() {
    'use strict';
    
    // 配置 - 可以被外部配置覆盖
    const CONFIG = Object.assign({
        apiEndpoint: 'http://localhost:3001/track', // 默认本地测试端点
        batchSize: 10,        // 批量发送事件数量
        heartbeatInterval: 30000,  // 心跳间隔(毫秒)
        sessionTimeout: 30 * 60 * 1000,  // 会话超时(30分钟)
        debug: true          // 调试模式
    }, window.CLIMATE_ANALYTICS_CONFIG || {});
    
    // 全局追踪对象
    window.ClimateAnalytics = {
        version: '2.0',
        sessionId: generateSessionId(),
        userId: getUserId(),
        startTime: Date.now(),
        pageStartTime: Date.now(),
        events: [],
        metrics: {
            pageViews: 0,
            maxScrollDepth: 0,
            totalClicks: 0,
            formSubmissions: 0,
            timeSpent: 0
        },
        isActive: true
    };
    
    /**
     * 生成会话ID
     */
    function generateSessionId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `cs_${timestamp}_${random}`;
    }
    
    /**
     * 获取或创建用户ID (持久化)
     */
    function getUserId() {
        let userId = localStorage.getItem('cs_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('cs_user_id', userId);
        }
        return userId;
    }
    
    /**
     * 获取设备和浏览器信息
     */
    function getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            screenResolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            colorDepth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            online: navigator.onLine
        };
    }
    
    /**
     * 获取页面信息
     */
    function getPageInfo() {
        return {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            path: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash,
            domain: window.location.hostname
        };
    }
    
    /**
     * 记录事件
     */
    function trackEvent(eventType, data = {}) {
        const event = {
            eventId: generateEventId(),
            sessionId: ClimateAnalytics.sessionId,
            userId: ClimateAnalytics.userId,
            eventType: eventType,
            timestamp: new Date().toISOString(),
            data: data,
            page: getPageInfo(),
            device: eventType === 'page_view' ? getDeviceInfo() : undefined
        };
        
        ClimateAnalytics.events.push(event);
        
        if (CONFIG.debug) {
            console.log('📊 Climate Analytics Event:', event);
        }
        
        // 批量发送或立即发送重要事件
        if (shouldSendImmediately(eventType) || ClimateAnalytics.events.length >= CONFIG.batchSize) {
            sendEvents();
        }
    }
    
    /**
     * 生成事件ID
     */
    function generateEventId() {
        return Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }
    
    /**
     * 判断是否需要立即发送事件
     */
    function shouldSendImmediately(eventType) {
        return ['page_view', 'form_submit', 'page_leave', 'conversion'].includes(eventType);
    }
    
    /**
     * 发送事件到服务器
     */
    async function sendEvents() {
        if (ClimateAnalytics.events.length === 0) return;
        
        const eventsToSend = [...ClimateAnalytics.events];
        ClimateAnalytics.events = [];
        
        try {
            const response = await fetch(CONFIG.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    events: eventsToSend,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            if (CONFIG.debug) {
                console.log('✅ Events sent successfully:', eventsToSend.length);
            }
        } catch (error) {
            // 发送失败，重新加入队列
            ClimateAnalytics.events.unshift(...eventsToSend);
            console.warn('❌ Failed to send analytics events:', error);
            
            // 备用本地存储
            saveToLocalStorage(eventsToSend);
        }
    }
    
    /**
     * 备用本地存储
     */
    function saveToLocalStorage(events) {
        try {
            const stored = JSON.parse(localStorage.getItem('cs_analytics_backup') || '[]');
            stored.push(...events);
            // 限制存储大小，只保留最新的100个事件
            if (stored.length > 100) {
                stored.splice(0, stored.length - 100);
            }
            localStorage.setItem('cs_analytics_backup', JSON.stringify(stored));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }
    
    /**
     * 页面浏览追踪
     */
    function trackPageView() {
        ClimateAnalytics.metrics.pageViews++;
        ClimateAnalytics.pageStartTime = Date.now();
        
        // 获取页面主题信息
        const pageTheme = getCurrentPageTheme();
        
        trackEvent('page_view', {
            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
            isFirstVisit: !localStorage.getItem('cs_visited'),
            visitCount: getVisitCount(),
            // 添加主题信息
            theme: pageTheme.theme,
            section: pageTheme.section,
            category: pageTheme.category,
            path: window.location.pathname,
            hash: window.location.hash,
            title: document.title
        });
        
        // 标记已访问
        localStorage.setItem('cs_visited', 'true');
        incrementVisitCount();
        
        // 调试输出
        if (CONFIG.debug) {
            console.log('🎯 Climate Analytics - 页面访问追踪:', {
                theme: pageTheme.theme,
                section: pageTheme.section,
                category: pageTheme.category,
                url: window.location.href
            });
        }
    }
    
    /**
     * 获取访问次数
     */
    function getVisitCount() {
        return parseInt(localStorage.getItem('cs_visit_count') || '0');
    }
    
    /**
     * 增加访问次数
     */
    function incrementVisitCount() {
        const count = getVisitCount() + 1;
        localStorage.setItem('cs_visit_count', count.toString());
    }
    
    /**
     * 识别当前页面主题
     */
    function getCurrentPageTheme() {
        // 1. 优先从URL hash识别主题
        const hash = window.location.hash.replace('#', '') || 'home';
        const themeMapping = {
            'home': { theme: 'home', section: 'home-hero', category: 'landing' },
            'scenarios-value': { theme: 'scenarios-value', section: 'scenarios-overview', category: 'product' },
            'products': { theme: 'products', section: 'what-we-do', category: 'product' },
            'comparison': { theme: 'comparison', section: 'comparison-overview', category: 'product' },
            'value-for-user': { theme: 'value-for-user', section: 'value-overview', category: 'value' },
            'pricing': { theme: 'pricing', section: 'pricing-overview', category: 'conversion' },
            'about': { theme: 'about', section: 'about-main', category: 'info' },
            'contact': { theme: 'contact', section: 'contact-form', category: 'conversion' }
        };
        
        if (themeMapping[hash]) {
            return themeMapping[hash];
        }
        
        // 2. 从当前可见的页面元素的data-theme属性识别
        const themeElement = document.querySelector(`#${hash}[data-theme], [data-theme="${hash}"]`);
        if (themeElement) {
            return {
                theme: themeElement.getAttribute('data-theme'),
                section: themeElement.getAttribute('data-section') || 'unknown',
                category: themeElement.getAttribute('data-category') || 'other'
            };
        }
        
        // 3. fallback: 从页面标题识别
        const title = document.title.toLowerCase();
        if (title.includes('climate seal')) {
            return { theme: 'home', section: 'home-hero', category: 'landing' };
        }
        
        // 4. 默认值
        return { theme: 'home', section: 'home-hero', category: 'landing' };
    }

    /**
     * 滚动深度追踪
     */
    function trackScrollDepth() {
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > ClimateAnalytics.metrics.maxScrollDepth) {
            ClimateAnalytics.metrics.maxScrollDepth = scrollPercent;
            
            // 记录关键滚动里程碑
            if ([25, 50, 75, 90, 100].includes(scrollPercent)) {
                trackEvent('scroll_milestone', {
                    depth: scrollPercent,
                    totalScrollTime: Date.now() - ClimateAnalytics.pageStartTime
                });
            }
        }
    }
    
    /**
     * 点击追踪
     */
    function trackClick(event) {
        const target = event.target.closest('a, button, [data-track], [data-cta], [data-section]');
        if (!target) return;
        
        ClimateAnalytics.metrics.totalClicks++;
        
        // 获取当前页面主题
        const pageTheme = getCurrentPageTheme();
        
        const clickData = {
            elementType: target.tagName.toLowerCase(),
            text: target.textContent.trim().substring(0, 100),
            href: target.href || null,
            className: target.className,
            id: target.id || null,
            coordinates: { x: event.clientX, y: event.clientY },
            // 添加主题信息
            theme: pageTheme.theme,
            section: pageTheme.section,
            category: pageTheme.category,
            // 特殊追踪属性
            cta: target.getAttribute('data-cta') || null,
            sectionData: target.getAttribute('data-section') || null,
            formData: target.getAttribute('data-form') || null
        };
        
        // CTA点击专门追踪
        if (target.getAttribute('data-cta')) {
            clickData.category = 'cta';
            trackEvent('cta_click', clickData);
            if (CONFIG.debug) {
                console.log('🎯 CTA点击追踪:', {
                    cta: clickData.cta,
                    theme: clickData.theme,
                    text: clickData.text
                });
            }
        }
        // 转化事件检测
        else if (isConversionClick(target)) {
            clickData.category = 'conversion';
            trackEvent('conversion', clickData);
        } else {
            trackEvent('click', clickData);
        }
    }
    
    /**
     * 判断是否为转化点击
     */
    function isConversionClick(element) {
        const conversionSelectors = [
            '[href*=\"contact\"]',
            '[href*=\"quote\"]',
            '[href*=\"demo\"]',
            'button[type=\"submit\"]',
            '.cta-button',
            '.contact-button',
            '.try-now',
            '.get-started'
        ];
        
        return conversionSelectors.some(selector => element.matches(selector)) ||
               /contact|quote|demo|try|start|buy|purchase/i.test(element.textContent);
    }
    
    /**
     * 表单提交追踪
     */
    function trackFormSubmit(event) {
        const form = event.target;
        ClimateAnalytics.metrics.formSubmissions++;
        
        // 获取当前页面主题
        const pageTheme = getCurrentPageTheme();
        
        const formData = new FormData(form);
        const fields = {};
        let hasEmail = false;
        let hasPhone = false;
        let fieldCount = 0;
        
        for (let [key, value] of formData.entries()) {
            if (value && value.trim()) {
                fields[key] = 'filled';
                fieldCount++;
            } else {
                fields[key] = 'empty';
            }
            if (key.toLowerCase().includes('email')) hasEmail = true;
            if (key.toLowerCase().includes('phone')) hasPhone = true;
        }
        
        // 表单类型判断
        const formType = form.getAttribute('data-form') || 
                        (hasEmail && hasPhone ? 'contact' : 'generic');
        
        trackEvent('form_submit', {
            formId: form.id || 'unknown',
            formType: formType,
            action: form.action,
            method: form.method,
            fields: Object.keys(fields),
            fieldCount: fieldCount,
            hasEmail: hasEmail,
            hasPhone: hasPhone,
            timeToSubmit: Date.now() - ClimateAnalytics.pageStartTime,
            // 添加主题信息
            theme: pageTheme.theme,
            section: pageTheme.section,
            category: pageTheme.category
        });
        
        // 重要转化事件
        const conversionValue = (formType === 'contact' || formType === 'contact-form') ? 'high' : 
                               (hasEmail || hasPhone ? 'medium' : 'low');
        
        trackEvent('conversion', {
            type: 'form_submission',
            formId: form.id,
            formType: formType,
            theme: pageTheme.theme,
            section: pageTheme.section,
            value: conversionValue
        });
        
        if (CONFIG.debug) {
            console.log('📝 表单提交追踪:', {
                formType: formType,
                theme: pageTheme.theme,
                fieldCount: fieldCount,
                conversionValue: conversionValue
            });
        }
    }
    
    /**
     * 页面停留时间追踪
     */
    function trackTimeSpent() {
        const timeSpent = Date.now() - ClimateAnalytics.pageStartTime;
        ClimateAnalytics.metrics.timeSpent = timeSpent;
        
        return Math.round(timeSpent / 1000); // 返回秒数
    }
    
    /**
     * 页面离开追踪
     */
    function trackPageLeave() {
        const timeSpent = trackTimeSpent();
        
        trackEvent('page_leave', {
            timeSpent: timeSpent,
            maxScrollDepth: ClimateAnalytics.metrics.maxScrollDepth,
            totalClicks: ClimateAnalytics.metrics.totalClicks,
            formSubmissions: ClimateAnalytics.metrics.formSubmissions,
            engaged: timeSpent > 30 && ClimateAnalytics.metrics.maxScrollDepth > 25
        });
        
        // 立即发送所有待处理事件
        sendEvents();
    }
    
    /**
     * 心跳追踪
     */
    function trackHeartbeat() {
        if (!ClimateAnalytics.isActive) return;
        
        // 获取当前页面主题
        const pageTheme = getCurrentPageTheme();
        
        trackEvent('heartbeat', {
            timeSpent: trackTimeSpent(),
            scrollDepth: ClimateAnalytics.metrics.maxScrollDepth,
            clicks: ClimateAnalytics.metrics.totalClicks,
            active: document.hasFocus(),
            // 添加主题信息
            theme: pageTheme.theme,
            section: pageTheme.section,
            category: pageTheme.category
        });
        
        if (CONFIG.debug) {
            console.log('💓 心跳追踪:', {
                theme: pageTheme.theme,
                timeSpent: Math.round(trackTimeSpent() / 1000) + 's',
                scrollDepth: ClimateAnalytics.metrics.maxScrollDepth + '%',
                clicks: ClimateAnalytics.metrics.totalClicks
            });
        }
    }
    
    /**
     * 检测用户活跃状态
     */
    function setupActivityDetection() {
        let lastActivity = Date.now();
        
        function updateActivity() {
            lastActivity = Date.now();
            ClimateAnalytics.isActive = true;
        }
        
        // 监听用户活动
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, updateActivity, true);
        });
        
        // 检查非活跃状态
        setInterval(() => {
            ClimateAnalytics.isActive = (Date.now() - lastActivity) < 60000; // 1分钟无活动为非活跃
        }, 10000);
    }
    
    /**
     * 初始化事件监听器
     */
    function initializeEventListeners() {
        // 页面加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', trackPageView);
        } else {
            trackPageView();
        }
        
        // 滚动追踪
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(trackScrollDepth, 100);
        }, { passive: true });
        
        // 点击追踪
        document.addEventListener('click', trackClick, true);
        
        // 表单提交追踪
        document.addEventListener('submit', trackFormSubmit);
        
        // 页面离开追踪
        window.addEventListener('beforeunload', trackPageLeave);
        window.addEventListener('pagehide', trackPageLeave);
        
        // Hash 变化追踪（单页面应用导航）
        window.addEventListener('hashchange', () => {
            // 发送当前页面的停留时间
            trackEvent('page_leave', {
                timeSpent: trackTimeSpent(),
                scrollDepth: ClimateAnalytics.metrics.maxScrollDepth
            });
            
            // 重新追踪新页面
            setTimeout(trackPageView, 100); // 延迟一下让DOM更新
        });
        
        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                trackEvent('page_hidden', { timeSpent: trackTimeSpent() });
            } else {
                trackEvent('page_visible', { timestamp: Date.now() });
            }
        });
    }
    
    /**
     * 公开API
     */
    window.ClimateAnalytics.track = trackEvent;
    window.ClimateAnalytics.getMetrics = () => ClimateAnalytics.metrics;
    window.ClimateAnalytics.sendNow = sendEvents;  // 暴露发送函数用于调试
    window.ClimateAnalytics.getData = () => ({
        sessionId: ClimateAnalytics.sessionId,
        userId: ClimateAnalytics.userId,
        metrics: ClimateAnalytics.metrics,
        events: ClimateAnalytics.events // 暴露事件队列
    });
    
    // 调试函数
    if (CONFIG.debug) {
        window.ClimateAnalytics.debug = {
            getEvents: () => ClimateAnalytics.events,
            getCurrentTheme: getCurrentPageTheme,
            forceHeartbeat: trackHeartbeat,
            sendEvents: sendEvents
        };
    }
    
    /**
     * 初始化
     */
    function initialize() {
        initializeEventListeners();
        setupActivityDetection();
        
        // 定期心跳
        setInterval(trackHeartbeat, CONFIG.heartbeatInterval);
        
        // 定期发送事件
        setInterval(sendEvents, 60000); // 每分钟发送一次
        
        console.log('🚀 Climate Seal Analytics v2.0 initialized');
        console.log('📊 Session ID:', ClimateAnalytics.sessionId);
        console.log('👤 User ID:', ClimateAnalytics.userId);
    }
    
    // 启动
    initialize();
    
})();