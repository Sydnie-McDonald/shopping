// Enter Supabase Information
const SUPABASE_URL = 'https://gmpyleofggphhfqygglb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtcHlsZW9mZ2dwaGhmcXlnZ2xiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQzNDE0NTEsImV4cCI6MTk1OTkxNzQ1MX0.aAoG-W_B2pk78Kdb54K8sM3SQbO0g1kbGUOtqvvQhXA';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

export function getUser() {
    return client.auth.session() && client.auth.session().user;
}

export async function checkAuth() {
    const user = getUser();

    if (!user) location.replace('../');
}

export async function redirectIfLoggedIn() {
    if (getUser()) {
        location.replace('./list');
    }
}

export async function signupUser(email, password) {
    const response = await client.auth.signUp({ email, password });

    return response.user;
}

export async function signInUser(email, password) {
    const response = await client.auth.signIn({ email, password });

    return response.user;
}

export async function logout() {
    await client.auth.signOut();

    return (window.location.href = '../');
}

function checkError({ data, error }) {
    return error ? console.error(error) : data;
}

export async function getListItems() {
    const response = await client.from('shopping').select();
    // this will only grab items that belong to this user thanks to RLS and user_id property

    return checkError(response);
}

export async function createListItem(item, quantity) {
    const response = await client.from('shopping').insert([{ item, quantity }]); // because of RLS and our default values, we add user_id for free

    return checkError(response);
}

export async function buyListItem(someId) {
    // sets a given list item's bought property to true
    const response = await client.from('shopping').update({ bought: true }).match({ id: someId });

    return checkError(response);
}

export async function deleteAllListItems() {
    const response = await client.from('shopping').delete().match({ user_id: getUser().id });

    return checkError(response);
}