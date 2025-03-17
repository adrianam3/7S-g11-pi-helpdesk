<?php
//TODO: Clase de Auditoria
require_once('../config/config.php');

class Auditoria
{
    //TODO: Implementar los métodos de la clase

    public function todos() // Select * from auditoria
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `auditoria`";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function uno($idAuditoria) // Select * from auditoria where id = $idAuditoria
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `auditoria` WHERE `idAuditoria`=$idAuditoria";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function insertar($nombreTabla, $tipoAccion, $idRegistro, $datosAnteriores, $datosNuevos, $usuarioResponsable, $ipOrigen, $detallesAdicionales) // Insert into auditoria (...)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "INSERT INTO `auditoria` (`nombreTabla`, `tipoAccion`, `idRegistro`, `datosAnteriores`, `datosNuevos`, `usuarioResponsable`, `ipOrigen`, `detallesAdicionales`) 
                       VALUES ('$nombreTabla', '$tipoAccion', '$idRegistro', '$datosAnteriores', '$datosNuevos', '$usuarioResponsable', '$ipOrigen', '$detallesAdicionales')";
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

    public function actualizar($idAuditoria, $nombreTabla, $tipoAccion, $idRegistro, $datosAnteriores, $datosNuevos, $usuarioResponsable, $ipOrigen, $detallesAdicionales) // Update auditoria set ... where id = $idAuditoria
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `auditoria` SET 
                        `nombreTabla`='$nombreTabla', 
                        `tipoAccion`='$tipoAccion', 
                        `idRegistro`='$idRegistro', 
                        `datosAnteriores`='$datosAnteriores', 
                        `datosNuevos`='$datosNuevos', 
                        `usuarioResponsable`='$usuarioResponsable', 
                        `ipOrigen`='$ipOrigen', 
                        `detallesAdicionales`='$detallesAdicionales', 
                        `fechaModificacion`=CURRENT_TIMESTAMP 
                        WHERE `idAuditoria`=$idAuditoria";
            if (mysqli_query($con, $cadena)) {
                return $idAuditoria;
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

    public function eliminar($idAuditoria) // Delete from auditoria where id = $idAuditoria
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "DELETE FROM `auditoria` WHERE `idAuditoria`= $idAuditoria";
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
