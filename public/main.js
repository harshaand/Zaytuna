/*Look at https://www.federalistpig.com/ for inspo */
window.addEventListener("load", function () {
    const images = Array.from(document.querySelectorAll('.gallery img'));
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
    gsap.fromTo('.card-review', { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 1, stagger: 0.1, ease: "power1.inOut" });
    const reviews_slider = document.querySelector(".slider");
    const reviews_left_btn = document.querySelector("#reviews-left-btn");
    const reviews_right_btn = document.querySelector("#reviews-right-btn");
    updateSliderBtnVisibility(reviews_slider, reviews_left_btn, reviews_right_btn);



    function updateSliderBtnVisibility(slider, left_btn, right_btn) {
        function updateButtonVisibility() {
            //Recommendation & review section isn't the general container size as it spans 100% of the viewport width
            //So using the hero section as a general section for reference of how wide the containers are
            // Using this to make the main display for the cards, the same width as the containers.
            const container_hero = document.querySelector(".container-hero");
            const container_width = parseFloat(window.getComputedStyle(container_hero).width);
            //container_width is a good enough rough estimate. CSS will snap scroll.
            left_btn.onclick = () => { slider.scrollLeft -= container_width };
            right_btn.onclick = () => { slider.scrollLeft += container_width };

            if (slider.scrollLeft === 0) {
                left_btn.style.visibility = 'hidden';

            } else {
                left_btn.style.visibility = 'visible';
            }

            if (slider.clientWidth > slider.scrollWidth) {
                right_btn.style.visibility = 'hidden';
            }
            //Sometimes scrollLeftstops right before the end, so added the -10 for safety
            if (slider.scrollLeft > 0 && slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
                right_btn.style.visibility = 'hidden';

            }
            else {
                right_btn.style.visibility = 'visible';
            }


        }
        slider.addEventListener('scroll', updateButtonVisibility);
        updateButtonVisibility();

        // Create a ResizeObserver
        const resizeObserver = new ResizeObserver(entries => { updateButtonVisibility(); });

        // Start observing the resizableDiv for size changes
        resizeObserver.observe(slider);

    }


    const serverApiMenuUrl = 'https://zaytunacuisine.com/api/menu';
    const serverApiReviewsUrl = 'https://zaytunacuisine.com/api/reviews';
    // Fetch menu items on page load

    fetchMenuItems();
    fetchReviewsItems();

    const container_menu_cards = document.querySelector(".container-menu-cards");

    // Function to fetch data from the server
    async function fetchMenuItems() {
        try {
            const response = await fetch(serverApiMenuUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch data from server');
            }
            const data = await response.json();
            displayMenuItems(data.records);
        } catch (error) {
            console.error(error);
            alert('Error fetching menu items. Please check the console for more details.');
        }
    }

    // Function to fetch data from the server
    async function fetchReviewsItems() {
        try {
            const response = await fetch(serverApiReviewsUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch data from server');
            }
            const data = await response.json();
            displayReviewItems(data.records);
        } catch (error) {
            console.error(error);
            alert('Error fetching menu items. Please check the console for more details.');
        }
    }

    // Function to display menu items
    function displayMenuItems(items) {
        container_menu_cards.innerHTML = ''; // Clear the container
        let htmlinjection = '';
        const menu_time = ['Breakfast', 'Lunch', 'Dinner'];
        const displayFilteredRecords = items.filter(item => item.fields.Display && item.fields.Feature != null);
        menu_time.forEach(time => {
            htmlinjection += `<div class="container-menu-time-cards hidden" id="container-${time}-cards">`;
            const timeFilteredRecords = displayFilteredRecords.filter(item => item.fields.MenuTime === time);
            const sortedRecords = timeFilteredRecords.sort((a, b) => a.fields.Order - b.fields.Order);
            sortedRecords.forEach(item => {
                const { Name, Image, OutOfStock } = item.fields;
                const Description = item.fields.Description != null ? item.fields.Description : ""
                if (item.fields.Image != null) {
                    htmlinjection += `
                            <div class="card-food" id="card-feature-food">
                                <img class="image-food" src="${Image[0].url}" alt="">
                                <div class="text-food">
                                <div class="food-name-description">
                                    <p class="text-food-name">${Name}</p>
                                    <p>${Description}</p>
                                </div>
                        `;
                } else {
                    htmlinjection += `
                           <div class="card-food" id="card-feature-food">
                            
                                <div class="text-food">
                                    <div class="food-name-description">
                                        <p class="text-food-name">${Name}</p>
                                        <p>${Description}</p>
                                    </div>
                        `;
                }
                container_menu_cards.innerHTML = htmlinjection;
                if (OutOfStock === true) {
                    htmlinjection += `
                                </div>
                            <p class="card-food-out-of-stock">Fresh out, sorry!</p>
                            </div>
                            `}
                else {
                    htmlinjection += `
                                </div>
                            </div>
                        `;
                }
            });
            htmlinjection += `
                </div> `;
        })
        document.getElementById('container-Breakfast-cards').classList.remove('hidden');
        gsap.fromTo('.card-food', { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 1, stagger: 0.05, ease: "power1.inOut" });
    }

    function displayReviewItems(items) {
        reviews_slider.innerHTML = ''; // Clear the container
        let htmlinjection = '<div id="cards-spacer-reviews"></div>';
        const filteredRecords = items.filter(item => item.fields.Display != null);
        const sortedRecords = filteredRecords.sort((a, b) => a.fields.Order - b.fields.Order);
        sortedRecords.forEach(item => {
            const { Name, Image, ReviewText, URL, Source } = item.fields;
            htmlinjection += `
                <a href="${URL}" class="card-review" target="_blank">
                    <p class="text-review">${ReviewText}</p>
                    <div class="info-review">
                        <img class="image-reviewer" src="${Image[0].url}" alt="">
                            <p class="text-reviewer-name">${Name}</p>
                            <p class="text-review-source">Review from ${Source}</p>
                    </div>
                </a>
                `;

        });
        htmlinjection += `
                <div id="cards-spacer-reviews"></div>`;
        reviews_slider.innerHTML = htmlinjection;
        gsap.fromTo('.card-review', { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 1, stagger: 0.05, ease: "power1.inOut" });
    }

    // Get the button and menu elements
    const buttons = document.querySelectorAll('.menu-btn');
    document.getElementById('breakfast-btn').classList.add('active');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove the 'active' class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));
            buttons.forEach(btn => btn.disabled = false);
            this.classList.add('active');
            this.disabled = true;


            // Hide all menu cards
            document.getElementById('container-Breakfast-cards').classList.add('hidden');
            document.getElementById('container-Breakfast-cards').classList.remove('visible');
            document.getElementById('container-Lunch-cards').classList.add('hidden');
            document.getElementById('container-Lunch-cards').classList.remove('visible');
            document.getElementById('container-Dinner-cards').classList.add('hidden');
            document.getElementById('container-Dinner-cards').classList.remove('visible');


            // Show the corresponding menu cards based on the button clicked
            if (this.id === 'breakfast-btn') {
                document.getElementById('container-Breakfast-cards').classList.remove('hidden');
                document.getElementById('container-Breakfast-cards').classList.add('visible');
                gsap.fromTo('#container-Breakfast-cards .card-food', { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.05, ease: "power1.inOut" });
            } else if (this.id === 'lunch-btn') {
                document.getElementById('container-Lunch-cards').classList.remove('hidden');
                document.getElementById('container-Lunch-cards').classList.add('visible');
                gsap.fromTo('#container-Lunch-cards .card-food', { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.05, ease: "power1.inOut" });
            } else if (this.id === 'dinner-btn') {
                document.getElementById('container-Dinner-cards').classList.remove('hidden');
                document.getElementById('container-Dinner-cards').classList.add('visible');
                gsap.fromTo('#container-Dinner-cards .card-food', { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.05, ease: "power1.inOut" });
            }
        });
    });

});