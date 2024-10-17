window.addEventListener("load", function () {
    //------------------------------------------------------MODALS----------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------------------------------

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
        modal.style.display = 'none';
        overlay.style.display = 'none';
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
        if (event.clientY < 10 && modal_countdown_display === true && window.innerWidth > 480) {
            modal.style.display = 'flex';
            overlay.style.display = 'block';
        }
    }
    function closeModal() {
        if (window.innerWidth <= 480) {
            modal.style.display = 'none';
            overlay.style.display = 'none';
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
    modal_mobile_timer = setTimeout(function () {
        modal_mobile.style.display = 'flex';
    }, 10000);

    closeBtn_mobile.onclick = function () {
        modal_mobile.style.display = 'none';
        localStorage.setItem('dontShowModal', 'true');
        removeModalListenersMobile();
        clearTimeout(modal_mobile_timer);

    }

    function preventNavigationMobile(e) {
        modal_mobile.style.display = 'flex';
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
                modal_mobile.style.padding = '36px var(--container-spacing-horizontal)';
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
});