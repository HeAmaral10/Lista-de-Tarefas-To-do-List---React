import { useState, useEffect } from 'react';
import './ListaTarefas.css';

function ListaTarefas() {
    // 'useState' cria um lugar para guardar informações que podem mudar na tela.
    // Aqui, 'tarefas' guarda a lista de tarefas, e 'setTarefas' é como um botão para atualizar essa lista.
    // Usamos uma função dentro de 'useState' para carregar as tarefas salvas no seu computador (se houverem).
    const [tarefas, setTarefas] = useState(() => {
        const savedTarefas = localStorage.getItem('tarefas');
        return savedTarefas ? JSON.parse(savedTarefas) : [];
    });

    // 'novaTarefa' guarda o que você está digitando na caixa de adicionar tarefa.
    const [novaTarefa, setNovaTarefa] = useState('');
    // 'ordenacao' guarda como as tarefas estão sendo mostradas (por data ou em ordem alfabética).
    const [ordenacao, setOrdenacao] = useState('data');

    // 'useEffect' faz alguma coisa acontecer quando a página carrega ou quando 'tarefas' muda.
    // Aqui, toda vez que 'tarefas' muda, ele salva a lista atualizada no seu computador.
    useEffect(() => {
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }, [tarefas]);

    // Essa função é chamada quando você aperta o botão "Adicionar".
    const adicionarTarefa = () => {
        // Se você digitou alguma coisa (tirando espaços vazios)...
        if (novaTarefa.trim() !== '') {
            // ...adiciona a nova tarefa à lista. A nova tarefa é um objeto com o texto que você digitou,
            // a informação de que ainda não está concluída ('concluida: false'), e a data em que foi criada.
            setTarefas([...tarefas, { texto: novaTarefa, concluida: false, data: new Date().toISOString() }]);
            // Depois de adicionar, limpa a caixa de texto para você poder digitar a próxima tarefa.
            setNovaTarefa("");
        }
    };

    // Essa função é chamada quando você aperta o botão "Remover" de uma tarefa.
    const removerTarefa = (indice) => {
        // Ela cria uma nova lista que não tem a tarefa que você quer remover (usando o 'indice' para saber qual remover).
        setTarefas(tarefas.filter((_, i) => i !== indice));
    };

    // Essa função é chamada quando você marca ou desmarca a caixinha de "concluída" de uma tarefa.
    const marcarConcluida = (indice) => {
        // Cria uma cópia da lista de tarefas para não mudar a original diretamente.
        const novasTarefas = [...tarefas];
        // Muda o estado de 'concluida' da tarefa que você marcou/desmarcou.
        novasTarefas[indice].concluida = !novasTarefas[indice].concluida;
        // Atualiza a lista de tarefas com a mudança.
        setTarefas(novasTarefas);
    };

    // Essa parte organiza as tarefas para serem mostradas na tela.
    const tarefasOrdenadas = [...tarefas].sort((a, b) => {
        // Se a ordenação escolhida for alfabética...
        if (ordenacao === 'alfabetica') {
            // ...compara os textos das tarefas para colocar em ordem de A a Z.
            return a.texto.localeCompare(b.texto);
        } else {
            // ...se não for alfabética (é por data), compara as datas das tarefas para mostrar as mais antigas primeiro.
            return new Date(a.data) - new Date(b.data);
        }
    });

    // Essa é a parte que mostra as coisas na tela.
    return (
        <div>
            <h2>Lista de Tarefas</h2>
            {/* Caixa de texto onde você digita uma nova tarefa. */}
            <input
                type='text'
                value={novaTarefa}
                onChange={(e) => setNovaTarefa(e.target.value)}
                placeholder='Digite uma nova tarefa'
                className="input"
            />
            {/* Botão para adicionar a tarefa que você digitou. */}
            <button onClick={adicionarTarefa} className="botaoAdicionar">Adicionar</button>

            {/* Botões para escolher como as tarefas serão mostradas. */}
            <div className="botoesOrdenacao">
                <button onClick={() => setOrdenacao('alfabetica')}>Ordenar A-Z</button>
                <button onClick={() => setOrdenacao('data')}>Ordenar por Data</button>
            </div>

            {/* Lista onde as tarefas são mostradas. */}
            <ul>
                {/* Para cada tarefa na lista organizada... */}
                {tarefasOrdenadas.map((tarefa, indice) => (
                    // ...cria um item na lista ('li').
                    <li key={indice} className={`li ${tarefa.concluida ? 'concluida' : 'pendente'}`}>
                        {/* Caixinha de marcar como concluída. */}
                        <input
                            type="checkbox"
                            checked={tarefa.concluida}
                            onChange={() => marcarConcluida(indice)}
                        />
                        {/* Texto da tarefa. Se estiver concluída, coloca uma classe diferente para poder riscar o texto (se o CSS tiver essa regra). */}
                        <span className={tarefa.concluida ? 'textoConcluido' : ''}>
                            {tarefa.texto}
                        </span>
                        {/* Botão para remover a tarefa. */}
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