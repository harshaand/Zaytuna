window.addEventListener("load", function () {
    const serverApiUrl = 'http://localhost:3002/api/menu';
    // Fetch menu items on page load
    fetchMenuItems();

    const container_menu_cards = document.querySelector(".container-menu-cards");


    const reviews_slider = document.querySelector("#slider-reviews");
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





    // Function to fetch data from the server
    async function fetchMenuItems() {
        try {
            const response = await fetch(serverApiUrl);
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

    // Function to display menu items


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
                const { Name, Description, Image, OutOfStock } = item.fields;

                htmlinjection += `
                    <div class="card-food">
                        <img class="image-food" src="${Image[0].url}" alt="">
                        <div class="text-food">
                            <h5>${Name}</h4>
                            <p>${Description}</p>
                        
                `;
                container_menu_cards.innerHTML = htmlinjection;

                if (OutOfStock === true) {
                    htmlinjection += `
                        <h3 class="card-food-out-of-stock">Fresh out, sorry!<h3>
                        </div>
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
    }

    // Get the button and menu elements
    const buttons = document.querySelectorAll('.menu-btn');
    /*
    const breakfast_container = document.getElementById('container-Breakfast-cards');
    const lunch_container = document.getElementById('container-Lunch-cards');
    const dinner_container = document.getElementById('container-Dinner-cards');
    
    // Add click event listeners to each button
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove the 'active' class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));
            // Add 'active' class to the clicked button
            this.classList.add('active');

            // Hide all menu cards
            breakfast_container.classList.add('hidden');
            breakfast_container.classList.remove('visible');
            lunch_container.classList.add('hidden');
            lunch_container.classList.remove('visible');
            dinner_container.classList.add('hidden');
            dinner_container.classList.remove('visible');

            // Show the corresponding menu cards based on the button clicked
            if (this.id === 'breakfast-btn') {
                breakfast_container.classList.remove('hidden');
                breakfast_container.classList.add('visible');
            } else if (this.id === 'lunch-btn') {
                lunch_container.classList.remove('hidden');
                lunch_container.classList.add('visible');
            } else if (this.id === 'dinner-btn') {
                dinner_container.classList.remove('hidden');
                dinner_container.classList.add('visible');
            }
        });
    });*/
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove the 'active' class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));

            // Hide all menu cards
            document.getElementById('container-Breakfast-cards').classList.add('hidden');
            document.getElementById('container-Lunch-cards').classList.add('hidden');
            document.getElementById('container-Dinner-cards').classList.add('hidden');
            document.getElementById('container-Breakfast-cards').classList.remove('visible');
            document.getElementById('container-Lunch-cards').classList.remove('visible');
            document.getElementById('container-Dinner-cards').classList.remove('visible');

            // Add 'active' class to the clicked button
            this.classList.add('active');

            // Show the corresponding menu cards based on the button clicked
            if (this.id === 'breakfast-btn') {
                document.getElementById('container-Breakfast-cards').classList.remove('hidden');
                document.getElementById('container-Breakfast-cards').classList.add('visible');
            } else if (this.id === 'lunch-btn') {
                document.getElementById('container-Lunch-cards').classList.remove('hidden');
                document.getElementById('container-Lunch-cards').classList.add('visible');
            } else if (this.id === 'dinner-btn') {
                document.getElementById('container-Dinner-cards').classList.remove('hidden');
                document.getElementById('container-Dinner-cards').classList.add('visible');
            }
        });
    });
});