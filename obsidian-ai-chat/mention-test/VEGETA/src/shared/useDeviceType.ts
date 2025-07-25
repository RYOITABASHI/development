import { Platform } from "obsidian";

export type DeviceType = 'mobile' | 'pc';

export interface DeviceInfo {
    type: DeviceType;
    isMobile: boolean;
    isTablet: boolean;
    screenWidth: number;
    screenHeight: number;
    userAgent: string;
}

export function useDeviceType(): DeviceInfo {
    // Primary detection via Obsidian's Platform API
    const obsidianMobile = Platform.isMobile;
    
    // Secondary detection via screen size and user agent
    const screenWidth = window.screen?.width || window.innerWidth;
    const screenHeight = window.screen?.height || window.innerHeight;
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Mobile indicators
    const mobileUserAgents = [
        'android', 'iphone', 'ipad', 'ipod', 'blackberry', 
        'windows phone', 'mobile', 'tablet'
    ];
    const hasMobileUserAgent = mobileUserAgents.some(agent => userAgent.includes(agent));
    
    // Screen size detection (considering fold phones like Z Fold6)
    const smallScreen = screenWidth <= 768;
    const tabletScreen = screenWidth > 768 && screenWidth <= 1024;
    const isTablet = tabletScreen || userAgent.includes('tablet') || userAgent.includes('ipad');
    
    // Combined mobile detection
    const isMobile = obsidianMobile || hasMobileUserAgent || smallScreen;
    
    // Device type determination
    const type: DeviceType = isMobile ? 'mobile' : 'pc';
    
    // Log device detection for debugging
    console.log('Device Detection:', {
        obsidianMobile,
        hasMobileUserAgent,
        smallScreen,
        screenWidth,
        screenHeight,
        userAgent: userAgent.substring(0, 50) + '...',
        finalType: type
    });
    
    return {
        type,
        isMobile,
        isTablet,
        screenWidth,
        screenHeight,
        userAgent
    };
}

export function getOptimalConfig(deviceInfo: DeviceInfo) {
    if (deviceInfo.type === 'mobile') {
        return {
            // Mobile-optimized settings
            maxRetries: 3,
            retryDelay: 500,
            renderDelay: 300,
            useSimplifiedUI: true,
            enableBorderPane: false,
            containerPadding: '0.25rem',
            fontSize: '16px',
            buttonMinSize: '44px'
        };
    } else {
        return {
            // PC-optimized settings
            maxRetries: 5,
            retryDelay: 1000,
            renderDelay: 100,
            useSimplifiedUI: false,
            enableBorderPane: true,
            containerPadding: '0.5rem',
            fontSize: '14px',
            buttonMinSize: '32px'
        };
    }
}