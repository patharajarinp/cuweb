import React, { useEffect, useState, useRef, useCallback } from 'react';
import { connectToN8N } from './connect_n8n.js';

const SYSTEM_ERROR_ID = 'system-error';

const CHAT_MEMORY = {
    messages: [],
    inputText: '',
    hasInitialized: false,
    sessionId: null,
};


const HINT_CHIPS = ['หนังสือขายดี', 'แนะนำ E-Book', 'พัฒนาตนเอง', 'นิยาย', 'คอสเรียน' , 'สอบเข้า'];

const ChulaBookstoreChatbot = ({
    openOnMount = false,
    initialMessage = null,
    onClose = null,
    side = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => CHAT_MEMORY.messages || []);
    const [message, setMessage] = useState(() => CHAT_MEMORY.inputText || '');
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeCat, setActiveCat] = useState(0);

    const justToggled = useRef(false);
    const msgBoxRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const chatRef = useRef(null);
    const sessionId = useRef(
        CHAT_MEMORY.sessionId || 'user-' + Math.random().toString(36).substr(2, 9)
    );
    const hasInitialized = useRef(
        CHAT_MEMORY.hasInitialized || (CHAT_MEMORY.messages && CHAT_MEMORY.messages.length > 0)
    );
    const isProcessing = useRef(false);
    const initialSentRef = useRef(false);
    const prevIsOpenRef = useRef(isOpen);
    const [systemError, setSystemError] = useState('');

    useEffect(() => { CHAT_MEMORY.sessionId = sessionId.current; }, []);
    useEffect(() => {
        CHAT_MEMORY.messages = messages;
        CHAT_MEMORY.hasInitialized = hasInitialized.current || messages.length > 0;
    }, [messages]);
    useEffect(() => { CHAT_MEMORY.inputText = message; }, [message]);

    const scrollToBottom = useCallback(() => {
        setTimeout(() => {
            try { msgBoxRef.current?.scrollTo({ top: msgBoxRef.current.scrollHeight, behavior: 'smooth' }); } catch (e) {}
        }, 40);
    }, []);

    const addBubble = useCallback((text, type, image = null, options = null) => {
        const bubble = { text: text ?? '', type, image, options, id: Date.now() + Math.random() };
        setMessages(prev => { scrollToBottom(); return [...prev, bubble]; });
    }, [scrollToBottom]);

    useEffect(() => {
        const t = setTimeout(() => setIsVisible(true), 250);
        return () => clearTimeout(t);
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น'); return; }
        const reader = new FileReader();
        reader.onloadend = () => { setSelectedImage(reader.result); inputRef.current?.focus(); };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSendMessage = useCallback(async (overrideText) => {
        const raw = typeof overrideText === 'string' ? overrideText : message;
        const text = (raw || '').trim();

        if (typeof connectToN8N !== 'function') {
            setSystemError('ขออภัย ระบบยังไม่พร้อม กรุณารีเฟรชหน้า');
            return;
        }
        if ((!text && !selectedImage) || isProcessing.current) return;

        isProcessing.current = true;
        setSystemError('');
        addBubble(text, 'user', selectedImage);

        const payload = { message: text, sessionId: sessionId.current };
        if (selectedImage) payload.image = selectedImage;

        if (typeof overrideText !== 'string') {
            setMessage('');
            setSelectedImage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }

        setIsLoading(true);
        const typingId = 'typing-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
        setMessages(prev => { scrollToBottom(); return [...prev, { text: '...', type: 'typing', id: typingId }]; });

        const botBubbleId = 'bot-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
        let receivedFirstChunk = false;
        let accumulated = '';

        try {
            const finalResult = await connectToN8N(payload, (chunk) => {
                let chunkText = '';
                let chunkOptions = null;
                let chunkImage = null;

                if (typeof chunk === 'string') {
                    chunkText = chunk;
                } else if (chunk && typeof chunk === 'object') {
                    chunkText = String(chunk.delta ?? chunk.text ?? chunk.reply ?? '') || '';
                    chunkOptions = chunk.options || chunk.quickReplies || chunk.quick_replies || null;
                    chunkImage = chunk.image || null;
                }

                if (!receivedFirstChunk) {
                    receivedFirstChunk = true;
                    accumulated = chunkText;
                    setMessages(prev => prev.filter(m => m.id !== typingId));
                    setMessages(prev => {
                        scrollToBottom();
                        return [...prev, { text: accumulated, type: 'bot', id: botBubbleId, image: chunkImage, options: chunkOptions }];
                    });
                } else {
                    if (chunkText) {
                        accumulated += chunkText;
                        setMessages(prev => prev.map(m => m.id === botBubbleId ? { ...m, text: accumulated } : m));
                        scrollToBottom();
                    }
                    if (chunkImage) setMessages(prev => prev.map(m => m.id === botBubbleId ? { ...m, image: chunkImage } : m));
                    if (chunkOptions) setMessages(prev => prev.map(m => m.id === botBubbleId ? { ...m, options: chunkOptions } : m));
                }
            });

            setMessages(prev => prev.filter(m => m.type !== 'typing'));

            let finalText = 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ ลองใหม่ภายหลัง';
            if (typeof finalResult === 'object' && finalResult !== null) {
                finalText = finalResult.reply || finalResult.text || finalResult.message || finalResult.output || JSON.stringify(finalResult);
            } else if (typeof finalResult === 'string') {
                finalText = finalResult;
            }
            const finalImage = typeof finalResult === 'object' && finalResult?.image ? finalResult.image : null;
            const finalOptions = typeof finalResult === 'object'
                ? (finalResult.options || finalResult.quickReplies || finalResult.quick_replies || null)
                : null;

            if (receivedFirstChunk) {
                setMessages(prev => prev.map(m => m.id === botBubbleId ? { ...m, text: finalText, image: finalImage, options: finalOptions } : m));
            } else {
                addBubble(finalText, 'bot', finalImage, finalOptions);
            }
        } catch (err) {
            console.error('🚨 Error:', err);
            setMessages(prev => prev.filter(m => m.type !== 'typing'));
            setSystemError('ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsLoading(false);
            isProcessing.current = false;
            setTimeout(() => { if (inputRef.current && isOpen) inputRef.current.focus(); }, 120);
        }
    }, [message, selectedImage, isOpen, addBubble, scrollToBottom]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
    }, [handleSendMessage]);

    const handleQuickReplyClick = useCallback(async (opt) => {
        const value = typeof opt === 'string' ? opt : (opt.value ?? opt.label ?? '');
        if (!value || isProcessing.current) return;

        isProcessing.current = true;
        setSystemError('');
        addBubble(value, 'user');
        const payload = { message: value, sessionId: sessionId.current };
        setIsLoading(true);
        setTimeout(() => addBubble('...', 'typing'), 50);

        try {
            const result = await connectToN8N(payload);
            setMessages(prev => prev.filter(m => m.type !== 'typing'));
            await new Promise(r => setTimeout(r, 50));

            let botMessage = 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ ลองใหม่ภายหลัง';
            if (typeof result === 'object' && result !== null) {
                botMessage = result.reply || result.text || result.message || result.output || JSON.stringify(result);
            } else if (typeof result === 'string') {
                botMessage = result;
            }
            const botOptions = typeof result === 'object'
                ? (result.options || result.quickReplies || result.quick_replies || null)
                : null;

            addBubble(botMessage, 'bot', typeof result === 'object' && result?.image ? result.image : null, botOptions);
        } catch (err) {
            console.error('🚨 QuickReply Error:', err);
            setMessages(prev => prev.filter(m => m.type !== 'typing'));
            await new Promise(r => setTimeout(r, 50));
            setSystemError('ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsLoading(false);
            isProcessing.current = false;
            setTimeout(() => inputRef.current?.focus(), 120);
        }
    }, [addBubble]);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (justToggled.current) return;
            if (chatRef.current && !chatRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && messages.length === 0 && !hasInitialized.current) {
            hasInitialized.current = true;
            setTimeout(() => addBubble('สวัสดีค่ะ! ยินดีต้อนรับสู่ศูนย์หนังสือจุฬาฯ มีอะไรให้ช่วยไหมคะ?', 'bot'), 100);
        }
    }, [isOpen, messages.length, addBubble]);

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
    }, [isOpen]);

    const handleToggle = useCallback(() => {
        justToggled.current = true;
        setIsOpen(prev => { if (!prev) hasInitialized.current = true; return !prev; });
        setTimeout(() => { justToggled.current = false; }, 350);
    }, []);

    const handleClose = useCallback(() => setIsOpen(false), []);

    useEffect(() => {
        if (prevIsOpenRef.current && !isOpen) { try { onClose?.(); } catch (e) {} }
        prevIsOpenRef.current = isOpen;
    }, [isOpen, onClose]);

    useEffect(() => {
        if (openOnMount) { setIsOpen(true); hasInitialized.current = true; }
    }, [openOnMount]);

    useEffect(() => {
        if (!isOpen || !initialMessage || initialSentRef.current) return;
        initialSentRef.current = true;
        setTimeout(() => handleSendMessage(initialMessage), 220);
    }, [isOpen, initialMessage, handleSendMessage]);

    return (
        <div
            id="chula-chatbot-wrapper"
            className={isVisible ? 'fade-in' : 'fade-out'}
            style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.4s cubic-bezier(0.4,0,0.2,1)', zIndex: 12000 }}
        >
            {isOpen && (
                <div ref={chatRef} id="chula-chatbot-box" className={`chula-open ${side ? 'side-panel' : ''}`}>

                    {/* ══ HEADER ══ */}
                    <div className="chula-header chula-header-mobilelike">

                        {/* Top: logo + title + online badge + close */}
                        <div className="header-top-row">
                            <div className="cb-logo-box">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 19V6a2 2 0 012-2h12a2 2 0 012 2v13" stroke="#2C1A0E" strokeWidth="1.8" strokeLinecap="round"/>
                                    <path d="M4 19a2 2 0 002 2h12a2 2 0 002-2" stroke="#2C1A0E" strokeWidth="1.8"/>
                                    <path d="M9 8h6M9 12h4" stroke="#2C1A0E" strokeWidth="1.6" strokeLinecap="round"/>
                                </svg>
                            </div>

                            <div className="header-left header-left-mobilelike">
                                <div className="chula-title-group">
                                    <p className="chula-title-main">ศูนย์หนังสือจุฬาฯ</p>
                                    <p className="chula-title-sub">Chulalongkorn University Bookstore</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ══ MESSAGES ══ */}
                    <div ref={msgBoxRef} id="messages" className="chula-messages">

                        {/* Date divider */}
                        <div className="cb-divider">วันนี้</div>

                        {/* System error */}
                        {systemError && <div className="system-label" key={SYSTEM_ERROR_ID}>{systemError}</div>}

                        {/* Bubbles */}
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`bubble ${msg.type}`}
                                style={{ width: 'auto', maxWidth: 'auto', alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start' }}
                            >
                                {msg.type === 'bot' && (
                                    <img className="avatar bot-avatar" src="/images/head.png" alt="CU Book"/>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                    {msg.image && (
                                        <div style={{ marginBottom: msg.text ? 5 : 0 }}>
                                            <img
                                                src={msg.image}
                                                alt="attachment"
                                                style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8, border: '1px solid rgba(44,26,14,0.12)' }}
                                            />
                                        </div>
                                    )}

                                    {msg.type === 'typing' ? (
                                        <div className="text typing-indicator"><span/><span/><span/></div>
                                    ) : (
                                        <>
                                            {msg.text && (
                                                <div
                                                    className="text"
                                                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere', lineHeight: 1.5 }}
                                                    dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br>') }}
                                                />
                                            )}
                                            {msg.options && msg.type === 'bot' && (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                                                    {msg.options.map((opt, idx) => {
                                                        const label = typeof opt === 'string' ? opt : (opt.label ?? opt.value ?? `Option ${idx + 1}`);
                                                        return (
                                                            <button key={idx} type="button" onClick={() => handleQuickReplyClick(opt)} className="quick-reply-btn">
                                                                {label}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            <div className="cb-ts">
                                                {new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ══ LOADING ROW ══ */}
                    {isLoading && (
                        <div className="chat-loading-row" aria-hidden={!isLoading}>
                            <div className="typing-indicator" aria-hidden="true"><span/><span/><span/></div>
                            <div className="loader" aria-hidden="true"/>
                            <div>กำลังพิมพ์...</div>
                        </div>
                    )}

                    {/* ══ SELECTED IMAGE ══ */}
                    {selectedImage && (
                        <div className="selected-image-row">
                            <div className="selected-image-wrap">
                                <img src={selectedImage} alt="preview" className="selected-image-preview"/>
                                <button onClick={handleRemoveImage} className="selected-image-remove">×</button>
                            </div>
                        </div>
                    )}

                    {/* ══ INPUT ROW ══ */}
                    <div className="chula-input-row">
                        <div className="cb-input-inner">
                            <div className="attach-btn-wrapper">
                                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange}/>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="attach-trigger" title="แนบรูปภาพ">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                                    </svg>
                                </button>
                            </div>

                            <input
                                ref={inputRef}
                                id="msg"
                                type="text"
                                placeholder="ค้นหาหนังสือ หรือถามได้เลย..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                            />

                            <button
                                id="send"
                                type="button"
                                title="ส่ง"
                                onClick={handleSendMessage}
                                disabled={isLoading || (!message.trim() && !selectedImage)}
                                className="send-btn"
                            >
                                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                                    <path d="M14 2L7 9M14 2L9.5 14L7 9L2 6.5L14 2Z" stroke="#F5E8C0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>

                        {/* Hint chips */}
                        <div className="cb-hint-row">
                            {HINT_CHIPS.map((h, i) => (
                                <button key={i} className="cb-hint" onClick={() => handleSendMessage(h)}>{h}</button>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export const AanjungChatbotUI = (props) => <ChulaBookstoreChatbot {...props} />;
export default ChulaBookstoreChatbot;