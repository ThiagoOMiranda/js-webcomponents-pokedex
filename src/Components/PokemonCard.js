class PokemonCard extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({mode: "open"});

    this.componentRoot = this.build();
    shadow.appendChild(this.componentRoot);
    shadow.appendChild(this.styles());
  }

  styles() {
    const style = document.createElement("style");
    style.textContent = `
		.pokemon {
			height: 100%;
			max-height: 9rem;
			color: #333;
			box-shadow: 1px 1px 5px 1px rgba(0,0,0,0.7);
			display: flex;
			flex-direction: column;
			cursor: pointer;
			border-radius: 0.5rem;
			border-bottom: 2px solid #fff;
			background: url(../assets/imgs/pokePattern_01.svg) center/ 75% no-repeat;
		}

		/*
		.pokemon::before {
			position: absolute;
			content: "";
			width: 100%;
			height: 100%;
			background: url(../assets/imgs/pokePattern_01.svg) center/ 75% no-repeat;
			border-radius: 0.5rem;
			border-bottom: 2px solid #fff;
			z-index: -1;
		}
		*/

		.basic-info {
			font-size: 0.825rem;
			border-radius: 0.5rem 0.5rem 0 0;
  			display: flex;
  			align-items: center;
  			justify-content: space-between;
  			padding: 0.35rem 0.5rem;
  			background: #eee url(../assets/imgs/pokePattern_02.svg) center / 25px repeat;
		}

		.basic-info > span {
			font-weight: bold;
		}

		.basic-info > span:first-child {
			text-transform: capitalize;
		}

		.detail {
			height: 100%;
  			position: relative;
  			overflow: hidden;
  			padding: 0.75rem;
  			display: flex;
  			flex-direction: row;
  			align-items: center;
  			justify-content: space-between;
		}

		.types {
			height: 100%;
  			background: rgba(255, 255, 255, 0.3);
  			border-radius: 0.25rem;
  			display: flex;
  			flex-direction: column;
  			justify-content: center;
  			text-align: center;
			margin: 0;
  			padding: 0.35rem;
  			list-style: none;
		}

		.types > span {
			font-weight: 700;
  			font-size: small;
  			margin-bottom: 0.5rem;
		}

		.types > li {
			min-width: 3.50rem;
  			padding: 0.15rem 0.3rem;
			/* background-color: #666; */
  			color: #fff;
  			font-weight: 900;
			font-size: smaller;
  			border-radius: 1rem;
  			text-align: center;
  			text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  			box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 1);
			margin-bottom: 0.5rem;
		}

		.types > li:last-child {
			margin-bottom: 0;
		}

		.detail > img {
			max-width: 100%;
			height: 5.5rem;
			border-radius: 0.5rem;
			filter: drop-shadow(3px 3px 3px rgba(0, 0, 0, 0.8));
		}

		.normal {
  			background-color: #a4acaf80;
		}

		.fighting {
  			background-color: #d5672380;
		}

		.flying {
  			background: linear-gradient(
    		to bottom,
    		#3dc8ef80 0%,
    		#3dc7ef80 50%,
    		#bdb9b880 0%,
    		#bdb9b880 50%
  		);
		}

		.poison {
  			background-color: #b97fc980;
		}

		.ground {
		    background: linear-gradient(
		    to bottom,
		    #f7de3f80 0%,
		    #f7de3f80 50%,
		    #ab984280 0%,
		    #ab984280 50%
		  );
		}

		.rock {
  			background-color: #a38c2180;
		}

		.bug {
  			background-color: #729f3f80;
		}

		.ghost {
  			background-color: #7b62a380;
		}

		.steel {
  			background-color: #9eb7b880;
		}

		.fire {
  			background-color: #fd7d2480;
		}

		.water {
  			background-color: #4592c480;
		}

		.grass {
  			background-color: #9bcc5080;
		}

		.electric {
  			background-color: #eed53580;
		}

		.psychic {
  			background-color: #f366b980;
		}

		.ice {
  			background-color: #51c4e780;
		}

		.dragon {
  			background: linear-gradient(
    		to bottom,
    		#53a4cf80 0%,
    		#53a4cf80 50%,
    		#f16e5780 0%,
    		#f16e5780 50%
  			);
		}

		.dark {
  			background: #70707080;
		}

		.fairy {
  			background-color: #fdb9e980;
		}
	`;

    return style;
  }

  build() {
    const componentRoot = document.createElement("li");
    componentRoot.setAttribute("class", "pokemon");

    const basicInfo = document.createElement("div");
    basicInfo.setAttribute("class", "basic-info");

    this.pokemonName = document.createElement("span");
    this.pokemonName.textContent = "Pokemon";

    this.pokemonNumber = document.createElement("span");
    this.pokemonNumber.textContent = "#" + "0".toString().padStart(3, "0");

    basicInfo.appendChild(this.pokemonName);
    basicInfo.appendChild(this.pokemonNumber);

    const detail = document.createElement("div");
    detail.setAttribute("class", "detail");

    this.typesList = document.createElement("ol");
    this.typesList.setAttribute("class", "types");

    const typeSpan = document.createElement("span");
    typeSpan.textContent = "Tipo:";

    this.typesList.appendChild(typeSpan);

    this.pokemonImg = document.createElement("img");
    this.pokemonImg.src = "assets/imgs/pokePattern_01.svg";
    this.pokemonImg.alt = "Pokemon";

    detail.appendChild(this.typesList);
    detail.appendChild(this.pokemonImg);

    componentRoot.appendChild(basicInfo);
    componentRoot.appendChild(detail);

    return componentRoot;
  }

  setData(pokemon) {
    this.componentRoot.setAttribute("id", `${pokemon.number}`);
    this.componentRoot.classList.add(pokemon.types[0]);
    this.pokemonName.textContent = pokemon.name || "Pokemon";
    this.pokemonNumber.textContent =
      "#" + (pokemon.number || 0).toString().padStart(3, "0");

    const typesPlaceholder = document.createDocumentFragment();

    if (pokemon.types && pokemon.types.length > 0) {
      typesPlaceholder.innerHTML = "";

      pokemon.types.forEach((type) => {
        const typeItem = document.createElement("li");
        typeItem.textContent = type;
        typeItem.setAttribute("class", type);
        typesPlaceholder.appendChild(typeItem);
        this.typesList.appendChild(typesPlaceholder);
      });
    } else {
      const typeDefault = document.createElement("li");
      typeDefault.textContent = "tipo";
      typeDefault.style.backgroundColor = "#888";
      this.typesList.appendChild(typeDefault);
    }
    this.pokemonImg.src = pokemon.image || "assets/imgs/favicon.svg";
    this.pokemonImg.alt = pokemon.name || "Pokemon";
  }
}

customElements.define("pokemon-card", PokemonCard);
