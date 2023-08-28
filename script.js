const clientId = "6fd7da8323b5478aafa52dc629d650f4"; // Replace with your client ID
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
let userID = ''
let top50Tracks = [{}]
let top50Artists = [{}]
let recommendationArtist = {}
let finalRecomendationsList = [{}]
let genres = []
let savedSongs = [{}]
let selectedSeeds = {
  topSong: [],
  savedSong: [],
  artist: [],
  genre: []
}
let seedDisplay = []
let accessToken
let profile

const genresToListButton = document.querySelector('.submitButton');
const topSongsDropdown = document.getElementById('topSongs')
const topArtistsDropdown = document.getElementById('topArtists')
const savedSongsDropdown = document.getElementById('savedSongs')
const genresDropdown = document.getElementById('genres')
const getRecomendationsButton = document.getElementById('getRecomendationsButton')

const populateStartingUI = (profile) => {
  let emailDisplayLink = document.getElementById("email")
  emailDisplayLink.innerText = profile.email;
  emailDisplayLink.setAttribute('href', profile.external_urls.spotify)

  savedSongs.forEach(song => {
    const option = document.createElement('option')
    option.setAttribute('value', song.name)
    option.innerHTML = song.name
    savedSongsDropdown.appendChild(option)
  })

  genres.forEach(el => {
    const option = document.createElement('option')
    option.setAttribute('value', el)
    option.innerHTML = el
    genresDropdown.appendChild(option)
  })

  top50Tracks.forEach(el => {
    const option = document.createElement('option')
    option.setAttribute('value', el.name)
    option.innerHTML = `${el.name}`
    topSongsDropdown.appendChild(option)
  })

  top50Artists.forEach(el => {
      const option = document.createElement('option')
      option.setAttribute('value', el.name)
      option.innerHTML = `${el.name}`
      topArtistsDropdown.appendChild(option)
  })
}

getRecomendationsButton.addEventListener('click', async function(){
  console.log('selectedSeeds:', selectedSeeds);
  let recomendations = await get50Recommendations(accessToken, selectedSeeds)
  console.log(recomendations)
  recomendations.tracks.map((track, i = 0) => {
    let trackName = track.name;
  
    const featIndex = trackName.indexOf('(feat.');
    const ftIndex = trackName.indexOf('(ft.');
    if (featIndex !== -1) {
        trackName = trackName.substring(0, featIndex).trim();
      } else if(ftIndex !== -1){
        trackName = trackName.substring(0, ftIndex).trim();
    }
    finalRecomendationsList[i] = {
      name: trackName,
      artists: [],
      id: track.id,
      previewURL: track.preview_url,
      picURL: track.album.images[1].url,
      activated: false
    }
    track.artists.map(artist =>{
      if(i === 0) {
        finalRecomendationsList[i].artists.push(`${artist.name}`)
      } else{
        finalRecomendationsList[i].artists.push(` ${artist.name}`)
      }
    })
    i++
  })
  console.log(finalRecomendationsList)
  populateUI(profile);
})

genresToListButton.addEventListener('click', function() {
  if(topSongsDropdown.value !== 'none' && !seedDisplay.includes(topSongsDropdown.value) && seedDisplay.length < 5){
    selectedSeeds.topSong.push({
      song: topSongsDropdown.value,
      id: top50Tracks.find(track => track.name === topSongsDropdown.value).id
    });
    seedDisplay.push(topSongsDropdown.value)
  }
  
  if(savedSongsDropdown.value !== 'none' && !seedDisplay.includes(savedSongsDropdown.value) && seedDisplay.length < 5){
    selectedSeeds.savedSong.push({
      song: savedSongsDropdown.value,
      id: savedSongs.find(track => track.name === savedSongsDropdown.value).id
    });
    seedDisplay.push(savedSongsDropdown.value)
  }

  if(topArtistsDropdown.value !== 'none' && !seedDisplay.includes(topArtistsDropdown.value) && seedDisplay.length < 5){
    selectedSeeds.artist.push({
      artist: topArtistsDropdown.value,
      id: top50Artists.find(track => track.name === topArtistsDropdown.value).id
    });
    seedDisplay.push(topArtistsDropdown.value)
  }

  if(genresDropdown.value !== 'none' && !seedDisplay.includes(genresDropdown.value) && seedDisplay.length < 5){
    selectedSeeds.genre.push(genresDropdown.value)
    seedDisplay.push(genresDropdown.value)
  }

  console.log('selectedSeeds:', selectedSeeds);
  // Optional: Update the "seedsDisplay" with the selected values
  
    let seedDiv = document.querySelector('.seedsDisplay')
    seedDiv.textContent = ``
    seedDisplay.forEach((el, i) => {
      const span = document.createElement('span')
      span.setAttribute('class', 'seed')
      if(seedDisplay[i + 1] === undefined){
        span.textContent = `  ${el}`
      } else {
        span.textContent = `  ${el},`
      }
      span.addEventListener('click', function(){
        seedDisplay = seedDisplay.filter(e => e !== el)
        filterAndDisplaySeeds()
      })
      seedDiv.appendChild(span)
      i++
    })
});

const filterAndDisplaySeeds = () => {
  let seedDiv = document.querySelector('.seedsDisplay')
  seedDiv.textContent = ``
    seedDisplay.forEach((el, i) => {
      const span = document.createElement('span')
      if(seedDisplay[i + 1] === undefined){
        span.textContent = `  ${el}`
      } else {
        span.textContent = `  ${el},`
      }
      span.addEventListener('click', function(){
        seedDisplay = seedDisplay.filter(e => e !== el)
        filterAndDisplaySeeds()
      })
      seedDiv.appendChild(span)
      i++
    })
}



if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    accessToken = await getAccessToken(clientId, code);
    profile = await fetchProfile(accessToken);
    userID = profile.id
    // const newPlaylistID = await createPlaylist(accessToken)
    const playlists = await fetchPlaylists(accessToken)
    const top50SongsRes = await fetchTop50Songs(accessToken)
    const top50ArtistsRes = await fetchTop50Artists(accessToken)
    const genreSeeds = await getGenres(accessToken)
    savedSongs = await fetchAllSavedSongs(accessToken)
    console.log(top50ArtistsRes)

    genreSeeds.genres.forEach(el => {
      genres.push(el)
    })
    top50SongsRes.items.map((item, i = 0) => {
      if (i < 1) recommendationArtist = {name: item.album.artists[0].name, id: item.album.artists[0].id}
      top50Tracks[i] = {
        name: item.name,
        id: item.id
      }
      i++
    })
    top50ArtistsRes.items.map((item, i = 0) => {
      top50Artists[i] = {
        name: item.name,
        id: item.id
      }
      i++
    })
    // console.log(newPlaylistID)
    populateStartingUI(profile)

}

export async function redirectToAuthCodeFlow(clientId) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "http://localhost:5173/callback");
  params.append("scope", "user-read-private user-read-email playlist-modify-private playlist-read-private user-library-read user-top-read");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`
}

function generateCodeVerifier(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
}

export async function getAccessToken(clientId, code) {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:5173/callback");
  params.append("code_verifier", verifier);

  const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
  });

  const { access_token } = await result.json();
  return access_token;
}

async function fetchProfile(token) {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
});

return await result.json();
}

async function fetchPlaylists(token) {
  const result = await fetch("https://api.spotify.com/v1/me/playlists", {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
});

return await result.json();
}

async function createPlaylist(token) {
  const requestBody = {
      "name": "New Playlist",
      "description": "New playlist description",
      "public": false
  };

  const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
      method: "POST",
      headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  return data.id;  // This will return the ID of the newly created playlist.
}

async function get50Recommendations(token, selectedSeeds) {
 let url = `https://api.spotify.com/v1/recommendations?limit=50`
 let firstArtist = true
 selectedSeeds.artist.forEach(el => {
   if(firstArtist){
     url += `&seed_artists=${el.id}`
     selectedSeeds = selectedSeeds.artist.filter(el => el.id !== selectedSeeds.artist.id)
     firstArtist = false
    } else {
      url += `,${el.id}`
      selectedSeeds = selectedSeeds.artist.filter(el => el.id !== selectedSeeds.artist.id)
    }
  })
  
  for(let i = 0; i < selectedSeeds.length; i++){
    let firstArtist = true
    if(selectedSeeds[i].genre !== undefined && firstArtist){
      url += `&seed_genres=${selectedSeeds[i].genre}`
      selectedSeeds = selectedSeeds.filter(el => el.genre !== selectedSeeds[i].genre)
      firstArtist = false
    } else if(selectedSeeds[i].genre !== undefined){
      url += `,${selectedSeeds[i].genre}`
      selectedSeeds = selectedSeeds.filter(el => el.genre !== selectedSeeds[i].genre)
    }
  }
  
  console.log(url)
  console.log('selectedSeeds:', selectedSeeds);



  const result = await fetch(url, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
});

return await result.json();
}

async function getGenres(token) {
  const result = await fetch(`https://api.spotify.com/v1/recommendations/available-genre-seeds`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
});

return await result.json();
} 


async function fetchAllSavedSongs(token) {
  let offset = 0;
  const limit = 50; // This is the maximum number of items the API returns in one call.
  let savedSongs = [];
  let shouldContinueFetching = true;

  while (shouldContinueFetching) {
      try {
          const response = await fetch(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });

          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();

          const songs = data.items.map(item => ({
              name: item.track.name,
              id: item.track.id
          }));

          savedSongs = [...savedSongs, ...songs];

          // Check if there are more songs to fetch
          if (data.items.length < limit) {
              shouldContinueFetching = false;
          } else {
              offset += limit;
          }

      } catch (error) {
          console.error("Failed to fetch songs:", error);
          shouldContinueFetching = false; // Stop the loop in case of an error
      }
  }

  return savedSongs;
}


async function fetchTop50Songs(token) {
  const result = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50", {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
});

return await result.json();
}

async function fetchTop50Artists(token) {
  const result = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50", {
    method: "GET", headers: { Authorization: `Bearer ${token}` }
});

return await result.json();
}

function populateUI(profile) {
    
    let listEl = document.getElementById("suggestions")

    finalRecomendationsList.map((liEl) => {
      let cardContainer = document.createElement('div')
      cardContainer.addEventListener('click', function(){
        if(liEl.activated === false){
          cardContainer.style.backgroundColor = "#50c9d9"
          liEl = {
            activated: true,
          }
        } else {
          cardContainer.style.backgroundColor = "#526D82"
          liEl = {
            activated: false,
          }
        }
        console.log(finalRecomendationsList)
      })
      let nameEl = document.createElement('span')
      let artistEl = document.createElement('span')
      let playButtonWrapper = document.createElement('a')
      let playButton = document.createElement('i')
      let playButtonBackground = document.createElement('a')
      let albumPic = document.createElement('img')
      let albumAndPlayContainer = document.createElement('div')


      playButtonBackground.setAttribute('class', 'playButtonBackground')
      playButton.setAttribute('class', 'fa-solid fa-play playButton')
      albumAndPlayContainer.setAttribute('class', 'albumPlayContainer')
      albumPic.setAttribute('src', liEl.picURL)
      albumPic.setAttribute('class', 'albumPic')
      cardContainer.setAttribute('class', 'cardContainer')
      nameEl.setAttribute('class', 'card-name')
      artistEl.setAttribute('class', 'card-artist')
      playButtonBackground.setAttribute('href', liEl.previewURL)
      playButtonBackground.setAttribute('target', '_blank')      
      playButtonWrapper.setAttribute('class', 'playButtonWrapper')      

      nameEl.innerText = liEl.name
      artistEl.innerText = liEl.artists
      
      playButtonBackground.appendChild(playButton)
      playButtonWrapper.appendChild(playButtonBackground)
      albumAndPlayContainer.appendChild(albumPic)
      albumAndPlayContainer.appendChild(playButtonWrapper)
      cardContainer.appendChild(nameEl)
      cardContainer.appendChild(artistEl)
      cardContainer.appendChild(albumAndPlayContainer)
      listEl.append(cardContainer)
    })
    


}

