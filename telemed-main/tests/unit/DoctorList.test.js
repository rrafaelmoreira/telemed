import { mount } from '@vue/test-utils';
import ListaMedicos from '@/components/DoctorList.vue'; // Ajuste o caminho conforme necessário
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { db } from '../../src/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

jest.mock('vue-router', () => ({
  useRouter: jest.fn()
}));

jest.mock('@/firebase', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn()
}));

describe('ListaMedicos Component', () => {
  let routerMock;

  beforeEach(() => {
    routerMock = { push: jest.fn() };
    useRouter.mockReturnValue(routerMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o título corretamente', () => {
    const wrapper = mount(ListaMedicos);
    expect(wrapper.find('h1').text()).toBe('Médicos Disponíveis');
  });

  it('deve chamar fetchMedicos quando o componente é montado', async () => {
    // Simulando o retorno de getDocs com dados de médicos
    const mockDocs = [
      { id: '1', data: () => ({ firstName: 'John', lastName: 'Doe', crm: 'Cardiologista' }) },
      { id: '2', data: () => ({ firstName: 'Jane', lastName: 'Smith', crm: 'Pediatra' }) }
    ];
    getDocs.mockResolvedValueOnce({ docs: mockDocs });

    const wrapper = mount(ListaMedicos);

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.medicos.length).toBe(2);
    expect(wrapper.vm.medicos[0].firstName).toBe('John');
    expect(wrapper.vm.medicos[1].firstName).toBe('Jane');
  });

  it('deve renderizar a lista de médicos corretamente', async () => {
    const medicosMock = [
      { id: '1', firstName: 'John', lastName: 'Doe', crm: 'Cardiologista' },
      { id: '2', firstName: 'Jane', lastName: 'Smith', crm: 'Pediatra' }
    ];

    const wrapper = mount(ListaMedicos, {
      data() {
        return { medicos: medicosMock };
      }
    });

    const medicoItems = wrapper.findAll('.medico-item');
    expect(medicoItems).toHaveLength(2);
    expect(medicoItems[0].text()).toContain('John Doe');
    expect(medicoItems[1].text()).toContain('Jane Smith');
  });

  it('deve chamar o método agendar e redirecionar o usuário quando o botão de agendamento é clicado', async () => {
    window.confirm = jest.fn(() => true); // Mock para confirmar a ação
    const medicosMock = [
      { id: '1', firstName: 'John', lastName: 'Doe', crm: 'Cardiologista' }
    ];

    const wrapper = mount(ListaMedicos, {
      data() {
        return { medicos: medicosMock };
      }
    });

    await wrapper.find('button').trigger('click');
    expect(window.confirm).toHaveBeenCalledWith('Deseja agendar uma consulta com John Doe?');
    expect(routerMock.push).toHaveBeenCalledWith({ name: 'verAgenda', params: { medicoId: '1' } });
  });

  it('deve exibir um alerta ao agendar uma consulta', async () => {
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();

    const medicosMock = [
      { id: '1', firstName: 'John', lastName: 'Doe', crm: 'Cardiologista' }
    ];

    const wrapper = mount(ListaMedicos, {
      data() {
        return { medicos: medicosMock };
      }
    });

    await wrapper.find('button').trigger('click');
    expect(window.alert).toHaveBeenCalledWith('Agendamento para John Doe');
  });
});
