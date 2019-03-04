# DigitalPantry

## Installation

**Prerequisites:**
- [mysql server](https://dev.mysql.com/doc/mysql-getting-started/en/#mysql-getting-started-installing)
- [NodeJS](https://nodejs.org/en/download/)
- [git](https://git-scm.com/downloads)

**Start mySQL Server - MacOS**
- Navigate to /system preferences/mySQL/ and click start server
- Run:
```
sudo /usr/local/mysql/support-files/mysql.server start
```

**Start mySQL Server - Windows**
- Download MySQL installer (https://dev.mysql.com/downloads/installer/)
- Run it
- Add the folder ~\MySQL Server 8.0\bin\ to system PATH variables

**Configure project**
```
//clone this repository
git clone https://github.com/ey6685/DigitalPantry.git

//Checkout development branch
git checkout development

//Install all dependencies
npm install

```

**Set up database:**
```
//Create a new database (Do this step after mysql is installed)
mysql -u <your_username> -p
//It will promnt you for your password

//Once inside the mysql shell run
create database digital_pantry;

//Exit mysql shell and run
mysql -u <your_username> -p digital_pantry < mySQL.sql
//It will promnt you for your password
```

**Run project**
```
//Inside DigitalPantry directory, run
nodemon app.js

//In browser navigate to localhost:3000
```
