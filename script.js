import { getAccessToken, redirectToAuthCodeFlow} from "./verify";
import { get50Recommendations, getGenres, fetchAllSavedSongs, fetchTop50Songs, fetchTop50Artists, fetchProfile, fetchPlaylists, addSelectedSongsToPlaylist } from "./asyncCalls";
const clientId = "6fd7da8323b5478aafa52dc629d650f4"; // Replace with your client ID
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
let userID = ''
let top50Tracks = [{}]
let top50Artists = [{}]
let recommendationArtist = {}
let finalRecomendationsList = [{}]
let genres = []
let selectedSeeds = {
  topSong: [],
  savedSong: [],
  artist: [],
  genre: [],
  seeds: []
}
let selectedSongsforPlaylist = []
let selectedPlaylistID, playlists, savedSongs, top50SongsRes, top50ArtistsRes, genreSeeds, accessToken, profile

let seedDiv = document.querySelector('.seedsDisplay')
const genresToListButton = document.querySelector('.submitButton');
const topSongsDropdown = document.getElementById('topSongs')
const topArtistsDropdown = document.getElementById('topArtists')
const savedSongsDropdown = document.getElementById('savedSongs')
const genresDropdown = document.getElementById('genres')
const getRecomendationsButton = document.getElementById('getRecomendationsButton')
const toggleButtons = document.querySelectorAll('.numbersContainer .toggleCircle')
const minMaxRows = document.querySelectorAll('.numbersContainer .minMaxRow')
const saveSetupButton = document.getElementById('saveSetupButton')
const savePresetInput = document.getElementById('presetInput')
const selectPresetDropdwn = document.getElementById('presetDropdown')
const errorNameText = document.getElementById('errorNameText')
const errorRecommendationText = document.getElementById('redTextRecommendations')
const successNameText = document.getElementById('successNameText')
const loadPresetDropdown = document.getElementById('presetDropdown')
const playlistDropdown = document.querySelector('#playlistDropdown')
const selectAllSongsButton = document.querySelector('#selectAllSongsButton')
const addToPlaylistButton = document.querySelector('#addToPlaylistButton')


if (!code) {
  redirectToAuthCodeFlow(clientId);
} else {
    accessToken = await getAccessToken(clientId, code);
    profile = await fetchProfile(accessToken);
    userID = profile.id
    // const newPlaylistID = await createPlaylist(accessToken)
    playlists = await fetchPlaylists(accessToken)
    top50SongsRes = await fetchTop50Songs(accessToken)
    top50ArtistsRes = await fetchTop50Artists(accessToken)
    genreSeeds = await getGenres(accessToken)
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
    playlists.items.forEach(e => {
      const span = document.createElement('option')
      span.value = e.name
      span.textContent = e.name
      playlistDropdown.appendChild(span)
    })

    // console.log(newPlaylistID)
    populateStartingUI(profile)
  }

const prefix = "spotifyAppSave:";
let appData = {};

// work on repopulating Recommendations list

// selectAllSongsButton.addEventListener('click', e => {
//   finalRecomendationsList.forEach(e =>{
//     e.activated = true
//   })
//   console.log(finalRecomendationsList)
//   populateUI()
// })

addToPlaylistButton.addEventListener('click', async e => {
  let res = await addSelectedSongsToPlaylist(selectedPlaylistID, selectedSongsforPlaylist, accessToken)
  console.log(res)
})

playlistDropdown.addEventListener('change', e => {
  let playlistItem = playlists.items.filter(a => a.name !== e.value)
  selectedPlaylistID = playlistItem[0].id;
})


for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key.startsWith(prefix)) {
        let el = document.createElement('option')
        appData[key] = JSON.parse(localStorage.getItem(key));

        const name = key.replace(prefix, "");
        el.value = name;
        el.innerText = name; 
        loadPresetDropdown.appendChild(el);
    }

  }

  loadPresetDropdown.addEventListener('change', function(event){
    const selectedValue = event.target.value
    const item = localStorage.getItem(`spotifyAppSave:${selectedValue}`)
    selectedSeeds = JSON.parse(item)
    console.log("selected seeeds",selectedSeeds)
    
    const seedMap = {
      'min_acouticness': { type: 'min', index: 0 },
      'max_acouticness': { type: 'max', index: 0 },
      'target_acouticness': { type: 'target', index: 0 },

      'min_danceability': { type: 'min', index: 1 },
      'max_danceability': { type: 'max', index: 1 },
      'target_danceability': { type: 'target', index: 1 },

      'min_energy': { type: 'min', index: 2 },
      'max_energy': { type: 'max', index: 2 },
      'target_energy': { type: 'target', index: 2 },

      'min_instrumentalness': { type: 'min', index: 3 },
      'max_instrumentalness': { type: 'max', index: 3 },
      'target_instrumentalness': { type: 'target', index: 3 },
      
      'min_key': { type: 'min', index: 4 },
      'max_key': { type: 'max', index: 4 },
      'target_key': { type: 'target', index: 4 },
      
      'min_liveness': { type: 'min', index: 5 },
      'max_liveness': { type: 'max', index: 5 },
      'target_liveness': { type: 'target', index: 5 },

      'min_loudness': { type: 'min', index: 6 },
      'max_loudness': { type: 'max', index: 6 },
      'target_loudness': { type: 'target', index: 6 },

      'min_mode': { type: 'min', index: 7 },
      'max_mode': { type: 'max', index: 7 },
      'target_mode': { type: 'target', index: 7 },
      
      'min_popularity': { type: 'min', index: 8 },
      'max_popularity': { type: 'max', index: 8 },
      'target_popularity': { type: 'target', index: 8 },

      'min_speechiness': { type: 'min', index: 9 },
      'max_speechiness': { type: 'max', index: 9 },
      'target_speechiness': { type: 'target', index: 9 },

      'min_tempo': { type: 'min', index: 10 },
      'max_tempo': { type: 'max', index: 10 },
      'target_tempo': { type: 'target', index: 10 },

      'min_time_signature': { type: 'min', index: 11 },
      'max_time_signature': { type: 'max', index: 11 },
      'target_time_signature': { type: 'target', index: 11 },

      'min_valence': { type: 'min', index: 12 },
      'max_valence': { type: 'max', index: 12 },
      'target_valence': { type: 'target', index: 12 },

      'min_duration': { type: 'min', index: 13 },
      'max_duration': { type: 'max', index: 13 },
      'target_duration': { type: 'target', index: 13 },
  };
  const setClassAndaActive = (index) => {
    minMaxRows[index].setAttribute('class', 'minMaxRow minMaxRowActive');
    const button = minMaxRows[index].querySelector('.toggleCircle');
    button.setAttribute('class', ' toggleCircle toggleCircleActive');
    button.isActive = true;
  }

  for (let i = 0; i < selectedSeeds.seeds.length;i++){
    let minMaxRowInputs = minMaxRows[i].querySelectorAll('.numberInput');
    let [min, max, target] = [minMaxRowInputs[0], minMaxRowInputs[1], minMaxRowInputs[2]];
  
    for(let j = 0; j < selectedSeeds.seeds.length; j++) {
      const seed = selectedSeeds.seeds[j];
      const mapInfo = seedMap[seed.name];
  
      if (mapInfo && mapInfo.index === i) {
        if (mapInfo.type === 'min') {
          min.value = seed.value;
        } else if (mapInfo.type === 'max') {
          max.value = seed.value;
        } else if (mapInfo.type === 'target') {
          target.value = seed.value;
        }
        setClassAndaActive(i);
      }
  }
}

let AllNumberInputs = document.querySelectorAll('.numberInput')
AllNumberInputs.forEach(e => {
  e.addEventListener('change', function(){
    if(selectedSeeds.seeds.findIndex(a => a.name === e.id) === -1){
      selectedSeeds.seeds.push({
        name: e.id,
        value: e.value
      })
      console.log('logged new value')
    } else {
      let index = selectedSeeds.seeds.findIndex(a => a.name === e.id)

      selectedSeeds.seeds[index].value = e.value;
      console.log(selectedSeeds)
    }
  })
})
  filterAndDisplaySeeds()
})

savePresetInput.addEventListener('input', function(){
  errorNameText.setAttribute('style', 'display: none;')
  successNameText.setAttribute('style', 'display: none;')
})

saveSetupButton.addEventListener('click', function(){
  const name = savePresetInput.value.trim();
  console.log('click ran ')

  if(!name) {
    errorNameText.setAttribute('style', 'display: block;')
    console.log('no nmae running')
    return;
  }
  
  if(localStorage.getItem(`spotifyAppSave:${name}`)) {
    const overwrite = confirm("A preset with this name already exists. Do you want to overwrite it?");
    if (!overwrite) return;
  }

  try {
    localStorage.setItem(`spotifyAppSave:${name}`, JSON.stringify(selectedSeeds));
    successNameText.setAttribute('style', 'display: block;')
  } catch (e) {
    console.error('Failed to save to local storage', e);
    alert('Failed to save. Storage might be full.');
  }
  errorNameText.setAttribute('style', 'display: none;')
})

toggleButtons.forEach((e, i) => {
  e.isActive = false
  e.addEventListener('click', function(){
    let minMaxRowIputs = minMaxRows[i].querySelectorAll('.numberInput')
    let [min, max, target] = [minMaxRowIputs[0], minMaxRowIputs[1], minMaxRowIputs[2]]
    if(e.isActive === false){
      e.setAttribute('class', 'toggleCircle toggleCircleActive')
      e.isActive = true
      minMaxRows[i].setAttribute('class', 'minMaxRow minMaxRowActive')
      console.log(min, max, target)
      if(min.id === 'min_acousticness' || min.id === 'min_danceability' || min.id === 'min_energy' || min.id === 'min_instrumentalness' 
      || min.id === 'min_liveness' || min.id === 'min_loudness' || min.id === 'min_mode' || min.id === 'min_speechiness' || min.id === 'min_valence' || min.id === 'min_mode'){
        min.value = 0
          selectedSeeds.seeds.push({
            name: min.id,
            value: 0
          })
      }
      if(max.id === 'max_acousticness' || max.id === 'max_danceability' || max.id === 'max_energy' || max.id === 'max_instrumentalness' || max.id === 'max_liveness' 
      || max.id === 'max_loudness' || max.id === 'max_mode' || max.id === 'max_speechiness' || max.id === 'max_valence' || max.id === 'max_mode'){
        max.value = 1
        selectedSeeds.seeds.push({
          name: max.id,
          value: 1
        })
      }
      if(target.id === 'target_acousticness' || target.id === 'target_danceability' || target.id === 'target_energy' || target.id === 'target_instrumentalness' 
      || target.id === 'target_liveness' || target.id === 'target_loudness' || target.id === 'target_mode' || target.id === 'target_speechiness' || target.id === 'target_valence'){
        target.value = 0.5
        selectedSeeds.seeds.push({
          name: target.id,
          value: 0.5
        })
      }
      if (target.id === 'target_mode') target.value = 1, selectedSeeds.seeds.push({name: target.id, value: 1})
      if(min.id === 'min_key') min.value = 0, selectedSeeds.seeds.push({name: min.id, value: 0})
      if(max.id === 'max_key') max.value = 11, selectedSeeds.seeds.push({name: max.id, value: 11})
      if(target.id === 'target_key') target.value = 0, selectedSeeds.seeds.push({name: target.id, value: 0})
      
      if(min.id === 'min_popularity') min.value = 0, selectedSeeds.seeds.push({name: min.id, value: 0})
      if(max.id === 'max_popularity') max.value = 100, selectedSeeds.seeds.push({name: max.id, value: 100})
      if(target.id === 'target_popularity') target.value = 50, selectedSeeds.seeds.push({name: target.id, value: 50})
      
      if(min.id === 'min_tempo') min.value = 30, selectedSeeds.seeds.push({name: min.id, value: 30})
      if(max.id === 'max_tempo') max.value = 250, selectedSeeds.seeds.push({name: max.id, value: 250})
      if(target.id === 'target_tempo') target.value =  130, selectedSeeds.seeds.push({name: target.id, value: 130})
      
      if(min.id === 'min_time_signature') min.value = 0, selectedSeeds.seeds.push({name: min.id, value: 0})
      if(max.id === 'max_time_signature') max.value = 11, selectedSeeds.seeds.push({name: max.id, value: 11})
      if(target.id === 'target_time_signature') target.value =  4, selectedSeeds.seeds.push({name: target.id, value: 4})
      
      if(min.id === 'min_duration_s') min.value = 0, selectedSeeds.seeds.push({name: min.id, value: 0})
      if(max.id === 'max_duration_s') max.value = 1500, selectedSeeds.seeds.push({name: max.id, value: 1500})
      if(target.id === 'target_duration_s') target.value =  150, selectedSeeds.seeds.push({name: target.id, value: 150})
      e.setActive = true
    console.log(selectedSeeds)
    } else {
      e.setAttribute('class', 'toggleCircle')
      e.isActive = false
      minMaxRows[i].setAttribute('class', 'minMaxRow')
      min.value = ''
      max.value = ''
      target.value = ''

      if(min.id === 'min_acousticness' || min.id === 'min_danceability' || min.id === 'min_energy' || min.id === 'min_instrumentalness' 
      || min.id === 'min_liveness' || min.id === 'min_loudness' || min.id === 'min_mode' || min.id === 'min_speechiness' || min.id === 'min_valence' || min.id === 'min_mode'){
        min.value = ''
        selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== min.id)
      }
      if(max.id === 'max_acousticness' || max.id === 'max_danceability' || max.id === 'max_energy' || max.id === 'max_instrumentalness' || max.id === 'max_liveness' 
      || max.id === 'max_loudness' || max.id === 'max_mode' || max.id === 'max_speechiness' || max.id === 'max_valence' || max.id === 'max_mode'){
        max.value = ''
        selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== max.id)
      }
      if(target.id === 'target_acousticness' || target.id === 'target_danceability' || target.id === 'target_energy' || target.id === 'target_instrumentalness' 
      || target.id === 'target_liveness' || target.id === 'target_loudness' || target.id === 'target_mode' || target.id === 'target_speechiness' || target.id === 'target_valence'){
        target.value = ''
        selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== target.id)
      }
      if (target.id === 'target_mode') target.value = '', selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== target.id)
      if(min.id === 'min_key') min.value = '', selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== min.id)
      if(max.id === 'max_key') max.value = '', selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== max.id)
      if(target.id === 'target_key') target.value = '', selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== target.id)
      
      if(min.id === 'min_popularity') min.value = '', selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== min.id)
      if(max.id === 'max_popularity') max.value = '', selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== max.id)
      if(target.id === 'target_popularity') target.value = '', selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== target.id)
      
      if(min.id === 'min_tempo') min.value = '', selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== min.id)
      if(max.id === 'max_tempo') max.value = '', selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== max.id)
      if(target.id === 'target_tempo') target.value =  '', selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== target.id)
      
      if(min.id === 'min_time_signature') min.value = '', selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== min.id)
      if(max.id === 'max_time_signature') max.value = '', selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== max.id)
      if(target.id === 'target_time_signature') target.value =  '', selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== target.id)
      
      if(min.id === 'min_duration_s') min.value = '', selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== min.id)
      if(max.id === 'max_duration_s') max.value = '', selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== max.id)
      if(target.id === 'target_duration_s') target.value =  '', selectedSeeds.seeds = selectedSeeds.seeds.filter(a => a.name !== target.id)
      console.log(selectedSeeds)
    }
  })
})

getRecomendationsButton.addEventListener('click', async function(){
  getRecomendationsButton.setAttribute('style', "display: none;")
  if(!selectedSeeds.artist.length && !selectedSeeds.topSong.length && !selectedSeeds.savedSong.length && !selectedSeeds.genre.length){
    errorRecommendationText.setAttribute('style', 'display: block;')
    return;
  }
  console.log('selectedSeeds:', selectedSeeds);
  let recomendations = await get50Recommendations(accessToken, selectedSeeds)
  let dropdownAndButtonContainer = document.getElementById('playlistDropdownAndAddButton')
  dropdownAndButtonContainer.setAttribute('style', 'display: flex;')
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
  if(topSongsDropdown.value !== 'none' && !selectedSeeds.topSong.some(songObject => songObject.song === topSongsDropdown.value) && seedDiv.getElementsByTagName('span').length <= 5){
    selectedSeeds.topSong.push({
      song: topSongsDropdown.value,
      id: top50Tracks.find(track => track.name === topSongsDropdown.value).id
    });
  }
  
  if(savedSongsDropdown.value !== 'none' && !selectedSeeds.savedSong.some(songObject => songObject.song === savedSongsDropdown.value) && seedDiv.getElementsByTagName('span').length <= 5){
    selectedSeeds.savedSong.push({
      song: savedSongsDropdown.value,
      id: savedSongs.find(track => track.name === savedSongsDropdown.value).id
    });
  }

  if(topArtistsDropdown.value !== 'none' && !selectedSeeds.artist.some(songObject => songObject.artist === topArtistsDropdown.value) && seedDiv.getElementsByTagName('span').length <= 5){
    selectedSeeds.artist.push({
      artist: topArtistsDropdown.value,
      id: top50Artists.find(track => track.name === topArtistsDropdown.value).id
    });
  }

  if(genresDropdown.value !== 'none' && !selectedSeeds.genre.includes(genresDropdown.value) && seedDiv.getElementsByTagName('span').length <= 5){
    selectedSeeds.genre.push(genresDropdown.value)
  }
     
    console.log(selectedSeeds)
    filterAndDisplaySeeds()

});

  function populateStartingUI(profile){
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

function populateUI(profile) {
    
  let listEl = document.getElementById("suggestions")

  finalRecomendationsList.map((liEl) => {
    let cardContainer = document.createElement('div')
    cardContainer.addEventListener('click', function(){
      if(liEl.activated === false){
        cardContainer.style.backgroundColor = "#50c9d9"
        selectedSongsforPlaylist.push(`spotify:track:${liEl.id}`)
        console.log(liEl)
        liEl.activated = true
      } else {
        selectedSongsforPlaylist = selectedSongsforPlaylist.filter(a => a !== liEl.id)
        cardContainer.style.backgroundColor = "#526D82"
        liEl.activated = false
      }
      console.log(selectedSongsforPlaylist)
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

function filterAndDisplaySeeds(){
  seedDiv.innerHTML = ``
  selectedSeeds.topSong.forEach((el, i) => {
    if(seedDiv.getElementsByTagName('span').length >= 5) return
    const span = document.createElement('span')
    span.setAttribute('class', 'seed')
    span.textContent = `  ${el.song}`
    seedDiv.appendChild(span)
    span.addEventListener('click', function(){
      selectedSeeds.topSong = selectedSeeds.topSong.filter(e => e !== el)
      filterAndDisplaySeeds()
    })
  })
  selectedSeeds.savedSong.forEach((el, i) => {
    if(seedDiv.getElementsByTagName('span').length >= 5) return
    const span = document.createElement('span')
    span.setAttribute('class', 'seed')
    span.textContent = `  ${el.song}`
    seedDiv.appendChild(span)
    span.addEventListener('click', function(){
      selectedSeeds.savedSong = selectedSeeds.savedSong.filter(e => e !== el)
      filterAndDisplaySeeds()
    })
  })
  selectedSeeds.artist.forEach((el, i) => {
    if(seedDiv.getElementsByTagName('span').length >= 5) return
    const span = document.createElement('span')
    span.setAttribute('class', 'seed')
    span.textContent = `  ${el.artist}`
    seedDiv.appendChild(span)
    span.addEventListener('click', function(){
      selectedSeeds.artist = selectedSeeds.artist.filter(e => e !== el)
      filterAndDisplaySeeds()
    })
  })
  selectedSeeds.genre.forEach((el, i) => {
    if(seedDiv.getElementsByTagName('span').length >= 5) return
    const span = document.createElement('span')
    span.setAttribute('class', 'seed')
    span.textContent = `  ${el}`
    seedDiv.appendChild(span)
    span.addEventListener('click', function(){
      selectedSeeds.genre = selectedSeeds.genre.filter(e => e !== el)
      filterAndDisplaySeeds()
    })
  })
  console.log(seedDiv)

  let childSpans = seedDiv.getElementsByTagName('span')
  for(let i = 0; i < childSpans.length; i++){
    if (childSpans[i + 1] !== undefined) childSpans[i].textContent += `,`
  }

  if(childSpans.length){
    getRecomendationsButton.disabled = false;
    errorRecommendationText.setAttribute('style', 'display: none;')
  }
}
