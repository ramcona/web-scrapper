const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const { sendNotification } = require('./firebase.js')

async function scrapeTokopedia() {
  const url = 'https://www.tokopedia.com/officialjkt48?perpage=20';

  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  });

  const $ = cheerio.load(response.data);

  const products = [];

  $('.css-1sn1xa2').each((index, element) => {
    const name = $(element).find('.prd_link-product-name').text().trim();
    const price = $(element).find('.prd_link-product-price').text().trim();
    const imageUrl = $(element).find('img').attr('src');
    const productUrl = $(element).find('a').attr('href');
    const preorder = $(element).find('.css-1458qc4').text().trim();
    
    const product = { name, price, imageUrl, productUrl, preorder };

    if (!checkIfProductExists(product)) {
      products.push(product);
      let message = `${name} tersedia di Tokopedia dengan harga ${price}`
      sendNotification("JKT48 MERCH", message, imageUrl, productUrl, "testtopic")
    }
  });

  saveToJSON(products);
}

function checkIfProductExists(product) {
  const jsonData = fs.readFileSync('products.json', 'utf8');
  const existingProducts = JSON.parse(jsonData);

  return existingProducts.some((existingProduct) => {
    return (
      existingProduct.name === product.name &&
      existingProduct.price === product.price &&
      existingProduct.imageUrl === product.imageUrl &&
      existingProduct.productUrl === product.productUrl &&
      existingProduct.preorder === product.preorder
    );
  });
}

function saveToJSON(products) {
  const jsonData = fs.readFileSync('products.json');
  const existingProducts = JSON.parse(jsonData);

  const mergedProducts = [...existingProducts, ...products];

  const jsonString = JSON.stringify(mergedProducts, null, 2);

  fs.writeFileSync('products.json', jsonString);

  console.log('Scraped products saved to products.json');
}

module.exports = {scrapeTokopedia}