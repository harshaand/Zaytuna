window.addEventListener("load", function () {
    gsap.from(".logo", { duration: 1.6, delay: 1.6, y: 30, opacity: 0, ease: "power2.inOut" });
    gsap.from(".nav-links", { duration: 1.6, delay: 1.6, y: 30, opacity: 0, ease: "power2.inOut" });


    gsap.from(".button-CTA", { duration: 1.6, delay: 2, opacity: 0, ease: "power1.inOut" });

    gsap.to(".navbar", { duration: 0, visibility: "visible" });

    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    // Toggle mobile menu and hamburger animation
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
});