export async function get50Recommendations(token, selectedSeeds) {
    const acousticInputMin = document.getElementById('min_acousticness')
    const acousticInputMax = document.getElementById('max_acousticness')
    const acousticInputTarget = document.getElementById('target_acousticness')
    const danceabilityInputMin = document.getElementById('min_danceability')
    const danceabilityInputMax = document.getElementById('max_danceability')
    const danceabilityInputTarget = document.getElementById('target_danceability')
    const energyInputMin = document.getElementById('min_energy')
    const energyInputMax = document.getElementById('max_energy')
    const energyInputTarget = document.getElementById('target_energy')
    const instrumentalnessInputMin = document.getElementById('min_instrumentalness')
    const instrumentalnessInputMax = document.getElementById('max_instrumentalness')
    const instrumentalnessInputTarget = document.getElementById('target_instrumentalness')
    const keyInputMin = document.getElementById('min_key')
    const keyInputMax = document.getElementById('max_key')
    const keyInputTarget = document.getElementById('target_key')
    const livenessInputMin = document.getElementById('min_liveness')
    const livenessInputMax = document.getElementById('max_liveness')
    const livenessInputTarget = document.getElementById('target_liveness')
    const loudnessInputMin = document.getElementById('min_loudness')
    const loudnessInputMax = document.getElementById('max_loudness')
    const loudnessInputTarget = document.getElementById('target_loudness')
    const modeInputMin = document.getElementById('min_mode')
    const modeInputMax = document.getElementById('max_mode')
    const modeInputTarget = document.getElementById('target_mode')
    const popularityInputMin = document.getElementById('min_popularity')
    const popularityInputMax = document.getElementById('max_popularity')
    const popularityInputTarget = document.getElementById('target_popularity')
    const speechinessInputMin = document.getElementById('min_speechiness')
    const speechinessInputMax = document.getElementById('max_speechiness')
    const speechinessInputTarget = document.getElementById('target_speechiness')
    const tempoInputMin = document.getElementById('min_tempo')
    const tempoInputMax = document.getElementById('max_tempo')
    const tempoInputTarget = document.getElementById('target_tempo')
    const time_signatureInputMin = document.getElementById('min_time_signature')
    const time_signatureInputMax = document.getElementById('max_time_signature')
    const time_signatureInputTarget = document.getElementById('target_time_signature')
    const valenceInputMin = document.getElementById('min_valence')
    const valenceInputMax = document.getElementById('max_valence')
    const valenceInputTarget = document.getElementById('target_valence')
    const duration_sInputMin = document.getElementById('min_duration_s')
    const duration_sInputMax = document.getElementById('max_duration_s')
    const duration_sInputTarget = document.getElementById('target_duration_s')
    

    let url = `https://api.spotify.com/v1/recommendations?limit=50`
    let firstArtist = true
    let firstGenre = true
    let firstTrack = true
    selectedSeeds.artist.forEach(el => {
      if(firstArtist){
        url += `&seed_artists=${el.id}`
        selectedSeeds.artist = selectedSeeds.artist.filter(item => item !== el)
        firstArtist = false
       } else {
         url += `,${el.id}`
         selectedSeeds.artist = selectedSeeds.artist.filter(item => item !== el)
       }
     })
   
    selectedSeeds.genre.forEach(el => {
      if(firstGenre){
        url += `&seed_genre=${el}`
        selectedSeeds.genre = selectedSeeds.genre.filter(item => item !== el)
        firstGenre = false
       } else {
         url += `,${el}`
         selectedSeeds.genre = selectedSeeds.genre.filter(item => item !== el)
       }
     })
   
     selectedSeeds.topSong.forEach(el => {
       if(firstTrack){
         url += `&seed_tracks=${el.id}`
         selectedSeeds.topSong = selectedSeeds.topSong.filter(item => item !== el)
         firstTrack = false
        } else {
   
          url += `,${el.id}`
          selectedSeeds.topSong = selectedSeeds.topSong.filter(item => item !== el)
        }
      })
   
     selectedSeeds.savedSong.forEach(el => {
       if(firstTrack){
         url += `&seed_tracks=${el.id}`
         selectedSeeds.savedSong = selectedSeeds.savedSong.filter(item => item !== el)
         firstTrack = false
        } else {
          url += `,${el.id}`
          selectedSeeds.savedSong = selectedSeeds.savedSong.filter(item => item !== el)
        }
      })
      if(acousticInputMin.value !== ''){
        url += `&min_acousticness=${acousticInputMin.value}`
      }
      if(acousticInputMax.value !== ''){
        url += `&max_acousticness=${acousticInputMax.value}`
      }
      if(acousticInputTarget.value !== ''){
        url += `&target_acousticness=${acousticInputTarget.value}`
      }

      if(danceabilityInputMin.value !== ''){
        url += `&min_danceability=${danceabilityInputMin.value}`
      }
      if(danceabilityInputMax.value !== ''){
        url += `&max_danceability=${danceabilityInputMax.value}`
      }
      if(danceabilityInputTarget.value !== ''){
        url += `&target_danceability=${danceabilityInputTarget.value}`
      }
      
      if(duration_sInputMin.value !== ''){
        url += `&min_duration_s=${duration_sInputMin.value * 1000}`
      }
      if(duration_sInputMax.value !== ''){
        url += `&max_duration_s=${duration_sInputMax.value * 1000}`
      }
      if(duration_sInputTarget.value !== ''){
        url += `&target_duration_s=${duration_sInputTarget.value * 1000}`
      }

      if(energyInputMin.value !== ''){
        url += `&min_energy=${energyInputMin.value}`
      }
      if(energyInputMax.value !== ''){
        url += `&max_energy=${energyInputMax.value}`
      }
      if(energyInputTarget.value !== ''){
        url += `&target_energy=${energyInputTarget.value}`
      }

      if(instrumentalnessInputMin.value !== ''){
        url += `&min_instrumentalness=${instrumentalnessInputMin.value}`
      }
      if(instrumentalnessInputMax.value !== ''){
        url += `&max_instrumentalness=${instrumentalnessInputMax.value}`
      }
      if(instrumentalnessInputTarget.value !== ''){
        url += `&target_instrumentalness=${instrumentalnessInputTarget.value}`
      }

      if(keyInputMin.value !== ''){
        url += `&min_key=${keyInputMin.value}`
      }
      if(keyInputMax.value !== ''){
        url += `&max_key=${keyInputMax.value}`
      }
      if(keyInputTarget.value !== ''){
        url += `&target_key=${keyInputTarget.value}`
      }

      if(livenessInputMin.value !== ''){
        url += `&min_liveness=${livenessInputMin.value}`
      }
      if(livenessInputMax.value !== ''){
        url += `&max_liveness=${livenessInputMax.value}`
      }
      if(livenessInputTarget.value !== ''){
        url += `&target_liveness=${livenessInputTarget.value}`
      }

      if(loudnessInputMin.value !== ''){
        url += `&min_loudness=${loudnessInputMin.value}`
      }
      if(loudnessInputMax.value !== ''){
        url += `&max_loudness=${loudnessInputMax.value}`
      }
      if(loudnessInputTarget.value !== ''){
        url += `&target_loudness=${loudnessInputTarget.value}`
      }

      if(modeInputMin.value !== ''){
        url += `&min_mode=${modeInputMin.value}`
      }
      if(modeInputMax.value !== ''){
        url += `&max_mode=${modeInputMax.value}`
      }
      if(modeInputTarget.value !== ''){
        url += `&target_mode=${modeInputTarget.value}`
      }

      if(popularityInputMin.value !== ''){
        url += `&min_popularity=${popularityInputMin.value}`
      }
      if(popularityInputMax.value !== ''){
        url += `&max_popularity=${popularityInputMax.value}`
      }
      if(popularityInputTarget.value !== ''){
        url += `&target_popularity=${popularityInputTarget.value}`
      }

      if(speechinessInputMin.value !== ''){
        url += `&min_speechiness=${speechinessInputMin.value}`
      }
      if(speechinessInputMax.value !== ''){
        url += `&max_speechiness=${speechinessInputMax.value}`
      }
      if(speechinessInputTarget.value !== ''){
        url += `&target_speechiness=${speechinessInputTarget.value}`
      }

      if(tempoInputMin.value !== ''){
        url += `&min_tempo=${tempoInputMin.value}`
      }
      if(tempoInputMax.value !== ''){
        url += `&max_tempo=${tempoInputMax.value}`
      }
      if(tempoInputTarget.value !== ''){
        url += `&target_tempo=${tempoInputTarget.value}`
      }

      if(time_signatureInputMin.value !== ''){
        url += `&min_time_signature=${time_signatureInputMin.value}`
      }
      if(time_signatureInputMax.value !== ''){
        url += `&max_time_signature=${time_signatureInputMax.value}`
      }
      if(time_signatureInputTarget.value !== ''){
        url += `&target_time_signature=${time_signatureInputTarget.value}`
      }

      if(valenceInputMin.value !== ''){
        url += `&min_valence=${valenceInputMin.value}`
      }
      if(valenceInputMax.value !== ''){
        url += `&max_valence=${valenceInputMax.value}`
      }
      if(valenceInputTarget.value !== ''){
        url += `&target_valence=${valenceInputTarget.value}`
      }


     const testURL = 'https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical%2Ccountry&seed_tracks=0c6xIDDpzE81m2q797ordA&min_acousticness=0.1&max_acousticness=1.0&target_acousticness=0.5&min_danceability=0.1&max_danceability=1.0&target_danceability=0.5&min_energy=0.1&max_energy=1.0&target_energy=0.5&target_time_signature=4&min_valence=0.1&max_valence=1.0&target_valence=0.5'
   
     const result = await fetch(url, {
       method: "GET", headers: { Authorization: `Bearer ${token}` }
   });
   
   return await result.json();
   }
   
   export async function getGenres(token) {
     const result = await fetch(`https://api.spotify.com/v1/recommendations/available-genre-seeds`, {
       method: "GET", headers: { Authorization: `Bearer ${token}` }
   });
   
   return await result.json();
   } 
   
   
   export async function fetchAllSavedSongs(token) {
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
             shouldContinueFetching = false; 
         }
     }
   
     return savedSongs;
   }
   
   
   export async function fetchTop50Songs(token) {
     const result = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50", {
       method: "GET", headers: { Authorization: `Bearer ${token}` }
   });
   
   return await result.json();
   }
   
   export async function fetchTop50Artists(token) {
     const result = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50", {
       method: "GET", headers: { Authorization: `Bearer ${token}` }
   });
   
   return await result.json();
   }

   export async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
  });
  
  return await result.json();
  }
  
  export async function fetchPlaylists(token) {
    const result = await fetch("https://api.spotify.com/v1/me/playlists", {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
  });
  
  return await result.json();
  }

  export async function addSelectedSongsToPlaylist(playlistId, trackUris, token){
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: trackUris
      })
    });
  
    const data = await response.json();
    return data;
  }

  export async function makeNewPlaylistBeforeAddSongs(user_id, playlistName, isPublic, token){
    const url = `https://api.spotify.com/v1/users/${user_id}/playlists`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playlistName,
          public: isPublic
      })
    });
  
    const data = await response.json();
    console.log(data)
    return data;
  } 
  
  // async function createPlaylist(token) {
  //   const requestBody = {
  //       "name": "New Playlist",
  //       "description": "New playlist description",
  //       "public": false
  //   };
  
  //   const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
  //       method: "POST",
  //       headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify(requestBody)
  //   });
  
  //   const data = await response.json();
  //   return data.id;  // This will return the ID of the newly created playlist.
  // }
  