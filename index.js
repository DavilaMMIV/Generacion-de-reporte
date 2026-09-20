import express from "express";
import { obtenerTodasLasPizzasAsync, 
        obtenerPizzaPorIdAsync,
        agregarPizzaAsync,
        actualizarPizzaAsync,
        eliminarPizzaASync } from './repositorios/pizza.repositorio.js';
import cors from 'cors'

const app = express();
app.use(cors());
const PORT = 3001; // Puerto en el que escuchará el servidor

//Configuracion para ver el body en un metodo/verbo POST
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Me da todas las pizzas registradas
app.get("/api/v1/pizzas", async (req,res) => { 
  const pizzas = await obtenerTodasLasPizzasAsync()
  return res.status(200).json(pizzas);
});

//Obtenemos una pizza por su id
app.get("/api/v1/pizzas/:id", async (req, res) =>{
  const id = req.params.id
  const pizza = await obtenerPizzaPorIdAsync(id)

  return res.status(200).json(pizza);
});

//Agregar una pizza
app.post("/api/v1/pizzas", async (req, res) => {
  const pizza = req.body
  const id = await agregarPizzaAsync(pizza)

  const idDto = {id: id, fecha: new Date() }

  return res.status(201).json(idDto);
})

// Actualizamos una pizza por su id
app.put("/api/v1/pizzas/:id", async (req, res) => {
  const id = req.params.id;
  const pizza = req.body;

  const pizzaExistente = await obtenerPizzaPorIdAsync(id);

  if (pizzaExistente == undefined) {
    const mensaje = { mensaje: "No existe la pizza con ese id" };
    return res.status(404).json(mensaje);
  }

  await actualizarPizzaAsync(id, pizza);

  const mensaje = { mensaje: "Datos actualizados" };
  return res.status(200).json(mensaje);
});

//Borramos una pizza por su id 
app.delete("/api/v1/pizzas/:id", async (req, res) => {
    const id = req.params.id;
    await eliminarPizzaASync(id)

    const mensaje = {mensaje: "Datos eliminados"}
    return res.status(202).json(mensaje);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto http://localhost:${PORT}`);
});