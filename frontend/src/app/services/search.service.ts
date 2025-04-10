import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTerm = new BehaviorSubject<string>('');
  private cityTerm = new BehaviorSubject<string>('');
  
  currentSearchTerm = this.searchTerm.asObservable();
  currentCityTerm = this.cityTerm.asObservable();

  updateSearchTerm(term: string) {
    this.searchTerm.next(term);
  }

  updateCityTerm(term: string) {
    this.cityTerm.next(term);
  }
} 