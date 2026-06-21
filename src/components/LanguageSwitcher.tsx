import {
  createSignal,
  createUniqueId,
  For,
  Show,
  onMount,
  onCleanup,
  type Component,
} from "solid-js";
import { locale, setLocale, LOCALES, t, type Locale } from "../i18n";

/* -------------------------------------------------------------------------- */
/* Flag art — inline SVG (Windows renders flag *emoji* as letter pairs, so     */
/* emoji are unreliable here). clipPath ids are per-instance unique.           */
/* -------------------------------------------------------------------------- */
const UKFlag: Component = () => {
  const id = createUniqueId();
  return (
    <svg viewBox="0 0 60 30" class="block w-full h-full" aria-hidden="true">
      <clipPath id={id}>
        <path d="M0 0v30h60V0z" />
      </clipPath>
      <g clip-path={`url(#${id})`}>
        <path d="M0 0v30h60V0z" fill="#012169" />
        <path d="M0 0 60 30m0-30L0 30" stroke="#fff" stroke-width="6" />
        <path
          d="M0 0 60 30m0-30L0 30"
          stroke="#C8102E"
          stroke-width="4"
        />
        <path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10" />
        <path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6" />
      </g>
    </svg>
  );
};

const VNFlag: Component = () => (
  <svg viewBox="0 0 30 20" class="block w-full h-full" aria-hidden="true">
    <rect width="30" height="20" fill="#DA251D" />
    <path
      fill="#FF0"
      d="M15 4l1.763 5.427h5.706l-4.616 3.354 1.763 5.427L15 14.708l-4.616 3.354 1.763-5.427-4.616-3.354h5.706z"
    />
  </svg>
);

const FLAGS: Record<Locale, Component> = { en: UKFlag, vi: VNFlag };

const Flag: Component<{ code: Locale; class?: string }> = (props) => {
  const Art = FLAGS[props.code];
  return (
    <span
      class={`block overflow-hidden rounded-[3px] ring-1 ring-white/15 ${
        props.class ?? ""
      }`}
    >
      <Art />
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/* Switcher — fixed top-left. Trigger shows only the active flag; the dropdown */
/* lists every locale (flag + label). Closes on outside-click or Escape.       */
/* -------------------------------------------------------------------------- */
const LanguageSwitcher: Component = () => {
  const [open, setOpen] = createSignal(false);
  let root: HTMLDivElement | undefined;

  const onDocClick = (e: MouseEvent) => {
    if (root && !root.contains(e.target as Node)) setOpen(false);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  };

  onMount(() => {
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
  });
  onCleanup(() => {
    document.removeEventListener("click", onDocClick);
    document.removeEventListener("keydown", onKey);
  });

  return (
    <div ref={root} class="fixed top-5 left-5 z-40">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        class="glass-pill grid place-items-center w-11 h-11 rounded-full transition-all duration-300 shadow-lg shadow-black/40 hover:bg-white/10 hover:scale-105 hover:shadow-cyanGlow/20 hover:border-white/20 cursor-pointer"
        aria-label={t().ui.changeLanguage}
        aria-haspopup="listbox"
        aria-expanded={open()}
      >
        <Flag code={locale()} class="w-6 h-4" />
      </button>

      <Show when={open()}>
        <div
          class="absolute top-13 left-0 bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/60 ring-1 ring-white/8 rounded-2xl p-2 flex flex-col gap-1 min-w-[10.5rem] transition-all duration-200 origin-top-left"
          role="listbox"
        >
          <For each={LOCALES}>
            {(l) => (
              <button
                onClick={() => {
                  setLocale(l.code);
                  setOpen(false);
                }}
                class="flex items-center gap-3 px-3 py-2 rounded-xl text-left bg-transparent transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyanGlow/40 cursor-pointer"
                classList={{ "bg-white/15 ring-1 ring-cyanGlow/25": l.code === locale() }}
                role="option"
                aria-selected={l.code === locale()}
              >
                <Flag code={l.code} class="w-6 h-4 shrink-0" />
                <span class="text-sm font-medium text-white/95 tracking-wide">{l.label}</span>
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

export default LanguageSwitcher;
