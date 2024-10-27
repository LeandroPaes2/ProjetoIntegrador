import { Router } from "express"; 
import DadoCtrl from "../Controle/dadoCtrl";

const dadoCtrl = new DadoCtrl();
const rotaDado = Router();

rotaDado.post("/", dadoCtrl.gravar);
rotaDado.put("/:id", dadoCtrl.editar);
rotaDado.patch("/:id", dadoCtrl.editar);
rotaDado.delete("/:id", dadoCtrl.excluir);
rotaDado.get("/:id", dadoCtrl.consultar);
rotaDado.get("/",dadoCtrl.consultar);

export default rotaDado;


