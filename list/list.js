import {
    checkAuth,
    createListItem,
    getListItems,
    logout,
    deleteAllListItems,
    renderItem,
    completeItem,
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
        const li = await renderItem(item);
        li.addEventListener('click', async () => {
            console.log('clicked');
            await completeItem(item.id);
            fetchAndDisplayList();
        });

        listEl.append(li);
    }
}
