
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

    //-------------------------------------NAV MOBILE-------------------------------------
    const hamburger = document.getElementById('hamburger');
    const mobile_menu = document.getElementById('mobile-menu');

    hamburger.addEventListener('click', () => {
        mobile_menu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    //-------------------------------------MENU API CALL-------------------------------------
    const serverApiMenuUrl = 'http://localhost:3002/api/menu';

    fetchMenuItems();

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

    //-------------------------------------MENU DISPLAY-------------------------------------
    const container_menu = document.querySelector(".container-menu");

    function displayMenuItems(items) {
        const menu_time = {
            Breakfast: "Served 9 AM - 11 AM",
            Lunch: "Served 11 AM - 4 PM",
            Dinner: "Served 4 PM - 10 PM "
        };
        const unique_categories = [...new Set(items.map(item => item.fields.Category))];
        const ordered_categories = unique_categories.sort((a, b) => parseFloat(a) - parseFloat(b));

        const display_filtered_records = items.filter(item => item.fields.Display);

        let htmlinjection = '';

        for (const time in menu_time) {
            htmlinjection += `
                                <div class="container-menu-page-time-cards hidden" id="container-${time}-cards">
                                <p class="description-menu animation-section-p"> ${menu_time[time]}</p>`;
            const time_filtered_records = display_filtered_records.filter(item => item.fields.MenuTime === time);
            const sorted_records = time_filtered_records.sort((a, b) => a.fields.Order - b.fields.Order);
            ordered_categories.forEach(category => {
                //<div class="category-${category.replace(/[^a-zA-Z/s]/g, '')}">
                const filteredRecords = sorted_records.filter(item => item.fields.Category === category);
                if (filteredRecords.length != 0) {
                    htmlinjection += `
                <div class="container-category">
                <h3 class="heading-menu-category animation-section-p">${category.replace(/[^a-zA-Z/s]/g, '')}</h3>
                <div class="container-category-cards">`;

                    filteredRecords.forEach(item => {
                        const { Name, Image, OutOfStock } = item.fields;
                        const Description = item.fields.Description != null ? item.fields.Description : ""
                        if (item.fields.Image != null) {
                            htmlinjection += `
                    <div class="card-food" id="cards-menu-page">
                        <img class="image-food" src="${Image[0].url}" alt="">
                        <div class="text-food">
                        <div class="food-name-description">
                            <p class="text-food-name">${Name}</p>
                            <p>${Description}</p>
                        </div>
                `;
                        } else {
                            htmlinjection += `
                    <div class="card-food" id="cards-menu-page">
                    
                        <div class="text-food">
                            <div class="food-name-description">
                                <p class="text-food-name">${Name}</p>
                                <p>${Description}</p>
                            </div>
                `;
                        }
                        container_menu.innerHTML = htmlinjection;
                        if (OutOfStock === true) {
                            htmlinjection += `
                        </div>
                    <p class="card-food-out-of-stock">Fresh out, sorry!<p>
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
            </div> 
            </div>`;
                }
                else {
                    htmlinjection += ``
                }
            });


            htmlinjection += `

            </div>`;
        }
        document.getElementById('container-Breakfast-cards').classList.remove('hidden');
        gsap.from(".animation-section-p", { duration: 1, delay: .9, opacity: 0, y: 30, ease: "power1.inOut" });
        gsap.fromTo('.card-food', { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 1, stagger: 0.05, ease: "power1.inOut" });

    }

    const buttons = document.querySelectorAll('.menu-btn');
    document.getElementById('breakfast-btn').classList.add('active');
    buttons.forEach(button => {
        button.addEventListener('click', function () {

            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');


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