export async function connectToN8N(data, onChunk, { timeoutMs = 60000 } = {}) {
    console.log('[connectToN8N] start', { timeoutMs, dataSummary: (data && data.message) ? data.message.slice(0,50) : undefined });
    const controller = new AbortController();
    const id = setTimeout(() => {
        console.warn('[connectToN8N] abort by timeout', timeoutMs);
        controller.abort();
    }, timeoutMs);

    try {
        const response = await fetch('/api/chat_ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            signal: controller.signal
        });

        clearTimeout(id);
        console.log('[connectToN8N] response status', response.status);

        const contentType = response.headers.get('content-type') || '';
        let payload;

        if (contentType.includes('application/json')) {
            payload = await response.json();
        } else {
            const txt = await response.text();
            payload = { reply: txt };
        }

        if (!response.ok) {
            const e = new Error(
                (payload && (payload.error || payload.details || payload.message)) ||
                `Server error: ${response.status}`
            );
            e.status = response.status;
            e.payload = payload;
            throw e;
        }

        // normalize payload text for caller
        if (payload && typeof payload === 'object' && !payload.reply) {
            payload.reply = payload.text || payload.message || payload.output || payload.answer || '';
        }

        if (onChunk) onChunk(payload);
        return payload;
    } catch (err) {
        clearTimeout(id);
        console.error("[connectToN8N] error:", err);
        throw err; 
    }
}