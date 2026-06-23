import { loadInitialData, setDateRange } from '../core/actions.js';
import { renderView } from './render.js';
import { state } from '../core/states.js';

state.subscribe(renderView);

flatpickr("#date-picker", {
  mode: "range",
  dateFormat: "Y-m-d",
  defaultDate: "today",
  onReady: function() {
    loadInitialData();
  },
  onChange: function(selectedDates) {
    if (selectedDates.length === 2 || selectedDates.length === 1) {
      setDateRange(selectedDates);
    }
  }
});

document.getElementById('export-anki-btn').addEventListener('click', async () => {
  const { exportAnki } = await import('../exporters/ankiExporter.js');
  exportAnki();
});