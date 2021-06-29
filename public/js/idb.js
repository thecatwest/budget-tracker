// const { request } = require("express");

// set indexedDB request
const req = indexedDB.open('budget-tracker', 1);

// declare database
let db;

// if cached resources have changed, call onupgradeneeded()
req.onupgradeneeded = function (event) {
    // save result to the db
    const db = event.target.result;
    db.createObjectStore('newBudget', {
        autoIncrement: true
    });
};

// if upgrade was successful
req.onsuccess = function (event) {
    db = event.target.result;

    // first, check if app is online, then return the budget response
    if (navigator.onLine) {
        budgetResponse();
    }
};

// if the upgrade was unsuccessful
req.onerror = function (event) {
    // clg error code
    console.log(event.target.errorCode);
};

// set up function to run app without data connection
function recordBudget(record) {
    // make new database transaction and set read/write perms
    const transaction = db.transaction(['newBudget'], 'readwrite');

    // access newBudget object store
    const budgetObjectStore = transaction.objectStore('newBudget');

    // add new record to budgetOobjectStore 
    budgetObjectStore.add(record);
};

function budgetResponse() {
    // open new transaction and give read/write perms
    const transaction = db.transaction(['newBudget'], 'readwrite');

    // access budgetObjectStore store
    const budgetObjectStore = transaction.objectStore('newBudget');

    //get all data from object store
    const getData = budgetObjectStore.getData();

    // if getData() successfully retrieves all data in the objectStore, AND
    getData.onsuccess = function () {

        // if there is data from getData(), THEN
        if (getData.result.length > 0) {

            // send the data to the api server
            fetch('/api/transaction', {
                    method: 'POST',
                    body: JSON.stringify(getData.result),
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    }
                })
                // jsonify response
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }

                    // open a new transaction newBudget and set read/write perms
                    const transaction = db.transaction(['newBudget'], 'readwrite');

                    //access budgetObjectStore store for newBudget
                    const budgetObjectStore = transaction.objectStore('newBudget');

                    // clear budgetObjectStore items
                    budgetObjectStore.clear();

                    // alert user that budgets have been saved
                    alert('Saved Budgets Submitted.')
                })
                // else, throw error
                .catch(err => console.log(err));
        }
    }
};
}