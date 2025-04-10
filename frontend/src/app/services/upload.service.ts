import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface UploadProgress {
  progress: number;
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'ERROR';
  url?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Upload une image vers le serveur et suit la progression
   * @param file Fichier à uploader
   * @param folder Dossier de destination (ex: 'menus', 'articles')
   * @returns Observable qui émet la progression et l'URL finale
   */
  uploadImage(file: File, folder: string): Observable<UploadProgress> {
    // Créer un FormData pour l'envoi du fichier
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // Créer un Subject pour suivre la progression
    const progress = new Subject<UploadProgress>();
    progress.next({ progress: 0, state: 'PENDING' });

    // Effectuer la requête avec suivi de progression
    this.http.post(`${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => this.getProgress(event))
    ).subscribe({
      next: (value: UploadProgress | null) => {
        if (value) {
          progress.next(value);
          if (value.state === 'DONE') {
            progress.complete();
          }
        }
      },
      error: (err) => {
        progress.next({
          progress: 0,
          state: 'ERROR',
          error: err.message || 'Une erreur est survenue lors de l\'upload'
        });
        progress.complete();
      }
    });

    return progress.asObservable();
  }

  /**
   * Convertit un événement HTTP en objet de progression
   */
  private getProgress(event: HttpEvent<any>): UploadProgress | null {
    switch (event.type) {
      case HttpEventType.Sent:
        return { progress: 0, state: 'IN_PROGRESS' };
      
      case HttpEventType.UploadProgress:
        const progress = event.total ? Math.round(100 * event.loaded / event.total) : 0;
        return { progress, state: 'IN_PROGRESS' };
      
      case HttpEventType.Response:
        const response = event as HttpResponse<any>;
        if (response.body && response.body.url) {
          return {
            progress: 100,
            state: 'DONE',
            url: response.body.url
          };
        }
        return null;
      
      default:
        return null;
    }
  }

  /**
   * Compresse une image avant upload
   * @returns Promise avec le blob compressé
   */
  compressImage(file: File, maxWidth: number, maxHeight: number, quality: number = 0.7): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          
          // Calculer les nouvelles dimensions
          if (width > maxWidth) {
            height = Math.round(height * maxWidth / width);
            width = maxWidth;
          }
          
          if (height > maxHeight) {
            width = Math.round(width * maxHeight / height);
            height = maxHeight;
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Impossible de créer le contexte canvas'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convertir en blob avec la qualité spécifiée
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Échec de conversion en blob'));
              }
            },
            file.type,
            quality
          );
        };
        
        img.onerror = () => {
          reject(new Error('Erreur lors du chargement de l\'image'));
        };
      };
      
      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'));
      };
    });
  }
} 