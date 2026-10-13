/**
 * Renders an outreach template string with lead variables
 * Variables: {name}, {category}, {area}, {rating}
 */
export function renderTemplate(template, lead) {
  if (!template || !lead) return '';

  const name = lead.name || 'your business';
  const category = lead.category || 'business';
  const area = lead.area || 'your area';
  const rating = lead.rating ? lead.rating.toFixed(1) : 'top';

  return template
    .replaceAll('{name}', name)
    .replaceAll('{category}', category)
    .replaceAll('{area}', area)
    .replaceAll('{rating}', rating);
}

export function renderEmailSubject(subjectTemplate, lead) {
  if (!subjectTemplate || !lead) return 'Website Inquiry';
  const name = lead.name || 'your business';
  return subjectTemplate.replaceAll('{name}', name);
}
