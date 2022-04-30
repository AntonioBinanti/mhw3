function onTokenResponse(response) {
    console.log(response);
    return response.json();
}

function onTokenJson(json) {
    console.log(json)
    token = json.access_token;
}

function onJson_img(json) {
    console.log(json);

    const album = document.querySelector('#album_image');
    album.innerHTML = '';
    const results = json.hits;

    if (results.length == 0) {
        const messaggio = document.createElement('h1');
        messaggio.textContent = 'Nessun elemento trovato!';
        album.appendChild(messaggio);
    }

    for (result of results) {
        const image = document.createElement('img');
        image.src = result.largeImageURL;
        const riquadro = document.createElement('div');
        riquadro.appendChild(image);
        album.appendChild(riquadro);
    }
}

function onResponse(response) {
    console.log('risposta ricevuta');
    return response.json();
}

function search(event) {
    event.preventDefault();

    const content = document.querySelector("#content").value;
    console.log(content);

    if (content) {
        const text = encodeURIComponent(content);
        const img_request = img_endpoint + '?key=' + key_img + '&q=' + text + '&per_page=' + max_results;

        fetch(img_request).then(onResponse).then(onJson_img);
    }
}

function onJson_music(json) {
    console.log(json);

    const album = document.querySelector('#album_music');
    album.innerHTML = '';

    const results = json.tracks.items;
    if (results.length == 0) {
        const messaggio = document.createElement('h1');
        messaggio.textContent = 'Nessun brano trovato!';
        album.appendChild(messaggio);
    }

    for (result of results) {
        const image = document.createElement('img');
        image.src = result.album.images[0].url;
        const riquadro = document.createElement('a');
        const name = document.createElement('h3');
        name.textContent = result.album.name;
        riquadro.appendChild(image);
        riquadro.appendChild(name);
        riquadro.href = result.album.external_urls.spotify;
        riquadro.target = "_blank";
        album.appendChild(riquadro);
    }
}

function music_search(event) {
    event.preventDefault();

    const content = document.querySelector('#music_content').value;
    console.log(content);

    if (content) {
        const brano = encodeURIComponent(content);
        console.log('Cerco il brano: ' + brano);

        fetch("https://api.spotify.com/v1/search?type=track&q=" + brano + "&limit=" + max_results,
            {
                headers:
                {
                    'Authorization': 'Bearer ' + token
                }
            }
        ).then(onResponse).then(onJson_music);
    }
}

const max_results = 12;
const img_endpoint = 'https://pixabay.com/api/';
const key_img = '26959822-fee627a50bdb7d6355c505470';

const client_id = 'eee16a1069e24c43988012ba84f30e5a';
const client_secret = 'cf8f9456023d4cc490a5b214648c0e06';
let token;
fetch("https://accounts.spotify.com/api/token",
    {
        method: "post",
        body: 'grant_type=client_credentials',
        headers:
        {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        }
    }
).then(onTokenResponse).then(onTokenJson);

const form_image = document.querySelector('#image');
form_image.addEventListener('submit', search);

const form_music = document.querySelector('#music');
form_music.addEventListener('submit', music_search);