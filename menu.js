
window.addEventListener("load", function () {
    const serverApiUrl = 'http://localhost:3002/api/menu';
    // Fetch menu items on page load
    fetchMenuItems();

    const food_category = document.querySelector("#food-category");
    const container_menu_cards = document.querySelector(".container-menu-cards");

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
        const uniqueCategories = [...new Set(items.map(item => item.fields.Category))];
        const orderedCategories = uniqueCategories.sort((a, b) => parseFloat(a) - parseFloat(b));

        console.log(orderedCategories);
        food_category.innerHTML = ''; // Clear the container
        let htmlinjection = '';



        orderedCategories.forEach(category => {
            htmlinjection += `<h2 class="heading-menu-category">${category.replace(/[^a-zA-Z\s]/g, '')}</h2>`;
            const filteredRecords = items.filter(item => item.fields.Category === category);

            filteredRecords.forEach(item => {


                console.log(item.fields.Category);
                const { Name, Description, Image, Display, OutOfStock } = item.fields;
                if (Display === true) {
                    htmlinjection += `
                <div class="card-food">
                    <img class="image-food" src="${Image[0].url}" alt="">
                    <div class="text-food">
                        <h4>${Name}</h4>
                        <p>${Description}</p>
                    
            `;
                    food_category.innerHTML = htmlinjection;

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

                }


                htmlinjection += `</div>`;
            });





        });


    }
});