/**
 * Motor de anuncios — se carga una sola vez por página desde `AdEngine.astro`.
 *
 * Qué resuelve:
 *  1. `atOptions` es una variable global compartida: dos banners en la misma
 *     página se pisan. Cada banner se pinta dentro de un iframe `srcdoc` con su
 *     propio `window`, así que pueden convivir todos los formatos.
 *  2. El `document.write` del proveedor arrasaría el documento si se ejecuta
 *     después del load. Dentro del iframe escribe en su propio documento.
 *  3. Carga diferida: sólo se pide el anuncio cuando está a punto de entrar en
 *     pantalla, salvo los marcados como `eager` (above the fold).
 *  4. Formato según viewport: se elige uno u otro, nunca se cargan los dos.
 */
import {
  AD_BANNER_HOST,
  AD_LAZY_MARGIN,
  AD_MOBILE_QUERY,
  AD_NATIVE_KEY,
  AD_NATIVE_SRC,
  AD_UNITS,
  adHeight,
  type AdSlotName,
  type AdUnit,
  type AdUnitName,
} from './ads';

const ANCHOR_ID = 'cf-ad-anchor';
const ANCHOR_KEY = 'cf-ad-anchor';

/** El native usa un id de contenedor fijo: sólo puede haber uno por página */
let nativeUsed = false;

function isMobile(): boolean {
  return window.matchMedia(AD_MOBILE_QUERY).matches;
}

function unitFor(el: HTMLElement): AdSlotName {
  const desktop = (el.dataset.ad ?? 'none') as AdSlotName;
  const mobile = (el.dataset.adMobile ?? desktop) as AdSlotName;
  return isMobile() ? mobile : desktop;
}

/**
 * El cierre de etiqueta de script no puede aparecer literal en este archivo:
 * el motor se sirve como módulo inline y el parser HTML cortaría el bloque justo
 * ahí. Se arma en ejecución para que ningún minificador lo vuelva a juntar.
 */
const SCRIPT_END = ['<', '/script>'].join('');
const SCRIPT_OPEN = ['<', 'script>'].join('');

/**
 * Documento aislado del iframe: cada anuncio tiene su propio `atOptions`.
 * El `invoke.js` va como etiqueta del HTML —no inyectada después— para que su
 * `document.write` se ejecute durante el parseo y no borre el documento.
 */
function bannerDoc(unit: AdUnit): string {
  const options = JSON.stringify({
    key: unit.key,
    format: 'iframe',
    height: unit.height,
    width: unit.width,
    params: {},
  });
  return (
    '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">' +
    '<base target="_blank">' +
    '<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style>' +
    '</head><body>' +
    `${SCRIPT_OPEN}atOptions=${options};${SCRIPT_END}` +
    `<script src="${AD_BANNER_HOST}/${unit.key}/invoke.js">${SCRIPT_END}` +
    '</body></html>'
  );
}

function renderBanner(box: HTMLElement, name: AdUnitName): void {
  const unit = AD_UNITS[name];
  const frame = document.createElement('iframe');
  frame.title = 'Publicidad';
  frame.width = String(unit.width);
  frame.height = String(unit.height);
  frame.setAttribute('scrolling', 'no');
  frame.setAttribute('frameborder', '0');
  frame.setAttribute('marginwidth', '0');
  frame.setAttribute('marginheight', '0');
  frame.setAttribute('loading', 'lazy');
  frame.style.cssText = `display:block;border:0;width:${unit.width}px;height:${unit.height}px;max-width:100%;`;
  frame.srcdoc = bannerDoc(unit);
  box.appendChild(frame);
}

function renderNative(box: HTMLElement): void {
  if (nativeUsed) {
    box.closest('.ad-unit')?.remove();
    return;
  }
  nativeUsed = true;
  const container = document.createElement('div');
  container.id = `container-${AD_NATIVE_KEY}`;
  box.appendChild(container);
  const script = document.createElement('script');
  script.async = true;
  script.setAttribute('data-cfasync', 'false');
  script.src = AD_NATIVE_SRC;
  box.appendChild(script);
}

function render(el: HTMLElement): void {
  if (el.dataset.adDone !== undefined) return;
  el.dataset.adDone = '';
  const name = unitFor(el);
  if (name === 'none') {
    el.remove();
    return;
  }
  const box = el.querySelector<HTMLElement>('.ad-unit__box');
  if (!box) return;
  if (name === 'native') renderNative(box);
  else renderBanner(box, name);
}

let observer: IntersectionObserver | null = null;
if ('IntersectionObserver' in window) {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer?.unobserve(entry.target);
        render(entry.target as HTMLElement);
      }
    },
    { rootMargin: AD_LAZY_MARGIN },
  );
}

function activate(el: HTMLElement): void {
  if (el.dataset.adDone !== undefined) return;
  if (el.dataset.adEager !== undefined || !observer) render(el);
  else observer.observe(el);
}

/** Crea un hueco con el mismo marcado que `AdSlot.astro` */
function buildSlot(desktop: AdSlotName, mobile: AdSlotName, margin: string): HTMLElement {
  const el = document.createElement('div');
  el.className = 'ad-unit';
  el.dataset.ad = desktop;
  el.dataset.adMobile = mobile;
  el.style.cssText = `--ad-h-d:${adHeight(desktop)}px;--ad-h-m:${adHeight(mobile)}px;margin:${margin} auto;`;
  const label = document.createElement('span');
  label.className = 'ad-unit__label';
  label.textContent = 'Publicidad';
  const box = document.createElement('div');
  box.className = 'ad-unit__box';
  el.append(label, box);
  return el;
}

/**
 * Anuncio dentro del texto: se inserta antes del enésimo `<h2>` del contenedor
 * indicado, de modo que cae entre dos secciones y nunca parte un párrafo.
 * Si el contenedor o el encabezado no existen, no se inserta nada.
 */
function injectInContent(config: HTMLElement): void {
  const selector = config.dataset.adTarget;
  const target = selector ? document.querySelector<HTMLElement>(selector) : null;
  config.remove();
  if (!target) return;

  const headings = target.querySelectorAll('h2');
  const index = Number(config.dataset.adAfter ?? '1');
  const anchorEl = headings[index];
  if (!anchorEl?.parentNode) return;

  const slot = buildSlot(
    (config.dataset.ad ?? 'rectangle') as AdSlotName,
    (config.dataset.adMobile ?? 'rectangle') as AdSlotName,
    config.dataset.adGap ?? '32px',
  );
  anchorEl.parentNode.insertBefore(slot, anchorEl);
  activate(slot);
}

/** Barra inferior fija: recordamos el cierre durante la sesión */
function setupAnchor(): void {
  const anchor = document.getElementById(ANCHOR_ID);
  if (!anchor) return;

  let dismissed = false;
  try {
    dismissed = sessionStorage.getItem(ANCHOR_KEY) === 'off';
  } catch {
    /* modo privado: se muestra igualmente */
  }
  if (dismissed) {
    anchor.remove();
    return;
  }

  document.body.classList.add('has-ad-anchor');
  anchor.querySelector('.ad-anchor__close')?.addEventListener('click', () => {
    anchor.remove();
    document.body.classList.remove('has-ad-anchor');
    try {
      sessionStorage.setItem(ANCHOR_KEY, 'off');
    } catch {
      /* nada que recordar */
    }
  });
}

function start(): void {
  setupAnchor();
  document.querySelectorAll<HTMLElement>('[data-ad-inject]').forEach(injectInContent);
  document.querySelectorAll<HTMLElement>('.ad-unit').forEach(activate);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}
