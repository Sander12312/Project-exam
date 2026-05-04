const productList = document.querySelector("#product-list");

// Carousel
const items = document.querySelectorAll("#carousel-list .news-item");
const prevBtn = document.querySelector(".arrow-btn.left");
const nextBtn = document.querySelector(".arrow-btn.right");

let currentIndex = 0;

function showItem(index) {
  items.forEach((item, i) => {
    item.style.display = i === index ? "block" : "none";
  });
}

if (prevBtn && nextBtn && items.length > 0) {
  prevBtn.addEventListener("click", () => {
    currentIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
    showItem(currentIndex);
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = currentIndex >= items.length - 1 ? 0 : currentIndex + 1;
    showItem(currentIndex);
  });

  showItem(currentIndex);
}

// Products from API
async function loadProducts() {
  try {
    productList.innerHTML = "<p>Loading products...</p>";

    const response = await fetch("https://v2.api.noroff.dev/online-shop");

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const result = await response.json();
    const products = result.data.slice(0, 12);

    productList.innerHTML = "";

    products.forEach((product) => {
      const price = product.discountedPrice || product.price;

      productList.innerHTML += `
        <a href="/pages/productinfo.html?id=${product.id}" class="card">
          <img src="${product.image.url}" alt="${product.image.alt || product.title}" class="card-image">
          <div class="card-content">
            <p class="card-label">${product.title}</p>
            <h3 class="card-price">${price} kr</h3>
            <p class="card-status">⭐ ${product.rating}</p>
          </div>
        </a>
      `;
    });
  } catch (error) {
    console.error("Error loading products:", error);
    productList.innerHTML = "<p>Could not load products. Please try again later.</p>";
  }
}

if (productList) {
  loadProducts();
}