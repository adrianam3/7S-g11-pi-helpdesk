# 7S-g11-pi-helpdesk
Proyecto integrador Grupo 11 / Aplicación móvil para la gestión de Help Desk en el área de sistemas de Imbauto S.A

LEEME: 

0. URL Github: https://github.com/adrianam3/7S-g11-pi-helpdesk.git

##OPCION 1 DE EJECUCIÓN DEL PROYECTO - INSTALAR EL PROYECTO

1. Descaragar el archivo comprimido 7S-g11-pi-helpdesk.zip
2. Para que se ejecute el backend se require tener instalado XAMPP
3. Descomprimr la carpeta 7S-g11-pi-helpdesk en htdocs de xammp, la ruta por defecto es C:\xampp\htdocs
4. Se suguiere utilizar visual studio code para abrir la carpeta principal del proyecto que es "7S-g11-pi-helpdesk"
5. Para ejecutar el backend debe estar ejecutandose en xammp el servidor web Apache y MySQL
6. Crear la base de datos help_desk en MySQL, puede usar phpmyadmin
7. Importar la estructura de la base de datos con el script que se ecuentra en C:\xampp\htdocs\7S-g11-pi-helpdesk\bdd\help_desk_11042025_1057.sql
9. Modificar las credenciales de MySQL en C:\xampp\htdocs\7S-g11-pi-helpdesk\7s-hd-backend\config\config.php
	private $host = "localhost";
    private $usuario = "root";
    private $pass = "clave";
    private $base = "help_desk";
10. Para ejecutar el frontend, se debe ejecutar una terminal e ingresar a la ruta C:\xampp\htdocs\7S-g11-pi-helpdesk\7s-hd-frontend\
11. ejecutar el comando npm install, para que se descaren todas la dependecias configuradas en el proyecto
12. ejecutar el siguiente comando npm install ngx-quill@latest npm install quill@latest
13. ejecutar el comando npm star, para iniciar la aplicación 
14. Usuarios aplicación Web Help Desk: 

	administrador: 
	email: adrian.merlo.am3+1@gmail.com
	clave: pass1234A.a

	coordinador:
	Usuario: adrian.merlo.am3+20@gmail.com
	Contraseña: pass1234A.a


	agente: 
	adrian.merlo.am3+21@gmail.com
	clave: pass1234A.a
	
	adrian.merlo.am3+5@gmail.com
	clave: pass1234A.a

	usuario: 
	adrian.merlo.am3+25@gmail.com
	clave: pass1234A.a
	
	adrian.merlo.am3+12@gmail.com	
	clave: pass1234A.a


