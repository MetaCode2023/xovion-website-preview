const dialog = document.querySelector('dialog');
const form = document.querySelector('#demo-form');
const status = document.querySelector('#form-status');
document.querySelectorAll('[data-demo]').forEach(button => button.addEventListener('click', () => {
  form.reset(); status.textContent = ''; form.hidden = false;
  const option = [...form.elements.service.options].find(x => x.value === button.dataset.demo);
  if (option) form.elements.service.value = option.value;
  dialog.showModal();
}));
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { form.reset(); status.textContent = ''; });
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  form.hidden = true;
  status.textContent = 'Demo complete. Nothing was sent or saved. Your live contact method will be connected before launch.';
  status.focus();
  form.reset();
});
