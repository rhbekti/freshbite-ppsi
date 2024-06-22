"use strict";

/**
 * navbar toggle
 */

const overlay = document.querySelector("[data-overlay]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const navLinks = document.querySelectorAll("[data-nav-link]");

const navElemArr = [navOpenBtn, navCloseBtn, overlay];

/**
 * header sticky & go to top
 */

const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 200) {
    header.classList.add("active");
    goTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    goTopBtn.classList.remove("active");
  }
});

// get product
$(document).ready(function () {
  getProducts();

  function getProducts() {
    $.ajax({
      url: "https://script.google.com/macros/s/AKfycbz0FzQRQPYJMEqhfy2P1W5RogsBzxcVEebwfE00cbhAtMgmJERUCJzlZndoGfWIL02y/exec",
      method: "GET",
      success: function (response) {
        const { data } = response;
        let content = "";

        $.each(data, function (index, value) {
          content += `
          <div class="product-card" data-name="${value.name}" data-price="${value.price}" data-image=${value.image} data-quantity="0">
                <div
                  class="product-image"
                  style="background-image: url('${value.image}')"
                ></div>
                <div class="product-title">${value.name}</div>
                <div class="product-price">Rp ${value.price}</div>
                <div class="quantity-controls">
                  <button data-name="${value.name}" class="decrement blue-button">-</button>
                  <span class="quantity">0</span>
                  <button data-name="${value.name}" class="increment blue-button">+</button>
                </div>
              </div>
          `;
        });

        $("#product-section").html(content);
      },
      error: function (error) {
        console.log(error);
      },
    });
  }

  $(document).ajaxStop(function () {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.forEach((order) => {
      let productCard = $(`.product-card[data-name="${order.productName}"]`);
      if (productCard.length > 0) {
        productCard.data("quantity", order.quantity);
        productCard.attr("data-quantity", order.quantity);
        productCard.find(".quantity").text(order.quantity);
      }
    });

    $(".product-card").on("click", ".increment", function () {
      let productCard = $(this).closest(".product-card");
      let productName = $(this).data("name");
      let productPrice = productCard.data("price");
      let productImage = productCard.data("image");
      let quantity = parseInt(productCard.data("quantity")) || 0;
      quantity++;

      productCard.data("quantity", quantity);
      productCard.attr("data-quantity", quantity);
      productCard.find(".quantity").text(quantity);

      updateQuantity(productName, productPrice, productImage, quantity);
    });

    $(".product-card").on("click", ".decrement", function () {
      let productCard = $(this).closest(".product-card");
      let productName = $(this).data("name");
      let productPrice = productCard.data("price");
      let productImage = productCard.data("image");
      let quantity = parseInt(productCard.data("quantity")) || 0;

      if (quantity > 0) {
        quantity--;
      }

      productCard.data("quantity", quantity);
      productCard.attr("data-quantity", quantity);
      productCard.find(".quantity").text(quantity);

      updateQuantity(productName, productPrice, productImage, quantity);
    });

    function updateQuantity(productName, productPrice, productImage, quantity) {
      let productIndex = orders.findIndex((p) => p.productName === productName);

      if (productIndex !== -1) {
        if (quantity > 0) {
          orders[productIndex].quantity = quantity;
        } else {
          orders.splice(productIndex, 1);
        }
      } else {
        if (quantity > 0) {
          orders.push({
            productName: productName,
            productPrice: productPrice,
            productImage: productImage,
            quantity: quantity,
          });
        }
      }

      localStorage.setItem("orders", JSON.stringify(orders));
    }
  });
});
