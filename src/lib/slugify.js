/** "SBI PO" -> "sbi-po". Used for exam and test-series URLs. */
export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
