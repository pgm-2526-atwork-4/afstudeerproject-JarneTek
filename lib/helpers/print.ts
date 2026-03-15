type SummaryItem = {
  productName: string;
  size: string;
  quantity: number;
};

type PrintOptions = {
  title: string;
  summaryItems: SummaryItem[];
};

export function printOrderPDF({ title, summaryItems }: PrintOptions) {
  const summaryRows = summaryItems
    .map(
      (item) =>
        `<tr><td>${item.productName}</td><td>${item.size}</td><td>${item.quantity}</td></tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #1a1a2e; padding: 24px; }
    h1 { font-size: 16px; margin-bottom: 4px; }
    .subtitle { font-size: 10px; color: #666; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1a1a2e; color: #fff; text-align: left; padding: 6px 10px; font-size: 10px; }
    td { padding: 5px 10px; border-bottom: 1px solid #f0f0f0; }
    @media print { @page { margin: 15mm; } }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p class="subtitle">Afgedrukt op ${new Date().toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" })}</p>
  <table>
    <thead><tr><th>Artikel</th><th>Maat</th><th>Aantal</th></tr></thead>
    <tbody>${summaryRows}</tbody>
  </table>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}
