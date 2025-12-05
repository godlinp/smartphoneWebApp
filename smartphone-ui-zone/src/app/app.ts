import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";

@Component({
  selector: 'app-root',
  imports: [FormsModule, Header, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('smartphone-ui-zone');
}

