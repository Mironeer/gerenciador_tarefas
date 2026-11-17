const express = require('express');
const router = express.Router();

const TarefaController = require('../controllers/tarefacontroller');

router.get('/', TarefaController.listar);
router.get('/todas', TarefaController.listarTodas);

router.post('/cadastrar', TarefaController.cadastrar);

router.get('/detalhes/:id', TarefaController.detalhes);
router.post('/editar/:id', TarefaController.editar);

router.post('/concluir/:id', TarefaController.concluir);
router.post('/excluir/:id', TarefaController.excluir);

module.exports = router;
