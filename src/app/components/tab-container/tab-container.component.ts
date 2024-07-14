import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  EventEmitter,
  Output,
  signal,
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { skip } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab-container',
  templateUrl: './tab-container.component.html',
  styleUrl: './tab-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabContainerComponent {
  protected readonly tabs = contentChildren<TabComponent>(TabComponent);

  protected readonly activeTab = signal<number | null>(null);

  @Output()
  activeTabChange: Observable<number> = toObservable(this.activeTab).pipe(skip(1));

  @Output()
  tabClose: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
    toObservable(this.tabs)
      .pipe(takeUntilDestroyed())
      .subscribe((tabs) => {
        if (tabs.length > 0) {
          if (this.activeTab() === null) {
            this.activeTab.set(0);
            this.updateTabs();
          } else if (tabs[this.activeTab()] === undefined) {
            this.activeTab.set(0);
            this.updateTabs();
          }
        } else {
          this.activeTab.set(null);
          this.updateTabs();
        }
      });
  }

  protected setActiveTab(index: number) {
    this.activeTab.set(index);
    this.updateTabs();
  }

  protected removeTab(index: number) {
    this.tabClose.emit(index);

    if (this.activeTab() === index) {
      this.activeTab.set(0);
      this.updateTabs();
    }
  }

  private updateTabs() {
    this.tabs().forEach((tab, index) => {
      tab.active.set(this.activeTab() === index);
    });
  }
}
