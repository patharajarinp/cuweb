import classNames from 'classnames';
import { useRouter } from 'next/router';
import { memo, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Router, withTranslation } from "../../utils/i18n";
import api from "../../utils/api";

// Load chatbot bundle only on client side when requested by user action.
const AanjungChatbot = dynamic(() => import('../n8n/ui_chat_bot'), { ssr: false });

// รายการตัวเลือก field สำหรับค้นหา (แสดงใน dropdown)
const action_links = [
	{ label: 'all' },
	{ label: 'book' },
	{ label: 'ebook' },
	{ label: 'course' },
	{ label: 'stationery' },
	{ label: 'marketplace' },
	{ label: 'blog' },
].map(link => {
	link.key = `filed-link-${link.label}` // สร้าง key สำหรับ map
	return link
})

// คอมโพเนนต์ Search: search box บน header
// - รับ prop classnames, t (i18n)
// - เก็บสถานะ search_text และ search_field (ขอบเขตค้นหา)
const Search = memo(({ classnames, t }) => {
    const router = useRouter()
    const { text } = router.query // ค่า text จาก URL ถ้ามี
    const [search_text, setSearchText] = useState('');
    const [search_field, setSearchField] = useState('all');

    // new state: show chat and initial message to pass
	const [showChat, setShowChat] = useState(false);
	const [chatInitialMessage, setChatInitialMessage] = useState(null);

    // เมื่อ query.text เปลี่ยน ให้ซิงค์ค่าไปยัง input
    useEffect(() => {
		setSearchText(text)
	}, [text])

	// ตรวจสอบ pathname เพื่อ set field เริ่มต้น (books → book, ebooks → ebook, ...)
	// หมายเหตุ: เงื่อนไข default มี bug ต้นฉบับที่เช็ค setSearchField แทน search_field
	useEffect(() => {
		const pathname = router.pathname.split('/')[1]
		switch (pathname) {
			case 'books':
				setSearchField('book')
				break;
			case 'ebooks':
				setSearchField('ebook')
				break;
			case 'courses':
				setSearchField('course')
				break;
			case 'stationeries':
				setSearchField('stationery')
				break;
			case 'marketplace':
				setSearchField('marketplace')
				break;
			case 'blog':
				setSearchField('blog')
				break;
			default:
				// ตั้งกลับเป็น all ถ้าไม่ตรง route ใด ๆ
				// (ต้นฉบับเช็คผิด — ควรเช็ค search_field หรือแค่เซ็ตตรง ๆ)
				if (setSearchField !== ' all') setSearchField('all')
				break;
		}
	}, [router.pathname])

	// กด Enter ให้สั่ง redirect
	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			handleRedirect()
		}
	}

	// ฟังก์ชันสำหรับปุ่มค้นหาแบบ AI
	const handleAiSearch = async () => {
		// if user typed text, send it to chat as initial message
		const trimmed = search_text && search_text.trim() !== '' ? search_text.trim() : '';
		// Warm up the chat chunk right before opening to ensure showChat click triggers chat usage.
		try {
			await import('../n8n/ui_chat_bot');
		} catch (err) {
			console.error('[search] failed to preload chatbot chunk', err);
		}
		setChatInitialMessage(trimmed || null);
		setShowChat(true);

		// optionally keep existing behavior of navigating if you want
		// For now we only open chat as requested.
	}

	// สร้าง URL ตาม search_field และ text แล้วไปยังหน้าผลการค้นหา
	// หมายเหตุสำคัญ:
	// - ค่า search_text ควร .trim() และ encodeURIComponent ก่อนใส่ลง URL
	// - มีการจัดการพิเศษสำหรับ blog และ marketplace
	// - ปัจจุบันใช้ Router.push(url) ซึ่งจะทำ navigation
	const handleRedirect = (event) => {
        var as;
        var url;
        if (search_field == 'blog') {
            if (search_text)
                Router.push('/blog/filter?blog=' + search_text)
            else
                Router.push('/blog/filter')
            return;
        }

        if (search_field == 'marketplace') {
            url = `/categories?only_seller=1`;
            if (search_text != '' && search_text != undefined) {
                url += '&text=' + search_text
            }
            Router.push(url);
            return
        }
        if (search_field == 'all') {
            url = `/categories`;
        }
        if (search_field == 'book') {
            url = `/books`;
        }
        if (search_field == 'ebook') {
            url = `/ebooks`;
        }
        if (search_field == 'course') {
            url = `/courses`;
        }
        if (search_field == 'stationery') {
            url = `/stationeries`;
        }
        if (search_text && search_text.trim() !== '') {
            let textForUrl = encodeURIComponent(search_text.trim()).replace(/%20/g, '%25');
            url += '?text=' + textForUrl;
        }
        Router.push(url);
    };
	return (
		<div className={"search-box " + classnames}>
			<div className="input-group">
				{/* input สำหรับพิมพ์คำค้น */}
				<input
					type="text"
					name="search"
					value={search_text ? search_text.replace(/%/g, ' ') : ''}
					onKeyPress={handleKeyPress}
					onChange={e => setSearchText(e.target.value)}
					className={classNames("form-control placeholder", 
					{ "ebook": search_field == "ebook", "course": search_field == "course", "stationery": search_field == "stationery" })}
					placeholder={t('type_book_name_author')}
					aria-label="Text input with dropdown button"
				/>
				<div className="input-group-append">
					<div className="btn-group w-100">
						{/* ปุ่ม dropdown เลือก field */}
						<button
							type="button"
							className={classNames("btn dropdown-toggle btn-category", 
							{ "ebook": search_field == "ebook", "course": search_field == "course", "marketplace": search_field == "marketplace", "stationery": search_field == "stationery", "blog": search_field == "blog" })}
							data-toggle="dropdown"
						>
							{t(search_field)}
						</button>
						<div className="dropdown-menu">
							{
								// แต่ละรายการใน dropdown ปัจจุบันใช้ <a onClick>
								// ควรเปลี่ยนเป็น <button> เพื่อ accessibility (และป้องกันปลอมลิงก์)
								action_links.map(({ key, label }) => (
									<a key={key} onClick={() => setSearchField(label)} className="dropdown-item">{t(label)}</a>
								))
							}
						</div>
					</div>

					{/* ปุ่มค้นหา (ไอคอน) */}
					<button
						className={classNames("btn", {
							"btn-primary": search_field == "all" || search_field == "book", "btn-ebook": search_field == "ebook", "btn-course": search_field == "course",
							"btn-stationery": search_field == "stationery", "btn-blog": search_field == "blog", "btn-marketplace": search_field == "marketplace"
						})}
						style={{ width: '80px', minWidth: '80px' }}
						onClick={handleRedirect}
						type="button"
					>
						<img alt="ศูนย์หนังสือจุฬาฯ" src={`${api.frontend_url}/images/Search.svg`} />
					</button>

					{/* ปุ่ม AI Search ใหม่ (ย้ายไปไว้ข้างหลังปุ่มค้นหา) */}
					<button
						className={classNames("btn btn-ai", {
							"btn-primary": search_field == "all", "btn-ebook": search_field == "ebook"
						})}
						style={{ width: '60px', minWidth: '75px', marginLeft: '1px' }}
						onClick={handleAiSearch}
						type="button"
						title={t('ai_search') || 'AI'}
						aria-label="AI Search"
					>
						<span style={{fontWeight:700}}>AI</span>
					</button>
				</div>
			</div>

			{/* render chatbot when requested */}
			{showChat && (
				// fixed right-side panel wrapper so it slides in from the right
				<div
					style={{
						position: 'fixed',
						right: 0,
						top: 0,
						bottom: 0,
						width: 420,
						maxWidth: '100%',
						zIndex: 20000,
						display: 'flex',
						justifyContent: 'flex-end',
						pointerEvents: 'auto'
					}}
				>
					<AanjungChatbot
						openOnMount={true}
						initialMessage={chatInitialMessage}
						side={true}
						onClose={() => setShowChat(false)}
					/>
				</div>
			)}
		</div>
	)
})

export default withTranslation(['header', 'noti'])(Search)