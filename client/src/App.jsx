import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

export default function App() {
  const [newAnimal, setNewAnimal] = useState("");
  const [Animals, setAnimals] = useState([]);
  const [AnimalNames, setAnimalNames] = useState([]);

  useEffect(() => {
    fetchAnimals();
    fetchAnimalNames();
  }, []);

  async function fetchAnimals() {
    try {
      const response = await axios.get("http://localhost:3000/");
      setAnimals(response.data.data);
    } catch (error) {
      console.error("Error fetching Animals:", error);
    }
  }

  async function fetchAnimalNames() {
    try {
      const response = await axios.get("http://localhost:3000/animalnames");
      //console.log(response.data.data);
      setAnimalNames(response.data.data);
    } catch (error) {
      console.error("Error fetching Animal Names:", error);
    }
  }
  

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3000/", { name: newAnimal });
      setNewAnimal("");
      fetchAnimals();
      fetchAnimalNames();
    } catch (error) {
      console.error("Error adding animal:", error);
    }
  }

  async function handleDeleteAll() {
    try {
      await axios.delete("http://localhost:3000/");
      fetchAnimals();
      fetchAnimalNames();
    } catch (error) {
      console.error("Error deleting all animals:", error);
    }
  }

  async function handleDelete(id) {
    try {
      await axios.delete(`http://localhost:3000/${id}`);
      fetchAnimals();
      fetchAnimalNames();
    } catch (error) {
      console.error("Error deleting animal:", error);
    }
  }

  async function deleteAnimalName(id) {
    try {
      await axios.delete(`http://localhost:3000/animalnames/${id}`);
      fetchAnimalNames();
    } catch (error) {
      console.error("There was an error deleting the animal name!", error);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Hero Pet Generator</h1>
      </header>
      <form className="new-item-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            value={newAnimal}
            onChange={(e) => setNewAnimal(e.target.value)}
            placeholder="Add a new animal"
          />
          <button className="btn" type="submit">Submit</button>
        </div>
        <button className="btn btn-danger" onClick={handleDeleteAll} type="button">Delete All Animals</button>
      </form>
      <h1 className="header">User Inputs</h1>
      <ul className="list">
        {Animals.length === 0 && <p>No Animals</p>}
        {Animals.map((animal) => (
          <li key={animal.id}>
            {animal.name}: {animal.date_created}
            <button className="btn btn-danger" onClick={() => handleDelete(animal.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h1 className="header">Generated Animal Names</h1>
      <ul className="list">
        {AnimalNames.length === 0 && <p>No Generated Names</p>}
        {AnimalNames.map((animalName) => (
          <li key={animalName.id}>
            {animalName.AnimalType}: {animalName.AnimalName}
            <button className="btn btn-danger" onClick={() => deleteAnimalName(animalName.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}