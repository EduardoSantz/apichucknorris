const API = {
    RANDOM_JOKE: 'https://api.chucknorris.io/jokes/random',
    FAVORITES: 'http://localhost:3000/api/favorites' // Altere para sua URL em produção
  };
  
  const elements = {
    jokeContainer: document.getElementById('joke-container'),
    chuckImage: document.getElementById('chuck-image'),
    favoritesList: document.getElementById('favorites-list'),
    favoriteTemplate: document.getElementById('favorite-template')
  };
  
  let currentJoke = null;
  
  // Funções Principais
  async function getNewJoke() {
    try {
      const response = await fetch(API.RANDOM_JOKE);
      const data = await response.json();
      
      currentJoke = {
        id: data.id,
        text: data.value,
        image: data.icon_url
      };
      
      updateJokeDisplay();
    } catch (error) {
      showError('Falha ao carregar piada');
    }
  }
  
  async function addToFavorites() {
    if (!currentJoke) return;
  
    try {
      const response = await fetch(API.FAVORITES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentJoke)
      });
  
      if (!response.ok) throw new Error('Falha ao favoritar');
      
      await loadFavorites();
      showSuccess('Piada favoritada!');
    } catch (error) {
      showError(error.message);
    }
  }
  
  async function deleteFavorite(id) {
    try {
      const response = await fetch(`${API.FAVORITES}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Falha ao remover');
      
      await loadFavorites();
      showSuccess('Favorito removido!');
    } catch (error) {
      showError(error.message);
    }
  }
  
  // Funções Auxiliares
  async function loadFavorites() {
    try {
      const response = await fetch(API.FAVORITES);
      const favorites = await response.json();
      
      elements.favoritesList.innerHTML = favorites.length 
        ? '' 
        : '<p>Nenhum favorito salvo ainda!</p>';
  
      favorites.forEach(fav => {
        const clone = elements.favoriteTemplate.content.cloneNode(true);
        const item = clone.querySelector('.favorite-item');
        
        item.querySelector('.favorite-img').src = fav.image;
        item.querySelector('.favorite-text').textContent = fav.text;
        item.querySelector('.delete-btn').addEventListener('click', () => deleteFavorite(fav.id));
        
        elements.favoritesList.appendChild(clone);
      });
    } catch (error) {
      showError('Falha ao carregar favoritos');
    }
  }
  
  function updateJokeDisplay() {
    elements.jokeContainer.textContent = currentJoke.text;
    elements.chuckImage.src = currentJoke.image;
    elements.chuckImage.alt = 'Ícone do Chuck Norris';
  }
  
  function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert error';
    alert.textContent = message;
    document.body.prepend(alert);
    setTimeout(() => alert.remove(), 3000);
  }
  
  function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert success';
    alert.textContent = message;
    document.body.prepend(alert);
    setTimeout(() => alert.remove(), 3000);
  }
  
  // Event Listeners
  document.getElementById('new-joke-btn').addEventListener('click', getNewJoke);
  document.getElementById('favorite-btn').addEventListener('click', addToFavorites);
  document.addEventListener('DOMContentLoaded', () => {
    getNewJoke();
    loadFavorites();
  });