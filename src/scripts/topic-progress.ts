const STORAGE_KEY      = 'platform-progress';
const COMMENTS_KEY     = 'platform-comments';
const ADVANCE_DELAY_MS = 400;

type ProgressState = 'complete' | 'unclear';
type ProgressMap   = Record<string, ProgressState>;
type CommentsMap   = Record<string, string>;

function getProgress(): ProgressMap {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const result: ProgressMap = {};
    for (const [k, v] of Object.entries(raw)) {
      if (v === 'complete' || v === 'unclear') result[k] = v;
      else if (v === true) result[k] = 'complete';
    }
    return result;
  } catch {
    return {};
  }
}

function saveProgress(p: ProgressMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function getComments(): CommentsMap {
  try {
    return JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}') as CommentsMap;
  } catch {
    return {};
  }
}

function saveComment(id: string, text: string) {
  const c = getComments();
  c[id] = text;
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(c));
}

function deleteComment(id: string) {
  const c = getComments();
  if (!(id in c)) return;
  delete c[id];
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(c));
}

function advanceToNext() {
  const nav = document.querySelector('[data-role-nav]');
  if (!nav) return;
  const links = nav.querySelectorAll('a[href]');
  const nextA = links[links.length - 1] as HTMLAnchorElement | undefined;
  const href = nextA?.getAttribute('href');
  if (href) setTimeout(() => { window.location.href = href; }, ADVANCE_DELAY_MS);
}

let _modalEl: HTMLDivElement | null = null;
let _modalOpen = false;
let _infoEl: HTMLButtonElement | null = null;

function getModal(): HTMLDivElement {
  if (_modalEl) return _modalEl;
  const el = document.createElement('div');
  el.id = 'unclear-comment-modal';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'Add a note');
  el.style.display = 'none';
  el.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4';
  el.innerHTML = `
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" data-modal-backdrop></div>
    <div class="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-semibold text-gray-900 dark:text-white">Add a note</span>
        <button data-modal-close class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" aria-label="Cancel">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <textarea
        data-modal-textarea
        rows="3"
        placeholder="What's unclear? (optional)"
        class="w-full text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/40 placeholder-gray-400 dark:placeholder-gray-500"
      ></textarea>
      <div class="flex justify-end gap-2 mt-4">
        <button data-modal-skip class="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Skip
        </button>
        <button data-modal-save class="text-xs font-medium px-3 py-1.5 rounded-full border border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors">
          Save &amp; next
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(el);
  _modalEl = el;
  return el;
}

function getInfoIndicator(anchor: HTMLButtonElement): HTMLButtonElement {
  if (_infoEl) return _infoEl;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'View note');
  btn.style.display = 'none';
  btn.className = 'relative group flex items-center py-1.5 px-2 rounded-full border border-amber-300 dark:border-amber-500/50 text-amber-500 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors';
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg><span data-info-tooltip class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block max-w-[180px] bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg px-2.5 py-1.5 shadow-lg pointer-events-none whitespace-normal text-left leading-snug z-[9998]"></span>`;
  anchor.insertAdjacentElement('afterend', btn);
  _infoEl = btn;
  return btn;
}

// Resolves with:
//   null         → cancelled (×, Escape, backdrop) — do NOT mark unclear
//   ''           → skip clicked — mark unclear, no comment
//   'some text'  → save clicked — mark unclear, save comment
function openUnclearModal(): Promise<string | null> {
  if (_modalOpen) return Promise.resolve(null);
  _modalOpen = true;
  return new Promise(resolve => {
    const modal    = getModal();
    const textarea = modal.querySelector('[data-modal-textarea]') as HTMLTextAreaElement;
    const skipBtn  = modal.querySelector('[data-modal-skip]')     as HTMLButtonElement;
    const saveBtn  = modal.querySelector('[data-modal-save]')     as HTMLButtonElement;
    const closeBtn = modal.querySelector('[data-modal-close]')    as HTMLButtonElement;
    const backdrop = modal.querySelector('[data-modal-backdrop]') as HTMLDivElement;

    textarea.value = '';
    modal.style.display = 'flex';
    textarea.focus();

    function cleanup() {
      _modalOpen = false;
      modal.style.display = 'none';
      skipBtn.removeEventListener('click',    onSkip);
      saveBtn.removeEventListener('click',    onSave);
      closeBtn.removeEventListener('click',   onCancel);
      backdrop.removeEventListener('click',   onCancel);
      document.removeEventListener('keydown', onKeydown);
    }

    function onSkip()   { cleanup(); resolve(''); }
    function onSave()   { cleanup(); resolve(textarea.value.trim()); }
    function onCancel() { cleanup(); resolve(null); }
    function onKeydown(e: KeyboardEvent) { if (e.key === 'Escape') onCancel(); }

    skipBtn.addEventListener('click',    onSkip);
    saveBtn.addEventListener('click',    onSave);
    closeBtn.addEventListener('click',   onCancel);
    backdrop.addEventListener('click',   onCancel);
    document.addEventListener('keydown', onKeydown);
  });
}

function initTopicProgress() {
  const completeBtn   = document.getElementById('complete-btn');
  const completeLabel = document.getElementById('complete-label');
  const unclearBtn    = document.getElementById('unclear-btn');
  const unclearLabel  = document.getElementById('unclear-label');

  if (!completeBtn || !completeLabel || !unclearBtn || !unclearLabel) return;

  const topicId = completeBtn.getAttribute('data-topic-id');
  if (!topicId) return;

  function updateButtons(state: ProgressState | undefined) {
    if (state === 'complete') {
      completeBtn!.classList.remove('border-gray-300', 'dark:border-gray-700', 'text-gray-500', 'dark:text-gray-400');
      completeBtn!.classList.add('border-emerald-500', 'text-emerald-600', 'bg-emerald-50', 'dark:bg-emerald-500/10', 'dark:text-emerald-400');
      completeLabel!.textContent = 'Completed';
    } else {
      completeBtn!.classList.add('border-gray-300', 'dark:border-gray-700', 'text-gray-500', 'dark:text-gray-400');
      completeBtn!.classList.remove('border-emerald-500', 'text-emerald-600', 'bg-emerald-50', 'dark:bg-emerald-500/10', 'dark:text-emerald-400');
      completeLabel!.textContent = 'Mark complete';
    }
    if (state === 'unclear') {
      unclearBtn!.classList.remove('border-gray-300', 'dark:border-gray-700', 'text-gray-500', 'dark:text-gray-400');
      unclearBtn!.classList.add('border-amber-400', 'text-amber-600', 'bg-amber-50', 'dark:bg-amber-500/10', 'dark:text-amber-400');
      unclearLabel!.textContent = 'Unclear';
    } else {
      unclearBtn!.classList.add('border-gray-300', 'dark:border-gray-700', 'text-gray-500', 'dark:text-gray-400');
      unclearBtn!.classList.remove('border-amber-400', 'text-amber-600', 'bg-amber-50', 'dark:bg-amber-500/10', 'dark:text-amber-400');
      unclearLabel!.textContent = 'Mark unclear';
    }
    const comment = getComments()[topicId!];
    if (state === 'unclear' && comment) {
      const infoBtn = getInfoIndicator(unclearBtn!);
      const tip = infoBtn.querySelector('[data-info-tooltip]') as HTMLSpanElement | null;
      if (tip) tip.textContent = comment;
      infoBtn.style.display = 'inline-flex';
    } else if (_infoEl) {
      _infoEl.style.display = 'none';
    }
  }

  function applyComplete() {
    const p = getProgress();
    const wasSet = p[topicId!] === 'complete';
    if (wasSet) {
      delete p[topicId!];
    } else {
      if (p[topicId!] === 'unclear') deleteComment(topicId!);
      p[topicId!] = 'complete';
    }
    saveProgress(p);
    updateButtons(p[topicId!]);
    window.dispatchEvent(new CustomEvent('platform-progress-changed'));
    if (!wasSet) advanceToNext();
  }

  async function handleUnclear() {
    const p = getProgress();
    if (p[topicId!] === 'unclear') {
      delete p[topicId!];
      deleteComment(topicId!);
      saveProgress(p);
      updateButtons(undefined);
      window.dispatchEvent(new CustomEvent('platform-progress-changed'));
      return;
    }
    const comment = await openUnclearModal();
    if (comment === null) return;
    p[topicId!] = 'unclear';
    if (comment) saveComment(topicId!, comment);
    saveProgress(p);
    updateButtons('unclear');
    window.dispatchEvent(new CustomEvent('platform-progress-changed'));
    advanceToNext();
  }

  updateButtons(getProgress()[topicId]);
  completeBtn.addEventListener('click', applyComplete);
  unclearBtn.addEventListener('click', handleUnclear);
}

initTopicProgress();
