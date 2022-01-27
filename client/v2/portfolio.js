﻿// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';
// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

// Custom const variables
const selectBrand = document.querySelector('#brand-select');
const checkReasonablePrice = document.querySelector('#reasonable-check');
const checkRecent = document.querySelector('#recently-check');
const selectSort = document.querySelector('#sort-select');
const spanNbNewProducts = document.querySelector('#nbNewProducts');

// Instantiate indicators
const spanP50 = document.querySelector('#p50');
const spanP90 = document.querySelector('#p90');
const spanP95 = document.querySelector('#p95');
const spanReleased = document.querySelector('#released');

const checkFavourite = document.querySelector('#favourite-check');
/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({ result, meta }) => {
    meta.pageSize = selectShow.options[selectShow.selectedIndex].value;
    currentProducts = result;
    currentPagination = meta;
};

console.log(currentPagination);
/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
      console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
//const renderProducts = products => {
//  const fragment = document.createDocumentFragment();
//  const div = document.createElement('div');
//  const template = products
//    .map(product => {
//      return `
//      <div class="product" id=${product.uuid}>
//        <span>${product.brand}</span>
//        <a href="${product.link}">${product.name}</a>
//        <span>${product.price}</span>
//      </div>
//    `;
//    })
//    .join('');

//  div.innerHTML = template;
//  fragment.appendChild(div);
//  sectionProducts.innerHTML = '<h2>Products</h2>';
//  sectionProducts.appendChild(fragment);
//};
const renderProducts = products => {
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    if (selectBrand.options[selectBrand.selectedIndex].value != "All") {
        const brandFilter = products.filter(product => product.brand == selectBrand.options[selectBrand.selectedIndex].value);
        products = brandFilter;
    }
    if (checkReasonablePrice.checked == true) {
        const reasonableFilter = products.filter(product => product.price < 100);
        products = reasonableFilter;
    }

    if (checkRecent.checked == true) {
        var d = new Date();
        d.setDate(d.getDate() - 14);
        let dstring = d.getFullYear() + "-" + d.getMonth() + "-"+ d.getDay();
        const recentFilter = products.filter(product => product.released > dstring);
        products = recentFilter;
    }

    let nbSort = selectSort.selectedIndex;
    if (nbSort == 0) {

        products.sort(function (a, b) {
            return parseInt(a.price) - parseInt(b.price);
        });

    }
    if (nbSort == 1) {

        products.sort(function (b, a) {
            return parseInt(a.price) - parseInt(b.price);
        });

    }

    if (nbSort == 2) {

        products.sort(function (b, a) {
            return parseInt(a.released) - parseInt(b.released);
        });

    }

    if (nbSort == 3) {

        products.sort(function (a, b) {
            return parseInt(a.released) - parseInt(b.released);
        });

    }
    console.log(products.length);
    const template = products
        .map(product => {
            return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
        <input type="checkbox" id="favourite-check">
      </div>
    `;
        })
        .join('');

    div.innerHTML = template;
    fragment.appendChild(div);
    sectionProducts.innerHTML = '<h2>Products</h2>';
    sectionProducts.appendChild(fragment);
};


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};


// Percentile calculator 

const Percentiles = (nb, products) => {
    const indexPercentile = Math.round(nb / 100 * products.length);
    return products[indexPercentile].price;
}

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = (products, pagination) => {

    //total amount of articles
    const { count } = pagination;
    spanNbProducts.innerHTML = count;

    // Recent articles indicator
    var d = new Date();
    d.setDate(d.getDate() - 14);
    let dstring = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDay();
    const recentFilter = products.filter(product => product.released > dstring);
    spanNbNewProducts.innerHTML = recentFilter.length;

    // Percentiles (50, 90, 95 of the product list)

    products.sort(function (a, b) {
        return parseInt(a.price) - parseInt(b.price);
    });

    spanP50.innerHTML = Percentiles(50, products);
    spanP90.innerHTML = Percentiles(90, products);
    spanP95.innerHTML = Percentiles(95, products);

    // Most recently added item indicator

    products.sort(function (b, a) {
        return parseInt(a.released) - parseInt(b.released);
    });

    spanReleased.innerHTML = products[0].released;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(products, pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', event => {
  fetchProducts(1, parseInt(event.target.value))
      .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

// cheap articles filter listener
checkReasonablePrice.addEventListener('change', event => {
    (render(currentProducts, currentPagination))
});

// recent articles filter listener
checkRecent.addEventListener('change', event => {
    (render(currentProducts, currentPagination))
});

//sort selection listener
selectSort.addEventListener('change', event => {
    (render(currentProducts, currentPagination))
});


/* brand filter listener */
selectBrand.addEventListener('change', event => {
 render(currentProducts, currentPagination);
});

/* page selection listener */
selectPage.addEventListener('change', event => {
    fetchProducts(parseInt(event.target.value), currentPagination.pageSize)
        .then(setCurrentProducts)
        .then(() => render(currentProducts, currentPagination));
});

document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
);
