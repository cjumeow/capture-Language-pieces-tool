// src/exporters/ankiExporter.js

import { escapeRegExp } from '../core/utils.js';
import { state } from '../core/states.js';
import { filterByDate } from '../core/filter.js';

function toAnkiHtml(text) {
  return text.replace(/\r\n/g, '\n').replace(/\n/g, '<br>');
}

function escapeCsvField(text) {
  return `"${text.replace(/"/g, '""')}"`;
}

export function exportAnki() {
  let dateFiltered = filterByDate(state.allPieces, state.selectedDateRange);
  
  let exportable = dateFiltered.filter(p => p.status === 'done');

  if (exportable.length === 0) {
    alert("No completed cards to export. Mark some pieces as 'done' first!");
    return;
  }

  let csvContent = exportable.map(p => {
    const front = toAnkiHtml(
      p.context.replace(
        new RegExp(`(${escapeRegExp(p.original_piece)})`, "gi"),
        "<u>$&</u>",
      ),
    );
    const back = toAnkiHtml(p.user_note || p.original_piece);
    return `${escapeCsvField(front)}\t${escapeCsvField(back)}`;
  }).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `anki_pieces_${new Date().toLocaleDateString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}