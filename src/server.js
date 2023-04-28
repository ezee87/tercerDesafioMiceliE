import express from "express";
import ProductManager from "./manager/productManager.js";

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager("./products.json");

app.get("/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    // Si la query limit no tiene valor (products/ o products?limit=), el valor predeterminado va a ser el tamaño del array products, en este caso 10.
    let limitValue = products.length;

    if (req.query.limit) {
      limitValue = parseInt(req.query.limit);
    }

    const productsConLimit = products.slice(0, limitValue);
    res.status(200).json(productsConLimit);
  } catch (error) {
    res.status(404).json({ message: error.message });
    console.log(error);
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productManager.getProductById(Number(id));
    if (product) {
      res.status(200).json({ message: 'Se encontro el producto!', product });
    } else {
      res.status(400).send(`No existe el producto ${id}`);
    }
  } catch (error) {}
});


const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server en puerto: ${PORT}`);
});