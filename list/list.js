import {
    checkAuth,
    createListItem,
    getListItems,
    buyListItem,
    logout,
    deleteAllListItems,
} from '../fetch-utils.js';

const form = document.querySelector('.list-form');
const deleteButton = document.querySelector('.delete');
const listEl = document.querySelector('.list');

checkAuth();

const logoutButton = document.getElementById('logout');

deleteButton.addEventListener('click', async () => {
    await deleteAllListItems();

    await fetchAndDisplayList();
});

logoutButton.addEventListener('click', () => {
    logout();
});

window.addEventListener('load', async () => {
    await fetchAndDisplayList();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    const item = data.get('item');
    const quantity = data.get('quantity');

    // - send the new item to supabase and create a new row
    await createListItem(item, quantity);
    // - clear out the old list
    // - fetch the list again
    // - loop through those items, create DOM elements, and append -- render items differently if "bought: true"
    form.reset();

    await fetchAndDisplayList();
});

async function fetchAndDisplayList() {
    // - call supabase to fetch all shopping items for this user
    const list = await getListItems();

    // - loop through those items, create DOM elements, and append -- render items differently if "bought: true"
    listEl.textContent = '';
    for (let item of list) {
        const listItemEl = document.createElement('p');

        listItemEl.classList.add('list-item');

        listItemEl.textContent = `${item.quantity} ${item.item}`;

        if (item.bought) {
            listItemEl.classList.add('bought');
        } else {
            listItemEl.classList.add('not-bought');
            listItemEl.addEventListener('click', async () => {
                // change the boolean to true
                await buyListItem(item.id);

                // after we update the data, let's fetch it again and render it again
                fetchAndDisplayList();
            });
        }

        listEl.append(listItemEl);
    }
}
