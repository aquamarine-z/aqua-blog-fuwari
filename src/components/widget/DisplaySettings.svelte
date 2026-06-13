<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { getDefaultHue, getHue, setHue } from "@utils/setting-utils";

export let lang: string = "en";

let hue = getHue();
const defaultHue = getDefaultHue();

const colorPalettes = [
    { hue: 0, key: I18nKey.colorFire },
    { hue: 180, key: I18nKey.colorOcean },
    { hue: 250, key: I18nKey.colorLavender },
    { hue: 300, key: I18nKey.colorMagenta },
    { hue: 340, key: I18nKey.colorRose },
];

function selectHue(h: number) {
	hue = h;
	setHue(h);
}

$: if (hue || hue === 0) {
	setHue(hue);
}
</script>

<div id="display-setting" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4">
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            {i18n(I18nKey.themeColor, lang)}
        </div>
    </div>
    <div class="flex flex-col gap-2 w-full mt-4">
        {#each colorPalettes as palette}
            <button 
                class="flex items-center w-full px-3 py-2 rounded-lg transition-all hover:bg-black/5 dark:hover:bg-white/5 {hue === palette.hue ? 'bg-black/10 dark:bg-white/10' : ''}"
                on:click={() => selectHue(palette.hue)}
            >
                <div class="w-5 h-5 rounded-full mr-3 shadow-sm border border-black/10 dark:border-white/10"
                     style={`background-color: oklch(0.70 0.14 ${palette.hue})`}
                ></div>
                <span class="text-neutral-700 dark:text-neutral-300 font-medium text-sm">
                    {i18n(palette.key, lang)}
                </span>
                {#if hue === palette.hue}
                    <Icon icon="material-symbols:check-circle-rounded" class="ml-auto text-[var(--primary)] text-lg"></Icon>
                {/if}
            </button>
        {/each}
    </div>
</div>

<style lang="stylus">
</style>

