
window.addEventListener("load", function () {
    //-------------------------------------ANIMATIONS-------------------------------------
    gsap.from(".logo", { duration: 1, delay: .6, y: 30, opacity: 0, ease: "power2.inOut" });
    gsap.from(".nav-links", { duration: 1, delay: .6, y: 30, opacity: 0, ease: "power2.inOut" });
    gsap.from(".animation-mobile-btns", { duration: 1, delay: .6, x: 30, opacity: 0, ease: "power2.inOut" });
    gsap.from(".animation-section-heading", { duration: 1, delay: .7, opacity: 0, y: 30, ease: "power1.inOut" });
    gsap.from(".animation-general-element", { duration: 1, delay: .8, opacity: 0, y: 30, ease: "power1.inOut" });
    gsap.from(".animation-section-p", { duration: 1, delay: .9, opacity: 0, y: 30, ease: "power1.inOut" });
    gsap.from(".button-CTA", { duration: 1, delay: 1, opacity: 0, ease: "power1.inOut" });

    gsap.fromTo('.column-footer-top-row', { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 1, stagger: 0.05, ease: "power1.inOut" });
    gsap.fromTo('.column-footer-bottom-row', { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 1, stagger: 0.05, ease: "power1.inOut" });

    gsap.to(".navbar", { duration: 0, visibility: "visible" });
    gsap.to(".container-menu-page", { duration: 0, visibility: "visible" });
    gsap.to(".container-footer", { duration: 0, visibility: "visible" });

    gsap.from(".menu-images img", { duration: 1, delay: .6, y: 30, opacity: 0, ease: "power2.inOut" });
    //-------------------------------------NAV MOBILE-------------------------------------
    const hamburger = document.getElementById('hamburger');
    const mobile_menu = document.getElementById('mobile-menu');

    hamburger.addEventListener('click', () => {
        mobile_menu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    //-------------------------------------NAV MOBILE-------------------------------------
    const buttons = document.querySelectorAll('.menu-btn');

    let menu_category = localStorage.getItem('menuCategory');

    if (menu_category === 'breakfast' || menu_category === null || menu_category === undefined) {
        document.getElementById('breakfast-btn').classList.add('active');

        document.getElementById('breakfast-menu-container').classList.add('visible');
        document.getElementById('breakfast-menu-container').classList.remove('hidden');

        document.getElementById('dinner-menu-container').classList.add('hidden');
        document.getElementById('dinner-menu-container').classList.remove('visible');

        document.getElementById('kids-menu-container').classList.add('hidden');
        document.getElementById('kids-menu-container').classList.remove('visible');
    }
    else if (menu_category === 'dinner') {
        document.getElementById('dinner-btn').classList.add('active');

        document.getElementById('dinner-menu-container').classList.add('visible');
        document.getElementById('dinner-menu-container').classList.remove('hidden');

        document.getElementById('breakfast-menu-container').classList.add('hidden');
        document.getElementById('breakfast-menu-container').classList.remove('visible');

        document.getElementById('kids-menu-container').classList.add('hidden');
        document.getElementById('kids-menu-container').classList.remove('visible');
    }

    else if (menu_category === 'kids') {
        document.getElementById('kids-btn').classList.add('active');

        document.getElementById('kids-menu-container').classList.add('visible');
        document.getElementById('kids-menu-container').classList.remove('hidden');

        document.getElementById('breakfast-menu-container').classList.add('hidden');
        document.getElementById('breakfast-menu-container').classList.remove('visible');

        document.getElementById('dinner-menu-container').classList.add('hidden');
        document.getElementById('dinner-menu-container').classList.remove('visible');
    }

    buttons.forEach(button => {
        button.addEventListener('click', function () {

            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');


            // Hide all menu cards
            document.getElementById('breakfast-menu-container').classList.add('hidden');
            document.getElementById('breakfast-menu-container').classList.remove('visible');
            document.getElementById('dinner-menu-container').classList.add('hidden');
            document.getElementById('dinner-menu-container').classList.remove('visible');
            document.getElementById('kids-menu-container').classList.add('hidden');
            document.getElementById('kids-menu-container').classList.remove('visible');


            // Show the corresponding menu cards based on the button clicked
            if (this.id === 'breakfast-btn') {
                document.getElementById('breakfast-btn').disabled = true;
                document.getElementById('breakfast-menu-container').classList.remove('hidden');
                document.getElementById('breakfast-menu-container').classList.add('visible');
                gsap.from("#breakfast-menu-container", { duration: 1, y: 30, opacity: 0, ease: "power2.inOut", onComplete: () => { document.getElementById('breakfast-btn').disabled = false; } });
                localStorage.setItem('menuCategory', 'breakfast');
            } else if (this.id === 'dinner-btn') {
                document.getElementById('dinner-btn').disabled = true;
                document.getElementById('dinner-menu-container').classList.remove('hidden');
                document.getElementById('dinner-menu-container').classList.add('visible');
                gsap.from("#dinner-menu-container", { duration: 1, y: 30, opacity: 0, ease: "power2.inOut", onComplete: () => { document.getElementById('dinner-btn').disabled = false; } });
                localStorage.setItem('menuCategory', 'dinner');
            } else if (this.id === 'kids-btn') {
                document.getElementById('kids-btn').disabled = true;
                document.getElementById('kids-menu-container').classList.remove('hidden');
                document.getElementById('kids-menu-container').classList.add('visible');
                gsap.from("#kids-menu-container", { duration: 1, y: 30, opacity: 0, ease: "power2.inOut", onComplete: () => { document.getElementById('kids-btn').disabled = false; } });
                localStorage.setItem('menuCategory', 'kids');
            }

        });
    });
});