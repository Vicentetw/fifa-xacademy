# Presentación - FIFA XAcademy Challenge

**FIFA XAcademy Challenge**

**Vicente Perrotta**

**Angular + Node.js + MySQL + Docker**

---

## OBJETIVO

Crear una aplicación full stack para gestionar jugadores FIFA:

- Login
- CRUD de jugadores
- Filtros de búsqueda
- Gráficos
- Exportar datos a CSV

---

## STACK TECNOLÓGICO

Tecnologías:

- Angular
- Node.js
- MySQL
- Docker
- JWT

---

##ARQUITECTURA

**Flujo:**

Angular → API Express → MySQL

- Frontend modular
- Backend REST
- Sequelize ORM

---

## CAMBIO DE REQUERIMIENTOS

“Inicialmente el sistema utilizaba una tabla simplificada.
Luego el challenge incorporó una estructura con más de 60 atributos, por lo que debí adaptar la arquitectura y realizar un sistema de mapeo dinámico.”


## DEMO

Funcionalidades clave:

- Login (User: test1@test.com, pass: 123456)
- Listado de jugadores
- Filtros activos
- Gráfico de datos
- Crear / editar jugadores
- Exportar CSV


## APRENDIZAJES

- Angular
- JWT
- Docker
- Sequelize
- Arquitectura
- Adaptación a cambios

## cómo iniciar
1- clonar el repositorio: https://github.com/Vicentetw/fifa-xacademy.git
2- cambiar a la rama "docker-update" la cual está actualizada y preparada para correr los 3 servidores con un comando: "docker compose up -d"
3- La rama main es una versión más simple para hacer el deploy online.
https://fifa-xacademy.web.app/  
Login 
User: test1@test.com
Pass: 123456
