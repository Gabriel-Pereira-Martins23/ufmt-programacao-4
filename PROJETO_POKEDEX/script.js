// Constantes e Elementos do DOM

const pokedexListEl = document.getElementById('pokedex-list');
const searchInputEl = document.getElementById('search-input');
const searchBtnEl = document.getElementById('search-btn');
const typeFilterEl = document.getElementById('type-filter');

// Estado da Aplicação
let loadedPokemons = [];

const API_URL = 'https://pokeapi.co/api/v2';

// Dicionário 
const traducaoTipos = {
    normal: 'normal',
    fire: 'fogo',
    water: 'agua',
    grass: 'grama',
    electric: 'eletrico',
    ice: 'gelo',
    fighting: 'lutador',
    poison: 'veneno',
    ground: 'terra',
    flying: 'voador',
    psychic: 'psiquico',
    bug: 'inseto',
    rock: 'pedra',
    ghost: 'fantasma',
    dragon: 'dragao',
    dark: 'sombrio',
    steel: 'metal',
    fairy: 'fada'
};

// --- Carregar Pokémons Iniciais ---
async function loadInitialPokemons() {
    try {
        // Busca os 50 primeiros Pokémons 
        const response = await fetch(`${API_URL}/pokemon?limit=50`);
        const data = await response.json();
        
        // Busca os detalhes completos de cada um deles
        const detailedRequests = data.results.map(pokemon => fetchPokemonDetailsByUrl(pokemon.url));
        loadedPokemons = await Promise.all(detailedRequests);
        
        // Exibe a lista e popula o seletor de tipos
        displayPokemons(loadedPokemons);
        populateTypeFilter();

    } catch (error) {
        console.error("Erro ao conectar à API:", error);
        pokedexListEl.innerHTML = '<p class="error">Falha ao carregar dados da PokéAPI. Verifique sua conexão.</p>';
    }
}

async function fetchPokemonDetailsByUrl(url) {
    const response = await fetch(url);
    return response.json();
}

// --- Exibição de Cards na Tela ---
function displayPokemons(pokemonList) {
    pokedexListEl.innerHTML = '';

    if (pokemonList.length === 0) {
        pokedexListEl.innerHTML = '<p class="no-results">Nenhum Pokémon encontrado.</p>';
        return;
    }

    pokemonList.forEach(pokemon => {
        const card = document.createElement('div');
        
       
        const tipoPrincipalIngles = pokemon.types[0].type.name;
        const tipoPrincipalPt = traducaoTipos[tipoPrincipalIngles] || tipoPrincipalIngles;
        card.className = `pokemon-card type-${tipoPrincipalPt}`;

        const pokemonId = `#${String(pokemon.id).padStart(3, '0')}`;
        const pokemonName = pokemon.name;
        const pokemonImg = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
        
        
        const typesHtml = pokemon.types.map(typeInfo => {
            const nomeIngles = typeInfo.type.name;
            const nomeTraduzido = traducaoTipos[nomeIngles] || nomeIngles;
            return `<span class="pokemon-type type-${nomeTraduzido}">${nomeTraduzido}</span>`;
        }).join('');

        card.innerHTML = `
            <span class="pokemon-id">${pokemonId}</span>
            <div class="pokemon-img-container">
                <img src="${pokemonImg}" alt="${pokemonName}" class="pokemon-img">
            </div>
            <h3 class="pokemon-name">${pokemonName}</h3>
            <div class="pokemon-types">
                ${typesHtml}
            </div>
        `;

        pokedexListEl.appendChild(card);
    });
}

// --- Busca direta na API por Nome ou ID ---
async function searchPokemon() {
    const query = searchInputEl.value.trim().toLowerCase();

    if (!query) {
        typeFilterEl.value = 'all';
        displayPokemons(loadedPokemons);
        return;
    }

    pokedexListEl.innerHTML = '<p class="searching">Buscando Pokémon na base de dados...</p>';

    try {
        const response = await fetch(`${API_URL}/pokemon/${query}`);
        
        if (!response.ok) {
            throw new Error('Não encontrado');
        }

        const pokemonData = await response.json();
        
        // Atualiza a lista carregada localmente 
        if (!loadedPokemons.some(p => p.id === pokemonData.id)) {
            loadedPokemons.push(pokemonData);
        }
        
        displayPokemons([pokemonData]);

    } catch (error) {
        pokedexListEl.innerHTML = `<p class="error">Nenhum Pokémon encontrado com o nome ou ID "${query}".</p>`;
    }
}

// --- Filtragem por Tipo ---
function filterPokemonsByType() {
    const selectedTypePt = typeFilterEl.value; // Tipo selecionado em português

    if (selectedTypePt === 'all') {
        displayPokemons(loadedPokemons);
    } else {
       
        const selectedTypeEn = Object.keys(traducaoTipos).find(key => traducaoTipos[key] === selectedTypePt);

        const filteredList = loadedPokemons.filter(pokemon => 
            pokemon.types.some(typeInfo => typeInfo.type.name === selectedTypeEn)
        );
        displayPokemons(filteredList);
    }
}

// --- Popular o Dropdown de Tipos Traduzido ---
function populateTypeFilter() {

    // Limpa o select deixando apenas a opção "Todos"
    typeFilterEl.innerHTML = '<option value="all">Todos os Tipos</option>';

    
    Object.values(traducaoTipos).forEach(tipoPt => {
        const option = document.createElement('option');
        option.value = tipoPt;
        option.innerText = tipoPt.charAt(0).toUpperCase() + tipoPt.slice(1);
        typeFilterEl.appendChild(option);
    });
}

// --- Event Listeners ---
searchBtnEl.addEventListener('click', searchPokemon);

searchInputEl.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchPokemon();
    }
});

typeFilterEl.addEventListener('change', filterPokemonsByType);

// --- Inicialização ---
loadInitialPokemons();