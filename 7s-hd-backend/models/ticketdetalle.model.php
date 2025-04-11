<?php
//TODO: Clase de TicketDetalle
require_once('../config/config.php');
require_once('../models/ticket.model.php');
require_once('email.controller.php');
class TicketDetalle
{
    //TODO: Implementar los métodos de la clase

    public function todos($idTicket)
{
    $con = new ClaseConectar();
    $conn = $con->ProcedimientoParaConectar();

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
      WHERE ticketDetalle.idTicket = ?
      ORDER BY ticketDetalle.fechaDetalle ASC";

    $stmt = $conn->prepare($cadena);

    if (!$stmt) {
        die("Error al preparar la consulta: " . $conn->error);
    }

    $stmt->bind_param("i", $idTicket); 

    $stmt->execute();
    $resultado = $stmt->get_result();

    $datos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }

    $stmt->close();
    $conn->close();

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

    public function insertar($idTicket, $idAgente, $idDepartamentoA, $observacion, $detalle, $tipoDetalle)
    {
        try {
            $ticket = new Ticket;
            $resultado = $ticket->uno($idTicket);
            $ticketActual = $resultado->fetch_assoc();
    
            enviarEmailMensajeDetalleTicket(
                idTicket: $idTicket, 
                emailRecibe: $ticketActual['email'], 
                nombreRecibe: $ticketActual['personaNombres'] . ' ' . $ticketActual['personaApellidos'],
                detalle: $detalle
            );
    
            enviarEmailMensajeDetalleTicket(
                idTicket: $idTicket, 
                emailRecibe: $ticketActual['agenteEmail'],
                nombreRecibe: $ticketActual['agenteNombres'] . ' ' . $ticketActual['agenteApellidos'],
                detalle: $detalle
            );
    
            $con = new ClaseConectar();
            $conn = $con->ProcedimientoParaConectar();
    
            $sql = "INSERT INTO ticketDetalle (
                        idTicket, idAgente, idDepartamentoA, observacion, detalle, tipoDetalle
                    ) VALUES (?, ?, ?, ?, ?, ?)";
    
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                return ['error' => $conn->error];
            }
    
            $idAgente = ($idAgente && $idAgente !== 'null') ? intval($idAgente) : null;
            $idDepartamentoA = intval($idDepartamentoA);
            $observacion = trim($observacion);
            $detalle = trim($detalle);
            $tipoDetalle = trim($tipoDetalle);
    
            $stmt->bind_param(
                'iiisss',
                $idTicket,
                $idAgente,
                $idDepartamentoA,
                $observacion,
                $detalle,
                $tipoDetalle
            );
    
            $stmt->execute();
    
            if ($stmt->errno) {
                return ['error' => $stmt->error];
            }
    
            return ['success' => true, 'insert_id' => $stmt->insert_id];
    
        } catch (Exception $e) {
            http_response_code(500);
            return ['error' => $e->getMessage()];
        } finally {
            if (isset($stmt)) $stmt->close();
            if (isset($conn)) $conn->close();
        }
    }
    
    public function actualizar(
        $idTicketDetalle,
        $idTicket,
        $idAgente,
        $idDepartamentoA,
        $observacion,
        $detalle,
        $tipoDetalle
    ) {
        try {
            $con = new ClaseConectar();
            $conn = $con->ProcedimientoParaConectar();
    
            $sql = "UPDATE ticketDetalle SET
                        idTicket = ?,
                        idAgente = ?,
                        idDepartamentoA = ?,
                        observacion = ?,
                        detalle = ?,
                        tipoDetalle = ?,
                        fechaDetalle = CURRENT_TIMESTAMP
                    WHERE idTicketDetalle = ?";
    
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                return ['error' => 'Error en la preparación: ' . $conn->error];
            }
    
            $idTicket = intval($idTicket);
            $idAgente = ($idAgente && $idAgente !== 'null') ? intval($idAgente) : null;
            $idDepartamentoA = intval($idDepartamentoA);
            $observacion = trim($observacion);
            $detalle = trim($detalle);
            $tipoDetalle = trim($tipoDetalle);
            $idTicketDetalle = intval($idTicketDetalle);
    
            $stmt->bind_param(
                'iiisssi',
                $idTicket,
                $idAgente,
                $idDepartamentoA,
                $observacion,
                $detalle,
                $tipoDetalle,
                $idTicketDetalle
            );
    
            $stmt->execute();
    
            if ($stmt->errno) {
                return ['error' => 'Error al ejecutar: ' . $stmt->error];
            }
    
            return ['success' => true, 'message' => 'Detalle actualizado correctamente', 'id' => $idTicketDetalle];
    
        } catch (Exception $e) {
            http_response_code(500);
            return ['error' => 'Excepción: ' . $e->getMessage()];
        } finally {
            if (isset($stmt)) $stmt->close();
            if (isset($conn)) $conn->close();
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
