const isClient = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export function getLocal(key, defaultValue = null) {
	if (!isClient) return defaultValue;
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : defaultValue;
	} catch (err) {
		console.error("getLocal error:", err);
		return defaultValue;
	}
}

export function setLocal(key, value) {
	if (!isClient) return;
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch (err) {
		console.error("setLocal error:", err);
	}
}

export function removeLocal(key) {
	if (!isClient) return;
	try {
		window.localStorage.removeItem(key);
	} catch (err) {
		console.error("removeLocal error:", err);
	}
}

export default { getLocal, setLocal, removeLocal };
