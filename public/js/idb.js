// create variable to hold db connection
let db;

// establish connection to IndexedDB database called 'budget_tracker' and set to version 1
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_spend', { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;

    if (navigator.onLine) {
        uploadTransaction();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['new_spend'], 'readwrite');

    const spendObjectStore = transaction.objectStore('new_spend');

    spendObjectStore.add(record);
};

function uploadTransaction() {
    const transaction = db.transaction(['new_spend'], 'readwrite');

    const spendObjectStore = transaction.objectStore('new_spend');

    const getAll = spendObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                //open one more transaction
                const transaction = db.transaction(['new_spend'], 'readwrite');
                // access the new_spend object store
                const spendObjectStore = transaction.objectStore('new_spend');
                // clear all items in store
                spendObjectStore.clear();
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
};

window.addEventListener('online', uploadTransaction);