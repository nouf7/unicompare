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

// Function to filter universities based on selected criteria
async function applyFilters() {
    const selectedAge = document.getElementById('age-filter').value;
    const selectedCountry = document.getElementById('country-filter').value;
    const selectedRes = document.getElementById('res-filter').value;
    const selectedSize = document.getElementById('size-filter').value;
    const selectedFocus = document.getElementById('focus-filter').value;
    const minRepScore = document.getElementById('min-rep-score').value;
    const maxRepScore = document.getElementById('max-rep-score').value;
    const minCitScore = document.getElementById('min-cit-score').value;
    const maxCitScore = document.getElementById('max-cit-score').value;
    const minEmployerRepScore = document.getElementById('min-employer-rep-score').value;
    const maxEmployerRepScore = document.getElementById('max-employer-rep-score').value;
    const minFacultyStudentScore = document.getElementById('min-faculty-student-score').value;
    const maxFacultyStudentScore = document.getElementById('max-faculty-student-score').value;

    

    const universities = await fetchUniversities();

    const filteredUniversities = universities.filter(university => {
        const ageCheck = selectedAge === 'All' || String(university.AGE) === selectedAge;
        const countryCheck = selectedCountry === 'All' || university.Country === selectedCountry;
        const resCheck = selectedRes === 'All' || university.RES === selectedRes;
        const sizeCheck = selectedSize === 'All' || university.SIZE === selectedSize;
        const focusCheck = selectedFocus === 'All' || university.FOCUS === selectedFocus;
        const minIntFacultyScore = document.getElementById('min-int-faculty-score').value;
        const maxIntFacultyScore = document.getElementById('max-int-faculty-score').value;
        const minIntResearchNetScore = document.getElementById('min-int-research-net-score').value;
        const maxIntResearchNetScore = document.getElementById('max-int-research-net-score').value;
        const minIntStudentsScore = document.getElementById('min-int-students-score').value;
        const maxIntStudentsScore = document.getElementById('max-int-students-score').value;
        const minOverallScore = document.getElementById('min-overall-score').value;
        const maxOverallScore = document.getElementById('max-overall-score').value;
        const minSustainabilityScore = document.getElementById('min-sustainability-score').value;
        const maxSustainabilityScore = document.getElementById('max-sustainability-score').value;
    
        
        const repScoreCheck = (!minRepScore || university['Academic Reputation Score'] >= minRepScore) &&
        (!maxRepScore || university['Academic Reputation Score'] <= maxRepScore);

        const citScoreCheck = (!minCitScore || university['Citations per Faculty Score'] >= minCitScore) &&
        (!maxCitScore || university['Citations per Faculty Score'] <= maxCitScore);

        const employerRepScoreCheck = (!minEmployerRepScore || university['Employer Reputation Score'] >= minEmployerRepScore) &&
                                      (!maxEmployerRepScore || university['Employer Reputation Score'] <= maxEmployerRepScore);
        
        // Check for Faculty Student Score within range
        const facultyStudentScoreCheck = (!minFacultyStudentScore || university['Faculty Student Score'] >= minFacultyStudentScore) &&
                                         (!maxFacultyStudentScore || university['Faculty Student Score'] <= maxFacultyStudentScore);

                                         const intFacultyScoreCheck = (!minIntFacultyScore || university['International Faculty Score'] >= minIntFacultyScore) &&
                                         (!maxIntFacultyScore || university['International Faculty Score'] <= maxIntFacultyScore);
            
            // Check for International Research Network Score within range
            const intResearchNetScoreCheck = (!minIntResearchNetScore || university['International Research Network Score'] >= minIntResearchNetScore) &&
                                             (!maxIntResearchNetScore || university['International Research Network Score'] <= maxIntResearchNetScore);
    
            // Return true if all checks pass
            const intStudentsScoreCheck = (!minIntStudentsScore || university['International Students Score'] >= minIntStudentsScore) &&
                                      (!maxIntStudentsScore || university['International Students Score'] <= maxIntStudentsScore);
        const overallScoreCheck = (!minOverallScore || university['Overall Score'] >= minOverallScore) &&
                                  (!maxOverallScore || university['Overall Score'] <= maxOverallScore);
        const sustainabilityScoreCheck = (!minSustainabilityScore || university['Sustainability Score'] >= minSustainabilityScore) &&
                                         (!maxSustainabilityScore || university['Sustainability Score'] <= maxSustainabilityScore);

        // Return true if all checks pass
        return ageCheck && countryCheck && resCheck && sizeCheck && focusCheck &&
               repScoreCheck && citScoreCheck && employerRepScoreCheck &&
               facultyStudentScoreCheck && intFacultyScoreCheck && intResearchNetScoreCheck &&
               intStudentsScoreCheck && overallScoreCheck && sustainabilityScoreCheck;
  
       
     
    });

    console.log('Filtered Universities:', filteredUniversities); // Log the filtered universities
    displayUniversities(filteredUniversities);
}


// Function to populate country filter options
async function populateCountryFilterOptions() {
    const universities = await fetchUniversities();
    const countries = ['All', ...new Set(universities.map(university => university.Country))];

    const countryFilter = document.getElementById('country-filter');

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });
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
            <p><strong>Rank 2023:</strong> ${university['2023 RANK']}</p>
            <p><strong>Rank 2024:</strong> ${university['2024 RANK']}</p>
            <p><strong>Age:</strong> ${university.AGE}</p>
            <p><strong>Academic Reputation Score:</strong> ${university['Academic Reputation Score']}</p>
            <p><strong>Citations per Faculty Score:</strong> ${university['Citations per Faculty Score']}</p>
            <p><strong>Country:</strong> ${university.Country}</p>
            <p><strong>Employer Reputation Score:</strong> ${university['Employer Reputation Score']}</p>
            <p><strong>FOCUS:</strong> ${university.FOCUS}</p>
            <p><strong>Faculty Student Score:</strong> ${university['Faculty Student Score']}</p>
            <p><strong>International Faculty Score:</strong> ${university['International Faculty Score']}</p>
            <p><strong>International Research Network Score:</strong> ${university['International Research Network Score']}</p>
            <p><strong>International Students Score:</strong> ${university['International Students Score']}</p>
            <p><strong>Overall Score:</strong> ${university['Overall Score']}</p>
            <p><strong>RES:</strong> ${university.RES}</p>
            <p><strong>SIZE:</strong> ${university.SIZE}</p>
            <p><strong>Sustainability Score:</strong> ${university['Sustainability Score']}</p>
            <hr>
        `;
        universitiesContainer.appendChild(universityElement);
    });
}

// Function to toggle more details
function toggleMoreDetails(universityElement) {
    const detailsElement = universityElement.querySelector('.university-details');
    detailsElement.style.display = detailsElement.style.display === 'none' ? 'block' : 'none';
}

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
            <p class="show-more-details" onclick="toggleMoreDetails(this.parentElement)">Show more details</p>
            <div class="university-details">
                <p><strong>Rank 2023:</strong> ${university['2023 RANK']}</p>
                <p><strong>Age:</strong> ${university.AGE}</p>
                <p><strong>Academic Reputation Score:</strong> ${university['Academic Reputation Score']}</p>
                <p><strong>Citations per Faculty Score:</strong> ${university['Citations per Faculty Score']}</p>
                <p><strong>Employer Reputation Score:</strong> ${university['Employer Reputation Score']}</p>
                <p><strong>FOCUS:</strong> ${university.FOCUS}</p>
                <p><strong>Faculty Student Score:</strong> ${university['Faculty Student Score']}</p>
                <p><strong>International Faculty Score:</strong> ${university['International Faculty Score']}</p>
                <p><strong>International Research Network Score:</strong> ${university['International Research Network Score']}</p>
                <p><strong>International Students Score:</strong> ${university['International Students Score']}</p>
                <p><strong>Overall Score:</strong> ${university['Overall Score']}</p>
                <p><strong>RES:</strong> ${university.RES}</p>
                <p><strong>SIZE:</strong> ${university.SIZE}</p>
                <p><strong>Sustainability Score:</strong> ${university['Sustainability Score']}</p>
            </div>
            <hr>
        `;
        universitiesContainer.appendChild(universityElement);
    });
}

// Below functions are used to compare univerities
async function populateUniversitySelection() {
    const universities = await fetchUniversities();

    const selectElement = document.getElementById('university-compare');
    universities.forEach(university => {
        if (university['Institution Name']) { 
            const option = document.createElement('option');
            option.value = university['Institution Name']; 
            option.textContent = university['Institution Name'];
            selectElement.appendChild(option);
        }
    });

}

let universitiesToCompare = [];

async function addUniversity() {
    const inputElement = document.getElementById('university-input');
    const universityName = inputElement.value.trim().toLowerCase(); 

    // check if the user enters univ. name
    if (universityName === "") {
        alert("Please enter a university name.");
        return;
    }

    // check the number of universities to compare
    if (universitiesToCompare.length >= 3) {
        alert('You can compare up to 3 universities at a time.');
        return;
    }

    try {
        const allUniversities = await fetchUniversities();
        // check for partial universities name
        const foundUniversities = allUniversities.filter(university =>
            university['Institution Name'].toLowerCase().includes(universityName)
        );

        if (foundUniversities.length > 0) {
            // case1: only one univerity is found
            if (foundUniversities.length === 1) {
                // Check if this university is already added
                if (!universitiesToCompare.includes(foundUniversities[0]['Institution Name'])) {
                    processUniversitySelection(foundUniversities[0]['Institution Name']);
                } else {
                    alert('This university has already been added.');
                }
            // case2: multiple univerisites found
            } else {
                let message = "Multiple universities found. Please select one by typing the number:\n";
                foundUniversities.forEach((uni, index) => {
                    message += `${index + 1}. ${uni['Institution Name']}\n`;
                });
                const selection = prompt(message);
                const selectedIndex = parseInt(selection, 10) - 1;

                if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < foundUniversities.length) {
                    // check if the university is already added
                    if (!universitiesToCompare.includes(foundUniversities[selectedIndex]['Institution Name'])) {
                        processUniversitySelection(foundUniversities[selectedIndex]['Institution Name']);
                    } else {
                        alert('This university has already been added.');
                    }
                } else {
                    alert("Invalid selection.");
                }
            }
        } else {
            alert("No matching universities found.");
        }
    } catch (error) {
        console.error('Error while trying to add a university:', error);
        alert("An error occurred. Please try again.");
    }
}

function processUniversitySelection(universityName) {
    // clear the input text box
    document.getElementById('university-input').value = ''; 

    // Check if the university is already added
    if (!universitiesToCompare.includes(universityName.toLowerCase())) {
        universitiesToCompare.push(universityName);
        updateSelectedUniversities();
    } else {
        alert("This university has already been added for comparison.");
    }
}

function updateSelectedUniversities() {
    const container = document.querySelector('.selected-universities');
    container.innerHTML = ''; 

    universitiesToCompare.forEach(name => {
        const div = document.createElement('div');
        div.textContent = name;
        container.appendChild(div);
    });
}

function updateSelectedUniversities() {
    const container = document.querySelector('.selected-universities');
    container.innerHTML = ''; 

    universitiesToCompare.forEach((name, index) => {
        const div = document.createElement('div');
        const deleteBtn = document.createElement('button');
        
        div.textContent = name;
        div.style.marginRight = "10px"; 
        
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = function() { removeUniversity(index); }; 
        deleteBtn.classList.add('delete-btn'); 
        
        div.appendChild(deleteBtn);
        container.appendChild(div);
    });
}

function removeUniversity(index) {
    universitiesToCompare.splice(index, 1); 
    updateSelectedUniversities(); 
}

async function compareUniversities() {
    // Check if there are universities to compare
    if (universitiesToCompare.length === 0) {
        alert('Please add at least one university to compare.');
        return;
    }

    const allUniversities = await fetchUniversities();
    // Transform the fetched university names to lowercase for comparison
    const selectedUniversitiesData = allUniversities.filter(university =>
        universitiesToCompare.map(name => name.toLowerCase()).includes(university['Institution Name'].toLowerCase())
    );

    if (selectedUniversitiesData.length > 0) {
        displayComparison(selectedUniversitiesData);
    } else {
        const comparisonResult = document.querySelector('.comparison-result');
        comparisonResult.innerHTML = '<p>No matching universities found to compare.</p>';
    }
}

function displayComparison(universities) {
    const comparisonResult = document.querySelector('.comparison-result');
    comparisonResult.innerHTML = '';

    universities.forEach(university => {
        const div = document.createElement('div');
        div.classList.add('university-comparison');
        div.innerHTML = `
            <h2>${university['Institution Name']}</h2>
            <p><strong>Rank:</strong> ${university['2024 RANK']}</p>
            <p><strong>Country:</strong> ${university.Country}</p>
            <p class="show-more-details" onclick="toggleMoreDetails(this.parentElement)">Show more details</p>
            <div class="university-details">
                <p><strong>Rank 2023:</strong> ${university['2023 RANK']}</p>
                <p><strong>Age:</strong> ${university.AGE}</p>
                <p><strong>Academic Reputation Score:</strong> ${university['Academic Reputation Score']}</p>
                <p><strong>Citations per Faculty Score:</strong> ${university['Citations per Faculty Score']}</p>
                <p><strong>Employer Reputation Score:</strong> ${university['Employer Reputation Score']}</p>
                <p><strong>FOCUS:</strong> ${university.FOCUS}</p>
                <p><strong>Faculty Student Score:</strong> ${university['Faculty Student Score']}</p>
                <p><strong>International Faculty Score:</strong> ${university['International Faculty Score']}</p>
                <p><strong>International Research Network Score:</strong> ${university['International Research Network Score']}</p>
                <p><strong>International Students Score:</strong> ${university['International Students Score']}</p>
                <p><strong>Overall Score:</strong> ${university['Overall Score']}</p>
                <p><strong>RES:</strong> ${university.RES}</p>
                <p><strong>SIZE:</strong> ${university.SIZE}</p>
                <p><strong>Sustainability Score:</strong> ${university['Sustainability Score']}</p>
            </div>
            <hr>
        `;
        comparisonResult.appendChild(div);
    });
}


// Call the function to populate country filter options when the page loads
window.onload = async function() {
    await populateCountryFilterOptions();
    await populateUniversitySelection(); 
};

// Function to handle search based on university name
function searchUniversity() {
    // Get the typed university name from the input field
    const universityName = document.getElementById('university-name').value.trim().toLowerCase();

    // Check if the input is empty
    if (universityName === "") {
        alert("Please enter a university name.");
        return;
    }

    // Redirect to search-results.html with the search query
    window.location.href = `search-results.html?q=${encodeURIComponent(universityName)}`;
}



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
// Call the searchUniversity function when the search button is clicked
document.getElementById('btn-search').addEventListener('click', searchUniversity);

