<script>
import { onDestroy, onMount, tick } from "svelte";
import { siteConfig } from "../../config";
import { stripBasePath, url as withBaseUrl } from "../../utils/url-utils";

export let categories = [];
export let lang = siteConfig.lang;
export let currentUrl = "";
export let listenForUrlUpdates = true;
export let isRoot = true;

let activeUrl = currentUrl;

// Process categories when lang changes
$: {
	const mainLang = siteConfig.lang;

	const langsPattern = (
		siteConfig.languages || [siteConfig.lang, "en", "ja", "ko"]
	)
		.filter((l) => l !== mainLang)
		.join("|");
	const regex = new RegExp(`^\\/(${langsPattern})(\\/|$)`);
}

function getInternalUrl(value) {
	if (!value) return "";
	const mainLang = siteConfig.lang;
	if (lang && lang !== mainLang && value.startsWith("/")) {
		const langsPattern = (
			siteConfig.languages || [siteConfig.lang, "en", "ja", "ko"]
		)
			.filter((l) => l !== mainLang)
			.join("|");
		const regex = new RegExp(`^\\/(${langsPattern})(\\/|$)`);
		if (!value.match(regex)) {
			return `/${lang}${value}`;
		}
	}
	return value;
}

function getUrl(value) {
	const internalUrl = getInternalUrl(value);
	return internalUrl ? withBaseUrl(internalUrl) : "";
}

function isNodeActive(node, url = activeUrl) {
	if (node.type === "file") {
		let url1 = getInternalUrl(node.url) || "";
		let url2 = stripBasePath(url || "");
		if (url1.endsWith("/")) url1 = url1.slice(0, -1);
		if (url2.endsWith("/")) url2 = url2.slice(0, -1);
		// sometimes URL decoding is needed
		url1 = decodeURI(url1);
		url2 = decodeURI(url2);
		return url1 === url2 && url1 !== "";
	}
	if (node.type === "folder") {
		let isActive = false;
		if (node.url) {
			let url1 = getInternalUrl(node.url) || "";
			let url2 = stripBasePath(url || "");
			if (url1.endsWith("/")) url1 = url1.slice(0, -1);
			if (url2.endsWith("/")) url2 = url2.slice(0, -1);
			url1 = decodeURI(url1);
			url2 = decodeURI(url2);
			isActive = url1 === url2 && url1 !== "";
		}
		if (isActive) return true;
		if (node.children) {
			return node.children.some((child) => isNodeActive(child, url));
		}
	}
	return false;
}

function expandActive(nodes, url = activeUrl) {
	let expanded = {};
	for (const node of nodes) {
		if (node.type === "folder" && isNodeActive(node, url)) {
			expanded[node.folderName || node.name] = true;
			if (node.children) {
				const childrenExpanded = expandActive(node.children, url);
				expanded = { ...expanded, ...childrenExpanded };
			}
		}
	}
	return expanded;
}

// Initialize synchronously so it renders correctly on the server (SSR), preventing layout shifts on client!
let expandedCategories = expandActive(categories, activeUrl);

function toggleCategory(node) {
	const key = node.folderName || node.name;
	expandedCategories = {
		...expandedCategories,
		[key]: !expandedCategories[key],
	};
}

let cleanupUrlListener = () => {};

onMount(() => {
	if (!listenForUrlUpdates) return;

	const updateUrl = async (event) => {
		const nextUrl = event.detail?.url;
		if (!nextUrl || nextUrl === activeUrl) return;

		activeUrl = nextUrl;
		expandedCategories = expandActive(categories, nextUrl);

		if (isRoot) {
			await tick();
			document.dispatchEvent(
				new CustomEvent("docs-directory:updated", {
					detail: { url: nextUrl },
				}),
			);
			document.dispatchEvent(
				new CustomEvent("category-tree:updated", {
					detail: { url: nextUrl },
				}),
			);
		}
	};

	document.addEventListener("docs-directory:update-url", updateUrl);
	document.addEventListener("category-tree:update-url", updateUrl);
	cleanupUrlListener = () => {
		document.removeEventListener("docs-directory:update-url", updateUrl);
		document.removeEventListener("category-tree:update-url", updateUrl);
	};
});

onDestroy(() => {
	cleanupUrlListener();
});
</script>

<div class="docs-directory">
    {#each categories as node}
        {#if node.type === 'folder'}
            <div class="docs-node">
                <div
                    class="docs-header"
                    class:expanded={expandedCategories[node.folderName || node.name]}
                    class:active={isNodeActive(node, activeUrl)}
                    title={node.name}
                >
                    <button 
                        class="docs-chevron-btn" 
                        on:click|stopPropagation={() => toggleCategory(node)}
                        aria-label="Toggle"
                    >
                        <span class="docs-chevron" class:rotated={expandedCategories[node.folderName || node.name]}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                    </button>
                    <svelte:element
                        this={node.url ? 'a' : 'button'}
                        href={node.url ? getUrl(node.url) : undefined}
                        class="docs-name-btn"
                        style={node.url ? "text-decoration: none;" : ""}
                        title={node.name}
                        on:click={() => {
                            if (!node.url) toggleCategory(node);
                        }}
                    >
                        <span class="docs-name">{node.name}</span>
                    </svelte:element>
                </div>

                {#if expandedCategories[node.folderName || node.name] && node.children}
                    <div class="docs-children">
                        <svelte:self categories={node.children} lang={lang} currentUrl={activeUrl} listenForUrlUpdates={listenForUrlUpdates} isRoot={false} />
                    </div>
                {/if}
            </div>
        {:else if node.type === 'file'}
            <a
                href={getUrl(node.url)}
                class="docs-leaf"
                class:active={isNodeActive(node, activeUrl)}
                title={node.name}
            >
                <span class="docs-leaf-dot"></span>
                <span class="docs-leaf-title">{node.name}</span>
            </a>
        {/if}
    {/each}
</div>

<style>
    .docs-directory {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }

    .docs-node {
        border-radius: 0.5rem;
        min-width: 0;
    }

    .docs-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.5rem 0.5rem;
        border-radius: 0.5rem;
        border: none;
        background: none;
        cursor: pointer;
        transition: all 0.2s ease;
        color: oklch(0.45 0 0);
        font-size: 0.9rem;
        font-weight: 600;
        text-align: left;
        min-width: 0;
    }

    .docs-chevron-btn {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: inherit;
    }

    .docs-name-btn {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        font: inherit;
        color: inherit;
        flex: 1;
        text-align: left;
        display: flex;
        align-items: center;
        transition: none;
        min-width: 0;
    }

    :global(.dark) .docs-header {
        color: oklch(0.85 0 0);
    }

    .docs-header:hover {
        background: var(--btn-plain-bg-hover);
        color: var(--primary);
        padding-left: 0.75rem;
    }

    .docs-header.expanded {
        color: var(--primary);
    }

    .docs-header.active {
        color: var(--primary);
        font-weight: 700;
    }

    .docs-chevron {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1rem;
        height: 1rem;
        flex-shrink: 0;
        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0.6;
    }

    .docs-chevron.rotated {
        transform: rotate(90deg);
        opacity: 1;
    }

    .docs-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
    }

    .docs-children {
        display: flex;
        flex-direction: column;
        margin-left: 0.75rem;
        padding-left: 0.75rem;
        border-left: 1.5px solid oklch(0.80 0.02 var(--hue));
        margin-top: 2px;
        margin-bottom: 4px;
        animation: slideDown 0.2s ease-out;
        min-width: 0;
    }

    :global(.dark) .docs-children {
        border-left-color: oklch(0.35 0.02 var(--hue));
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .docs-leaf {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.35rem 0.5rem;
        border-radius: 0.375rem;
        text-decoration: none;
        color: oklch(0.55 0 0);
        font-size: 0.8rem;
        line-height: 1.3;
        transition: all 0.15s ease;
        min-width: 0;
    }

    :global(.dark) .docs-leaf {
        color: oklch(0.70 0 0);
    }

    .docs-leaf:hover {
        background: var(--btn-plain-bg-hover);
        color: var(--primary);
        padding-left: 0.75rem;
    }

    .docs-leaf.active {
        background: var(--btn-regular-bg);
        color: var(--primary);
        font-weight: bold;
    }

    :global(.dark) .docs-leaf.active {
        background: var(--btn-plain-bg-hover);
    }

    .docs-leaf-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: oklch(0.70 0.05 var(--hue));
        flex-shrink: 0;
        transition: all 0.15s;
    }

    :global(.dark) .docs-leaf-dot {
        background: oklch(0.50 0.05 var(--hue));
    }

    .docs-leaf:hover .docs-leaf-dot, .docs-leaf.active .docs-leaf-dot {
        background: var(--primary);
        transform: scale(1.3);
    }

    .docs-leaf-title {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
