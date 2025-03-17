<?php
//TODO: Clase de TicketDetalle
require_once('../config/config.php');
require_once('../models/ticket.model.php');
require_once('email.controller.php');
class TicketDetalle
{
    //TODO: Implementar los métodos de la clase

    public function todos($idTicket) // Select * from ticketDetalle
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        // $cadena = "SELECT * FROM `ticketDetalle` ORDER BY `fechaDetalle` ASC";
        $cadena = "SELECT 
      ticketDetalle.*, 
      estadoTicket.nombre AS estadoTicketNombre,
      CONCAT(persona.nombres, ' ', persona.apellidos) AS clienteNombreCompleto,
      CONCAT(agentePersona.nombres, ' ', agentePersona.apellidos) AS agenteNombreCompleto
        FROM ticketDetalle
        LEFT JOIN ticket ON ticketDetalle.idTicket = ticket.idTicket
        LEFT JOIN usuario ON ticket.idUsuario = usuario.idUsuario
        LEFT JOIN persona ON usuario.idPersona = persona.idPersona
        LEFT JOIN estadoTicket ON ticket.idEstadoTicket = estadoTicket.idEstadoTicket
        LEFT JOIN AgenteDepartamento ON AgenteDepartamento.idAgente = ticket.idAgente AND AgenteDepartamento.idDepartamentoA = ticket.idDepartamentoA
        LEFT JOIN agente ON agente.idAgente = AgenteDepartamento.idAgente
        LEFT JOIN persona AS agentePersona ON agente.idUsuario = agentePersona.idPersona 
        WHERE ticketDetalle.idTicket=$idTicket
        ORDER BY ticketDetalle.fechaDetalle ASC;
        ";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function uno($idTicketDetalle) // Select * from ticketDetalle where id = $idTicketDetalle
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `ticketDetalle` WHERE `idTicketDetalle`=$idTicketDetalle";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function insertar($idTicket, $idAgente, $idDepartamentoA, $observacion, $detalle, $tipoDetalle) // Insert into ticketDetalle (...)
    {
        try {
            $ticket = new Ticket;
            $resultado = $ticket->uno($idTicket);
            $ticketActual = $resultado->fetch_assoc();
            enviarEmailMensajeDetalleTicket(
                idTicket:$idTicket, 
                emailRecibe: $ticketActual['email'], 
                nombreRecibe: $ticketActual['personaNombres'].' '.$ticketActual['personaApellidos'],
                detalle: $detalle
            );

            enviarEmailMensajeDetalleTicket(
                idTicket:$idTicket, 
                emailRecibe: $ticketActual['agenteEmail'],
                nombreRecibe: $ticketActual['agenteNombres'].' '.$ticketActual['agenteApellidos'],
                detalle: $detalle
            );

            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "INSERT INTO `ticketDetalle` (`idTicket`, `idAgente`, `idDepartamentoA`, `observacion`, `detalle`, `tipoDetalle`) 
                       VALUES ('$idTicket', " . ($idAgente && $idAgente != 'null' ? "'$idAgente'" : "NULL") . ", '$idDepartamentoA', '$observacion', '$detalle', '$tipoDetalle')";
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

    public function actualizar($idTicketDetalle, $idTicket, $idAgente, $idDepartamentoA, $observacion, $detalle, $tipoDetalle) // Update ticketDetalle set ... where id = $idTicketDetalle
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `ticketDetalle` SET 
                        `idTicket`='$idTicket', 
                        `idAgente`=" . ($idAgente && $idAgente != 'null' ? "'$idAgente'" : "NULL") . ",
                        `idDepartamentoA`='$idDepartamentoA', 
                        `observacion`='$observacion', 
                        `detalle`='$detalle', 
                        `tipoDetalle`='$tipoDetalle', 
                        `fechaDetalle`=CURRENT_TIMESTAMP 
                        WHERE `idTicketDetalle`=$idTicketDetalle";
            if (mysqli_query($con, $cadena)) {
                return $idTicketDetalle;
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

    public function eliminar($idTicketDetalle) // Delete from ticketDetalle where id = $idTicketDetalle
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "DELETE FROM `ticketDetalle` WHERE `idTicketDetalle`= $idTicketDetalle";
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
