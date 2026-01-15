<h1 align="center">🌊 Flow payment 💵</h1>
<h3 align="center">Tikkie clone</h3>

---

## 📜 Despre Proiect

Acesta proiect este realizat în cadrul opționalului de Tehnologii Web și simulează o aplicație de solicitare a plăților, similar cu [Tikkie](https://dutchreview.com/expat/tikkie-netherlands/). Utilizatorii pot crea cereri de plată introducând suma și motivul, generând un cod QR pe care prietenii îl pot scana pentru a accepta sau refuza plata. Aplicația urmărește statusul fiecărei cereri și trimite notificări push requester-ului atunci când requestee-ii acționează asupra cererii.

**URL Aplicație:** [Flow Payment](https://flow-payment.eduardbonea.com)

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
* **Notificări prin email**: Requesterii primesc notificări atunci când requestee-ii răspund cererilor.

---

## 🚀 Instalare și Rulare

Utilizarea Docker este cea mai simplă și rapidă metodă, eliminând cerințele de instalare Node.js, MySQL sau ArrowJS direct pe sistemul personal

### 0. Precondiții Esențiale

* **[Docker Desktop](https://www.docker.com/products/docker-desktop)** 

### 1. Clonarea Proiectului

Deschide terminalul și clonează repository-ul:

```bash
git clone [https://github.com/eduardbonea/flow-payment.git](https://github.com/eduardbonea/flow-payment.git)
cd flow-payment
````

### 2\. Configurare Variabile de Mediu

Variabilele sunt definite în `docker-compose.yml` ca să fie importate din `.env`, este nevoie să creați un fișier `.env` în directorul `backend/` cu următoarea structură:

```bash
# BACKEND
PORT=3003

JWT_SECRET=

#EMAIL
RESEND_API_KEY=
FROM_MAIL=

#DATABASE
MYSQL_DATABASE=flow-app
MYSQL_USER=flow-app
MYSQL_PASSWORD=''
DB_HOST='127.0.0.1'
DB_DIALECT='mysql'
DB_CHARSET='utf8'
```

### 3\. Pornirea Aplicației (Build & Run)

Execută această comandă pentru a construi imaginile Docker necesare și a porni toate serviciile (backend, frontend, bază de date) în fundal:

```bash
docker-compose up --build -d
```

### 4\. Accesarea Aplicației

După ce containerele au pornit cu succes:

| Serviciu | Adresă Implicită |
| :--- | :--- |
| **Frontend (Aplicația Web)** | `http://localhost:80` |
| **Backend (API)** | `http://localhost:3003` |
| **Database (mysql)** | `http://localhost:3306` |

### 5\. Oprirea și Curățarea

Pentru a opri și șterge containerele fără a pierde datele stocate în volume:

```bash
docker-compose down
```

Pentru a șterge complet toate containerele, imaginile și **volumele de date (inclusiv datele MySQL stocate)**:

```bash
docker-compose down --rmi all -v
```

-----

## Rute API

### Rută Generală

| Funcționalitate | Tip rută | Path |
| :--- | :--- | :--- |
| **Resetare baza de date** | GET | /reset |
| **Autentificare utilizator** | POST | /api/auth/login |

---

### Rute User

| Funcționalitate | Tip rută | Path |
| :--- | :--- | :--- |
| **Creare utilizator** | POST | /api/user/create |
| **Găsire profil utilizator** | GET | /api/user/getProfile |
| **Actualizare username** | PATCH | /api/user/patchusername/{userId} |
| **Actualizare parolă** | PATCH | /api/user/patchpassword/{userId} |
| **Actualizare email** | PATCH | /api/user/patchemail/{userId} |
| **Actualizare IBAN** | PATCH | /api/user/patchiban/{userId} |
| **Actualizare link de revolut** | PATCH | /api/user/patchrevlink/{userId} |
| **Ștergere utilizator** | DELETE | /api/user/delete/{userId} |

---

### Rute Payment

| Funcționalitate | Tip rută | Path |
| :--- | :--- | :--- |
| **Creare plată** | POST | /api/payment/create |
| **Istoric plăți** | GET | /api/payment/getHistory |
| **Link QR** | GET | /api/payment/getPaymentQR |
| **Ștergere plată** | GET | /api/payment/delete/{paymentId} |
| **Detalii plată** | GET | /api/payment/getDetails/{UUID} |
| **Actualizare plată** | PATCH | /api/payment/patch |
| **Trimitere mail către utilizator** | POST | /api/payment/notify |


## 🌐 Hostarea Web - DevOps

Aplicația **Flow Payment** este găzduită prin intermediul [DigitalOcean](https://www.digitalocean.com/products/droplets) pe un server **Ubuntu 24.04.1** și este accesibilă printr-un domeniu gestionat cu **DNS Cloudflare**.

### Configurație Server

* **Server OS:** Ubuntu 22.04.01 (DigitalOcean Droplet)  
* **Web server:** Nginx – folosit pentru a direcționa cererile către backend și pentru a servi frontend-ul.  
* **Docker:**  Platforma de Containerizare folosită pentru a rula aplicația în medii izolate și reproductibile (containere).

### Flux General

* **Frontend-ul** (Arrow.js + Vite build) este servit de Nginx ca fișiere statice.  
* **Backend-ul** (Node.js + Express) rulează ca proces gestionat de PM2 și expune API-ul RESTful pentru frontend.  
* **DNS și SSL:** Cloudflare gestionează domeniul și oferă SSL gratuit pentru securizarea conexiunilor HTTPS.  
* **Acces public:** Aplicația este accesibilă prin domeniul configurat în Cloudflare (`https://flow-payment.eduardbonea.com`).

## 👨🏻‍💻👩🏻‍💻 Autor

* **Eduard Bonea** - [GitHub](https://github.com/eduardbonea)
                   - [Website](https://eduardbonea.com)
