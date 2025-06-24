'use strict';



/**
 * all music information
 */

const musicData = [
  {
    backgroundImage: "./assets/images/1.jpg",
    posterUrl: "./assets/images/1.jpg",
    title: "Raftaarein",
    album: "Vishal Dadlani",
    year: 2011,
    artist: "Vishal Dadlani",
    musicPath: "./assets/music/1.mp3",
  },
  {
    backgroundImage: "./assets/images/2.jpg",
    posterUrl: "./assets/images/2.jpg",
    title: "Brown Rang",
    album: "Honey Singh",
    year: 2011,
    artist: "Honey Singh",
    musicPath: "./assets/music/2.mp3",
  },
  {
    backgroundImage: "./assets/images/3.jpg",
    posterUrl: "./assets/images/3.jpg",
    title: "Angreji Beat",
    album: "Honey Singh",
    year: 2011,
    artist: "Honey Singh",
    musicPath: "./assets/music/3.mp3",
  },
  {
    backgroundImage: "./assets/images/4.jpg",
    posterUrl: "./assets/images/4.jpg",
    title: "Blue Eyes",
    album: "Honey Singh",
    year: 2013,
    artist: "Honey Singh",
    musicPath: "./assets/music/4.mp3",
  },
  {
    backgroundImage: "./assets/images/5.jpg",
    posterUrl: "./assets/images/5.jpg",
    title: "chammak challo",
    album: "Akon X Hamsika Iyer",
    year: 2011,
    artist: "Akon X Hamsika Iyer",
    musicPath: "./assets/music/5.mp3",
  },
  {
    backgroundImage: "./assets/images/6.jpg",
    posterUrl: "./assets/images/6.jpg",
    title: "Millionaire",
    album: "Honey Singh",
    year: 2024,
    artist: "Honey Singh",
    musicPath: "./assets/music/6.mp3",
  },
  {
    backgroundImage: "./assets/images/7.jpg",
    posterUrl: "./assets/images/7.jpg",
    title: "Desi Kalakaar",
    album: "Honey Singh",
    year: 2014,
    artist: "Honey Singh",
    musicPath: "./assets/music/7.mp3",
  },
  {
    backgroundImage: "./assets/images/8.jpg",
    posterUrl: "./assets/images/8.jpg",
    title: "Radhe",
    album: "Devi Sri Prasad X Himesh Reshammiya X Sajid Wajid",
    year: 2021,
    artist: "Devi Sri Prasad X Himesh Reshammiya X Sajid Wajid",
    musicPath: "./assets/music/8.mp3",
  },
  {
    backgroundImage: "./assets/images/9.jpg",
    posterUrl: "./assets/images/9.jpg",
    title: "Jalebi Baby",
    album: "Tesher x Jason Derulo",
    year: 2024,
    artist: "Tesher x Jason Derulo",
    musicPath: "./assets/music/9.mp3",
  },
];



/**
 * add eventListnere on all elements that are passed
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * PLAYLIST
 * 
 * add all music in playlist, from 'musicData'
 */

const playlist = document.querySelector("[data-music-list]");

for (let i = 0, len = musicData.length; i < len; i++) {
  playlist.innerHTML += `
  <li>
    <button class="music-item ${i === 0 ? "playing" : ""}" data-playlist-toggler data-playlist-item="${i}">
      <img src="${musicData[i].posterUrl}" width="800" height="800" alt="${musicData[i].title} Album Poster"
        class="img-cover">

      <div class="item-icon">
        <span class="material-symbols-rounded">equalizer</span>
      </div>
    </button>
  </li>
  `;
}



/**
 * PLAYLIST MODAL SIDEBAR TOGGLE
 * 
 * show 'playlist' modal sidebar when click on playlist button in top app bar
 * and hide when click on overlay or any playlist-item
 */

const playlistSideModal = document.querySelector("[data-playlist]");
const playlistTogglers = document.querySelectorAll("[data-playlist-toggler]");
const overlay = document.querySelector("[data-overlay]");

const togglePlaylist = function () {
  playlistSideModal.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("modalActive");
}

addEventOnElements(playlistTogglers, "click", togglePlaylist);



/**
 * PLAYLIST ITEM
 * 
 * remove active state from last time played music
 * and add active state in clicked music
 */

const playlistItems = document.querySelectorAll("[data-playlist-item]");

let currentMusic = 0;
let lastPlayedMusic = 0;

const changePlaylistItem = function () {
  playlistItems[lastPlayedMusic].classList.remove("playing");
  playlistItems[currentMusic].classList.add("playing");
}

addEventOnElements(playlistItems, "click", function () {
  lastPlayedMusic = currentMusic;
  currentMusic = Number(this.dataset.playlistItem);
  changePlaylistItem();
});



/**
 * PLAYER
 * 
 * change all visual information on player, based on current music
 */

const playerBanner = document.querySelector("[data-player-banner]");
const playerTitle = document.querySelector("[data-title]");
const playerAlbum = document.querySelector("[data-album]");
const playerYear = document.querySelector("[data-year]");
const playerArtist = document.querySelector("[data-artist]");

const audioSource = new Audio(musicData[currentMusic].musicPath);

const changePlayerInfo = function () {
  playerBanner.src = musicData[currentMusic].posterUrl;
  playerBanner.setAttribute("alt", `${musicData[currentMusic].title} Album Poster`);
  document.body.style.backgroundImage = `url(${musicData[currentMusic].backgroundImage})`;
  playerTitle.textContent = musicData[currentMusic].title;
  playerAlbum.textContent = musicData[currentMusic].album;
  playerYear.textContent = musicData[currentMusic].year;
  playerArtist.textContent = musicData[currentMusic].artist;

  audioSource.src = musicData[currentMusic].musicPath;

  audioSource.addEventListener("loadeddata", updateDuration);
  playMusic();
}

addEventOnElements(playlistItems, "click", changePlayerInfo);

/** update player duration */
const playerDuration = document.querySelector("[data-duration]");
const playerSeekRange = document.querySelector("[data-seek]");

/** pass seconds and get timcode formate */
const getTimecode = function (duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.ceil(duration - (minutes * 60));
  const timecode = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  return timecode;
}

const updateDuration = function () {
  playerSeekRange.max = Math.ceil(audioSource.duration);
  playerDuration.textContent = getTimecode(Number(playerSeekRange.max));
}

audioSource.addEventListener("loadeddata", updateDuration);

audioSource.addEventListener("ended", function () {
  // Move to next song
  lastPlayedMusic = currentMusic;
  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic >= musicData.length - 1 ? currentMusic = 0 : currentMusic++;
  }
  changePlayerInfo();
  changePlaylistItem();
  audioSource.play(); // Start playing the next song automatically
});


/**
 * PLAY MUSIC
 * 
 * play and pause music when click on play button
 */

const playBtn = document.querySelector("[data-play-btn]");

let playInterval;

const playMusic = function () {
  if (audioSource.paused) {
    audioSource.play();
    playBtn.classList.add("active");
    playInterval = setInterval(updateRunningTime, 500);
  } else {
    audioSource.pause();
    playBtn.classList.remove("active");
    clearInterval(playInterval);
  }
}

playBtn.addEventListener("click", playMusic);


/** update running time while playing music */

const playerRunningTime = document.querySelector("[data-running-time");

const updateRunningTime = function () {
  playerSeekRange.value = audioSource.currentTime;
  playerRunningTime.textContent = getTimecode(audioSource.currentTime);

  updateRangeFill();
  isMusicEnd();
}



/**
 * RANGE FILL WIDTH
 * 
 * change 'rangeFill' width, while changing range value
 */

const ranges = document.querySelectorAll("[data-range]");
const rangeFill = document.querySelector("[data-range-fill]");

const updateRangeFill = function () {
  let element = this || ranges[0];

  const rangeValue = (element.value / element.max) * 100;
  element.nextElementSibling.style.width = `${rangeValue}%`;
}

addEventOnElements(ranges, "input", updateRangeFill);



/**
 * SEEK MUSIC
 * 
 * seek music while changing player seek range
 */

const seek = function () {
  audioSource.currentTime = playerSeekRange.value;
  playerRunningTime.textContent = getTimecode(playerSeekRange.value);
}

playerSeekRange.addEventListener("input", seek);



/**
 * END MUSIC
 */

const isMusicEnd = function () {
  if (audioSource.ended) {
    playBtn.classList.remove("active");
    audioSource.currentTime = 0;
    playerSeekRange.value = audioSource.currentTime;
    playerRunningTime.textContent = getTimecode(audioSource.currentTime);
    updateRangeFill();
  }
}



/**
 * SKIP TO NEXT MUSIC
 */

const playerSkipNextBtn = document.querySelector("[data-skip-next]");

const skipNext = function () {
  lastPlayedMusic = currentMusic;

  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic >= musicData.length - 1 ? currentMusic = 0 : currentMusic++;
  }

  changePlayerInfo();
  changePlaylistItem();
}

playerSkipNextBtn.addEventListener("click", skipNext);



/**
 * SKIP TO PREVIOUS MUSIC
 */

const playerSkipPrevBtn = document.querySelector("[data-skip-prev]");

const skipPrev = function () {
  lastPlayedMusic = currentMusic;

  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic <= 0 ? currentMusic = musicData.length - 1 : currentMusic--;
  }

  changePlayerInfo();
  changePlaylistItem();
}

playerSkipPrevBtn.addEventListener("click", skipPrev);



/**
 * SHUFFLE MUSIC
 */

/** get random number for shuffle */
const getRandomMusic = () => Math.floor(Math.random() * musicData.length);

const shuffleMusic = () => currentMusic = getRandomMusic();

const playerShuffleBtn = document.querySelector("[data-shuffle]");
let isShuffled = false;

const shuffle = function () {
  playerShuffleBtn.classList.toggle("active");

  isShuffled = isShuffled ? false : true;
}

playerShuffleBtn.addEventListener("click", shuffle);



/**
 * REPEAT MUSIC
 */

const playerRepeatBtn = document.querySelector("[data-repeat]");

const repeat = function () {
  if (!audioSource.loop) {
    audioSource.loop = true;
    this.classList.add("active");
  } else {
    audioSource.loop = false;
    this.classList.remove("active");
  }
}

playerRepeatBtn.addEventListener("click", repeat);



/**
 * MUSIC VOLUME
 * 
 * increase or decrease music volume when change the volume range
 */

const playerVolumeRange = document.querySelector("[data-volume]");
const playerVolumeBtn = document.querySelector("[data-volume-btn]");

const changeVolume = function () {
  audioSource.volume = playerVolumeRange.value;
  audioSource.muted = false;

  if (audioSource.volume <= 0.1) {
    playerVolumeBtn.children[0].textContent = "volume_mute";
  } else if (audioSource.volume <= 0.5) {
    playerVolumeBtn.children[0].textContent = "volume_down";
  } else {
    playerVolumeBtn.children[0].textContent = "volume_up";
  }
}

playerVolumeRange.addEventListener("input", changeVolume);


/**
 * MUTE MUSIC
 */

const muteVolume = function () {
  if (!audioSource.muted) {
    audioSource.muted = true;
    playerVolumeBtn.children[0].textContent = "volume_off";
  } else {
    changeVolume();
  }
}

playerVolumeBtn.addEventListener("click", muteVolume);


// Touch gesture support for skipping tracks
let touchStartX = 0;
let touchEndX = 0;
const player = document.querySelector('.player');

if (player) {
  player.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  });

  player.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  });

  function handleGesture() {
    if (touchEndX < touchStartX - 50) {
      // Swipe left: next track
      document.querySelector('[data-skip-next]')?.click();
    }
    if (touchEndX > touchStartX + 50) {
      // Swipe right: previous track
      document.querySelector('[data-skip-prev]')?.click();
    }
  }
}

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-theme');
    themeToggle.querySelector('span').textContent =
      document.documentElement.classList.contains('light-theme') ? 'dark_mode' : 'light_mode';
  });
}

document.addEventListener('click', function(e) {
  if (e.target.closest('.like-btn')) {
    const btn = e.target.closest('.like-btn');
    btn.classList.toggle('liked');
  }
});

const audio = document.querySelector('audio') || window.audio; // adjust as needed
const canvas = document.getElementById('visualizer');
if (audio && canvas) {
  const ctx = canvas.getContext('2d');
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioCtx.createAnalyser();
  const source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 32;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = (canvas.width / bufferLength) - 2;
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] / 2;
      ctx.fillStyle = '#1976d2';
      ctx.fillRect(i * (barWidth + 2), canvas.height - barHeight, barWidth, barHeight);
    }
  }
  audio.onplay = () => audioCtx.resume();
  draw();
}

const playbackSpeedSelect = document.getElementById('playback-speed');
if (playbackSpeedSelect) {
  playbackSpeedSelect.addEventListener('change', function () {
    audioSource.playbackRate = parseFloat(this.value);
  });
  // Ensure speed resets on track change
  audioSource.addEventListener('loadeddata', function () {
    audioSource.playbackRate = parseFloat(playbackSpeedSelect.value);
  });
}

// Keyboard shortcuts for desktop
document.addEventListener('keydown', function(e) {
  if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') return;
  switch (e.key.toLowerCase()) {
    case ' ':
      e.preventDefault();
      playMusic();
      break;
    case 'arrowright':
      audioSource.currentTime = Math.min(audioSource.currentTime + 5, audioSource.duration);
      break;
    case 'arrowleft':
      audioSource.currentTime = Math.max(audioSource.currentTime - 5, 0);
      break;
    case 'arrowup':
      audioSource.volume = Math.min(audioSource.volume + 0.1, 1);
      changeVolume();
      break;
    case 'arrowdown':
      audioSource.volume = Math.max(audioSource.volume - 0.1, 0);
      changeVolume();
      break;
    case 'n':
      skipNext();
      break;
    case 'p':
      skipPrev();
      break;
    case 's':
      shuffle();
      break;
    case 'r':
      repeat.call(playerRepeatBtn);
      break;
    case 'f':
      toggleFullScreen();
      break;
  }
});

// Fullscreen toggle
function toggleFullScreen() {
  const elem = document.documentElement;
  if (!document.fullscreenElement) {
    elem.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

// Desktop notification on song change
function showNotification(title, body) {
  if (window.Notification && Notification.permission === "granted") {
    new Notification(title, { body });
  }
}
if (window.Notification && Notification.permission !== "granted") {
  Notification.requestPermission();
}
function notifySongChange() {
  showNotification(musicData[currentMusic].title, musicData[currentMusic].artist);
}
audioSource.addEventListener("play", notifySongChange);

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  if (!localStorage.getItem('currentUser')) {
    logoutBtn.style.display = 'none';
  } else {
    logoutBtn.style.display = '';
  }
  logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    window.location.href = "auth.html";
  });
}