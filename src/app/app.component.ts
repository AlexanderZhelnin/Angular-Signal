import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, inject, Injector, OnInit, signal } from '@angular/core';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, tap } from 'rxjs';
import { myEffect, mySignal } from './my-signal';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit
{
  cd = inject(ChangeDetectorRef);

  titleIndex = 1;

  title = signal('Тест1');
  index = signal(1);

  computedTitle = computed(() => `${this.title()}: ${this.index()}`);

  title$ = new BehaviorSubject('Тест1');
  index$ = new BehaviorSubject(1);

  computedTitle$ = combineLatest([this.title$, this.index$])
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map(([t, i]) => `${t}: ${i}`)
    );

  myTitle = mySignal('Тест1');

  constructor()
  {
    effect(_ =>
    {
      this.computedTitle();
      console.log('Changed');
    });

    this.computedTitle$.subscribe(_ =>
    {
      console.log('Changed$');
    });

    myEffect(() =>
    {
      console.log('myTitleChanged', this.myTitle());
    });
  }

  ngOnInit(): void
  {
  }

  onClick()
  {
    this.titleIndex++;

    this.title.set(`Тест${this.titleIndex}`)
    this.index.set(this.index() + 1);

    this.title$.next(`Тест${this.titleIndex}`);
    this.index$.next(this.index$.value + 1);

    this.myTitle.set(`Тест${this.titleIndex}`);

    this.cd.detectChanges();
  }
}
