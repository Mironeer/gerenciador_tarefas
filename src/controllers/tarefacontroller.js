const Tarefa = require('../models/tarefa');

class TarefaController {

    static dataHoje() {
        const hoje = new Date();

        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');

        return `${ano}-${mes}-${dia}`;
    }

    static validarData(dataEntrega) {
        if (
            typeof dataEntrega !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(dataEntrega)
        ) {
            return false;
        }

        const [ano, mes, dia] = dataEntrega.split('-').map(Number);
        const data = new Date(ano, mes - 1, dia);

        return (
            data.getFullYear() === ano &&
            data.getMonth() === mes - 1 &&
            data.getDate() === dia
        );
    }

    static calcularDiasRestantes(dataEntrega) {
        if (!TarefaController.validarData(dataEntrega)) {
            return null;
        }

        const [ano, mes, dia] = dataEntrega.split('-').map(Number);

        const prazo = Date.UTC(ano, mes - 1, dia);

        const hoje = new Date();

        const hojeUTC = Date.UTC(
            hoje.getFullYear(),
            hoje.getMonth(),
            hoje.getDate()
        );

        return Math.round((prazo - hojeUTC) / 86400000);
    }

    static prepararTarefas(tarefas) {
        return tarefas.map(tarefa => ({
            ...tarefa,
            diasRestantes: TarefaController.calcularDiasRestantes(
                tarefa.dataEntrega
            )
        }));
    }

    static listar(req, res) {
        const tarefas = Tarefa.listar()
            .slice()
            .sort((a, b) => b.id - a.id)
            .slice(0, 3);

        res.render('tarefas', {
            tarefas: TarefaController.prepararTarefas(tarefas),
            filtro: 'recentes',
            mostrarTodas: false,
            dataMinima: TarefaController.dataHoje()
        });
    }

    static listarTodas(req, res) {
        const filtro = req.query.status || 'todas';

        let tarefas = Tarefa.listar()
            .slice()
            .sort((a, b) => b.id - a.id);

        if (filtro === 'pendente' || filtro === 'concluida') {
            tarefas = tarefas.filter(
                tarefa => tarefa.status === filtro
            );
        }

        res.render('tarefas', {
            tarefas: TarefaController.prepararTarefas(tarefas),
            filtro,
            mostrarTodas: true,
            dataMinima: TarefaController.dataHoje()
        });
    }

    static cadastrar(req, res) {
        const { titulo, descricao, disciplina, dataEntrega } = req.body;

        if (!titulo || titulo.trim().length < 3 || titulo.trim().length > 100) {
            return res.send('O título deve ter entre 3 e 100 caracteres.');
        }

        if (descricao && descricao.trim().length > 500) {
            return res.send('A descrição deve ter até 500 caracteres.');
        }

        if (!disciplina || disciplina.trim().length < 2 || disciplina.trim().length > 80) {
            return res.send('A disciplina deve ter entre 2 e 80 caracteres.');
        }

        if (!TarefaController.validarData(dataEntrega)) {
            return res.send('Informe uma data de entrega válida.');
        }

        if (dataEntrega < TarefaController.dataHoje()) {
            return res.send('A data de entrega não pode ser anterior a hoje.');
        }

        Tarefa.cadastrar(
            titulo.trim(),
            descricao ? descricao.trim() : '',
            disciplina.trim(),
            dataEntrega
        );

        res.redirect('/');
    }

    static detalhes(req, res) {
        const tarefa = Tarefa.buscarPorId(req.params.id);

        if (!tarefa) {
            return res.status(404).send('Tarefa não encontrada.');
        }

        res.render('detalhes', {
            tarefa: {
                ...tarefa,
                diasRestantes: TarefaController.calcularDiasRestantes(
                    tarefa.dataEntrega
                )
            },
            dataMinima: TarefaController.dataHoje()
        });
    }

    static editar(req, res) {
        const { titulo, descricao, disciplina, dataEntrega } = req.body;

        if (!titulo || titulo.trim().length < 3 || titulo.trim().length > 100) {
            return res.send('O título deve ter entre 3 e 100 caracteres.');
        }

        if (descricao && descricao.trim().length > 500) {
            return res.send('A descrição deve ter até 500 caracteres.');
        }

        if (!disciplina || disciplina.trim().length < 2 || disciplina.trim().length > 80) {
            return res.send('A disciplina deve ter entre 2 e 80 caracteres.');
        }

        if (!TarefaController.validarData(dataEntrega)) {
            return res.send('Informe uma data de entrega válida.');
        }

        if (dataEntrega < TarefaController.dataHoje()) {
            return res.send('A data de entrega não pode ser anterior a hoje.');
        }

        const tarefa = Tarefa.editar(
            req.params.id,
            titulo.trim(),
            descricao ? descricao.trim() : '',
            disciplina.trim(),
            dataEntrega
        );

        if (!tarefa) {
            return res.status(404).send('Tarefa não encontrada.');
        }

        res.redirect('/');
    }

    static concluir(req, res) {
        const tarefa = Tarefa.concluir(req.params.id);

        if (!tarefa) {
            return res.status(404).send('Tarefa não encontrada.');
        }

        res.redirect('/');
    }

    static excluir(req, res) {
        const excluida = Tarefa.excluir(req.params.id);

        if (!excluida) {
            return res.status(404).send('Tarefa não encontrada.');
        }

        res.redirect('/');
    }
}

module.exports = TarefaController;
