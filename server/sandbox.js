/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimart = require('./sources/montlimart');
const adresseparis = require('./sources/adresseparis');
const loom = require('./sources/loom');
const fs = require('fs');

const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://admin:wMicBfqyyOAk6dxR@Cluster0.tk0ap.mongodb.net/webapp?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';
const MONGODB_COLLECTION = 'products';


async function sandbox (/*eshop = 'https://www.dedicatedbrand.com/en/men/news'*/) {
  try {
    let products = [];

    // dedicatedbrand scrapping
    let pages = ['https://www.dedicatedbrand.com/en/men/all-men#page=1',
    'https://www.dedicatedbrand.com/en/men/all-men#page=2',
    'https://www.dedicatedbrand.com/en/men/all-men#page=3',
    'https://www.dedicatedbrand.com/en/men/all-men#page=4',
    'https://www.dedicatedbrand.com/en/men/all-men#page=5',
    'https://www.dedicatedbrand.com/en/women/all-women#page=1',
    'https://www.dedicatedbrand.com/en/women/all-women#page=2',
    'https://www.dedicatedbrand.com/en/women/all-women#page=3',
    'https://www.dedicatedbrand.com/en/women/all-women#page=4',
    'https://www.dedicatedbrand.com/en/women/all-women#page=5',
    'https://www.dedicatedbrand.com/en/kids/t-shirts#page=1',
    'https://www.dedicatedbrand.com/en/kids/t-shirts#page=2',
    'https://www.dedicatedbrand.com/en/kids/sweatshirts',
    'https://www.dedicatedbrand.com/en/kids/bottoms',
    'https://www.dedicatedbrand.com/en/kids/swimwear'];
    for(let page of pages){
      console.log(`🕵️‍♀️  scraping ${page}`);
      let results = await dedicatedbrand.scrape(page);
      console.log(`👕 ${results.length} products found`);
      products.push(results.flat());
    }

    // adresseparis scrapping
    pages = ['https://adresse.paris/630-toute-la-collection?id_category=630&n=118'];
    console.log(`🕵️‍♀️  scraping ${pages}`);
    let results = await adresseparis.scrape(pages);
    console.log(`👕 ${results.length} products found`);
    products.push(results.flat());

    // montlimart scrapping
    pages = ['https://www.montlimart.com/toute-la-collection.html?p=1',
    'https://www.montlimart.com/toute-la-collection.html?p=2',
    'https://www.montlimart.com/toute-la-collection.html?p=3',
    'https://www.montlimart.com/toute-la-collection.html?p=4',
    'https://www.montlimart.com/toute-la-collection.html?p=5',
    'https://www.montlimart.com/toute-la-collection.html?p=6',
    'https://www.montlimart.com/toute-la-collection.html?p=7',
    'https://www.montlimart.com/toute-la-collection.html?p=8',];
    for(let page of pages){
      console.log(`🕵️‍♀️  scraping ${page}`);
      let results = await montlimart.scrape(page);
      console.log(`👕 ${results.length} products found`);
      products.push(results.flat());
    }

    // loom scrapping
    pages = ['https://www.loom.fr/collections/tous-les-vetements'];
    console.log(`🕵️‍♀️  scraping ${pages}`);
    results = await loom.scrape(pages);
    console.log(`👕 ${results.length} products found`);
    products.push(results.flat());

    products = products.flat();
    console.log(`👕 ${products.length} total of products found`);

    // save products into json file
    //fs.writeFileSync('all_products.json', JSON.stringify(products));

    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)

    const collection = db.collection('products');
    const result = collection.insertMany(products);
    console.log(result);

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);