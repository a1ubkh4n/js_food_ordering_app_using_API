/* jshint esversion: 6 */
import uniqid from 'uniqid';

export default class List {
  constructor() {
    this.items = [];
  }

  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid,
      count,
      unit,
      ingredient
    };
    this.items.push(item);
    return item;
  }

  deleteItem(id) {
    const index = this.items.findIndex((el) => el.id === id);
    // [2, 4, 6, 8] splice(1, 2) --> returns [4, 6], original array is [2, 8]
    // [2, 4, 6, 8] slice(1, 3) --> returns [4, 6], original array is [2, 4, 6, 8]
    this.item.splice(index, 1);
  }

  updateCount(id, newCount) {
    this.items.find(el => el.id === id).count = newCount;
  }
}