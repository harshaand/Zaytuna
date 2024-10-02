window.addEventListener("load", function () {
    const serverApiUrl = 'http://localhost:3002/api/menu';
    // Fetch menu items on page load
    fetchMenuItems();

    const food_slider = document.querySelector("#slider-food");
    const food_left_btn = document.querySelector("#food-left-btn");
    const food_right_btn = document.querySelector("#food-right-btn");
    updateSliderBtnVisibility(food_slider, food_left_btn, food_right_btn);

    const reviews_slider = document.querySelector("#slider-reviews");
    const reviews_left_btn = document.querySelector("#reviews-left-btn");
    const reviews_right_btn = document.querySelector("#reviews-right-btn");
    updateSliderBtnVisibility(reviews_slider, reviews_left_btn, reviews_right_btn);

    const categories_slider = document.querySelector("#slider-categories");
    const categories_left_btn = document.querySelector("#categories-left-btn");
    const categories_right_btn = document.querySelector("#categories-right-btn");
    updateSliderBtnVisibility(categories_slider, categories_left_btn, categories_right_btn);



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
        food_slider.innerHTML = ''; // Clear the container
        let htmlinjection = '<div id="cards-spacer-food"></div>';

        const filteredRecords = items.filter(item => item.fields.Display && item.fields.FeatureRank != null);
        const sortedRecords = filteredRecords.sort((a, b) => a.fields.FeatureRank - b.fields.FeatureRank);

        sortedRecords.forEach(item => {
            const { Name, Description, Image, OutOfStock } = item.fields;

            htmlinjection += `
                <div class="card-food">
                    <img class="image-food" src="${Image[0].url}" alt="">
                    <div class="text-food">
                        <h4>${Name}</h4>
                        <p>${Description}</p>
                    
            `;
            food_slider.innerHTML = htmlinjection;

            if (OutOfStock === true) {
                htmlinjection += `
                    <h3 class="card-food-out-of-stock">Fresh out,<br>sorry!<h3>
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
    }


});