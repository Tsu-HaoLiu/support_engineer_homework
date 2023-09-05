// --- Imports --- //
import { formatDate, fetchTestData, filterDuplicate } from './utils.js';

// --- GLOBAL --- //
const results = document.getElementById('data');
const { orgJSON, accountJSON } = await fetchTestData();
// ------------- //

const dropdown = document.getElementById('dropdown');

// Function to show/hide divs based on the selected item
function showSelectedDiv() {
    const selectedOption = dropdown.value;
    const hiddenReports = document.querySelectorAll('.hidden');

    // Remove element display styling on reports
    for (const report of hiddenReports) {
        report.style.display = '';
    }
    
    // Show the element of selected option
    document.getElementById(selectedOption).style.display = 'block';
}

// Event listener to trigger the function when the dropdown changes
dropdown.addEventListener('change', showSelectedDiv);

// ------------------ Report 1 ------------------ //
// Takes the value of a `myShopifyDomain` field as an 
// input and returns their `optimization` settings.
//------------------------------------------------//
function getShopifyDomain() {
    const inputValue = document.getElementById('inputDomain').value.toLowerCase();
    let validInput = inputValue.endsWith('myshopify.com'); // checks input for valid domain name
    let displayValue = 'Invalid shopify domain, please check the domain';

    if (validInput) {
        // Loops through orgs and checks for matching `myShopifyDomain`
        for(let org of orgJSON) {
            if (org.myShopifyDomain.toLowerCase() == inputValue) {
                displayValue = JSON.stringify(JSON.parse(org.setup)['optimization']);
                break;
            } 
        }
    } else if (!inputValue || inputValue.length === 0) {
        displayValue = 'Please enter a valid shopify domain';
    } 
    
    // Output results to text box
    results.textContent = displayValue;
}

// Return results on button click or pressing `Enter` in input box
document.getElementById('btnDomainReport').addEventListener('click', getShopifyDomain);
document.getElementById('inputDomain').addEventListener("keyup", (event) => {
    if (event.key == 'Enter') document.getElementById('btnDomainReport').click();
});

// ------------------ Report 2 ------------------ //
// Loops through all organizations and shows the date
// they were created (DD/MM/YYYY), their `status`,
// and `planName` sorted by oldest to newest.
//------------------------------------------------//
function getSortedOrg() {
    let data = [];
    let missingPlans = [];

    // Loop through Org for ids
    for(let org of orgJSON) {
        let orgID = org.id;
        let validPlans = false;

        // Loop through accounts to make sure orgs -> plans
        for(let account of accountJSON) {
            // skip if org and plan id don't match
            if (orgID !== account.organizationId) continue; 

            // Format date to correct format
            let parsedDate = formatDate(account['createdDate']);

            data.push({
                "organizationName": org.orgName,
                "organizationId": account.organizationId,
                "createdDate": parsedDate,
                "status": account.status,
                "planName": account.planName
            });
            validPlans = true;
        }

        // If the org doesn't have valid plans push to array
        if (!validPlans) {
            missingPlans.push({
                "organizationName": org.orgName,
                "organizationId": orgID,
            });
        }
    }

    let duplicates = filterDuplicate(data);

    // Format results so they are human readable
    data = JSON.stringify(data).replace(/},{/g, '},\r\n{');
    duplicates = JSON.stringify(duplicates).replace(/},{/g, '},\r\n{');
    missingPlans = JSON.stringify(missingPlans).replace(/},{/g, '},\r\n{');

    // Output results to text box
    results.textContent = `${data}\nDuplicates:\n${duplicates}\nOrgs missing Plans:\n${missingPlans}`;
}

// Event listener to trigger the function on button click
document.getElementById('orgSort').addEventListener('click', getSortedOrg);

// ------------------ Report 3 ------------------ //
// Returns the list of organizations whose status is cancelled.
//------------------------------------------------//
function getCancelledPlans() {
    let data = [];

    // Loop through account plans to check for cancelled statuses
    for(let account of accountJSON) {
        if (account.status.toLowerCase() !== 'cancelled') continue;

        // Return org name of the cancelled plan and push info to array
        const orgName = orgJSON.find(obj => obj.id === account.organizationId).orgName;
        data.push({
            "organizationName": orgName,
            "organizationId": account['organizationId'],
            "status": account.status
        });
    }
    // Output results to text box
    results.textContent = JSON.stringify(data);
}

// Event listener to trigger the function on button click
document.getElementById('cancelledPlans').addEventListener('click', getCancelledPlans);

// ------------------ Report 4 ------------------ //
// Takes the value of an `orgName` and returns 
// the organization record in JSON format.
//------------------------------------------------//
function getOrgData() {
    const inputValue = document.getElementById('inputOrgName').value.toLowerCase();
    let displayValue = 'Invalid organization name, please check the domain';

    if (!inputValue || inputValue.length === 0) {
        results.textContent = 'Please enter a valid organization name';
        return;
    }
    
    // Loops through org and checks for matching `orgName`
    for(let org of orgJSON) {
        if (org.orgName.toLowerCase() == inputValue) {
            // Checks for account plan using matching org id
            const orgPlan = JSON.stringify(accountJSON.find(obj => obj.organizationId === org.id)) || "No active plan found!";
            // Format info in a human readable format
            displayValue = `${JSON.stringify(org).replace(/","/g, '",\r\n"')}\n\nOrganization's account plan:\n${orgPlan.replace(/","/g, '",\r\n"')}`;
            break;
        } 
    }

    // Output results to text box
    results.textContent = displayValue;
}

// Return results on button click or pressing `Enter` in input box
document.getElementById('btnOrgName').addEventListener('click', getOrgData);
document.getElementById('inputOrgName').addEventListener("keyup", (event) => {
    if (event.key == 'Enter') document.getElementById('btnOrgName').click();
});