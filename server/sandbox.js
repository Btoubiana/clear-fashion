/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimart = require('./sources/montlimart');
const adresseparis = require('./sources/adresseparis');
const fs = require('fs');

async function sandbox (/*eshop = 'https://www.dedicatedbrand.com/en/men/news'*/) {
  try {
    let products = [];

    // dedicatedbrand scrapping
    let pages = ['https://www.dedicatedbrand.com/en/men/all-men#page=1',
    'https://www.dedicatedbrand.com/en/men/all-men#page=2',
    'https://www.dedicatedbrand.com/en/men/all-men#page=3',
    'https://www.dedicatedbrand.com/en/men/all-men#page=4',
    'https://www.dedicatedbrand.com/en/men/all-men#page=5',
    'https://www.dedicatedbrand.com/en/men/all-men#page=6',
    'https://www.dedicatedbrand.com/en/men/all-men#page=7',
    'https://www.dedicatedbrand.com/en/men/all-men#page=8',
    'https://www.dedicatedbrand.com/en/men/all-men#page=9',
    'https://www.dedicatedbrand.com/en/men/all-men#page=10',
    'https://www.dedicatedbrand.com/en/women/all-women#page=1',
    'https://www.dedicatedbrand.com/en/women/all-women#page=2',
    'https://www.dedicatedbrand.com/en/women/all-women#page=3',
    'https://www.dedicatedbrand.com/en/women/all-women#page=4',
    'https://www.dedicatedbrand.com/en/women/all-women#page=5',
    'https://www.dedicatedbrand.com/en/women/all-women#page=6',
    'https://www.dedicatedbrand.com/en/women/all-women#page=7',
    'https://www.dedicatedbrand.com/en/women/all-women#page=8',
    'https://www.dedicatedbrand.com/en/women/all-women#page=9',
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

    products = products.flat();
    console.log(`👕 ${products.length} total of products found`);
    // save products into json file
    fs.writeFileSync('all_products.json', JSON.stringify(products));

    














    /*console.log(`🕵️‍♀️  browsing ${eshop} source`);
    const products = await dedicatedbrand.scrape(eshop);
    console.log(products);
    console.log('done');
    process.exit(0);*/
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);