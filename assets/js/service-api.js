const pokeApi = {};

const convertPokeApiInfoToPokemon = (pokeInfo) => {
  const pokemon = new Pokemon();

  pokemon.name = pokeInfo.name;
  pokemon.number = pokeInfo.id;

  const types = pokeInfo.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  const imageData =
    pokeInfo["sprites"]["other"]["official-artwork"]["front_default"];

  pokemon.image = imageData;
  return pokemon;
};

pokeApi.getPokemonInfo = async (pokemon) => {
  try {
    const infoResponse = await fetch(pokemon.url);

    if (!infoResponse.ok) {
      throw new Error(`An error occurred: ${infoResponse.status}`);
    }

    pokemonInfoData = await infoResponse.json();
    return convertPokeApiInfoToPokemon(pokemonInfoData);
  } catch (error) {
    console.error("An error occurred whithin getPokemonInfo: ", error);
    throw error;
  }
};

pokeApi.getPokemonData = async (offset, limit) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`An error occurred: ${response.status}`);
    }

    const responseData = await response.json();
    maxCount = parseInt(responseData.count);
    const pokemons = responseData.results;
    const detailRequests = pokemons.map(pokeApi.getPokemonInfo);
    const pokemonsDetails = await Promise.all(detailRequests);

    return pokemonsDetails;
  } catch (error) {
    console.error("An error occurred within getPokemonData:", error);
    throw error;
  }
};

pokeApi.getPokemonList = async () => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${maxCount}`;
  try {
    const responseList = await fetch(url);

    if (!responseList.ok) {
      throw new Error(`An error occurred: ${responseList.status}`);
    }

    responseData = await responseList.json();
    const pokemonList = responseData.results;
    return pokemonList;
  } catch (error) {
    console.error("An error occurred within getPokemonList:", error);
    throw error;
  }
};
