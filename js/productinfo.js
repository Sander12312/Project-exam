const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const productImage = document.querySelector("#product-image");
const productTitle = document.querySelector("#product-title");
const productStars = document.querySelector("#product-stars");
const productRating = document.querySelector("#product-rating");
const productDescription = document.querySelector("#product-description");
const productTags = document.querySelector("#product-tags");
const productPrice = document.querySelector("#product-price");
const reviewsList = document.querySelector("#reviews-list");
const addToCartButton = document.querySelector("#add-to-cart-button");
const token = localStorage.getItem("accessToken");

if (!token && addToCartButton) {
  addToCartButton.disabled = true;
  addToCartButton.textContent = "Login to add to cart";
}

let currentProduct = null;

function createStars(rating) {
  const roundedRating = Math.round(rating);
  let stars = "";

  for (let i = 1; i <= 5; i++) {
    stars += i <= roundedRating ? "★" : "☆";
  }

  return stars;
}

function addToCart(product) {
  const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

  const productInCart = existingCart.find((item) => item.id === product.id);

  if (productInCart) {
    productInCart.quantity += 1;
  } else {
    existingCart.push({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    discountedPrice: product.discountedPrice,
    image: product.image?.url || "",
    alt: product.image?.alt || product.title,
    quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(existingCart));
}

async function loadProduct() {
  if (!productId) {
    console.error("No product ID found in URL");
    return;
  }

  try {
    const response = await fetch(`https://v2.api.noroff.dev/online-shop/${productId}`);
    const result = await response.json();
    const product = result.data;

    currentProduct = product;

    productImage.src = product.image?.url || "/images/placeholder.jpg";
    productImage.alt = product.image?.alt || product.title;
    productTitle.textContent = product.title;
    productStars.textContent = createStars(product.rating);
    productRating.textContent = `${product.rating} / 5`;
    productDescription.textContent = product.description;

    if (product.price !== product.discountedPrice) {
      productPrice.innerHTML = `
        <span style="text-decoration: line-through; opacity: 0.6; margin-right: 0.5rem;">
          ${product.price} kr
        </span>
        ${product.discountedPrice} kr
      `;
    } else {
      productPrice.textContent = `${product.price} kr`;
    }

    productTags.innerHTML = "";

    product.tags.forEach((tag) => {
      const li = document.createElement("li");
      li.textContent = tag;
      productTags.appendChild(li);
    });

    reviewsList.innerHTML = "";

    if (!product.reviews || product.reviews.length === 0) {
      reviewsList.innerHTML = `
        <div class="review">
          <div class="review-icon">👤</div>
          <div class="review-content">
            <h3>No reviews yet</h3>
            <p>This product has no reviews yet.</p>
          </div>
        </div>
      `;
    } else {
      product.reviews.forEach((review) => {
        reviewsList.innerHTML += `
          <div class="review">
            <div class="review-icon">👤</div>
            <div class="review-content">
              <h3>${review.username}</h3>
              <p>${review.description}</p>
            </div>
          </div>
        `;
      });
    }
  } catch (error) {
    console.error("Could not load product:", error);
    reviewsList.innerHTML = `
      <div class="review">
        <div class="review-content">
          <h3>Something went wrong</h3>
          <p>Could not load this product.</p>
        </div>
      </div>
    `;
  }
}

addToCartButton.addEventListener("click", () => {
  if (!currentProduct) return;

  addToCart(currentProduct);
  alert("Product added to cart");
});

loadProduct();

const shareButton = document.querySelector("#share-button");

if (shareButton) {
  shareButton.addEventListener("click", async () => {
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: productTitle.textContent,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Product link copied!");
      }
    } catch (error) {
      console.error("Could not share product:", error);
    }
  });
}