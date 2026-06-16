// Topic progress (mark complete / mark unclear) + auto-advance to next topic.
//
// Shared by all topic layouts. No-ops on pages without the status buttons.
// `topicId` is read from the `data-topic-id` attribute on the buttons.
//
// Auto-advance reuses the bottom nav's "Next" link, whose href is already
// resolved to the correct destination on load by the `?from=` handler in
// BaseLayout.astro (role-phase route when arriving via ?from=roles/..., else
// the pillar -> module -> chapter route). So we never re-derive routing here.

const STORAGE_KEY = 'platform-progress';
const ADVANCE_DELAY_MS = 400;

type ProgressState = 'complete' | 'unclear';
type ProgressMap = Record<string, ProgressState>;

function getProgress(): ProgressMap {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const result: ProgressMap = {};
    for (const [k, v] of Object.entries(raw)) {
      if (v === 'complete' || v === 'unclear') result[k] = v;
      else if (v === true) result[k] = 'complete'; // migrate legacy boolean
    }
    return result;
  } catch {
    return {};
  }
}

function saveProgress(p: ProgressMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

// Navigate to the destination the bottom nav's "Next" link currently points to.
// The last anchor inside nav[data-role-nav] is the Next link (matches the
// navLinks[navLinks.length - 1] convention in BaseLayout's ?from= handler).
function advanceToNext() {
  const nav = document.querySelector('[data-role-nav]');
  if (!nav) return;
  const links = nav.querySelectorAll('a[href]');
  const nextA = links[links.length - 1] as HTMLAnchorElement | undefined;
  const href = nextA?.getAttribute('href');
  if (href) setTimeout(() => { window.location.href = href; }, ADVANCE_DELAY_MS);
}

function initTopicProgress() {
  const completeBtn = document.getElementById('complete-btn');
  const completeLabel = document.getElementById('complete-label');
  const unclearBtn = document.getElementById('unclear-btn');
  const unclearLabel = document.getElementById('unclear-label');

  // Not a topic page — nothing to wire up.
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
  }

  // Toggle a mark. Advances to the next topic only when a mark is newly set
  // (clicking an active button clears it and stays put).
  function toggle(state: ProgressState) {
    const p = getProgress();
    const wasSet = p[topicId!] === state;
    if (wasSet) delete p[topicId!];
    else p[topicId!] = state;
    saveProgress(p);
    updateButtons(p[topicId!]);
    window.dispatchEvent(new CustomEvent('platform-progress-changed'));
    if (!wasSet) advanceToNext();
  }

  updateButtons(getProgress()[topicId]);
  completeBtn.addEventListener('click', () => toggle('complete'));
  unclearBtn.addEventListener('click', () => toggle('unclear'));
}

initTopicProgress();
