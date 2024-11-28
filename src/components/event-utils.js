// src/components/event-utils.js

// Inicializa o contador de ID de eventos com 1.
let eventId = 1;

// Função para criar um ID único para cada novo evento.
// Isso garante que cada evento adicionado ao calendário tenha um identificador único.
export function createEventId() {
  return eventId++;  // Incrementa e retorna o próximo ID disponível.
}

// Lista inicial de eventos para o calendário.
// Esses eventos são usados para preencher o calendário quando ele é carregado pela primeira vez.
export const INITIAL_EVENTS = [
  {
    id: createEventId(), // Gera um ID único para o evento.
    title: 'Consulta de Rotina', // Título do evento.
    start: new Date().toISOString(), // Data e hora de início do evento, no formato ISO.
    duration: { hours: 2 } // Duração do evento, especificada em horas.
  },
  // Adicione mais eventos iniciais conforme necessário.
  // Exemplo:
  // { id: createEventId(), title: 'Vacinação', start: new Date(Date.now() + 86400000).toISOString(), duration: { hours: 1 } }
];
