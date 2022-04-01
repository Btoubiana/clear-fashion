const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./db')

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'true': true});
});

app.get('/products/search', async (request, response) => {
  var limit = request.query.limit != null ? request.query.limit : 12;
  var brand = (request.query.brand != null && request.query.brand != 'all') ? request.query.brand : /[a-zA-Z0-9]/i;
  var price = request.query.price != null ? parseInt(request.query.price) : Infinity;
  var query = {"brand": brand, "price": {"$lte": price}};
  console.log(query);
  var products = await db.find({"brand":brand, "price":{'$lte':price}});
  /*producs = products.sort((a, b) => a.price - b.price).slice(0, limit);
  var body = {}
  body.data.result = products*/
  var page = request.query.page != null ? request.query.page : 1;
  var count = products.length;
  var size = Math.floor(count/limit);

  console.log(count)
  response.send(
    {
      "data": {
        "meta": {
          "count": count,
          "currentPage": parseInt(page),
          "pageCount": size+1,
          "pageSize": parseInt(limit)
        },
        "result": products.sort((a, b) => a.price - b.price).slice(limit*(page-1), limit*page)
      },
      "success": true
    }
  );
});

app.get('/products/:id', async (request, response) => { 
  const id = request.params.id
  console.log(id)
  items = db.find()
  .then((item) => {
    products = item.filter(i => i._id == id)
    response.send(products)
  });
});

//app.get('/products', async (request, response) => { 
//  items = await db.find() 
//  response.send(items)
//});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);