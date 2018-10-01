/* jshint esversion: 6 */

import { elements } from './base';

export const clearItem = () => {
  elements.shopping.innerHTML = "";
};

export const renderItem = (item) => {
  const markup = `
  <li class="shopping__item" data-item_id=${item.id}>
    <div class="shopping__count">
      <input type="number" min="0" value="${item.count}" step="${item.count}" class="shopping__count-value">
      <p>${item.unit}</p>
    </div>
    <p class="shopping__description">${item.ingredient}</p>
    <button class="shopping__delete btn-tiny">
      <svg>
        <use href="img/icons.svg#icon-circle-with-cross"></use>
      </svg>
    </button>
  </li>
  `;

  elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = (id) => {
  const item =document.querySelector(`[data-item_id="${id}"]`);
  if(item) {
    item.parentElement.removeChild(item);
  }
};