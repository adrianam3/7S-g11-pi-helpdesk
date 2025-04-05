<?php
//TODO: Clase de Encuesta
require_once('../config/config.php');

class Encuesta
{
    //TODO: Implementar los métodos de la clase

    public function todos() // Select * from encuesta
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT encuesta.* ,
        persona.idPersona,
        persona.nombres,
        persona.apellidos,
        CONCAT(persona.nombres, ' ' , persona.apellidos)  AS nombreCompletoUsuario,
        ticket.titulo, ticket.descripcion, ticket.fechaCreacion, ticket.fechaCierre,
        (  SELECT CONCAT(p1.nombres, ' ' , p1.apellidos)  AS nombreAgente
            FROM `ticketdetalle` td1
            JOIN agente a1 on a1.idAgente=td1.idAgente
            JOIN usuario u1 on a1.idUsuario=u1.idUsuario
            join persona p1 on p1.idPersona=u1.idPersona
            WHERE
                idTicket = ticket.idTicket AND idTicketDetalle =
                (SELECT MAX(idTicketDetalle) FROM
                    `ticketdetalle` td2 
                WHERE td2.idTicket = td1.idTicket
                )) AS nombreAgente
        FROM `encuesta` encuesta
        JOIN ticket AS ticket ON encuesta.idTicket = ticket.idTicket
        JOIN usuario AS usuario ON encuesta.idUsuario = usuario.idUsuario
        JOIN persona AS persona ON persona.idPersona = usuario.idPersona
";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function uno($idEncuesta) // Select * from encuesta where id = $idEncuesta
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `encuesta` WHERE `idEncuesta`=$idEncuesta";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function insertar($idTicket, $idUsuario, $puntuacion, $comentarios) // Insert into encuesta (...)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "INSERT INTO `encuesta` (`idTicket`, `idUsuario`, `puntuacion`, `comentarios`) 
                       VALUES ('$idTicket', '$idUsuario', '$puntuacion', '$comentarios')";
            if (mysqli_query($con, $cadena)) {
                return $con->insert_id;
            } else {
                return $con->error;
            }
        } catch (Exception $th) {
            http_response_code(500);
            return $th->getMessage();
        } finally {
            $con->close();
        }
    }

    public function actualizar($idEncuesta, $idTicket, $idUsuario, $puntuacion, $comentarios, $fechaRespuestaEncuesta) // Update encuesta set ... where id = $idEncuesta
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `encuesta` SET 
                        `idTicket`='$idTicket', 
                        `idUsuario`='$idUsuario', 
                        `puntuacion`='$puntuacion', 
                        `comentarios`='$comentarios', 
                        `fechaRespuestaEncuesta`='$fechaRespuestaEncuesta'
                        WHERE `idEncuesta`=$idEncuesta";
            if (mysqli_query($con, $cadena)) {
                return $idEncuesta;
            } else {
                return $con->error;
            }
        } catch (Exception $th) {
            http_response_code(500);
            return $th->getMessage();
        } finally {
            $con->close();
        }
    }

    public function eliminar($idEncuesta) // Delete from encuesta where id = $idEncuesta
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "DELETE FROM `encuesta` WHERE `idEncuesta`= $idEncuesta";
            if (mysqli_query($con, $cadena)) {
                return 1;
            } else {
                return $con->error;
            }
        } catch (Exception $th) {
            http_response_code(500);
            return $th->getMessage();
        } finally {
            $con->close();
        }
    }
}
