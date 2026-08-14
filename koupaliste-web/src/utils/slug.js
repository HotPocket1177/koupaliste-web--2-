// Stabilní URL-friendly identifikátor z názvu akce (bez diakritiky, mezery -> pomlčky).
export function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
