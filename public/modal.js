window.addEventListener("load", function () {

    const overlay = document.getElementById('overlay');

    const modal_desktop = document.getElementById('modal-desktop');
    const close_button_desktop = document.getElementById('modal-close-button-desktop');
    const form_desktop = document.getElementById('form-modal-desktop');
    const modal_title_desktop = document.getElementById('modal-title-desktop');
    const modal_description_desktop = document.getElementById('modal-description-desktop');

    const modal_mobile = document.getElementById('modal-mobile');
    const close_button_mobile = document.getElementById('modal-close-button-mobile');
    const form_mobile = document.getElementById('form-modal-mobile');
    const modal_title_mobile = document.getElementById('modal-title-mobile');
    const modal_description_mobile = document.getElementById('modal-description-mobile');

    const form_footer = document.getElementById('form-modal-footer');
    const modal_title_footer = document.getElementById('modal-title-footer');
    const modal_description_footer = document.getElementById('modal-description-footer');
    modalFooter();
    //-------------------------------MODAL FUNCTIONALITY (POST REQUEST, DISCOUNT CODE, LOCAL STORAGE)-------------------------------

    async function subscribeUser(email, discount_code) {
        try {
            const response = await fetch('https://www.zaytunarestaurant-bawtry.com/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, discount_code }),
            });

            const data = await response.json();

        } catch (error) {
            console.error('Error:', error);
        }
    }

    function generateDiscountCode(email) {
        const prefix = email.split('@')[0].toUpperCase().slice(0, 4);
        const randomPart = Math.random().toString(36).substring(2, 10 - prefix.length).toUpperCase();
        return prefix + randomPart;
    }

    let dontShowModal = localStorage.getItem('dontShowModal');
    if (dontShowModal === null) {
        modalMobile();
        displayModal();
    }

    //-----------------------------------------------------DESKTOP MODAL---------------------------------------------------------------------
    close_button_desktop.onclick = function () {
        // Hide modal and overlay
        gsap.to(modal_desktop, { duration: 0.3, opacity: 0, scale: 0.7, onComplete: () => { document.getElementById("modal-desktop").style.display = "none"; } });
        gsap.to(overlay, {
            duration: 0.3, opacity: 0, onComplete: () => { document.getElementById("overlay").style.display = "none"; }
        });
        localStorage.setItem('dontShowModal', 'true');
        removeModalListeners()
    }
    function removeModalListeners() {
        document.removeEventListener('mousemove', showModal);
        window.removeEventListener('resize', closeModal);
    }
    let modal_timer;
    let modal_countdown_display = false;

    //Will give user 5 seconds before exit modal can appear
    modal_timer = setTimeout(function () {
        modal_countdown_display = true;
    }, 5000);

    function showModal(event) {
        if (event.clientY < 10 && modal_countdown_display === true && window.innerWidth > 480 && modal_desktop.style.display !== 'flex') {
            gsap.to(overlay, { duration: 0.5, opacity: 1, visibility: "visible" });
            gsap.fromTo(modal_desktop,
                { scale: 0.7, opacity: 0, visibility: "visible" },
                { duration: 0.6, scale: 1, opacity: 1, ease: "elastic.out(1, 0.75)" }
            );
            modal_desktop.style.display = 'flex';
            overlay.style.display = 'block';
        }
    }
    function closeModal() {
        if (window.innerWidth <= 480) {
            gsap.to(modal_desktop, { duration: 0.3, opacity: 0, scale: 0.7, onComplete: () => { document.getElementById("modal-desktop").style.display = "none"; } });
            gsap.to(overlay, { duration: 0.3, opacity: 0, onComplete: () => { document.getElementById("overlay").style.display = "none"; } });
        }
    }

    function displayModal() {
        window.addEventListener('resize', closeModal);
        document.addEventListener('mousemove', showModal);

        form_desktop.addEventListener('submit', function (event) {

            // Prevent the default form submission
            event.preventDefault();

            const email = document.getElementById('email').value;
            const discount_code = generateDiscountCode(email);

            subscribeUser(email, discount_code);

            if (email) {
                localStorage.setItem('userEmail', email);
                form_desktop.style.display = 'none';
                modal_title_desktop.innerHTML = "You're in!🎉";
                modal_description_desktop.style.lineHeight = '140%';
                modal_description_desktop.style.fontFamily = 'var(--font-1)'
                modal_description_desktop.innerHTML = "Your discount code is on the way to your inbox! We can't wait to serve you something delicious.💙<br><br>If you don't see it in your inbox within 1 minute, please check your spam folder.";
            }
        });

    }
    //----------------------------------------------------MOBILE MODAL--------------------------------------------------------------
    let modal_mobile_timer;
    //Modal after 10 seconds
    if (localStorage.getItem('dontShowModal') !== 'true') {
        modal_mobile_timer = setTimeout(function () {
            if (window.innerWidth < 480 && modal_mobile.style.display !== 'flex') {
                gsap.from(modal_mobile, { y: "100%", ease: "elastic.out(1, 0.75)", duration: 1.5 });
                modal_mobile.style.display = 'flex';
            }
        }, 15000);
    }

    close_button_mobile.onclick = function () {
        gsap.to(modal_mobile, { y: "100%", opacity: 0, duration: 0.5, ease: "power2.in", onComplete: () => { modal_mobile.style.display = "none"; } });


        localStorage.setItem('dontShowModal', 'true');
        removeModalListenersMobile();
        clearTimeout(modal_mobile_timer);

    }

    function preventNavigationMobile(e) {
        if (modal_mobile.style.display !== 'flex') {
            gsap.from(modal_mobile, { y: "100%", ease: "elastic.out(1, 0.75)", duration: 1.5 });
            modal_mobile.style.display = 'flex';
        }
        e.preventDefault();
    }

    function removeModalListenersMobile() {
        window.removeEventListener('beforeunload', preventNavigationMobile);
        document.querySelectorAll('a').forEach(function (link) {
            link.removeEventListener('click', preventNavigationMobile);
        });
    }

    function modalMobile() {

        form_mobile.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('email_mobile').value;
            const discount_code = generateDiscountCode(email);
            subscribeUser(email, discount_code);

            if (email) {
                localStorage.setItem('userEmail', email);
                form_mobile.style.display = 'none';
                modal_title_mobile.innerHTML = "You're in!🎉";
                modal_description_mobile.style.lineHeight = '140%';
                modal_description_mobile.style.fontFamily = 'var(--font-1)';
                modal_description_mobile.innerHTML = "Your discount code is on the way to your inbox! We can't wait to serve you something delicious.💙<br><br>If you don't see it in your inbox within 1 minute, please check your spam folder.";
                modal_mobile.style.minHeight = '30vh';
                modal_mobile.style.padding = '36px var(--container-spacing-horizontal) calc(36px + calc(var(--cards-border-radius))) var(--container-spacing-horizontal)';
            }
        });

        if (window.innerWidth < 480) {
            window.addEventListener('beforeunload', preventNavigationMobile);
            document.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', preventNavigationMobile);
            });
        }
    }
    //----------------------------------------------------MOBILE FOOTER--------------------------------------------------------------

    function modalFooter() {

        form_footer.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('email_footer').value;
            const discount_code = generateDiscountCode(email);
            subscribeUser(email, discount_code);

            if (email) {
                form_footer.style.display = 'none';
                modal_title_footer.innerHTML = "You're in!🎉";
                modal_description_footer.innerHTML = "Your discount code is on the way to your inbox! We can't wait to serve you something delicious.💙<br><br>If you don't see it in your inbox within 1 minute, please check your spam folder.";
            }
        });
    }
});