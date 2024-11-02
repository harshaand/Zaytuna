
window.addEventListener("load", function () {
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
    gsap.fromTo('.brick', { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 1, stagger: 0.05, ease: "power1.inOut" });
    gsap.to(".container-footer", { duration: 0, visibility: "visible" });

    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    // Toggle mobile menu and hamburger animation
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    const images = Array.from(document.querySelectorAll('.masonry img'));
    const lightbox_overlay = document.querySelector('.lightbox-overlay');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClickSwipeArea = document.querySelector('.lightbox-image-and-btns');
    const caption = document.getElementById('caption');
    const thumbnailBar = document.getElementById('thumbnailBar');
    const prevButton = document.getElementById('lightbox-left-btn');
    const nextButton = document.getElementById('lightbox-right-btn');
    const closeButton = document.getElementById('closeButton');

    let currentIndex = 0;

    function preventScrollOutsideThumbnailBar(event) {
        if (!event.target.closest('.thumbnail-bar')) {
            event.preventDefault();
        }
    }

    function showLightbox() {
        const selectedImage = images[currentIndex];
        lightboxImage.src = selectedImage.src;
        caption.innerText = selectedImage.alt;
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

    let isFirstHighlight = true; // Flag to track if it's the first highlight

    function highlightThumbnail() {
        isFirstHighlight = true;

        thumbnailBar.querySelectorAll('img').forEach((img, i) => {
            if (i === currentIndex) {
                img.classList.add('active');
            }
            else {
                img.classList.remove('active');
            }
        });

        const activeThumbnail = thumbnailBar.querySelectorAll('img')[currentIndex];
        const thumbnailBarWidth = thumbnailBar.offsetWidth;
        const thumbnailWidth = activeThumbnail.offsetWidth;
        const thumbnailPosition = activeThumbnail.offsetLeft + thumbnailWidth / 2;

        // Only scroll if this is the first highlight
        if (isFirstHighlight) {
            thumbnailBar.scrollLeft = thumbnailPosition - thumbnailBarWidth / 2;
            isFirstHighlight = false; // Disable further automatic scrolling
        }
    }

    function closeLightbox() {
        window.removeEventListener('wheel', preventScrollOutsideThumbnailBar);
        window.removeEventListener('touchmove', preventScrollOutsideThumbnailBar);
        gsap.to(lightbox, { duration: 0.3, opacity: 0, scale: 0.7, onComplete: () => { lightbox.style.display = "none"; } });
        gsap.to(lightbox_overlay, { duration: 0.3, opacity: 0, onComplete: () => { lightbox_overlay.style.display = "none"; } });


    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showLightbox();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showLightbox();
    }

    function changeImage(index) {
        currentIndex = (index + images.length) % images.length;
        showLightbox();
    }


    images.forEach((img, index) => {
        img.addEventListener('click', () => changeImage(index));
        const thumbnail = img.cloneNode();
        thumbnail.addEventListener('click', () => changeImage(index));
        thumbnail.style.borderRadius = '4px';
        thumbnailBar.appendChild(thumbnail);
    });



    // Swipe functionality on the lightboxImage only
    let startX;

    lightboxClickSwipeArea.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    lightboxClickSwipeArea.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        if (startX > endX + 50) nextImage();
        else if (startX < endX - 50) prevImage();
    });

    // Event listeners for buttons
    nextButton.addEventListener('click', nextImage);
    prevButton.addEventListener('click', prevImage);
    closeButton.addEventListener('click', closeLightbox);


    gsap.fromTo('.gallery-image', { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 1, stagger: 0.05, ease: "power1.inOut" });
    gsap.fromTo('.card-review', { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 1, stagger: 0.05, ease: "power1.inOut" });


});