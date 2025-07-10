import { useState, useEffect } from "react";

export default function ApiStatus() {
    const [apiStatus, setApiStatus] = useState('checking');

    const checkApiStatus = async () => {
        try {
            setApiStatus('checking');
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch('https://api.imgflip.com/get_memes', {
                signal: controller.signal,
                method: 'HEAD' // Use HEAD to minimize data usage
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                setApiStatus('online');
            } else {
                setApiStatus('offline');
            }
        } catch (error) {
            console.error('API status check failed:', error);
            setApiStatus('offline');
        }
    };

    useEffect(() => {
        // Initial check
        checkApiStatus();
        
        // Check every 30 seconds
        const interval = setInterval(checkApiStatus, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const getStatusInfo = () => {
        switch (apiStatus) {
            case 'online':
                return {
                    text: 'Imgflip API Online',
                    dotClass: 'status-dot-online',
                    statusClass: 'api-status-online'
                };
            case 'offline':
                return {
                    text: 'Imgflip API Offline',
                    dotClass: 'status-dot-offline',
                    statusClass: 'api-status-offline'
                };
            case 'checking':
                return {
                    text: 'Checking API...',
                    dotClass: 'status-dot-checking',
                    statusClass: 'api-status-checking'
                };
            default:
                return {
                    text: 'API Status Unknown',
                    dotClass: 'status-dot-unknown',
                    statusClass: 'api-status-unknown'
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div className="api-status-container">
            <div className={`api-status ${statusInfo.statusClass}`}>
                <div className={`status-dot ${statusInfo.dotClass}`}></div>
                <span className="status-text">{statusInfo.text}</span>
            </div>
        </div>
    );
} 