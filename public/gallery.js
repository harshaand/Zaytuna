
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
    gsap.to(".container-gallery-page", { duration: 0, visibility: "visible" });
    gsap.to(".brick", { opacity: 1, duration: 0.3, delay: 1, stagger: 0.05, ease: "power1.inOut", onComplete: () => { lightbox.style.opacity = "1"; } });
    gsap.to(".container-footer", { duration: 0, visibility: "visible" });
    //-------------------------------------NAV MOBILE-------------------------------------
    const hamburger = document.getElementById('hamburger');
    const mobile_menu = document.getElementById('mobile-menu');

    // Toggle mobile menu and hamburger animation
    hamburger.addEventListener('click', () => {
        mobile_menu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    //-------------------------------------GALLERY SECTION (LIGHTBOX)-------------------------------------
    const images = Array.from(document.querySelectorAll('.masonry img'));
    const lightbox_overlay = document.querySelector('.lightbox-overlay');
    const lightbox = document.getElementById('lightbox');
    const lightbox_image = document.getElementById('lightbox-image');
    const lightbox_click_swipe_area = document.querySelector('.lightbox-image-and-btns');
    //const caption = document.getElementById('caption');
    const thumbnail_bar = document.getElementById('thumbnail-bar');
    const lightbox_left_btn = document.getElementById('lightbox-left-btn');
    const lightbox_right_btn = document.getElementById('lightbox-right-btn');
    const lightbox_close_btn = document.getElementById('lightbox-close-btn');

    let current_index = 0;

    function preventScrollOutsideThumbnailBar(event) {
        if (!event.target.closest('.thumbnail-bar')) {
            event.preventDefault();
        }
    }

    function showLightbox() {
        const selected_image = images[current_index];
        lightbox_image.src = selected_image.src;
        //caption.innerText = selected_image.alt;
        highlightThumbnail();
        window.addEventListener('wheel', preventScrollOutsideThumbnailBar, { passive: false });
        window.addEventListener('touchmove', preventScrollOutsideThumbnailBar, { passive: false });
        if (lightbox.style.display !== 'flex') {
            gsap.fromTo(lightbox,
                { scale: 0.7, opacity: 1, display: "flex" },
                { duration: 0.6, scale: 1, opacity: 1, ease: "back.out(1.7)" }
            );
            gsap.to(lightbox_overlay, { duration: 0.5, opacity: 1, visibility: "visible" });
        }
        lightbox.style.display = 'flex';
        lightbox_overlay.style.display = 'block';

    }

    let is_first_highlight = true; // Flag to track if it's the first highlight

    function highlightThumbnail() {
        is_first_highlight = true;

        thumbnail_bar.querySelectorAll('img').forEach((img, i) => {
            if (i === current_index) {
                img.classList.add('active');
            }
            else {
                img.classList.remove('active');
            }
        });

        const active_thumbnail = thumbnail_bar.querySelectorAll('img')[current_index];
        const thumbnail_bar_width = thumbnail_bar.offsetWidth;
        const thumbnail_width = active_thumbnail.offsetWidth;
        const thumbnail_position = active_thumbnail.offsetLeft + thumbnail_width / 2;

        // Only scroll if this is the first highlight
        if (is_first_highlight) {
            thumbnail_bar.scrollLeft = thumbnail_position - thumbnail_bar_width / 2;
            is_first_highlight = false; // Disable further automatic scrolling
        }
    }

    function closeLightbox() {
        window.removeEventListener('wheel', preventScrollOutsideThumbnailBar);
        window.removeEventListener('touchmove', preventScrollOutsideThumbnailBar);
        gsap.to(lightbox, { duration: 0.3, opacity: 0, scale: 0.7, onComplete: () => { lightbox.style.display = "none"; } });
        gsap.to(lightbox_overlay, { duration: 0.3, opacity: 0, onComplete: () => { lightbox_overlay.style.display = "none"; } });
    }

    function nextImage() {
        current_index = (current_index + 1) % images.length;
        showLightbox();
    }

    function prevImage() {
        current_index = (current_index - 1 + images.length) % images.length;
        showLightbox();
    }

    function changeImage(index) {
        current_index = (index + images.length) % images.length;
        showLightbox();
    }


    images.forEach((img, index) => {
        img.addEventListener('click', () => changeImage(index));
        const thumbnail = img.cloneNode();
        thumbnail.addEventListener('click', () => changeImage(index));
        thumbnail.style.borderRadius = '4px';
        thumbnail_bar.appendChild(thumbnail);
    });

    // Swipe functionality on the lightboxImage only
    let start_x;

    lightbox_click_swipe_area.addEventListener('touchstart', (e) => {
        start_x = e.touches[0].clientX;
    });

    lightbox_click_swipe_area.addEventListener('touchend', (e) => {
        const end_x = e.changedTouches[0].clientX;
        if (start_x > end_x + 50) nextImage();
        else if (start_x < end_x - 50) prevImage();
    });

    // Event listeners for buttons
    lightbox_right_btn.addEventListener('click', nextImage);
    lightbox_left_btn.addEventListener('click', prevImage);
    lightbox_close_btn.addEventListener('click', closeLightbox);

    gsap.fromTo('.gallery-image', { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 1, stagger: 0.05, ease: "power1.inOut" });
    gsap.fromTo('.card-review', { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 1, stagger: 0.05, ease: "power1.inOut" });


});