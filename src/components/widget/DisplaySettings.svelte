<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { getDefaultHue, getHue, setHue } from "@utils/setting-utils";
import { siteConfig } from "../../config";

export let lang = "en";

let hue = getHue();
let displayHue = hue;
const defaultHue = getDefaultHue();

const configHues = siteConfig.themeColor.colors || [0, 180, 250, 300, 340];

let localizedNames = i18n(I18nKey.themeColorNames, lang) as unknown as string[];
if (
	!Array.isArray(localizedNames) ||
	localizedNames.length !== configHues.length
) {
	localizedNames = i18n(
		I18nKey.themeColorNames,
		siteConfig.lang,
	) as unknown as string[];
}
if (
	!Array.isArray(localizedNames) ||
	localizedNames.length !== configHues.length
) {
	localizedNames = configHues.map((_, i) => `Color ${i + 1}`);
}

const colorPalettes = configHues.map((h, i) => ({
	hue: h,
	name: localizedNames[i],
}));

function selectHue(h: number) {
	hue = h;
	displayHue = h;
	setHue(h);
}

let timeout: any;
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
                    {palette.name}
                </span>
                {#if hue === palette.hue}
                    <Icon icon="material-symbols:check-circle-rounded" class="ml-auto text-[var(--primary)] text-lg"></Icon>
                {/if}
            </button>
        {/each}
        {#if siteConfig.themeColor.customHue !== false}
        <div class="mt-2 flex flex-col gap-2">
            <span class="text-neutral-700 dark:text-neutral-300 font-medium text-sm ml-1" id="hueValue">{i18n(I18nKey.customHue, lang)} ({Math.round(displayHue)})</span>
            <input type="range" min="0" max="360" step="1" bind:value={displayHue} 
                on:input={(e) => {
                    const r = document.querySelector(":root") as HTMLElement;
                    if (r) r.style.setProperty("--hue", e.currentTarget.value);
                }} 
                on:change={(e) => {
                    hue = parseInt(e.currentTarget.value);
                    setHue(hue);
                }} 
                class="color-slider" />
        </div>
        {/if}
    </div>
</div>

<style lang="stylus">
.color-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 1.75rem;
  border-radius: 0.5rem;
  background: linear-gradient(to right, oklch(0.70 0.14 0), oklch(0.70 0.14 60), oklch(0.70 0.14 120), oklch(0.70 0.14 180), oklch(0.70 0.14 240), oklch(0.70 0.14 300), oklch(0.70 0.14 360));
  outline: none;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
}
.color-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0.6rem;
  height: 1.5rem;
  border-radius: 0.2rem;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.15);
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
.color-slider::-moz-range-thumb {
  width: 0.6rem;
  height: 1.5rem;
  border-radius: 0.2rem;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.15);
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
</style>

