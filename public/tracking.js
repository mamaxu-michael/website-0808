// Climate Seal 网站追踪代码
(function() {
    'use strict';
    
    // 追踪数据存储
    const trackingData = {
        sessionId: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        startTime: Date.now(),
        events: [],
        pageViews: 0,
        scrollDepth: 0,
        clicks: 0
    };
    
    // 获取访客信息
    function getVisitorInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenSize: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            url: window.location.href,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        };
    }
    
    // 记录事件
    function trackEvent(eventType, data = {}) {
        const event = {
            type: eventType,
            timestamp: Date.now(),
            data: data,
            url: window.location.href
        };
        
        trackingData.events.push(event);
        
        // 发送到服务器（这里模拟）
        console.log('📊 Climate Seal Analytics:', event);
        
        // 发送到本地存储用于演示
        localStorage.setItem('climateSeelAnalytics', JSON.stringify(trackingData));
    }
    
    // 页面加载追踪
    trackEvent('page_view', getVisitorInfo());
    trackingData.pageViews++;
    
    // 滚动深度追踪
    let maxScroll = 0;
    function trackScroll() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
            maxScroll = scrollPercent;
            trackingData.scrollDepth = scrollPercent;
            trackEvent('scroll', { depth: scrollPercent + '%' });
        }
    }
    
    // 点击追踪
    function trackClick(e) {
        const target = e.target.closest('a, button');
        if (!target) return;
        
        trackingData.clicks++;
        
        const clickData = {
            elementType: target.tagName.toLowerCase(),
            text: target.textContent.trim().substring(0, 50),
            href: target.href || null,
            className: target.className,
            id: target.id || null
        };
        
        // 特殊按钮追踪
        if (target.getAttribute('href') === '#contact' || 
            target.textContent.includes('Contact') || 
            target.textContent.includes('联系') ||
            target.textContent.includes('Try Now') ||
            target.textContent.includes('Get Started')) {
            clickData.category = 'conversion';
            clickData.importance = 'high';
        }
        
        trackEvent('click', clickData);
    }
    
    // 表单提交追踪
    function trackFormSubmit(e) {
        const form = e.target;
        const formData = new FormData(form);
        const fields = {};
        
        for (let [key, value] of formData.entries()) {
            // 不记录敏感信息，只记录字段名
            fields[key] = '***';
        }
        
        trackEvent('form_submit', {
            formId: form.id || 'unknown',
            fields: Object.keys(fields),
            fieldCount: Object.keys(fields).length
        });
    }
    
    // 停留时间追踪
    function trackTimeSpent() {
        const timeSpent = Math.round((Date.now() - trackingData.startTime) / 1000);
        trackEvent('time_spent', { 
            seconds: timeSpent,
            minutes: Math.round(timeSpent / 60)
        });
    }
    
    // 页面离开追踪
    function trackPageLeave() {
        trackTimeSpent();
        trackEvent('page_leave', {
            totalScrollDepth: trackingData.scrollDepth,
            totalClicks: trackingData.clicks,
            totalEvents: trackingData.events.length
        });
    }
    
    // 事件监听器
    window.addEventListener('scroll', trackScroll);
    document.addEventListener('click', trackClick);
    document.addEventListener('submit', trackFormSubmit);
    window.addEventListener('beforeunload', trackPageLeave);
    
    // 每30秒记录一次心跳
    setInterval(() => {
        trackEvent('heartbeat', {
            scrollDepth: trackingData.scrollDepth,
            clicks: trackingData.clicks,
            timeSpent: Math.round((Date.now() - trackingData.startTime) / 1000)
        });
    }, 30000);
    
    // 暴露全局函数用于查看数据
    window.getAnalyticsData = function() {
        return JSON.parse(localStorage.getItem('climateSeelAnalytics') || '{}');
    };
    
    window.clearAnalyticsData = function() {
        localStorage.removeItem('climateSeelAnalytics');
        console.log('Analytics data cleared');
    };
    
    console.log('🚀 Climate Seal Analytics initialized');
    console.log('📊 View data: getAnalyticsData()');
    console.log('🗑️ Clear data: clearAnalyticsData()');
    
})();