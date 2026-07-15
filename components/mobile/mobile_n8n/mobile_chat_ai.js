import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connectToN8N } from '../../n8n/connect_n8n';

const WELCOME_TEXT = 'สวัสดีค่ะ มีอะไรให้ผู้ช่วย AI ช่วยแนะนำไหมคะ';
const MobileChatAI = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const [input, setInput] = useState('');
	const [isSending, setIsSending] = useState(false);
	const [messages, setMessages] = useState([{ id: 1, type: 'bot', text: WELCOME_TEXT }]);
	const [activeCat, setActiveCat] = useState(0);
	const [isStreaming, setIsStreaming] = useState(false);
	const bodyRef = useRef(null);
	const listRef = useRef(null);
	const textareaRef = useRef(null);
	const sessionId = useMemo(() => 'mobile-' + Math.random().toString(36).slice(2, 11), []);

	// Mount detection
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Listen for open event from navbar
	useEffect(() => {
		const handleOpenFromNavbar = () => {
			setIsOpen(true);
		};

		if (typeof window !== 'undefined') {
			window.addEventListener('open-mobile-ai-chat', handleOpenFromNavbar);
		}

		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('open-mobile-ai-chat', handleOpenFromNavbar);
			}
		};
	}, []);

	// Prevent body scroll when chat is open
	useEffect(() => {
		if (!isMounted) return;

		if (isOpen) {
			bodyRef.current = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
		} else if (bodyRef.current !== null) {
			document.body.style.overflow = bodyRef.current;
		}

		return () => {
			if (bodyRef.current !== null) {
				document.body.style.overflow = bodyRef.current;
			}
		};
	}, [isOpen, isMounted]);

	// Auto-scroll to bottom on new messages
	useEffect(() => {
		if (!listRef.current) return;
		listRef.current.scrollTop = listRef.current.scrollHeight;
	}, [messages, isOpen]);

	// Auto-resize textarea
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			const scrollHeight = textareaRef.current.scrollHeight;
			const viewportHeight =
				typeof window !== 'undefined' && window.visualViewport
					? window.visualViewport.height
					: window.innerHeight;
			const maxHeight = viewportHeight * 0.26; // keep input usable when keyboard is open
			textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
		}
	}, [input]);

	// Keep a CSS viewport unit synced with the live viewport (useful on mobile keyboard open)
	useEffect(() => {
		if (typeof window === 'undefined') return;

		const setViewportUnit = () => {
			const liveHeight = window.visualViewport?.height || window.innerHeight;
			document.documentElement.style.setProperty('--mchat-vh', `${liveHeight * 0.01}px`);
		};

		setViewportUnit();
		window.addEventListener('resize', setViewportUnit);
		window.visualViewport?.addEventListener('resize', setViewportUnit);

		return () => {
			window.removeEventListener('resize', setViewportUnit);
			window.visualViewport?.removeEventListener('resize', setViewportUnit);
		};
	}, []);

	const appendMessage = (type, text, extra = {}) => {
		const id = Date.now() + Math.random();
		setMessages((prev) => [...prev, { id, type, text, ...extra }]);
		return id;
	};

	const updateMessageById = (id, patch) => {
		setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
	};

	const handleSend = async (overrideText) => {
		const text = (typeof overrideText === 'string' ? overrideText : input).trim();
		if (!text || isSending) return;

		if (typeof overrideText !== 'string') setInput('');
		appendMessage('user', text);
		setIsSending(true);
		setIsStreaming(true);

		const typingId = appendMessage('typing', '...');
		let botId = null;
		let receivedFirstChunk = false;
		let accumulated = '';

		try {
			const result = await connectToN8N({ message: text, sessionId }, (chunk) => {
				let chunkText = '';
				if (typeof chunk === 'string') chunkText = chunk;
				else if (chunk && typeof chunk === 'object') chunkText = String(chunk.delta ?? chunk.text ?? chunk.reply ?? '');

				if (!chunkText) return;

				if (!receivedFirstChunk) {
					receivedFirstChunk = true;
					accumulated = chunkText;
					setMessages((prev) => prev.filter((m) => m.id !== typingId));
					botId = appendMessage('bot', accumulated);
				} else if (botId) {
					accumulated += chunkText;
					updateMessageById(botId, { text: accumulated });
				}
			});

			setMessages((prev) => prev.filter((m) => m.id !== typingId));

			const finalText =
				typeof result === 'string'
					? result
					: (result?.reply || result?.text || result?.message || 'ไม่สามารถติดต่อระบบได้ในขณะนี้');

			if (receivedFirstChunk && botId) updateMessageById(botId, { text: finalText });
			else appendMessage('bot', finalText);
		} catch {
			setMessages((prev) => prev.filter((m) => m.id !== typingId));
			appendMessage('bot', 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
		} finally {
			setIsSending(false);
			setIsStreaming(false);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const parseProductCards = (text) => {
		if (!text) return null;
		// ตรวจว่ามี pattern [PRODUCT] หรือ JSON array ของสินค้า
		try {
			const parsed = JSON.parse(text);
			if (Array.isArray(parsed) && parsed[0]?.title) return parsed;
		} catch {}
		return null;
	};

	const renderBotContent = (text) => {
		if (!text) return null;
		if (typeof window === 'undefined') return text;

		// ลองแปลงเป็น product cards ก่อน
		const products = parseProductCards(text);
		if (products) {
			return (
				<div className="mchat-product-list">
					{products.map((p, i) => (
						<div key={i} className="mchat-product-card">
							<div className="mchat-product-thumb" style={{ background: p.color || '#8B1A2E' }}>
								{p.image
									? <img src={p.image} alt={p.title} />
									: <span className="mchat-product-code">{p.code || 'BOOK'}</span>
								}
							</div>
							<div className="mchat-product-info">
								<p className="mchat-product-title">{p.title}</p>
								{p.author && <p className="mchat-product-author">{p.author}</p>}
								<div className="mchat-product-price-row">
									<span className="mchat-product-price">฿ {p.price}</span>
									{p.original && <span className="mchat-product-original">฿ {p.original}</span>}
								</div>
							</div>
						</div>
					))}
				</div>
			);
		}

		// fallback: render HTML เหมือนเดิม
		try {
			const parser = new DOMParser();
			const doc = parser.parseFromString(String(text), 'text/html');
			const nodes = Array.from(doc.body.childNodes);
			return nodes.map((node, idx) => {
				if (node.nodeType === Node.TEXT_NODE) return <span key={idx}>{node.textContent}</span>;
				if (node.nodeName === 'BR') return <br key={idx} />;
				if (node.nodeName === 'A') {
					const href = node.getAttribute('href') || '#';
					return <a key={idx} href={href} target="_blank" rel="noopener noreferrer">{node.textContent || href}</a>;
				}
				if (node.nodeName === 'IMG') {
					const src = node.getAttribute('src');
					const alt = node.getAttribute('alt') || 'image';
					return src ? <img key={idx} src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: 8, marginTop: 8 }} /> : null;
				}
				return <span key={idx}>{node.textContent}</span>;
			});
		} catch { return text; }
	};

	const formatTime = (timestamp) => {
		const date = new Date(timestamp);
		return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
	};

	if (!isMounted) return null;

	return (
		<>
			<div className={`mchat-ai-overlay ${isOpen ? 'show' : ''}`} onClick={() => setIsOpen(false)} />

			<section className={`mchat-ai-panel ${isOpen ? 'show' : ''}`} aria-hidden={!isOpen} role="dialog" aria-modal="true" aria-label="แชทผู้ช่วย AI">

				{/* ── Header ── */}
				<header className="mchat-ai-header">
					<div className="mchat-drag-handle" onClick={() => setIsOpen(false)} />

					<div className="mchat-top-row">
						<div className="mchat-logo">
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
								<path d="M4 19V6a2 2 0 012-2h12a2 2 0 012 2v13" stroke="#2C1A0E" strokeWidth="2" strokeLinecap="round"/>
								<path d="M4 19a2 2 0 002 2h12a2 2 0 002-2" stroke="#2C1A0E" strokeWidth="2"/>
								<path d="M9 8h6M9 12h4" stroke="#2C1A0E" strokeWidth="1.8" strokeLinecap="round"/>
							</svg>
						</div>

						<div className="mchat-title-group">
							<p className="mchat-title">ศูนย์หนังสือจุฬาฯ</p>
							<p className="mchat-subtitle">Chulalongkorn University Bookstore</p>
						</div>
					</div>
				</header>

				{/* ── Messages ── */}
				<div className="mchat-messages" ref={listRef}>
					<div className="mchat-divider"><span>วันนี้</span></div>

					{messages.map((msg) => (
						<div key={msg.id} className={`mchat-row ${msg.type === 'typing' ? 'bot' : msg.type}`}>
							{(msg.type === 'bot' || msg.type === 'typing') && (
								<div className="mchat-avatar">
									<svg width="15" height="15" viewBox="0 0 24 24" fill="none">
										<path d="M4 19V6a2 2 0 012-2h12a2 2 0 012 2v13" stroke="#2C1A0E" strokeWidth="2" strokeLinecap="round"/>
										<path d="M4 19a2 2 0 002 2h12a2 2 0 002-2" stroke="#2C1A0E" strokeWidth="2"/>
									</svg>
								</div>
							)}
							<div className="mchat-bubble-col">
								<div className={`mchat-bubble ${msg.type === 'typing' ? 'typing' : msg.type}`}>
									{msg.type === 'typing' ? (
										<div className="mchat-dots"><span/><span/><span/></div>
									) : msg.type === 'bot' ? (
										renderBotContent(msg.text)
									) : (
										msg.text
									)}
								</div>
								{msg.type !== 'typing' && (
									<div className={`mchat-ts ${msg.type}`}>{formatTime(msg.id)}</div>
								)}
							</div>
						</div>
					))}
				</div>

				{/* ── Input area ── */}
				<div className="mchat-input-area">
					<div className="mchat-input-row">
						<textarea
							ref={textareaRef}
							rows={1}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="ค้นหาหนังสือ หรือถามได้เลย..."
							className="mchat-input"
							disabled={isSending}
							autoComplete="off" autoCorrect="off" autoCapitalize="off"
						/>
						<button className="mchat-send-btn" onClick={() => handleSend()} disabled={isSending || !input.trim()} type="button" aria-label="ส่ง">
							{isSending ? (
								<svg className="mchat-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none">
									<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
									<path fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7V2z"/>
								</svg>
							) : (
								<svg width="18" height="18" viewBox="0 0 16 16" fill="none">
									<path d="M14 2L7 9M14 2L9.5 14L7 9L2 6.5L14 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							)}
						</button>
					</div>
				</div>

			</section>
		</>
	);
};

export default MobileChatAI;