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
}