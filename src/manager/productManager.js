import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async #newId() {
    let newId = 0;
    const products = await this.getProducts();
    products.map((prod) => {
      if (prod.id > newId) newId = prod.id;
    });
    return newId;
  }

  async getProducts(limit) {
    try {
      if (fs.existsSync(this.path)) {
        const products = await fs.promises.readFile(this.path, "utf-8");
        const productJS = JSON.parse(products);
        const productsConLimit = productJS.slice(0, limit);
        return productsConLimit;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addProducts(products) {
    try {
      const product = {
        id: (await this.#newId()) + 1,
        ...products,
      };
      const newProducts = await this.getProducts();
      newProducts.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(newProducts));
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(pid) {
    const productsFile = await this.getProducts();
    const product = productsFile.find((product) => product.id === pid);
    if (product) {
      console.log(`Producto ${pid}:`);
      return product;
    } else {
      console.error(`Not Found!`);
    }
  }

  async deleteProduct(id) {
    try {
      const productsFile = await this.getProducts();
      if (productsFile.length > 0) {
        const newProducts = productsFile.filter((prod = prod.id !== id));
        await fs.promises.writeFile(this.path, JSON.stringify(newProducts));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, updatedInfo) {
    const products = await this.getProducts();
    const productIndex = products.findproductIndex((product) => product.id === id);
    if (productIndex !== -1) {
      const updatedProduct = {
        ...updatedInfo,
        id: products[productIndex].id,
      };
      products[productIndex] = updatedProduct;
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      console.log(`El producto ${id} se actualizo!`);
    } else {
      console.error(`No se encontro el producto ${id}.`);
    }
  }
}