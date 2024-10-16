import React, { useState, useEffect } from 'react';

function PokeAPIComponent() {

    const levels = [20,30,50]
    const [pokemonList, setPokemonList] = useState([]);
    const [pokemon, setPokemon] = useState([]);
    const [clickedPokemon, setClickedPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(levels[0]);
    const [level, setLevel] = useState(1);

    useEffect(() => {
        // First API: Fetch the list of Pokémon
        fetch(`https://pokeapi.co/api/v2/pokemon?limit=${currentStatus}&offset=0`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Pokémon list');
                }
                return response.json();
            })
            .then((data) => {
                // Fetch details for each Pokémon in parallel
                const pokemonPromises = data.results.map((pokemon) =>
                    fetch(pokemon.url).then((response) => response.json())
                );

                // Wait for all Pokémon details to be fetched
                return Promise.all(pokemonPromises);
            })
            .then((detailedPokemonData) => {
                setPokemonList(detailedPokemonData);
                randomPoke(detailedPokemonData)// Store detailed data in state
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [currentStatus]); // Runs only once when component mounts


    if (loading) {
        return <div>Loading Pokémon...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    function randomPoke(pokemonData) {
        const newRandomPokemons = [];
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * pokemonData.length);
            newRandomPokemons.push(pokemonData[randomIndex].sprites.front_default);
        }

        // Set 5 random Pokémon in the state
        setPokemon(newRandomPokemons);
    }

    return (
        <div className="GameContainer">
            <h3>Level {level}</h3>
            <div className="levels">
                <button onClick={() => setCurrentStatus(levels[0])}>Easy</button>
                <button onClick={() => setCurrentStatus(levels[1])}>Normal</button>
                <button onClick={() => setCurrentStatus(levels[2])}>Hard</button>
            </div>
            <ul style={{display: "flex", listStyleType: "none"}}>
                {pokemon.map((pokemon, index) => (
                    <li key={index} onClick={() => {
                        setLevel(level + 1);
                        setClickedPokemon([...clickedPokemon, pokemon]);
                        console.log(clickedPokemon);
                        for (let i = 0; i < clickedPokemon.length; i++) {

                            if (clickedPokemon[i] === pokemon) {
                                setClickedPokemon([]);
                                setLevel(1);
                                alert('lose')
                            }
                        }
                        randomPoke(pokemonList);
                    }}>

                        <img className="pokemon-image" src={pokemon} alt="Pokemon"/>

                    </li>
                ))}
            </ul>
        </div>
    )
}

export default PokeAPIComponent;

//.sprites.front_default