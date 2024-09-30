import {Component, inject, OnDestroy, OnInit} from "@angular/core";
import {ItemService} from "../../services/item.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {ItemModel} from "../../models/item.model";
import {AccordionComponent} from "../../ui/accordion/accordion.component";
import {AccordionItemComponent} from "../../ui/accordion/accordion-item/accordion-item.component";
import {ShoppingCartService} from "../../services/shopping-cart.service";
import {NgOptimizedImage} from "@angular/common";
import {UserModel} from "../../models/user.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AccordionComponent,
    AccordionItemComponent,
    NgOptimizedImage
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent implements OnInit, OnDestroy{
  itemId!: string;
  item!: ItemModel;
  private cartId = '';
  private subscriptions: Subscription[] = [];
  private route = inject(ActivatedRoute);

  private itemService = inject(ItemService);
  private cartService = inject(ShoppingCartService);
  private userService = inject(UserService);

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe(params => {
      this.itemId = params['itemId'];
      /**
       *  Code below produces a "TypeError: properties are undefined".
       *  This occurs because the item object is not initialized when
       *  the template is first rendered. This happens because the
       *  item data is fetched asynchronously.
       *   https://stackoverflow.com/a/76951201
       */
      this.itemService.getItemById(this.itemId).subscribe({
        next: (data: ItemModel) => {
          this.item = data;
        }
      });
    }));
     this.subscriptions.push(this.userService.getUserByEmail().subscribe({
       next: (data: UserModel) => {
         this.cartId = data.cartId
         console.log(data);
       }
     }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  addToCart(){
    if (!this.item.in_stock) return;
    this.cartService.addItemToCart(this.cartId, this.itemId).subscribe({
      next: () => {
        console.log('Item added successfully')
      }
    })
  }

}
