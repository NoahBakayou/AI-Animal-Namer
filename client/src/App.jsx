import "./styles.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [newItem, setNewItem] = useState("");
  const [Animals, setAnimals] = useState([]);

  useEffect(() => {
    fetchAnimals();
  }, []);

  async function fetchAnimals() {
    try {
      const response = await axios.get("http://localhost:3000/");
      setAnimals(response.data.data);
    } catch (error) {
      console.error("Error fetching Animals:", error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (newItem.trim() === "") return;

    try {
      const response = await axios.post("http://localhost:3000/", {
        name: newItem
      });

      setNewItem(""); // Clear the input field
      fetchAnimals(); // Fetch Animals again to refresh the list
    } catch (error) {
      console.error("Error adding animal:", error);
    }
  }

  async function deleteAnimal(id) {
    try {
      await axios.delete(`http://localhost:3000/${id}`);
      setAnimals((currentAnimals) =>
        currentAnimals.filter((animal) => animal.id !== id)
      );
    } catch (error) {
      console.error("Error deleting animal:", error);
    }
  }

  async function deleteAllAnimals() {
    try {
      await axios.delete("http://localhost:3000/"); // Endpoint to delete all animals
      fetchAnimals(); // Fetch animals again to refresh the list
    } catch (error) {
      console.error("Error deleting all animals:", error);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="new-item-form">
        <div className="form-row">
          <label htmlFor="item"> New Item </label>
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            type="text"
            id="item"
          />
        </div>
        <button className="btn"> Add</button>
      </form>
      <h1 className="header"> Animal List </h1>
      <ul className="list">
        {Animals.length === 0 && <p>No Animals</p>}
        {Animals.map((animal) => (
          <li key={animal.id}>
            {animal.name}
            <button
              className="btn btn-danger"
              onClick={() => deleteAnimal(animal.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button className="btn btn-danger" onClick={deleteAllAnimals}>
        Delete All Animals
      </button>
    </>
  );
}
