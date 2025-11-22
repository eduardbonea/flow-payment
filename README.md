<h1 align="center">🌊 Flow payment 💵</h1>
<h3 align="center">Proiectul echipei Flow</h3>

---

## 📜 Despre Proiect

Acesta proiect este realizat în cadrul opționalului de Tehnologii Web și simulează o aplicație de solicitare a plăților, similar cu [Tikkie](https://dutchreview.com/expat/tikkie-netherlands/). Utilizatorii pot crea cereri de plată introducând suma și motivul, generând un cod QR pe care prietenii îl pot scana pentru a accepta sau refuza plata. Aplicația urmărește statusul fiecărei cereri și trimite notificări push requester-ului atunci când requestee-ii acționează asupra cererii.

**URL Aplicație:** [TBA]

---

## 🛠️ Tehnologii Folosite

Proiectul este construit folosind următoarele tehnologii:

### Frontend

* **[ArrowJS](https://www.arrow-js.com/)**: Bibliotecă JavaScript pentru construirea interfețelor și gestionarea stării aplicației.
* **[HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)**: definește structura paginilor și elementele vizuale
* **[CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)**: stilizează elementele HTML

### Backend

* **[Node.js](https://nodejs.org/)**: Mediul de rulare JavaScript (runtime) pentru server.
* **[Express.js](https://expressjs.com/)**: Un framework minimalist pentru Node.js, folosit pentru a construi API-ul RESTful.
* **[Sequelize](https://sequelize.org/)**: Un ORM (Object-Relational Mapper) bazat pe promisiuni pentru Node.js. Simplifică interacțiunea cu baza de date (ex: PostgreSQL, MySQL, SQLite).
* **Baza de date: [mysql](https://www.mysql.com/).**

---

## ✨ Funcționalități Principale

* **Autentificare Utilizatori**: Acces în  aplicație prin conturi unice per utilizator
* **Crearea cererilor de plată**: Introducerea sumei și motivului, generarea unui cod QR.
* **Vizualizarea cererilor**: Requesterii pot vedea statusul fiecărui requestee și totalul colectat.
* **Acceptare/Refuz cereri**: Requestee-ii pot accepta sau refuza plățile prin interfața accesibilă cu QR code-ul.
* **Notificări push**: Requesterii primesc notificări atunci când requestee-ii răspund cererilor.

---

## 🚀 Instalare și Rulare Locală

Pentru a rula acest proiect local, vei avea nevoie de Node.js instalat dar și de un client pentru baze de date și de asemenea un IDE pentru modificări în codul sursă

**Windows**

* **[Visual Studio Code](https://code.visualstudio.com/download)**: Open source IDE
* **[NVM](https://github.com/coreybutler/nvm-windows)**: este un utilitar care permite instalarea și gestionarea mai multor versiuni de Node.js pe același calculator.
* **[Laragon](https://laragon.org/download)**: Laragon este un mediu de dezvoltare local complet pentru Windows, ideal pentru proiecte web PHP, Node.js și baze de date MySQL/PostgreSQL

**Linux**

* **[Visual Studio Code](https://code.visualstudio.com/download)**: Open source IDE
* **[NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)**: este un utilitar care permite instalarea și gestionarea mai multor versiuni de Node.js pe același calculator.
* **[XAMPP](https://www.apachefriends.org/)**: XAMPP este un mediu de dezvoltare local complet, cu server web, baze de date și suport PHP/Perl, pentru testarea aplicațiilor web pe calculatorul personal

### 1. Configurare locală

1.  Clonează repository-ul și navigheaza în folderul 'flow-payment':

    ```bash
    git clone [https://github.com/eduardbonea/movie-app.git](https://github.com/eduardbonea/movie-app.git)
    cd flow-payment
    ```
 
2.  Configurează frontend-ul:

    * Va trebui să navighezi în folderul `frontend` și să instalezi dependințele.

    ```bash
    cd frontend
    npm i
    npm run dev
    ```

4.  Configurează backend-ul:
   
    * Va trebui să navighezi în folderul `backend` și să instalezi dependințele.

    ```bash
    cd backend
    npm i
    ```
    * Va trebui să-ți creezi o bază de date numită 'flow' în Laragon sau XAMPP prin intermediul interfaței aplicației.
      
    * Apoi, pentru a rula baza de date vom folosii:

    ```bash
    npm run dev server.js
    ```

  ## Rute
  
   | Rutâ pentru | Tip rută | Path |
| :--- | :--- | :--- |
| **Reset** | Get | /reset |
| **User** | Post | /api/user/createUser |

> **⚠️ Notă Importantă:**nu uita să-ți pornești mediul de dezvoltare local, fie el XAMPP, Laragon sau alt program similar **. Altfel, baza de date nu va putea fi accesată de către backend iar rutele nu vor putea fi apelate

## 🌐 Hostarea Web - DevOps

Aplicația **Flow Payment** este găzduită prin intermediul [DigitalOcean](https://www.digitalocean.com/products/droplets) pe un server **Ubuntu 24.04.1** și este accesibilă printr-un domeniu gestionat cu **DNS Cloudflare**.

### Configurație Server

* **Server OS:** Ubuntu 22.04.01 (DigitalOcean Droplet)  
* **Web server:** Nginx – folosit pentru a direcționa cererile către backend și pentru a servi frontend-ul.  
* **Proces manager:** PM2 – rulează aplicația Node.js în background și gestionează restart-urile automate în caz de erori sau reboot.  

### Flux General

* **Frontend-ul** (Arrow.js + Vite build) este servit de Nginx ca fișiere statice.  
* **Backend-ul** (Node.js + Express) rulează ca proces gestionat de PM2 și expune API-ul RESTful pentru frontend.  
* **DNS și SSL:** Cloudflare gestionează domeniul și oferă SSL gratuit pentru securizarea conexiunilor HTTPS.  
* **Acces public:** Aplicația este accesibilă prin domeniul configurat în Cloudflare (ex: `https://flow-payment.com`).

## 👨🏻‍💻👩🏻‍💻 Membrii echipei

* **Eduard Bonea** - [GitHub](https://github.com/eduardbonea)
                   - [Website](https://eduardbonea.com)

* **Ana-Maria Antonenco** - [GitHub](https://github.com/anaantonenco)
                          - [Instagram](https://instagram.com/anamariaantonenco)
