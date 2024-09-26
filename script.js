const pesquisar = document.getElementById('pesquisar');
const btnEnviar = document.getElementById('BotaoEnviar');
const pokemons = document.getElementById('pokemons');

const fetchPokemon = (value) => {
    const result = fetch(`https://pokeapi.co/api/v2/pokemon/${value}`)
    .then((res) => res.json())
    .then((data) => {
        return data;
    });

    return result;  
}

const getFromChain = (pokemon) => {
    return pokemon && pokemon["evolves_to"][0];
}

const getPokemonName = (pokemon) => {
    return pokemon && pokemon["species"]["name"];
}

const getEvolutionsList = (chain) => {
    const pokemon1 = getFromChain(chain);
    const pokemon2 = getFromChain(pokemon1);
    const name1 = getPokemonName(pokemon1);
    const name2 = getPokemonName(pokemon2);
    return [name1, name2];
}

const fetchEvolutions =  async (value) => {
    const species = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${value}`);
    const species_json = await species.json();
    const evolution_chain = await fetch(species_json["evolution_chain"]["url"]);
    const evolution_json = await evolution_chain.json();
    const chain = evolution_json["chain"];
    return [chain["species"]["name"], ...getEvolutionsList(chain)];
}

const fetchPokemonFrontImage = async (value) => {
    const result = await fetchPokemon(value);
    return result["sprites"]["front_default"];
}

const showEvolutions = async (event) => {
    event.preventDefault();
    const pokemonName = pesquisar.value.toLowerCase();
    const evolutions = await fetchEvolutions(pokemonName);
    pokemons.innerHTML = ``;
    const pokemonContainer = document.createElement('div');
    pokemonContainer.className = 'pokemon-container';

    for (let i = 0; i < evolutions.length; i++) {
        if (evolutions[i]) {
            const pokemonItem = document.createElement('div');
            pokemonItem.className = 'pokemon-item';

            const img = document.createElement('img');
            img.className = 'pokemon-img';
            await fetchPokemonFrontImage(evolutions[i]).then((sprite) => {
                img.src = sprite;
                pokemonItem.appendChild(img);
            });

            const name = document.createElement('div');
            name.className = 'pokemon-name';
            name.textContent = evolutions[i];
            pokemonItem.appendChild(name);

            pokemonContainer.appendChild(pokemonItem);
        }
    }

    pokemons.appendChild(pokemonContainer);
}

btnEnviar.addEventListener('click', showEvolutions);
