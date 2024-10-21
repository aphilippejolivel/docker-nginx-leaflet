// Initialize the map and set its default view to a specific location
Autosize.enable();
var map = L.map('map').setView([48.850520, 2.374922], 5);
var api_url = "http://localhost:3000"
// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

fetch(api_url+'/api/pins')
    .then(response => response.json())
    .then(data => {
        data.pins.forEach(pin => {
            L.marker([pin.lat, pin.lon]).addTo(map);
        });
    })
    .catch(error => console.error('Error fetching pins:', error));

// Function to perform geocoding using OpenStreetMap's Nominatim service
function geocodeCity(cityName,marker) {
    var url = `https://nominatim.openstreetmap.org/search?format=json&q=${cityName}`;

    // Make a request to Nominatim API to get the coordinates of the city
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                var lat = data[0].lat;
                var lon = data[0].lon;

                // Pan the map to the city's coordinates
                map.setView([lat, lon], 12);

                // Optional: Add a marker at the city's location
                if (marker){
                    L.marker([lat, lon]).addTo(map)
                    .bindPopup(`<b>${cityName}</b>`)
                    .openPopup();
                    fetch(api_url+'/api/pins', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ lat: lat, lon: lon }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Pin added with ID:', data.id);
                    })
                    .catch(error => console.error('Error saving pin:', error));
                }
            } else {
                alert('City not found!');
            }
        })
        .catch(error => {
            console.error('Error fetching geocode:', error);
            alert('Error fetching city location. Please try again.');
        });
}

// Search button event listener
document.getElementById('search-btn').addEventListener('click', function() {
    var city = document.getElementById('city-search').value;
    if (city) {
        geocodeCity(city,false);
    }
});

document.getElementById('marker-btn').addEventListener('click', function() {
    var city = document.getElementById('city-search').value;
    if (city) {
        geocodeCity(city,true);
    }
});

// Optional: Allow pressing Enter to trigger the search
document.getElementById('city-search').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission or page reload
        document.getElementById('search-btn').click(); // Trigger search button click
    }
});
