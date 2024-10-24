window.addEventListener("load", function () {
    //------------------------------------------------------MODALS----------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------------------------------
    const serverApiSubscribeUrl = 'https://zaytunacuisine.com/api/subscribe';

    const modal = document.getElementById('myModal');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('modal-close-button');
    const form = document.getElementById('form-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');

    const modal_mobile = document.getElementById('modal-mobile');
    const closeBtn_mobile = document.getElementById('modal-close-button-mobile');
    const form_mobile = document.getElementById('form-modal-mobile');
    const modalTitle_mobile = document.getElementById('modal-title-mobile');
    const modalDescription_mobile = document.getElementById('modal-description-mobile');

    const form_footer = document.getElementById('form-modal-footer');
    const modalTitle_footer = document.getElementById('modal-title-footer');
    const modalDescription_footer = document.getElementById('modal-description-footer');
    modalFooter();

    async function subscribeUser(email, discount_code) {
        try {
            const response = await fetch(serverApiSubscribeUrl, { // Adjust the URL if the server is hosted elsewhere
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, discount_code }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Subscriber added successfully:', data);
            } else {
                console.error('Error subscribing user:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function generateDiscountCode(email) {
        const prefix = email.split('@')[0].toUpperCase().slice(0, 4);
        const randomPart = Math.random().toString(36).substring(2, 10 - prefix.length).toUpperCase();
        console.log(prefix, randomPart)
        return prefix + randomPart;
    }

    let dontShowModal = localStorage.getItem('dontShowModal');
    if (dontShowModal === null) {
        modalMobile();
        displayModal();
    }

    //-----------------------------------------------------DESKTOP---------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------------------------------
    closeBtn.onclick = function () {
        // Hide modal and overlay
        gsap.to(modal, { duration: 0.3, opacity: 0, scale: 0.7, onComplete: () => { document.getElementById("myModal").style.display = "none"; } });
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
        if (event.clientY < 10 && modal_countdown_display === true && window.innerWidth > 480 && modal.style.display !== 'flex') {
            gsap.to(overlay, { duration: 0.5, opacity: 1, visibility: "visible" });
            gsap.fromTo(modal,
                { scale: 0.7, opacity: 0, visibility: "visible" },
                { duration: 0.6, scale: 1, opacity: 1, ease: "elastic.out(1, 0.75)" }
            );
            modal.style.display = 'flex';
            overlay.style.display = 'block';
        }
    }
    function closeModal() {
        if (window.innerWidth <= 480) {
            gsap.to(modal, { duration: 0.3, opacity: 0, scale: 0.7, onComplete: () => { document.getElementById("myModal").style.display = "none"; } });
            gsap.to(overlay, { duration: 0.3, opacity: 0, onComplete: () => { document.getElementById("overlay").style.display = "none"; } });
        }
    }

    function displayModal() {
        window.addEventListener('resize', closeModal);
        document.addEventListener('mousemove', showModal);

        // Add an event listener for the form's submit event
        form.addEventListener('submit', function (event) {
            console.log('yeehaw');

            // Prevent the default form submission
            event.preventDefault();

            const email = document.getElementById('email').value;
            const discount_code = generateDiscountCode(email);

            subscribeUser(email, discount_code);

            if (email) {
                localStorage.setItem('userEmail', email);
                form.style.display = 'none';
                modalTitle.innerHTML = "You're in!🎉";
                modalDescription.style.lineHeight = '140%';
                modalDescription.style.fontFamily = 'var(--font-1)'
                modalDescription.innerHTML = "Your discount code is on the way to your inbox! We can't wait to serve you something delicious.💙<br><br>If you don't see it in your inbox within 1 minute, please check your spam folder.";
            }
        });

    }
    //----------------------------------------------------MOBILE--------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------------------------------
    let modal_mobile_timer;
    //Modal after 10 seconds
    if (localStorage.getItem('dontShowModal') !== 'true') {
        modal_mobile_timer = setTimeout(function () {
            if (window.innerWidth < 480 && modal_mobile.style.display !== 'flex') {
                gsap.from(modal_mobile, { y: "100%", ease: "elastic.out(1, 0.75)", duration: 1.5 });
                modal_mobile.style.display = 'flex';
            }
        }, 10000);
    }

    closeBtn_mobile.onclick = function () {
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
                modalTitle_mobile.innerHTML = "You're in!🎉";
                modalDescription_mobile.style.lineHeight = '140%';
                modalDescription_mobile.style.fontFamily = 'var(--font-1)';
                modalDescription_mobile.innerHTML = "Your discount code is on the way to your inbox! We can't wait to serve you something delicious.💙<br><br>If you don't see it in your inbox within 1 minute, please check your spam folder.";
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
    //----------------------------------------------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------------------------------
    function modalFooter() {

        form_footer.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('email_footer').value;
            const discount_code = generateDiscountCode(email);
            subscribeUser(email, discount_code);

            if (email) {
                form_footer.style.display = 'none';
                modalTitle_footer.innerHTML = "You're in!🎉";
                modalDescription_footer.innerHTML = "Your discount code is on the way to your inbox! We can't wait to serve you something delicious.💙<br><br>If you don't see it in your inbox within 1 minute, please check your spam folder.";
            }
        });
    }
});