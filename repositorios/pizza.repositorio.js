import { MongoClient, ObjectId } from "mongodb";

const uri = "";

const client = new MongoClient(uri);

const dbName = "prueba";

let db;
let coleccionPizzas;

async function conectarMongo() {
    if (!db) {
        await client.connect();
        db = client.db(dbName);
        coleccionPizzas = db.collection("pizzas");
        console.log("Conectado a MongoDB");
    }
    return coleccionPizzas;
}

// Obtener todas las pizzas
export async function obtenerTodasLasPizzasAsync() {
    const pizzas = await conectarMongo();
    return await pizzas.find({}).toArray();
}

// Obtener pizza por ID
export async function obtenerPizzaPorIdAsync(id) {
    const pizzas = await conectarMongo();
    try {
        return await pizzas.findOne({
            _id: new ObjectId(id)
        });
    } catch (error) {
        return undefined;
    }
}

// Agregar pizza
export async function agregarPizzaAsync(pizza) {
    const pizzas = await conectarMongo();
    const resultado = await pizzas.insertOne(pizza);
    return resultado.insertedId.toString();
}

// Actualizar pizza
export async function actualizarPizzaAsync(id, pizza) {
    const pizzas = await conectarMongo();
    try {
        const resultado = await pizzas.updateOne(
            { _id: new ObjectId(id) },
            { $set: pizza }
        );
        return resultado.modifiedCount > 0;
    } catch (error) {
        return false;
    }
}

// Eliminar pizza
export async function eliminarPizzaASync(id) {
    const pizzas = await conectarMongo();
    try {
        const resultado = await pizzas.deleteOne({
            _id: new ObjectId(id)
        });
        return resultado.deletedCount > 0;
    } catch (error) {
        return false;
    }
}
