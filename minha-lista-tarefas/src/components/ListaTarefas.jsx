import { useState, useEffect } from 'react';
import './ListaTarefas.css';

function ListaTarefas() {
    const [tarefas, setTarefas] = useState(() => {
        const savedTarefas = localStorage.getItem('tarefas');
        return savedTarefas ? JSON.parse(savedTarefas) : [];
    });

    const [novaTarefa, setNovaTarefa] = useState('');
    const [ordenacao, setOrdenacao] = useState('data');

    useEffect(() => {
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }, [tarefas]);

    const adicionarTarefa = () => {
        if (novaTarefa.trim() !== '') {
            setTarefas([...tarefas, { texto: novaTarefa, concluida: false, data: new Date().toISOString() }]);
            setNovaTarefa("");
        }
    };

    const removerTarefa = (indice) => {
        setTarefas(tarefas.filter((_, i) => i !== indice));
    };

    const marcarConcluida = (indice) => {
        const novasTarefas = [...tarefas];
        novasTarefas[indice].concluida = !novasTarefas[indice].concluida;
        setTarefas(novasTarefas);
    };

    const tarefasOrdenadas = [...tarefas].sort((a, b) => {
        if (ordenacao === 'alfabetica') {
            return a.texto.localeCompare(b.texto);
        } else {
            return new Date(a.data) - new Date(b.data);
        }
    });

    return (
        <div>
            <h2>Lista de Tarefas</h2>
            <input 
                type='text'
                value={novaTarefa}
                onChange={(e) => setNovaTarefa(e.target.value)}
                placeholder='Digite uma nova tarefa'
                className="input"
            />
            <button onClick={adicionarTarefa} className="botaoAdicionar">Adicionar</button>

            <div className="botoesOrdenacao">
                <button onClick={() => setOrdenacao('alfabetica')}>Ordenar A-Z</button>
                <button onClick={() => setOrdenacao('data')}>Ordenar por Data</button>
            </div>

            <ul>
                {tarefasOrdenadas.map((tarefa, indice) => (
                    <li key={indice} className={`li ${tarefa.concluida ? 'concluida' : 'pendente'}`}>
                        <input 
                            type="checkbox" 
                            checked={tarefa.concluida} 
                            onChange={() => marcarConcluida(indice)} 
                        />
                        <span className={tarefa.concluida ? 'textoConcluido' : ''}>
                            {tarefa.texto}
                        </span>
                        <button onClick={() => removerTarefa(indice)} className="botaoRemover">
                            Remover
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListaTarefas;
