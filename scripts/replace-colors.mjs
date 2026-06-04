import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';

function walkDir(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      files.push(...walkDir(full));
    } else if (entry.isFile() && extname(entry.name) === '.jsx') {
      files.push(full);
    }
  }
  return files;
}

const files = walkDir(join(import.meta.dirname, '..', 'src'));
console.log(`Processing ${files.length} files...`);

// Token-based replacement: split on word boundaries and match exact tokens
// This avoids the \b-after-] issue with regex.
// Order matters: more specific tokens must come first.
const replaceMap = new Map([
  // --- text patterns ---
  ['text-white/90',              'text-[var(--c-text)]'],
  ['text-white/80',              'text-[var(--c-text)]'],
  ['text-white/70',              'text-[var(--c-text-2)]'],
  ['text-white/60',              'text-[var(--c-text-2)]'],
  ['text-white/50',              'text-[var(--c-text-3)]'],
  ['text-white/40',              'text-[var(--c-placeholder)]'],
  ['text-white/30',              'text-[var(--c-placeholder)]'],
  ['text-white/20',              'text-[var(--c-placeholder)]'],
  ['text-white',                 'text-[var(--c-text)]'],

  // --- placeholder patterns ---
  ['placeholder-white/40',       'placeholder-[var(--c-placeholder)]'],
  ['placeholder-white/30',       'placeholder-[var(--c-placeholder)]'],

  // --- shadow patterns ---
  ['shadow-[0_0_40px_rgba(255,255,255,0.03)]', 'shadow-[var(--c-glow)]'],

  // --- focus patterns ---
  ['focus:bg-white/[0.12]',      'focus:bg-[var(--c-element-hover)]'],
  ['focus:ring-white/30',        'focus:ring-[var(--c-border)]'],

  // --- bg hover patterns ---
  ['hover:bg-white/[0.12]',      'hover:bg-[var(--c-element-hover)]'],
  ['hover:bg-white/[0.09]',      'hover:bg-[var(--c-surface-hover)]'],
  ['hover:bg-white/[0.08]',      'hover:bg-[var(--c-element)]'],
  ['hover:bg-white/[0.04]',      'hover:bg-[var(--c-elevated)]'],
  ['hover:bg-white/[0.03]',      'hover:bg-[var(--c-elevated)]'],
  ['hover:bg-white/25',          'hover:bg-[var(--c-element-hover-2)]'],
  ['hover:bg-white/20',          'hover:bg-[var(--c-element-hover)]'],
  ['hover:bg-white/10',          'hover:bg-[var(--c-element-hover)]'],

  // --- bg bracket opacities ---
  ['bg-white/[0.12]',            'bg-[var(--c-element-hover)]'],
  ['bg-white/[0.09]',            'bg-[var(--c-surface-hover)]'],
  ['bg-white/[0.06]',            'bg-[var(--c-surface)]'],
  ['bg-white/[0.05]',            'bg-[var(--c-elevated)]'],
  ['bg-white/[0.04]',            'bg-[var(--c-elevated)]'],
  ['bg-white/[0.08]',            'bg-[var(--c-element)]'],
  ['bg-white/[0.03]',            'bg-[var(--c-elevated)]'],

  // --- bg simple opacities ---
  ['bg-white/30',                'bg-[var(--c-element-hover-2)]'],
  ['bg-white/25',                'bg-[var(--c-element-hover-2)]'],
  ['bg-white/20',                'bg-[var(--c-element-hover)]'],
  ['bg-white/15',                'bg-[var(--c-element)]'],
  ['bg-white/10',                'bg-[var(--c-element)]'],
  ['bg-white/5',                 'bg-[var(--c-element)]'],

  // --- border patterns ---
  ['border-white/[0.15]',        'border-[var(--c-border-strong)]'],
  ['border-white/[0.12]',        'border-[var(--c-border-md)]'],
  ['border-white/[0.08]',        'border-[var(--c-border)]'],
  ['border-white/[0.05]',        'border-[var(--c-border)]'],
  ['border-white/10',            'border-[var(--c-border)]'],
  ['border-white/30',            'border-[var(--c-border)]'],
  ['border-white/20',            'border-[var(--c-border)]'],
  ['border-white/5',             'border-[var(--c-border)]'],
  ['border-r-white/[0.08]',      'border-r-[var(--c-border)]'],
  ['border-b-white/[0.08]',      'border-b-[var(--c-border)]'],
  ['border-t-white/[0.08]',      'border-t-[var(--c-border)]'],

  // --- divide patterns ---
  ['divide-white/[0.05]',        'divide-[var(--c-border)]'],
  ['divide-white/[0.08]',        'divide-[var(--c-border)]'],

  // --- bg-black patterns ---
  ['bg-black/80',                'bg-[var(--c-overlay)]'],
  ['bg-black/70',                'bg-[var(--c-overlay)]'],
  ['bg-black/60',                'bg-[var(--c-overlay)]'],
  ['bg-black/50',                'bg-[var(--c-overlay)]'],
  ['bg-black/40',                'bg-[var(--c-overlay)]'],
  ['bg-black/30',                'bg-[var(--c-overlay)]'],
  ['bg-black',                   'bg-[var(--c-bg)]'],

  // --- standalone border-white (no opacity) ---
  ['border-white',               'border-[var(--c-border)]'],

  // --- from-white/to-white ---
  ['from-white',                 'from-[var(--c-text)]'],
  ['to-white',                   'to-[var(--c-text)]'],

  // === STATUS COLORS (light/dark aware) ===

  // --- Positive (emerald) ---
  ['text-emerald-50',            'text-[var(--c-positive)]'],
  ['text-emerald-300',           'text-[var(--c-positive)]'],
  ['text-emerald-400',           'text-[var(--c-positive)]'],
  ['text-emerald-400/70',        'text-[var(--c-positive)]/70'],
  ['text-emerald-500',           'text-[var(--c-positive)]'],
  ['text-emerald-600',           'text-[var(--c-positive)]'],
  ['bg-emerald-500',             'bg-[var(--c-positive)]'],
  ['bg-emerald-500/10',          'bg-[var(--c-positive-bg)]'],
  ['bg-emerald-500/15',          'bg-[var(--c-positive-bg)]'],
  ['bg-emerald-500/20',          'bg-[var(--c-positive-hover)]'],
  ['hover:bg-emerald-500/15',    'hover:bg-[var(--c-positive-bg)]'],
  ['hover:bg-emerald-500/20',    'hover:bg-[var(--c-positive-hover)]'],
  ['hover:bg-emerald-500/25',    'hover:bg-[var(--c-positive-hover)]'],
  ['hover:text-emerald-300',     'hover:text-[var(--c-positive)]'],
  ['border-emerald-500',         'border-[var(--c-positive)]'],
  ['border-emerald-500/20',      'border-[var(--c-positive-border)]'],
  ['border-emerald-500/30',      'border-[var(--c-positive-border)]'],
  ['hover:border-emerald-500/30','hover:border-[var(--c-positive-border)]'],

  // --- Warning (amber) ---
  ['text-amber-300',             'text-[var(--c-warning)]'],
  ['text-amber-400',             'text-[var(--c-warning)]'],
  ['text-amber-400/70',          'text-[var(--c-warning)]/70'],
  ['text-amber-500',             'text-[var(--c-warning)]'],
  ['bg-amber-500',               'bg-[var(--c-warning)]'],
  ['bg-amber-500/15',            'bg-[var(--c-warning-bg)]'],
  ['bg-amber-500/20',            'bg-[var(--c-warning-hover)]'],
  ['hover:bg-amber-500/20',      'hover:bg-[var(--c-warning-hover)]'],
  ['border-amber-500',           'border-[var(--c-warning)]'],
  ['border-amber-500/30',        'border-[var(--c-warning-border)]'],

  // --- Danger (rose/red) ---
  ['text-rose-200',              'text-[var(--c-danger)]'],
  ['text-rose-300',              'text-[var(--c-danger)]'],
  ['text-rose-400',              'text-[var(--c-danger)]'],
  ['text-rose-400/40',           'text-[var(--c-danger)]/40'],
  ['text-rose-400/70',           'text-[var(--c-danger)]/70'],
  ['text-rose-500',              'text-[var(--c-danger)]'],
  ['text-red-50',                'text-[var(--c-danger)]'],
  ['text-red-400',               'text-[var(--c-danger)]'],
  ['text-red-500',               'text-[var(--c-danger)]'],
  ['hover:text-rose-200',        'hover:text-[var(--c-danger)]'],
  ['bg-rose-500/10',             'bg-[var(--c-danger-bg)]'],
  ['bg-rose-500/15',             'bg-[var(--c-danger-bg)]'],
  ['bg-rose-500/20',             'bg-[var(--c-danger-hover)]'],
  ['bg-red-500/20',              'bg-[var(--c-danger-hover)]'],
  ['hover:bg-rose-500/10',       'hover:bg-[var(--c-danger-bg)]'],
  ['hover:bg-rose-500/15',       'hover:bg-[var(--c-danger-bg)]'],
  ['hover:bg-rose-500/20',       'hover:bg-[var(--c-danger-hover)]'],
  ['hover:bg-rose-500/25',       'hover:bg-[var(--c-danger-hover)]'],
  ['hover:text-rose-300',        'hover:text-[var(--c-danger)]'],
  ['border-rose-500',            'border-[var(--c-danger)]'],
  ['border-rose-500/20',         'border-[var(--c-danger-border)]'],
  ['border-rose-500/30',         'border-[var(--c-danger-border)]'],
  ['border-l-rose-500',          'border-l-[var(--c-danger)]'],
  ['hover:border-rose-500/30',   'hover:border-[var(--c-danger-border)]'],
  ['focus:ring-rose-500/30',     'focus:ring-[var(--c-danger-border)]'],

  // --- Info (blue) ---
  ['text-blue-50',               'text-[var(--c-info)]'],
  ['text-blue-300',              'text-[var(--c-info)]'],
  ['text-blue-400',              'text-[var(--c-info)]'],
  ['text-blue-500',              'text-[var(--c-info)]'],
  ['bg-blue-400/10',             'bg-[var(--c-info-bg)]'],
  ['bg-blue-500/15',             'bg-[var(--c-info-bg)]'],
  ['bg-blue-500/20',             'bg-[var(--c-info-hover)]'],
  ['border-blue-400/20',         'border-[var(--c-info-border)]'],
  ['border-blue-500/20',         'border-[var(--c-info-border)]'],
  ['border-blue-500/30',         'border-[var(--c-info-border)]'],

  // --- Accent (indigo/violet) ---
  ['text-indigo-300',            'text-[var(--c-accent)]'],
  ['text-violet-300',            'text-[var(--c-accent)]'],
  ['bg-indigo-500',              'bg-[var(--c-accent)]'],
  ['bg-indigo-500/15',           'bg-[var(--c-accent-bg)]'],
  ['bg-indigo-500/20',           'bg-[var(--c-accent-hover)]'],
  ['bg-violet-400/10',           'bg-[var(--c-accent-bg)]'],
  ['hover:bg-indigo-500/15',     'hover:bg-[var(--c-accent-bg)]'],
  ['hover:text-indigo-300',      'hover:text-[var(--c-accent)]'],
  ['hover:border-indigo-500/30', 'hover:border-[var(--c-accent-border)]'],
  ['border-indigo-500/30',       'border-[var(--c-accent-border)]'],
  ['border-violet-400/20',       'border-[var(--c-accent-border)]'],
  ['ring-indigo-500/15',         'ring-[var(--c-accent-bg)]'],

  // --- Danger border/bg variants ---
  ['border-rose-400/20',         'border-[var(--c-danger-border)]'],
  ['bg-rose-400/10',             'bg-[var(--c-danger-bg)]'],

  // --- Status badge colors for getInvoiceDisplayStatus ---
  ['text-rose-600',              'text-[var(--c-danger)]'],
  ['text-amber-700',             'text-[var(--c-warning)]'],
  ['bg-emerald-50',              'bg-[var(--c-positive-bg)]'],
  ['bg-rose-50',                 'bg-[var(--c-danger-bg)]'],
  ['bg-amber-50',                'bg-[var(--c-warning-bg)]'],
  ['border-emerald-200',         'border-[var(--c-positive-border)]'],
  ['border-rose-200',            'border-[var(--c-danger-border)]'],
  ['border-amber-200',           'border-[var(--c-warning-border)]'],
]);

function replaceAll(str, map) {
  // Split on boundaries that separate Tailwind classes:
  // whitespace, quotes, parentheses, brackets, commas, etc.
  // Use a regex that captures delimiters so we can rejoin.
  const tokens = str.split(/(\s+|"|'|\(|\)|,|\{|\}|`|\$\{)/);
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (map.has(t)) {
      tokens[i] = map.get(t);
    }
  }
  return tokens.join('');
}

let totalChanges = 0;

function countTokenChanges(before, after, map) {
  // Tokenize both and count how many tokens from the map old keys appear
  const countTokens = (str) => {
    const tokens = str.split(/(\s+|"|'|\(|\)|,|\{|\}|`|\$\{)/);
    let count = 0;
    for (const t of tokens) {
      if (map.has(t)) count++;
    }
    return count;
  };
  return countTokens(before) - countTokens(after);
}

for (const file of files) {
  const content = readFileSync(file, 'utf-8');
  const original = content;
  const result = replaceAll(content, replaceMap);

  if (result !== original) {
    writeFileSync(file, result, 'utf-8');
    const changes = countTokenChanges(original, result, replaceMap);
    totalChanges += changes;
    console.log(`✓ ${file} — ${changes} replacements`);
  }
}

console.log(`\nDone! ${totalChanges} total replacements across ${files.length} files.`);
