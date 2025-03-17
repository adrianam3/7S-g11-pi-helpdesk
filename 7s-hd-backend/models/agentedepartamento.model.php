<?php
//TODO: Clase de AgenteDepartamento
require_once('../config/config.php');

class AgenteDepartamento
{
    //TODO: Implementar los métodos de la clase

    public function todos() // Select * from AgenteDepartamento
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `AgenteDepartamento`";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function uno($idAgente, $idDepartamentoA) // Select * from AgenteDepartamento where idAgente = $idAgente AND idDepartamentoA = $idDepartamentoA
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `AgenteDepartamento` WHERE `idAgente`=$idAgente AND `idDepartamentoA`=$idDepartamentoA";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function insertar($idAgente, $idDepartamentoA, $estado) // Insert into AgenteDepartamento (...)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "INSERT INTO `AgenteDepartamento` (`idAgente`, `idDepartamentoA`, `estado`) VALUES ('$idAgente','$idDepartamentoA','$estado')";
            if (mysqli_query($con, $cadena)) {
                return true;
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

    public function actualizar($idAgente, $idDepartamentoA, $estado) // Update AgenteDepartamento set ... where idAgente = $idAgente AND idDepartamentoA = $idDepartamentoA
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `AgenteDepartamento` SET `estado`='$estado', `fechaModificacion`=CURRENT_TIMESTAMP WHERE `idAgente`=$idAgente AND `idDepartamentoA`=$idDepartamentoA";
            if (mysqli_query($con, $cadena)) {
                return true;
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

    public function eliminar($idAgente, $idDepartamentoA) // Delete from AgenteDepartamento where idAgente = $idAgente AND idDepartamentoA = $idDepartamentoA
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "DELETE FROM `AgenteDepartamento` WHERE `idAgente`=$idAgente AND `idDepartamentoA`=$idDepartamentoA";
            if (mysqli_query($con, $cadena)) {
                return true;
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
