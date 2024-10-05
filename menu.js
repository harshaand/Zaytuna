
window.addEventListener("load", function () {
    const serverApiMenuUrl = 'http://localhost:3002/api/menu';
    // Fetch menu items on page load
    fetchMenuItems();

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

    // Function to display menu items



    const container_menu = document.querySelector(".container-menu");
    // Function to display menu items
    function displayMenuItems(items) {
        const menu_time = ['Breakfast', 'Lunch', 'Dinner'];
        const uniqueCategories = [...new Set(items.map(item => item.fields.Category))];
        const orderedCategories = uniqueCategories.sort((a, b) => parseFloat(a) - parseFloat(b));

        const displayFilteredRecords = items.filter(item => item.fields.Display);


        let htmlinjection = '';


        menu_time.forEach(time => {
            htmlinjection += `<div class="container-menu-page-time-cards hidden" id="container-${time}-cards">`;
            const timeFilteredRecords = displayFilteredRecords.filter(item => item.fields.MenuTime === time);
            const sortedRecords = timeFilteredRecords.sort((a, b) => a.fields.Order - b.fields.Order);
            orderedCategories.forEach(category => {
                //<div class="category-${category.replace(/[^a-zA-Z/s]/g, '')}">
                const filteredRecords = sortedRecords.filter(item => item.fields.Category === category);
                console.log(filteredRecords);
                if (filteredRecords.length != 0) {
                    htmlinjection += `
                <div class="container-category">
                <h3 class="heading-menu-category">${category.replace(/[^a-zA-Z/s]/g, '')}</h3>
                <div class="container-category-cards">`;

                    filteredRecords.forEach(item => {
                        const { Name, Image, OutOfStock, Price } = item.fields;
                        console.log(Name);
                        const Description = item.fields.Description != null ? item.fields.Description : ""
                        if (item.fields.Image != null) {
                            htmlinjection += `
                    <div class="card-food" id="cards-menu-page">
                        <img class="image-food" src="${Image[0].url}" alt="">
                        <div class="text-food">
                        <div class="food-name-description">
                            <h5>${Name}</h5>
                            <p>${Description}</p>
                        </div>
                            <h6>${Price}</h6>   
                `;
                        } else {
                            htmlinjection += `
                    <div class="card-food" id="cards-menu-page">
                    
                        <div class="text-food">
                            <div class="food-name-description">
                                <h5>${Name}</h5>
                                <p>${Description}</p>
                            </div>
                            <h6>${Price}</h6>
                `;
                        }
                        container_menu.innerHTML = htmlinjection;
                        if (OutOfStock === true) {
                            htmlinjection += `
                        </div>
                    <h3 class="card-food-out-of-stock">Fresh out, sorry!<h3>
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
        })
        document.getElementById('container-Breakfast-cards').classList.remove('hidden');

    }

    // Get the button and menu elements
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