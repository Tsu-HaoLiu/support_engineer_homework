
/**
 * Convert standard date to (DD/MM/YYYY) format
 * @param {string} dateToFormat - Date in string format
 * @returns {string} - The date in (DD/MM/YYYY) format
 */
function formatDate(dateToFormat) {
    let formatedDate = new Date(dateToFormat);
    let day = formatedDate.getDate().toString().padStart(2, "0");
    let month = (formatedDate.getMonth()+1).toString().padStart(2, "0");
    let year = formatedDate.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Fetch CSV/JSON data 
 * @param {string} url - url/file location
 * @returns {string} - returns data in JSON format
 */
function fetchJSON(url) {
    return fetch(url).then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${fileURL}: ${response.status} ${response.statusText}`);
            }
            return response.json();
        }).catch(error => {
            console.error('Error fetching JSON:', error);
        });
}

/**
 * Fetch CSV/JSON data 
 * @returns {Object} - returns org and account data in JSON format
 */
async function fetchTestData() {
    let orgJSON = await fetchJSON("src/data/organization_orm.json");
    console.log('org', orgJSON);
    let accountJSON = await fetchJSON("src/data/account_plan_orm.json");
    console.log('account', accountJSON);
    return { orgJSON, accountJSON };
}

/**
 * Fetch CSV/JSON data 
 * @param {Object[]} arrayToFilter - List of items to check for duplicates
 * @returns {Object[]} - duplicated items
 */
function filterDuplicate(arrayToFilter) {
    // Create an object to track duplicates
    const duplicates = {};
    const combinedDuplicates = [];

    // Iterate through the array
    arrayToFilter.forEach(item => {
        // Convert the object properties to a string so it can be used as a key
        const itemString = JSON.stringify(item.organizationId);

        // Check if the string is already in the duplicates object
        if (duplicates[itemString]) {
            duplicates[itemString].push(item);
        } else {
            duplicates[itemString] = [item];
        }
    });

    // Print the duplicate entries as arrays of objects
    for (const key in duplicates) {
        if (duplicates[key].length > 1) {
            combinedDuplicates.push(duplicates[key]);
        }
    }
    return combinedDuplicates[0];
}


export { formatDate, fetchTestData, filterDuplicate };