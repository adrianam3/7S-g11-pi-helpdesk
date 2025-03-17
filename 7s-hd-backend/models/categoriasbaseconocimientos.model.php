<?php
//TODO: Clase de CategoriasBaseConocimientos
require_once('../config/config.php');

class CategoriasBaseConocimientos
{
    //TODO: Implementar los métodos de la clase

    public function todos() // Select * from CategoriasBaseConocimientos
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT CategoriasBaseConocimientos.*,
        BaseConocimientos.titulo AS BaseConocimientosTitulo,
        BaseConocimientos.contenido AS BaseConocimientosContenido
        FROM `CategoriasBaseConocimientos`
        LEFT JOIN `BaseConocimientos` ON CategoriasBaseConocimientos.idCategoria = BaseConocimientos.idCategoria
        ";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;

        // $cadena = "SELECT agente.*, 
        // usuario.usuario AS usuarioNombre,
        // CONCAT(persona.nombres, ' ', persona.apellidos) AS agenteNombreCompleto
        // FROM `agente`
        // LEFT JOIN `usuario` ON agente.idUsuario = usuario.idUsuario
        // LEFT JOIN `persona` ON usuario.idPersona = persona.idPersona
        // ";
    }

    public function uno($idCategoria) // Select * from CategoriasBaseConocimientos where id = $idCategoria
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `CategoriasBaseConocimientos` WHERE `idCategoria`=$idCategoria";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function insertar($nombreCategoria, $descripcion, $estado) // Insert into CategoriasBaseConocimientos (...)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "INSERT INTO `CategoriasBaseConocimientos` (`nombreCategoria`, `descripcion`, `estado`) 
                       VALUES ('$nombreCategoria', '$descripcion', '$estado')";
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

    public function actualizar($idCategoria, $nombreCategoria, $descripcion, $estado) // Update CategoriasBaseConocimientos set ... where id = $idCategoria
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `CategoriasBaseConocimientos` SET 
                        `nombreCategoria`='$nombreCategoria', 
                        `descripcion`='$descripcion', 
                        `estado`='$estado', 
                        `fechaModificacion`=CURRENT_TIMESTAMP 
                        WHERE `idCategoria`=$idCategoria";
            if (mysqli_query($con, $cadena)) {
                return $idCategoria;
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

    public function eliminar($idCategoria) // Delete from CategoriasBaseConocimientos where id = $idCategoria
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "DELETE FROM `CategoriasBaseConocimientos` WHERE `idCategoria`= $idCategoria";
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
