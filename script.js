// URLs for your Firebase Realtime Databases
const db1URL = 'https://unicompare-1-default-rtdb.firebaseio.com/.json';
const db2URL = 'https://unicompare-2-default-rtdb.firebaseio.com/.json';

// Custom sorting function to handle different formats of '2024 RANK'
function customSort(a, b) {
    const rankA = parseRank(a['2024 RANK']);
    const rankB = parseRank(b['2024 RANK']);

    // Compare ranks
    if (rankA !== rankB) {
        return rankA - rankB;
    } else {
        // If ranks are equal, sort alphabetically by institution name
        return a['Institution Name'].localeCompare(b['Institution Name']);
    }
}

// Function to parse '2024 RANK' values into numeric ranks for comparison
function parseRank(rank) {
    if (typeof rank === 'number') {
        return rank; // Numeric rank
    } else if (rank.endsWith('+')) {
        return parseInt(rank); // "1400+" format
    } else if (rank.includes('-')) {
        // Range format, e.g., "660-700"
        const parts = rank.split('-');
        return parseInt(parts[0]); // Use the lower bound of the range
    } else {
        return Number.MAX_SAFE_INTEGER; // Handle unexpected formats
    }
}

// Function to fetch universities from both databases
async function fetchUniversities() {
    try {
        // Fetch data from both databases concurrently
        const [response1, response2] = await Promise.all([
            fetch(db1URL),
            fetch(db2URL)
        ]);

        const data1 = await response1.json();
        const data2 = await response2.json();

        // Combine data from both databases into one array
        const universities1 = Object.values(data1);
        const universities2 = Object.values(data2);
        const universities = [...universities1, ...universities2];

        // Sort universities using the custom sorting function
        universities.sort(customSort);

        console.log('Sorted Universities:', universities); // Log the sorted universities array

        return universities;
    } catch (error) {
        console.error('Error fetching universities:', error);
        throw error;
    }
}

// Function to populate country filter options
async function populateCountryFilterOptions() {
    const universities = await fetchUniversities();
    const countries = [...new Set(universities.map(university => university.Country))];

    const countryFilter = document.getElementById('country-filter');

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });
}

// Function to filter universities by selected countries
async function applyFilters() {
    const selectedCountries = Array.from(document.getElementById('country-filter').selectedOptions).map(option => option.value);
    const universities = await fetchUniversities();

    const filteredUniversities = universities.filter(university => selectedCountries.includes(university.Country));

    console.log('Filtered Universities:', filteredUniversities); // Log the filtered universities
    displayUniversities(filteredUniversities);
}

// Function to display universities
function displayUniversities(universities) {
    const universitiesContainer = document.querySelector('.universities');
    universitiesContainer.innerHTML = '';

    universities.forEach(university => {
        const universityElement = document.createElement('div');
        universityElement.classList.add('university');
        universityElement.innerHTML = `
            <h2>${university['Institution Name']}</h2>
            <p><strong>Rank:</strong> ${university['2024 RANK']}</p>
            <p><strong>Country:</strong> ${university.Country}</p>
            <hr>
        `;
        universitiesContainer.appendChild(universityElement);
    });
}

// Call the function to populate country filter options when the page loads
window.onload = async function() {
    await populateCountryFilterOptions();
};

// Function to handle form submission for university search
document.getElementById('search-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the typed university name from the input field
    const universityName = document.getElementById('university-name').value.trim();

    // Fetch university information based on the typed name
    const universityInfo = await fetchUniversityInfo(universityName);

    // Display the university information on the page
    displayUniversity(universityInfo);
});

// Function to fetch university information based on the partial name
async function fetchUniversityInfo(universityName) {
    try {
        // Fetch data from both databases concurrently
        const [response1, response2] = await Promise.all([
            fetch(db1URL),
            fetch(db2URL)
        ]);

        const data1 = await response1.json();
        const data2 = await response2.json();

        // Combine data from both databases into one array
        const universities1 = Object.values(data1);
        const universities2 = Object.values(data2);
        const universities = [...universities1, ...universities2];

        // Find universities by partial name
        const foundUniversities = universities.filter(university =>
            university['Institution Name'].toLowerCase().includes(universityName.toLowerCase())
        );

        return foundUniversities.length > 0 ? foundUniversities : null; // Return found universities or null if not found
    } catch (error) {
        console.error('Error fetching university information:', error);
        throw error;
    }
}


// Function to display a single university
function displayUniversity(university) {
    const universitiesContainer = document.querySelector('.universities');
    universitiesContainer.innerHTML = '';

    if (university && university.length > 0) {
        university.forEach(university => {
            const universityElement = document.createElement('div');
            universityElement.classList.add('university');
            universityElement.innerHTML = `
            <h2>${university['Institution Name']}</h2>
            <p><strong>Rank:</strong> ${university['2024 RANK']}</p>
            <p><strong>Country:</strong> ${university.Country}</p>
            <p><strong>Overall Score:</strong> ${university['Overall Score']}</p>
            <p><strong>Age:</strong> ${university.AGE}</p>
            <p><strong>Academic Reputation Score:</strong> ${university['Academic Reputation Score']}</p>
            <p><strong>Citations per Faculty Score:</strong> ${university['Citations per Faculty Score']}</p>
            <p><strong>Employer Reputation Score:</strong> ${university['Employer Reputation Score']}</p>
            <p><strong>Faculty Student Score:</strong> ${university['Faculty Student Score']}</p>
            <p><strong>International Faculty Score:</strong> ${university['International Faculty Score']}</p>
            <p><strong>International Research Network Score:</strong> ${university['International Research Network Score']}</p>
            <p><strong>International Students Score:</strong> ${university['International Students Score']}</p>
            <p><strong>Sustainability Score:</strong> ${university['Sustainability Score']}</p>
            <hr>
            `;
            universitiesContainer.appendChild(universityElement);
        });
    } else {
        const noResultMessage = document.createElement('p');
        noResultMessage.textContent = 'No information found for the specified university.';
        universitiesContainer.appendChild(noResultMessage);
    }
}
