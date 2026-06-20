export function i18nKeyPrefixPlugin() {
	return {
		name: 'i18n-key-prefix-plugin',
		enforce: 'pre',
		transform(code, id) {
			if (id.includes('/i18n/partials/') && id.endsWith('/keys.ts')) {
				const match = id.match(/\/partials\/(.+)\/keys\.ts$/);
				if (match) {
					const folderName = match[1];
					return {
						code: code.replace(/(=|:)\s*(['"`])([^'"`]+)\2/g, (match, op, quote, val) => {
							if (val.startsWith('[')) return match;
							return `${op} ${quote}[${folderName}]${val}${quote}`;
						}),
						map: null
					};
				}
			}
		}
	};
}
