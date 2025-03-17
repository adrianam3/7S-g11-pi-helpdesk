<?php
//TODO: Clase de Ticket
require_once('../config/config.php');
require_once('../models/estadoticket.model.php');

class Ticket
{
    //TODO: Implementar los métodos de la clase
    public function todos($idRol, $idUsuario, $idAgente)
    {
        if ($idRol == 1 || $idRol == 4) { // Logica para validar roles 1 Administrador, 2 Usuario, 3 Agente, 4 Coordinador
            $sentencia = '';
        } elseif ($idRol == 2) {
            $sentencia = "WHERE ticket.idUsuario = $idUsuario";
        } elseif ($idRol == 3) {
            $sentencia = "WHERE ticket.idAgente = $idAgente";
        }
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT ticket.*, 
           sla.nombre AS slaNombre, 
           prioridad.nombre AS prioridadNombre,
           persona.nombres AS personaNombres,
           persona.apellidos AS personaApellidos,
           persona.email,
           estadoTicket.nombre AS estadoTicketNombre,
           departamentoAgente.nombre AS departamentoANombre,
           agentePersona.nombres AS agenteNombres,
           agentePersona.apellidos AS agenteApellidos,
           CONCAT(agentePersona.nombres, ' ', agentePersona.apellidos) AS agenteNombreCompleto ,
           encuesta.idEncuesta   
            FROM ticket
            LEFT JOIN sla ON ticket.idSla = sla.idSla
            LEFT JOIN prioridad ON ticket.idPrioridad = prioridad.idPrioridad
            LEFT JOIN usuario ON ticket.idUsuario = usuario.idUsuario
            LEFT JOIN persona ON usuario.idPersona = persona.idPersona
            LEFT JOIN estadoTicket ON ticket.idEstadoTicket = estadoTicket.idEstadoTicket
            LEFT JOIN AgenteDepartamento ON AgenteDepartamento.idAgente = ticket.idAgente AND AgenteDepartamento.idDepartamentoA = ticket.idDepartamentoA
            LEFT JOIN departamentoAgente ON departamentoAgente.idDepartamentoA = ticket.idDepartamentoA
            LEFT JOIN agente ON agente.idAgente = AgenteDepartamento.idAgente
            left JOIN usuario as usp on usp.idUsuario=agente.idUsuario
            left JOIN persona AS agentePersona ON agentePersona.idPersona = usp.idPersona
            LEFT JOIN  encuesta as encuesta on encuesta.idTicket=ticket.idTicket
            $sentencia
            ";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function dashboard($fechaInicio, $fechaFin)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT COUNT(*), estadoticket.nombre
            FROM `ticket`
            LEFT JOIN `sla` ON ticket.idSla = sla.idSla
            LEFT JOIN `prioridad` ON ticket.idPrioridad = prioridad.idPrioridad
            LEFT JOIN `usuario` ON ticket.idUsuario = usuario.idUsuario
            LEFT JOIN `persona` ON usuario.idPersona = persona.idPersona
            LEFT JOIN `estadoTicket` ON ticket.idEstadoTicket = estadoTicket.idEstadoTicket
            LEFT JOIN `AgenteDepartamento` ON AgenteDepartamento.idAgente = ticket.idAgente AND AgenteDepartamento.idDepartamentoA = ticket.idDepartamentoA
            LEFT JOIN `departamentoAgente` ON departamentoAgente.idDepartamentoA = ticket.idDepartamentoA
            LEFT JOIN `agente` ON agente.idAgente = AgenteDepartamento.idAgente
            LEFT JOIN `persona` AS agentePersona ON agente.idUsuario = agentePersona.idPersona
            WHERE ticket.fechaCreacion BETWEEN '$fechaInicio' AND '$fechaFin'
            GROUP BY  estadoTicket.nombre;
            ";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function dashboarddepartamentoestado($fechaInicio, $fechaFin)
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();

        // ticket ( abierto, asignado, en progreso o iniciado, cerrado, reaperturado, escalado, resuelto, en pausa*) 

        $cadena = "SELECT 
    departamentoAgente.nombre AS DepartamentoNombre,
    SUM(CASE WHEN estadoTicket.nombre = 'Abierto' THEN 1 ELSE 0 END) AS Abierto,
    SUM(CASE WHEN estadoTicket.nombre = 'Asignado' THEN 1 ELSE 0 END) AS Asignado,
    SUM(CASE WHEN estadoTicket.nombre = 'En progreso' THEN 1 ELSE 0 END) AS EnProgreso,
    SUM(CASE WHEN estadoTicket.nombre = 'Cerrado' THEN 1 ELSE 0 END) AS Cerrado,
    SUM(CASE WHEN estadoTicket.nombre = 'Reaperturado' THEN 1 ELSE 0 END) AS Reaperturado,
    SUM(CASE WHEN estadoTicket.nombre = 'Escalado' THEN 1 ELSE 0 END) AS Escalado,
    COALESCE(SUM(TIMESTAMPDIFF(HOUR, ticket.fechaCreacion, ticket.fechaInicioAtencion)), 0) AS TiempoRespuestaTotal,
    COALESCE(AVG(TIMESTAMPDIFF(HOUR, ticket.fechaCreacion, ticket.fechaInicioAtencion)), 0) AS TiempoRespuestaPromedio,
    COALESCE(SUM(TIMESTAMPDIFF(HOUR, ticket.fechaInicioAtencion, ticket.fechaCierre)), 0) AS TiempoServicioTotal,
    COALESCE(AVG(TIMESTAMPDIFF(HOUR, ticket.fechaInicioAtencion, ticket.fechaCierre)), 0) AS TiempoServicioPromedio
FROM `departamentoAgente`
LEFT JOIN `AgenteDepartamento` ON departamentoAgente.idDepartamentoA = AgenteDepartamento.idDepartamentoA
LEFT JOIN `agente` ON AgenteDepartamento.idAgente = agente.idAgente
LEFT JOIN `ticket` ON ticket.idAgente = agente.idAgente AND ticket.idDepartamentoA = departamentoAgente.idDepartamentoA AND ticket.fechaCreacion BETWEEN '$fechaInicio' AND '$fechaFin'
LEFT JOIN `estadoTicket` ON ticket.idEstadoTicket = estadoTicket.idEstadoTicket
LEFT JOIN `sla` ON ticket.idSla = sla.idSla
LEFT JOIN `prioridad` ON ticket.idPrioridad = prioridad.idPrioridad
LEFT JOIN `usuario` ON ticket.idUsuario = usuario.idUsuario
LEFT JOIN `persona` ON usuario.idPersona = persona.idPersona
LEFT JOIN `persona` AS agentePersona ON agente.idUsuario = agentePersona.idPersona
GROUP BY departamentoAgente.nombre;
            ";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function uno($idTicket) // Select * from ticket where id = $idTicket
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT ticket.*, 
       sla.nombre AS slaNombre, 
       prioridad.nombre AS prioridadNombre,
       persona.nombres AS personaNombres,
       persona.apellidos AS personaApellidos,
       persona.email,
       estadoTicket.nombre AS estadoTicketNombre,
       departamentoAgente.nombre AS departamentoANombre,
       agentePersona.nombres AS agenteNombres,
       agentePersona.apellidos AS agenteApellidos,
       agentePersona.email AS agenteEmail
        FROM `ticket`
        LEFT JOIN `sla` ON ticket.idSla = sla.idSla
        LEFT JOIN `prioridad` ON ticket.idPrioridad = prioridad.idPrioridad
        LEFT JOIN `usuario` ON ticket.idUsuario = usuario.idUsuario
        LEFT JOIN `persona` ON usuario.idPersona = persona.idPersona
        LEFT JOIN `estadoTicket` ON ticket.idEstadoTicket = estadoTicket.idEstadoTicket
        LEFT JOIN `AgenteDepartamento` ON AgenteDepartamento.idAgente = ticket.idAgente AND AgenteDepartamento.idDepartamentoA = ticket.idDepartamentoA
        LEFT JOIN `departamentoAgente` ON departamentoAgente.idDepartamentoA = ticket.idDepartamentoA
        LEFT JOIN `agente` ON agente.idAgente = AgenteDepartamento.idAgente
        left JOIN usuario as usp on usp.idUsuario=agente.idUsuario
        left JOIN persona AS agentePersona ON agentePersona.idPersona = usp.idPersona
        WHERE `idTicket`=$idTicket
        ";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function insertar(
        $titulo,
        $descripcion,
        $idSla,
        $idPrioridad,
        $idUsuario,
        $idfuenteContacto,
        $idTemaAyuda,
        $resueltoPrimerContacto,
        $idEstadoTicket,
        $idDepartamentoA,
        $idAgente,

    ) {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();

            // Construir la cadena del query correctamente
            $cadena = "INSERT INTO ticket (
                titulo, 
                descripcion, 
                idSla, 
                idPrioridad, 
                idUsuario, 
                idfuenteContacto, 
                idTemaAyuda, 
                resueltoPrimerContacto, 
                idEstadoTicket, 
                idDepartamentoA,
                idAgente
            ) VALUES (
                '$titulo',
                '$descripcion',
                " . ($idSla && $idSla != 'undefined' ? "'$idSla'" : "NULL") . ",
                '$idPrioridad',
                '$idUsuario',
                '$idfuenteContacto',
                '$idTemaAyuda',
                " . ($resueltoPrimerContacto && $resueltoPrimerContacto != 'undefined' ? "'$resueltoPrimerContacto'" : "NULL") . ",
                '$idEstadoTicket',
                " . ($idDepartamentoA && $idDepartamentoA != 'undefined' ? "'$idDepartamentoA'" : "NULL") . ",
                " . ($idAgente && $idAgente != 'undefined' ? "'$idAgente'" : "NULL") . "
            )";

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

    public function actualizar(
        $idTicket,
        $titulo,
        $descripcion,
        $idSla,
        $idPrioridad,
        $idfuenteContacto,
        $idTemaAyuda,
        $resueltoPrimerContacto,
        $idEstadoTicket,
        $idDepartamentoA,
        $idAgente,
        $fechaInicioAtencion,
        $fechaPrimeraRespuesta,
        $fechaAtualizacion,
        $fechaReapertura,
        $fechaUltimaRespuesta,
        $fechaCierre
    ) {
        try {
        // Si el estado del ticket es 'Cerrado', asignar la fecha actual a fechaCierre
        $estadoTicket = new EstadoTicket;
        $nombreEstadoTicket = $estadoTicket->estadoById(idEstadoTicket: $idEstadoTicket);
        if ($nombreEstadoTicket == 'Cerrado') {
            date_default_timezone_set('America/Guayaquil');
            $fechaCierre = date('Y-m-d H:i:s');
            $ticket = new Ticket;
            $resultado = $ticket->uno($idTicket);
            $ticketActual = $resultado->fetch_assoc();
            enviarEmailTicketCerrado(
                idTicket:$idTicket, 
                emailRecibe: $ticketActual['email'], 
                nombreRecibe: $ticketActual['personaNombres'].' '.$ticketActual['personaApellidos'],
            );
            enviarEmailTicketCerrado(
                idTicket:$idTicket, 
                emailRecibe: $ticketActual['agenteEmail'],
                nombreRecibe: $ticketActual['agenteNombres'].' '.$ticketActual['agenteApellidos'],
            );
        }
        
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `ticket` SET 
                        `titulo`='$titulo', 
                        `descripcion`='$descripcion', 
                        `idSla`='$idSla', 
                        `idPrioridad`='$idPrioridad', 
                        `idfuenteContacto`='$idfuenteContacto', 
                        `idTemaAyuda`='$idTemaAyuda', 
                        `resueltoPrimerContacto`='$resueltoPrimerContacto', 
                        `idEstadoTicket`='$idEstadoTicket', 
                        `idDepartamentoA`='$idDepartamentoA',
                        `idAgente`='$idAgente',
                        `fechaInicioAtencion`=" . ($fechaInicioAtencion && $fechaInicioAtencion != 'null' ? "'$fechaInicioAtencion'" : "NULL") . ", 
                        `fechaPrimeraRespuesta`=" . ($fechaPrimeraRespuesta ? "'$fechaPrimeraRespuesta'" : "NULL") . ", 
                        `fechaAtualizacion`=" . ($fechaAtualizacion && $fechaAtualizacion != 'null' ? "'$fechaAtualizacion'" : "NULL") . ", 
                        `fechaReapertura`=" . ($fechaReapertura ? "'$fechaReapertura'" : "NULL") . ", 
                        `fechaUltimaRespuesta`=" . ($fechaUltimaRespuesta ? "'$fechaUltimaRespuesta'" : "NULL") . ", 
                        `fechaCierre`=" . ($fechaCierre ? "'$fechaCierre'" : "NULL") . "
                        WHERE `idTicket`=$idTicket";
            if (mysqli_query($con, $cadena)) {
                return $idTicket;
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

    public function actualizarAgente(
        $idTicket,
        $idDepartamentoA,
        $idAgente,
    ) // Update ticket set ... where id = $idTicket
    {
        try {
            $estadoTicket = new EstadoTicket;
            $idEstadoTicket = $estadoTicket->idByEstado('Asignado');
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            date_default_timezone_set('America/Guayaquil');
            $fechaAtualizacion = date('Y-m-d H:i:s');
            $cadena = "UPDATE `ticket` SET 
                        `idDepartamentoA`='$idDepartamentoA',
                        `idAgente`='$idAgente',
                        `idEstadoTicket`='$idEstadoTicket', 
                        `fechaAtualizacion`=" . ($fechaAtualizacion && $fechaAtualizacion != 'null' ? "'$fechaAtualizacion'" : "NULL") . "
                        WHERE `idTicket`=$idTicket";
            if (mysqli_query($con, $cadena)) {
                return $idTicket;
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

    public function reaperturaEscalamiento(
        $idTicket,
        $idDepartamentoA,
        $idAgente,
        $idEstadoTicket,
        $fechaReapertura
    ) // Update ticket set ... where id = $idTicket
    {
        try {
            // $estadoTicket = new EstadoTicket;
            // $idEstadoTicket = $estadoTicket->idByEstado('Asignado');
            // $resultado = $ticket->uno($idTicket);
            // $ticketActual = $resultado->fetch_assoc();
            if($idEstadoTicket == 9) {
                // enviarEmailTReaperturaUsuario(
                //     idTicket:$idTicket,
                //     emailRecibe: $ticketActual['email'],
                //     nombreRecibe: $ticketActual['personaNombres'].' '.$ticketActual['personaApellidos'],
                // );
            } else if($idEstadoTicket == 6) {
                // enviarEmailTEscaladoUsuario(
                //     idTicket:$idTicket,
                //     emailRecibe: $ticketActual['email'],
                //     nombreRecibe: $ticketActual['personaNombres'].' '.$ticketActual['personaApellidos'],
                // ); 
            }

            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            date_default_timezone_set('America/Guayaquil');
            $fechaAtualizacion = date('Y-m-d H:i:s');
            $cadena = "UPDATE `ticket` SET 
                        `idDepartamentoA`='$idDepartamentoA',
                        `idAgente`='$idAgente',
                        `idEstadoTicket`='$idEstadoTicket', 
                        `fechaAtualizacion`=" . ($fechaAtualizacion && $fechaAtualizacion != 'null' ? "'$fechaAtualizacion'" : "NULL") . ",
                        `fechaReapertura`=" . ($fechaReapertura ? "'$fechaReapertura'" : "NULL") . "
                        WHERE `idTicket`=$idTicket";
            if (mysqli_query($con, $cadena)) {
                return $idTicket;
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

    public function eliminar($idTicket) 
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
    
            // Consulta previa para verificar el valor de idAgente
            $consulta = "SELECT idAgente FROM `ticket` WHERE `idTicket` = $idTicket";
            $resultado = mysqli_query($con, $consulta);
            
            if ($resultado) {
                $row = mysqli_fetch_assoc($resultado);
                $idAgente = $row['idAgente'];
    
                // Si el idAgente tiene el valor específico que deseas evitar
                if ($idAgente) {
                    http_response_code(500);
                    return "No se puede eliminar el ticket porque ya fue asignado.";
                }
    
                // Si no hay restricciones, procedemos a eliminar el ticket
                $cadena = "DELETE FROM `ticket` WHERE `idTicket`= $idTicket";
                if (mysqli_query($con, $cadena)) {
                    return 1;
                } else {
                    return $con->error;
                }
            } else {
                return "Error al verificar el idAgente.";
            }
        } catch (Exception $th) {
            http_response_code(500);
            return $th->getMessage();
        } finally {
            $con->close();
        }
    }
    
}
