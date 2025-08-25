/**
 * Climate Seal 简化访客统计工具
 * 功能：记录访问人数和地理位置
 */

(function() {
    'use strict';
    
    // 配置
    const CONFIG = {
        apiEndpoint: 'http://localhost:3001/simple-track',
        debug: true
    };
    
    // 获取用户唯一标识
    function getUserId() {
        let userId = localStorage.getItem('cs_visitor_id');
        if (!userId) {
            userId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('cs_visitor_id', userId);
        }
        return userId;
    }
    
    // 获取访客信息
    async function getVisitorInfo() {
        try {
            // 获取IP地理位置信息
            const geoResponse = await fetch('https://ipapi.co/json/');
            const geoData = await geoResponse.json();
            
            return {
                userId: getUserId(),
                timestamp: new Date().toISOString(),
                url: window.location.href,
                title: document.title,
                referrer: document.referrer,
                // 地理位置信息
                country: geoData.country_name || 'Unknown',
                countryCode: geoData.country_code || 'XX',
                region: geoData.region || 'Unknown',
                city: geoData.city || 'Unknown',
                timezone: geoData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                // 设备信息
                userAgent: navigator.userAgent,
                language: navigator.language,
                screenResolution: `${screen.width}x${screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                // 访问标记
                isNewVisitor: !localStorage.getItem('cs_visited'),
                visitCount: getVisitCount() + 1
            };
        } catch (error) {
            console.warn('无法获取地理位置信息:', error);
            return {
                userId: getUserId(),
                timestamp: new Date().toISOString(),
                url: window.location.href,
                title: document.title,
                referrer: document.referrer,
                country: 'Unknown',
                countryCode: 'XX',
                region: 'Unknown',
                city: 'Unknown',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                userAgent: navigator.userAgent,
                language: navigator.language,
                screenResolution: `${screen.width}x${screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                isNewVisitor: !localStorage.getItem('cs_visited'),
                visitCount: getVisitCount() + 1
            };
        }
    }
    
    // 获取访问次数
    function getVisitCount() {
        return parseInt(localStorage.getItem('cs_visit_count') || '0');
    }
    
    // 发送访客数据
    async function trackVisitor() {
        try {
            const visitorInfo = await getVisitorInfo();
            
            const response = await fetch(CONFIG.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(visitorInfo)
            });
            
            if (response.ok) {
                // 标记已访问
                localStorage.setItem('cs_visited', 'true');
                localStorage.setItem('cs_visit_count', visitorInfo.visitCount.toString());
                
                if (CONFIG.debug) {
                    console.log('✅ 访客信息已记录:', {
                        userId: visitorInfo.userId,
                        country: visitorInfo.country,
                        city: visitorInfo.city,
                        isNew: visitorInfo.isNewVisitor
                    });
                }
            }
        } catch (error) {
            console.warn('❌ 访客统计失败:', error);
        }
    }
    
    // 初始化
    function init() {
        // 页面加载完成后记录访客
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', trackVisitor);
        } else {
            trackVisitor();
        }
        
        console.log('🚀 Climate Seal 访客统计已启动');
    }
    
    // 暴露给全局
    window.ClimateSimpleAnalytics = {
        trackVisitor: trackVisitor,
        getUserId: getUserId
    };
    
    // 启动
    init();
    
})();