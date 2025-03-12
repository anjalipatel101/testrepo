import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./screens/Home";
import Menu from "./screens/Menu";
import Cart from "./screens/Cart";
import OrderStatus from "./screens/OrderStatus";
import Login from "./screens/Login";
import { AuthProvider } from "./context/AuthContext";
import "./styles/App.css";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

const App: React.FC = () => {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <header className="app-header">
            <h1>🍕 Pizza Ordering App</h1>
          </header>
          <nav className="app-nav">
            <a href="/">Home</a>
            <a href="/menu">Menu</a>
            <a href="/cart">Cart</a>
            <a href="/order-status">Order Status</a>
            <a href="/login">Login</a>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order-status" element={<OrderStatus />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <main className="todo-section">
            <h2>🍕 Customize Your Pizza</h2>
            <button onClick={createTodo}>+ Add Custom Pizza</button>
            <ul>
              {todos.map((todo) => (
                <li key={todo.id}>{todo.content}</li>
              ))}
            </ul>
          </main>
          <footer className="app-footer">
            <p>© 2025 Pizza Ordering App</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
