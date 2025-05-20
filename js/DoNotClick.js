export default [
  {run() {document.body.classList.add('exorcist-mode');}},
  {run() {
	const style = document.createElement('style');
	style.innerHTML = `
		@keyframes spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}
		.spin {
			animation: spin 6s linear infinite;
		}`;
	document.head.appendChild(style);
	document.body.classList.add('spin');
  }},
  {run() {document.body.style.cssText = 'transform: rotateY(180deg); transition: transform 0.6s;'}},
  {run() {document.body.style.cssText = 'transform: rotateX(180deg); transition: transform 0.6s;'}},
  {run() {
	const style = document.createElement('style');
	style.innerHTML = '.random-size {font-size: var(--random-size, 16px);}';
	document.head.appendChild(style);
	function randomSize() {return Math.floor(Math.random() * 50) + 10};
	for(const el of document.querySelectorAll('*')) {
		el.classList.add('random-size');
		el.style.setProperty('--random-size', `${randomSize()}px`);
	}
  }},
]