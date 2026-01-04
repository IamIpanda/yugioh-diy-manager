export type TrieNode = {
	children: Map<string, TrieNode>;
	value?: string;
};

export function build_trie(plain_ofurus: string) {
	let ofurus: Record<string, string> = {}
	for (let line of plain_ofurus.split("\n")) {
		let index = line.indexOf(":")
		if (index >= 0)
			ofurus[line.substring(0, index).trim()] = line.substring(index + 1).trim()
	}
		
	const root: TrieNode = { children: new Map() };
	for (const [key, val] of Object.entries(ofurus)) {
		if (!key) continue;
		let node = root;
		const chars = Array.from(key);
		for (const ch of chars) {
			let nxt = node.children.get(ch);
			if (!nxt) {
				nxt = { children: new Map() };
				node.children.set(ch, nxt);
			}
			node = nxt;
		}
		node.value = val;
	}
	return root
}

export function ofuru(str: string, trie: TrieNode) {
    if (!str) return str;
	if (!trie) return str;

	const chars = Array.from(str);
	const out: string[] = [];

	for (let i = 0; i < chars.length;) {
		if (chars[i] === '[') {
			let j = i + 1;
			while (j < chars.length && chars[j] !== ']') j++;
			if (j >= chars.length) {
				out.push(chars.slice(i).join(''));
				break;
			}
			out.push(chars.slice(i, j + 1).join(''));
			i = j + 1;
			continue;
		}
		if (chars[i] === '{') {
			let j = i + 1;
			while (j < chars.length && chars[j] !== '}') j++;
			if (j >= chars.length) {
				out.push(chars.slice(i).join(''));
				break;
			}
			out.push(chars.slice(i, j + 1).join(''));
			i = j + 1;
			continue;
		}
        let node = trie;
		let j = i;
		let lastVal: string | undefined = undefined;
		let lastLen = 0;

		while (j < chars.length) {
			const ch = chars[j];
			const nxt = node.children.get(ch);
			if (!nxt) break;
			node = nxt;
			if (node.value !== undefined) {
				lastVal = node.value;
				lastLen = j - i + 1;
			}
			j++;
		}

		if (lastVal !== undefined) {
			out.push(lastVal);
			i += lastLen;
		} else {
			out.push(chars[i]);
			i += 1;
		}
	}

	return out.join('');
}

