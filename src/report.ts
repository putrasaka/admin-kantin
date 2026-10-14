import type { Transaction } from './App';

const num = (n: number): string => (n || 0).toLocaleString('id-ID');

export function formatReportDateLabel(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`)
    .toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase();
}

export function buildSalesReportText(transactions: Transaction[], dateLabel: string): string {
  const lines: string[] = [];
  lines.push(`LIST PENJUALAN KANTIN MABIT TANGGAL ${dateLabel}`);
  lines.push('');

  let cashTotal = 0;
  let savedTotal = 0;

  transactions.forEach((tx, idx) => {
    lines.push(`${idx + 1}. ${tx.customerName}`);
    tx.items.forEach(item => {
      lines.push(`   - ${item.productName} : ${item.quantity}`);
      lines.push(`     Harga satuan : ${num(item.price)}`);
    });
    lines.push(`   - Total : ${num(tx.totalAmount)}`);
    if (tx.paymentMethod === 'cash') {
      cashTotal += tx.totalAmount;
    } else {
      savedTotal += tx.totalAmount;
    }
  });

  lines.push('');
  lines.push(`TOTAL PENDAPATAN CASH : ${num(cashTotal)}`);
  lines.push(`TOTAL PENDAPATAN TABUNGAN : ${num(savedTotal)}`);
  lines.push(`TOTAL KESELURUHAN : ${num(cashTotal + savedTotal)}`);

  return lines.join('\n');
}

export function buildSalesReportHtml(transactions: Transaction[], dateLabel: string): string {
  const text = buildSalesReportText(transactions, dateLabel);
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<!doctype html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<title>Laporan Penjualan ${dateLabel}</title>
<style>
  body { font-family: 'Courier New', Courier, monospace; font-size: 12pt; margin: 24px; color: #000; }
  pre { white-space: pre-wrap; margin: 0; }
</style>
</head>
<body>
<pre>${escaped}</pre>
</body>
</html>`;
}
