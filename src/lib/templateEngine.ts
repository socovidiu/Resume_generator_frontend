import Handlebars from "handlebars";

// Example helpers you’ll likely want
Handlebars.registerHelper("eq", (a: any, b: any) => a === b);
Handlebars.registerHelper("and", (a: any, b: any) => a && b);
Handlebars.registerHelper("or", (a: any, b: any) => a || b);
Handlebars.registerHelper("formatDate", (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString();
});

// You can register partials here if needed:
// Handlebars.registerPartial("sectionTitle", `<h2>{{title}}</h2>`);

export function renderTemplate(templateStr: string, data: unknown) {
  const template = Handlebars.compile(templateStr, { noEscape: true });
  return template(data);
}
