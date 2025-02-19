# [Todo List Management]

Todolist management simpel dalam bentuk Restful api menggunakan framework hapi.js

## Dokumentasi
Dokumentasi API lengkap tersedia di:

[SwaggerHub](https://app.swaggerhub.com/apis/CryfariS(Pahrijal)/todo-api/1.0.0)
atau
[Json file](http://github.com/Cryfari/todo_list/blob/master/docs/todo-api.json)
## Instalasi

instruksi langkah demi langkah cara menginstal proyek.

1.  Clone repositori ini:
    ```bash
    git clone https://github.com/Cryfari/todo_list
    ```
2.  Masuk ke direktori proyek:
    ```bash
    cd todo_list
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Buat database dan atur koneksi:
    *   Buat database PostgreSQL.
    *   Konfigurasikan koneksi database di file `.env` (lihat file `.env.example`).

## Menjalankan Aplikasi
  ```bash
  npm run start
  # atau
  npm run start-dev  
  ```
  Aplikasi akan berjalan di `http://localhost:[port]` ( biasanya port 3000).

## Menjalankan Test

```bash
npm test