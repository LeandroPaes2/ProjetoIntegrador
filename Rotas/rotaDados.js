import { Router } from "express"; 
import DadoCtrl from "../Controle/dadoCtrl.js"

const dadoCtrl = new DadoCtrl();
const rotaDado = Router();

const validarId = (req, res, next) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).send({ mensagem: "ID inválido!" });
    }
    next();
};

rotaDado.post("/", dadoCtrl.gravar);
rotaDado.put("/:id", validarId, dadoCtrl.editar);
rotaDado.patch("/:id", validarId, dadoCtrl.editar);
rotaDado.delete("/:id", validarId, dadoCtrl.excluir);
rotaDado.get("/:id", validarId, dadoCtrl.consultar);
rotaDado.get("/", dadoCtrl.consultar);
//rotaDado.get('/relatorio', dadoCtrl.consultarRelatorio);

export default rotaDado;