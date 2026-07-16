document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const burgerIcon = document.getElementById('burgerIcon');

    if (mobileMenuBtn && mobileMenu && burgerIcon) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            if (isHidden) {
                burgerIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16'); // Бургер
            } else {
                burgerIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12'); // Крестик
            }
        });
    }
});