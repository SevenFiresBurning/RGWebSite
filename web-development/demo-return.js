// A normal link remains available when JavaScript is disabled.
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
  const link = document.querySelector('#rg-demo-return a');
  if (link) window.location.assign(link.href);
});
