import { Injectable } from '@angular/core';
import {Meta} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(private meta: Meta) { }

  setMetaTags(tags: { title?: string; description?: string; keywords?: string; }) {
    if (tags.title) {
      this.meta.updateTag({ name: 'title', content: tags.title });
    }
    if (tags.description) {
      this.meta.updateTag({ name: 'description', content: tags.description });
    }
    if (tags.keywords) {
      this.meta.updateTag({ name: 'keywords', content: tags.keywords });
    }
  }
}
