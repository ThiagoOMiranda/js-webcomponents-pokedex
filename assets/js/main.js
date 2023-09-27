const myLink = document.getElementById("myLogo");
const pokemonListElement = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("load-more");
const buttonWrapper = loadMoreButton.parentElement;
const inputBox = document.getElementById("inputBox");
const searchButton = document.getElementById("btn-search");
const searchForm = inputBox.parentElement;
const notFoundedAlert = document.getElementById("not-founded");

let offset = 8;
let limit = 8;
const initialOffset = 16;
let maxCount = 100;
let currentPage = 1;
const initialBatch = 20;
const batchSize = 8;
let isSearching = false;
let searchResults = [];

myLink.addEventListener("click", () => {
  const url =
    "https://www.linkedin.com/in/thiago-de-oliveira-miranda-5393181a7";

  window.location.href = url;
});

//WINDOW SCREENSIZE
// Verifica o dispositivo pelo tamanho de tela, orientação e pontos de touchscreen
function identifyDeviceChange() {
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  const isMobile =
    Math.min(screenWidth, screenHeight) < 768 ||
    navigator.userAgent.indexOf("mobi") > -1;
  const isTablet =
    "maxTouchPoints" in navigator && navigator.maxTouchPoints > 0;

  const deviceType = isMobile
    ? screenHeight > screenWidth
      ? "Dispositivo móvel - Retrato"
      : "Dispositivo móvel - Paisagem"
    : isTablet
    ? "Tablet"
    : "Desktop";

  return {
    deviceType: deviceType,
    screenWidth: screenWidth,
    screenHeight: screenHeight,
  };
}

// Atribui animações ao buttonWrapper e ao loadMoreButton de acordo com o deviceType
const animationButtonWrapper = () => {
  const isDesktop = identifyDeviceChange().deviceType === "Desktop";
  const buttonWrapperSpan = buttonWrapper.children[0];
  const buttonSpan = loadMoreButton.children[0];

  if (isDesktop) {
    buttonWrapperSpan.textContent = "Passe o mouse aqui!";
    buttonWrapper.addEventListener("mouseenter", () => {
      buttonWrapper.style.transform = "translate(-50%, -3rem)";
      buttonWrapper.style.background =
        "linear-gradient( 0deg,rgba(0, 0, 0, 0.75) 0%,rgba(204, 204, 204, 0) 100%)";
      buttonWrapperSpan.style.opacity = "0";

      loadMoreButton.style.width = "9rem";
      loadMoreButton.style.background =
        "linear-gradient(to bottom, #ff0000 0%, #ff0000 45%, #000 45%, #000 55%, #fff 55%, #fff 100%)";
      buttonSpan.style.opacity = "1";
    });
    buttonWrapper.addEventListener("mouseleave", () => {
      buttonWrapper.style.transform = "translate(-50%)";
      buttonWrapper.style.background =
        "linear-gradient( 0deg,rgba(0, 0, 0, 0.5) 0%,rgba(204, 204, 204, 0) 100%)";
      buttonWrapperSpan.style.opacity = "1";

      loadMoreButton.style.width = "2.5rem";
      loadMoreButton.style.background =
        "url(../assets/imgs/favicon.svg) center / contain no-repeat";
      buttonSpan.style.opacity = "0";
    });
  } else {
    buttonWrapper.addEventListener("touchend", () => {
      buttonWrapper.style.transform = "translate(-50%, -3rem)";
      buttonWrapper.style.background =
        "linear-gradient( 0deg,rgba(0, 0, 0, 0.75) 0%,rgba(204, 204, 204, 0) 100%)";
      buttonWrapperSpan.style.opacity = "0";

      loadMoreButton.style.width = "9rem";
      loadMoreButton.style.background =
        "linear-gradient(to bottom, #ff0000 0%, #ff0000 45%, #000 45%, #000 55%, #fff 55%, #fff 100%)";
      buttonSpan.style.opacity = "1";
    });
  }
};

animationButtonWrapper();

// BACKGROUND
const setBackground = document.getElementById("background");
const backImages = [
  "Bckg_01.png",
  "Bckg_02.png",
  "Bckg_03.png",
  "Bckg_00.png",
  "Bckg_04.png",
  "Bckg_05.png",
  "Bckg_06.png",
  "Bckg_07.png",
  "Bckg_08.png",
  "Bckg_00.png",
];

// Função que troca o background entre várias imagens em intervalos regulares:
let currentIndex = 0;

const changeBackground = () => {
  setBackground.style.backgroundImage = `url("./assets/imgs/${backImages[currentIndex]}")`;
  currentIndex = (currentIndex + 1) % backImages.length;
};

// Troca de imagem a cada 5 segundos:
setInterval(changeBackground, 5000);

//POKÉDEX
// Cria instâncias do componente pokemon-card:
const convertPokemonToTag = (pokemon) => {
  const pokemonCard = document.createElement("pokemon-card");

  pokemonCard.setData(pokemon);
  pokemonListElement.appendChild(pokemonCard);
};

// Requisita dados da API e retorna um array de objetos:
const makeRequest = async (offset, limit) => {
  const pokemonData = await pokeApi.getPokemonData(offset, limit);
  if (pokemonData.length > 0) {
    pokemonData.map((pokemon) => convertPokemonToTag(pokemon));
    return true;
  } else return false;
};

makeRequest(0, initialOffset);

// Busca a lista de nomes completa de Pokemons da API:
const loadPokemonArray = async () => {
  try {
    let pokemonArray = await pokeApi.getPokemonList();
    return pokemonArray;
  } catch (error) {
    console.error("An error occurred with loadPokemonArray:", error);
  }
};

// Coleta dados de input e filtra o array:
const filterPokemonsByName = (input, array) => {
  const searchInput = input.toLowerCase();
  return array.filter((pokemon) =>
    pokemon.name.toLowerCase().startsWith(searchInput)
  );
};

// Filtra a lista de Pokemons da API e retorna o resultado:
const getPokemonDataAndFilter = async (input) => {
  try {
    const pokemonArray = await pokeApi.getPokemonList();
    searchResults = filterPokemonsByName(input, pokemonArray);
    return searchResults;
  } catch (error) {
    console.error("An error occurred with getPokemonDataAndFilter:", error);
  }
};

// Gerencia a lista de Pokemons e separa em páginas:
const managePageIndex = async (pokemonArray, pageNumber, batchSize) => {
  const totalPages =
    Math.ceil((pokemonArray.length - initialBatch) / batchSize) + 1;
  console.log(totalPages);

  const startIndex =
    pageNumber === 1 ? 0 : initialBatch + (pageNumber - 2) * batchSize;
  const endIndex = pageNumber === 1 ? initialBatch : startIndex + batchSize;

  const batchData = pokemonArray.slice(startIndex, endIndex);
  if (batchData.length > 0) {
    const listRequests = batchData.map(pokeApi.getPokemonInfo);
    const PokemonSearchList = await Promise.all(listRequests);
    PokemonSearchList.map((pokemon) => convertPokemonToTag(pokemon));

    return PokemonSearchList;
  }
};

// Gerencia funcionalidades atribuidas ao botão de busca.
searchButton.addEventListener("click", async () => {
  const searchText = inputBox.value;
  const isNumber = !isNaN(searchText);

  if (searchText !== "" && !isNumber) {
    inputBox.value = "";
    const searchList = await getPokemonDataAndFilter(searchText);
    pokemonListElement.innerHTML = "";
    if (searchList.length > 0) {
      currentPage = 1;
      isSearching = true;
      managePageIndex(searchList, currentPage, batchSize);

      if (!notFoundedAlert.classList.contains("hidden"))
        notFoundedAlert.classList.add("hidden");
    } else if (notFoundedAlert.classList.contains("hidden"))
      notFoundedAlert.classList.remove("hidden");

    if (searchList.length > 19) {
      if (buttonWrapper.classList.contains("hidden"))
        buttonWrapper.classList.remove("hidden");
    } else if (!buttonWrapper.classList.contains("hidden"))
      buttonWrapper.classList.add("hidden");
  } else if (searchText !== "" && isNumber) {
    const numberInput = parseInt(searchText);
    inputBox.value = "";
    pokemonListElement.innerHTML = "";
    const searchByNumber = await makeRequest(numberInput - 1, 1);
    if (!searchByNumber) {
      if (notFoundedAlert.classList.contains("hidden")) {
        notFoundedAlert.classList.remove("hidden");
      }
    } else if (!notFoundedAlert.classList.contains("hidden"))
      notFoundedAlert.classList.add("hidden");

    if (!buttonWrapper.classList.contains("hidden"))
      buttonWrapper.classList.add("hidden");
  } else {
    isSearching = false;
    if (!notFoundedAlert.classList.contains("hidden"))
      notFoundedAlert.classList.add("hidden");
    pokemonListElement.innerHTML = "";
    makeRequest(0, initialOffset);
    if (buttonWrapper.classList.contains("hidden"))
      buttonWrapper.classList.remove("hidden");
  }
});

// Previne que ocorra duplo clique e associa o input "Enter" par confirmar.
searchForm.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchButton.click();
  }
});

// Gerencia funcionalidades atribuidas ao botão de "carregar mais".
loadMoreButton.addEventListener("click", () => {
  const isDesktop = identifyDeviceChange().deviceType === "Desktop";
  const buttonWrapperSpan = buttonWrapper.children[0];
  const buttonSpan = loadMoreButton.children[0];

  if (!isDesktop) {
    setTimeout(() => {
      loadMoreButton.style.width = "2.5rem";
      loadMoreButton.style.background =
        "url(./assets/imgs/favicon.svg) center / contain no-repeat";
      buttonSpan.style.opacity = "0";
    }, 1000);

    setTimeout(() => {
      buttonWrapper.style.transform = "translate(-50%)";
      buttonWrapper.style.background =
        "linear-gradient( 0deg,rgba(0, 0, 0, 0.5) 0%,rgba(204, 204, 204, 0) 100%)";
      buttonWrapperSpan.style.opacity = "1";
    }, 2000);
  }

  if (isSearching) {
    currentPage++;
    managePageIndex(searchResults, currentPage, batchSize);
    if (currentPage * batchSize + initialBatch >= searchResults.length) {
      if (!buttonWrapper.classList.contains("hidden")) {
        buttonWrapper.classList.add("hidden");
      }
    }
  } else {
    offset += limit;
    const qtdElementsNextPage = offset + limit;
    if (qtdElementsNextPage >= maxCount) {
      const newLimit = maxCount - offset;
      makeRequest(offset, newLimit);
      if (!buttonWrapper.classList.contains("hidden")) {
        buttonWrapper.classList.add("hidden");
      }
    } else {
      makeRequest(offset, limit);
    }
  }
});
