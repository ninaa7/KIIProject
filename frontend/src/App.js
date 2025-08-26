import React, { useState, useEffect } from 'react';
import { getItems, createItem, updateItem, deleteItem } from './services/api';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [editingItem, setEditingItem] = useState(null); // To store the item being edited

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await getItems();
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      const newItem = { name: newItemName, description: newItemDescription };
      await createItem(newItem);
      setNewItemName('');
      setNewItemDescription('');
      fetchItems(); // Refresh the list
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  const handleUpdateItem = async (id, updatedData) => {
    try {
      await updateItem(id, updatedData);
      setEditingItem(null); // Exit editing mode
      fetchItems(); // Refresh the list
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteItem(id);
      fetchItems(); // Refresh the list
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const startEditing = (item) => {
    setEditingItem({ ...item }); // Create a copy to edit
  };

  const cancelEditing = () => {
    setEditingItem(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingItem(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="App">
      <h1>My App</h1>

      <div className="item-form">
        <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
        <form onSubmit={editingItem ? () => handleUpdateItem(editingItem._id, editingItem) : handleCreateItem}>
          <input
            type="text"
            placeholder="Item Name"
            name="name"
            value={editingItem ? editingItem.name : newItemName}
            onChange={editingItem ? handleEditChange : (e) => setNewItemName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            name="description"
            value={editingItem ? editingItem.description : newItemDescription}
            onChange={editingItem ? handleEditChange : (e) => setNewItemDescription(e.target.value)}
          />
          <button type="submit">{editingItem ? 'Update Item' : 'Add Item'}</button>
          {editingItem && <button type="button" onClick={cancelEditing}>Cancel</button>}
        </form>
      </div>

      <div className="item-list">
        <h2>Items</h2>
        {items.length === 0 ? (
          <p>No items yet. Add one above!</p>
        ) : (
          <ul>
            {items.map(item => (
              <li key={item._id}>
                <div>
                  <strong>{item.name}</strong> - {item.description}
                </div>
                <div>
                  <button onClick={() => startEditing(item)}>Edit</button>
                  <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;