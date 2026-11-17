let tarefas = [];
let proximoId = 1;

class Tarefa {
    static listar() {
        return tarefas;
    }

    static buscarPorId(id) {
        return tarefas.find(tarefa => tarefa.id === Number(id));
    }

    static cadastrar(titulo, descricao, disciplina, dataEntrega) {
        const tarefa = {
            id: proximoId++,
            titulo,
            descricao,
            disciplina,
            dataEntrega,
            status: "pendente"
        };

        tarefas.push(tarefa);

        return tarefa;
    }

    static editar(id, titulo, descricao, disciplina, dataEntrega) {
        const tarefa = this.buscarPorId(id);

        if (!tarefa) {
            return null;
        }

        tarefa.titulo = titulo;
        tarefa.descricao = descricao;
        tarefa.disciplina = disciplina;
        tarefa.dataEntrega = dataEntrega;

        return tarefa;
    }

    static concluir(id) {
        const tarefa = this.buscarPorId(id);

        if (!tarefa) {
            return null;
        }

        tarefa.status = "concluida";

        return tarefa;
    }

    static excluir(id) {
        const indice = tarefas.findIndex(
            tarefa => tarefa.id === Number(id)
        );

        if (indice === -1) {
            return false;
        }

        tarefas.splice(indice, 1);

        return true;
    }
}

module.exports = Tarefa;
