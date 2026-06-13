<script>
    import { onMount } from 'svelte';

    export let categories = [];
    export let lang = 'zh_CN';
    export let currentUrl = '';

    function getUrl(url) {
        if (!url) return '';
        if (lang && lang !== 'zh_CN' && url.startsWith('/') && !url.match(/^\/(en|ja|ko)(\/|$)/)) {
            return `/${lang}${url}`;
        }
        return url;
    }

    function isNodeActive(node) {
        if (node.type === 'file') {
            let url1 = getUrl(node.url) || '';
            let url2 = currentUrl || '';
            if (url1.endsWith('/')) url1 = url1.slice(0, -1);
            if (url2.endsWith('/')) url2 = url2.slice(0, -1);
            // sometimes URL decoding is needed
            url1 = decodeURI(url1);
            url2 = decodeURI(url2);
            return url1 === url2 && url1 !== '';
        } else if (node.type === 'folder') {
            let isActive = false;
            if (node.url) {
                let url1 = getUrl(node.url) || '';
                let url2 = currentUrl || '';
                if (url1.endsWith('/')) url1 = url1.slice(0, -1);
                if (url2.endsWith('/')) url2 = url2.slice(0, -1);
                url1 = decodeURI(url1);
                url2 = decodeURI(url2);
                isActive = (url1 === url2 && url1 !== '');
            }
            if (isActive) return true;
            if (node.children) {
                return node.children.some(child => isNodeActive(child));
            }
        }
        return false;
    }

    function expandActive(nodes) {
        let expanded = {};
        for (const node of nodes) {
            if (node.type === 'folder' && isNodeActive(node)) {
                expanded[node.name] = true;
                if (node.children) {
                    const childrenExpanded = expandActive(node.children);
                    expanded = { ...expanded, ...childrenExpanded };
                }
            }
        }
        return expanded;
    }

    // Initialize synchronously so it renders correctly on the server (SSR), preventing layout shifts on client!
    let expandedCategories = expandActive(categories);

    function toggleCategory(name) {
        expandedCategories = {
            ...expandedCategories,
            [name]: !expandedCategories[name]
        };
    }

    onMount(() => {
        // Any pure client-side only logic goes here
    });
</script>

<div class="category-tree">
    {#each categories as node}
        {#if node.type === 'folder'}
            <div class="category-node">
                <svelte:element
                    this={node.url ? 'a' : 'button'}
                    href={node.url ? getUrl(node.url) : undefined}
                    class="category-header"
                    style={node.url ? "text-decoration: none;" : ""}
                    class:expanded={expandedCategories[node.name]}
                    class:active={isNodeActive(node)}
                    on:click={() => toggleCategory(node.name)}
                >
                    <span class="category-chevron" class:rotated={expandedCategories[node.name]}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                    <span class="category-name">{node.name}</span>
                </svelte:element>

                {#if expandedCategories[node.name] && node.children}
                    <div class="category-children">
                        <svelte:self categories={node.children} lang={lang} currentUrl={currentUrl} />
                    </div>
                {/if}
            </div>
        {:else if node.type === 'file'}
            <a
                href={getUrl(node.url)}
                class="category-leaf"
                class:active={isNodeActive(node)}
                title={node.name}
            >
                <span class="leaf-dot"></span>
                <span class="leaf-title">{node.name}</span>
            </a>
        {/if}
    {/each}
</div>

<style>
    .category-tree {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .category-node {
        border-radius: 0.5rem;
    }

    .category-header {
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
        color: var(--text-color, rgb(64, 64, 64));
        font-size: 0.9rem;
        font-weight: 600;
        text-align: left;
    }

    :global(.dark) .category-header {
        color: rgb(212, 212, 212);
    }

    .category-header:hover {
        background: var(--btn-plain-bg-hover);
        color: var(--primary);
        padding-left: 0.75rem;
    }

    .category-header.expanded {
        color: var(--primary);
    }

    .category-header.active {
        color: var(--primary);
        font-weight: 700;
    }

    .category-chevron {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1rem;
        height: 1rem;
        flex-shrink: 0;
        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0.6;
    }

    .category-chevron.rotated {
        transform: rotate(90deg);
        opacity: 1;
    }

    .category-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .category-children {
        display: flex;
        flex-direction: column;
        margin-left: 0.75rem;
        padding-left: 0.75rem;
        border-left: 1.5px solid oklch(0.80 0.02 var(--hue));
        margin-top: 2px;
        margin-bottom: 4px;
        animation: slideDown 0.2s ease-out;
    }

    :global(.dark) .category-children {
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

    .category-leaf {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.35rem 0.5rem;
        border-radius: 0.375rem;
        text-decoration: none;
        color: rgb(115, 115, 115);
        font-size: 0.8rem;
        line-height: 1.3;
        transition: all 0.15s ease;
    }

    :global(.dark) .category-leaf {
        color: rgb(163, 163, 163);
    }

    .category-leaf:hover {
        background: var(--btn-plain-bg-hover);
        color: var(--primary);
        padding-left: 0.75rem;
    }

    .category-leaf.active {
        background: var(--btn-regular-bg);
        color: var(--primary);
        font-weight: bold;
    }

    :global(.dark) .category-leaf.active {
        background: var(--btn-plain-bg-hover);
    }

    .leaf-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: oklch(0.70 0.05 var(--hue));
        flex-shrink: 0;
        transition: all 0.15s;
    }

    :global(.dark) .leaf-dot {
        background: oklch(0.50 0.05 var(--hue));
    }

    .category-leaf:hover .leaf-dot, .category-leaf.active .leaf-dot {
        background: var(--primary);
        transform: scale(1.3);
    }

    .leaf-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
