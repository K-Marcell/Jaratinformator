CREATE TABLE menetrend(jaratId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, jaratKezdes INTEGER NOT NULL,  jaratKezd DATE NOT NULL, jaratVeg DATE NOT NULL);
CREATE TABLE jaratadat(jaratId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, allomasok TEXT NOT NULL);
CREATE TABLE allomasok(allomasId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, allomasNev TEXT NOT NULL);
