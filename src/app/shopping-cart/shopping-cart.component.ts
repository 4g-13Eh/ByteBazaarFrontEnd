import {Component, inject, OnInit} from '@angular/core';
import {ShoppingCartService} from "./shopping-cart.service";
import {ShoppingCartItemModel} from "./shopping-cart-item.model";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit {
  cartItems: Array<ShoppingCartItemModel> = [];
  private shoppingCartService = inject(ShoppingCartService);

  ngOnInit() {
    this.cartItems = this.shoppingCartService.getCartItems();
  }

  removeItem(itemId: string) {
    this.shoppingCartService.removeItemFromCart(itemId);
    this.cartItems = this.shoppingCartService.getCartItems();
  }

  clearCart(){
    this.shoppingCartService.clearCart();
    this.cartItems = [];
  }

  updateQuantity(itemId: string, newQuantity: number) {
    const item = this.cartItems.find(cartItem => cartItem.item.id === itemId);
    if (item && newQuantity >= 1) {
      item.quantity = newQuantity;
      this.shoppingCartService.addItemToCart(item);
    }
  }

  protected readonly Math = Math;
}
