import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ItemService} from "../services/item.service";
import {Subscription} from "rxjs";
import {DialogComponent} from "../ui/dialog/dialog.component";
import {ItemModel} from "../models/item.model";
import {RouterLink} from "@angular/router";
import {SidebarComponent} from "../ui/sidebar/sidebar.component";
import {categories, Category} from "../models/category.model";
import {MatTooltip} from "@angular/material/tooltip";
import {MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    DialogComponent,
    RouterLink,
    SidebarComponent,
    MatTooltip,
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent implements OnInit, OnDestroy{
  private itemService = inject(ItemService);
  protected items: ItemModel[] = [];

  private subs: Subscription[] = [];

  private tooltipText: string = '';
  private readonly dialog = inject(MatDialog);

  openDialog(item: ItemModel){
    if (item){
      if (item.price % 2 === 0){
        this.tooltipText = `${item.name}: CHF ${item.price}.-`;

      } else {
        this.tooltipText = `${item.name}: CHF ${item.price}`;
      }
      this.dialog.open(DialogComponent, {
        data: {item, tooltipText: this.tooltipText}
      });
    }
  }

  closeDialog(){
    this.dialog.closeAll();
  }

  ngOnInit() {
    this.subs.push(this.itemService.getAllItems().subscribe({
      next: (data: ItemModel[]) => {
        this.items = data;
      }
    }));
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onCategorySelected(selectedCategories: categories){
    if (selectedCategories.length === 0){
      this.subs.push(this.itemService.getAllItems().subscribe({
        next: (data: ItemModel[]) => {
          this.items = data;
        }
      }));
    } else {
      this.subs.push(this.itemService.getItemByCategories(selectedCategories).subscribe({
        next: (data: ItemModel[]) => {
          this.items = data;
        }
      }));
    }
  }

  protected getCategoryNames(categories: Category[]): string {
    return categories ? categories.map(cat => cat.categoryName).join(' / ') : 'No categories available';
  }
}
