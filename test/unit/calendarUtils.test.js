/** @jest-environment jsdom */
global.API_URL = '/api';
const {
  getUserTasks,
  getStatusColor,
  getPriorityIcon,
  tasksToEvents,
  updateTaskDate
} = require('../../public/js/calendar.js');

global.fetch = jest.fn();
beforeAll(() => {
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => 'test-token');
});

describe('calendar', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('getUserTasks debe retornar tareas si el API responde correctamente', async () => {
    const mockTasks = [
      {
        _id: '1',
        title: 'Test',
        priority: 'alta',
        status: 'pendiente',
        dueDate: '2025-05-15'
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks
    });

    const result = await getUserTasks();

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/tasks'), expect.any(Object));
    expect(result).toEqual(mockTasks);
  });

  test('getStatusColor debe retornar color correcto para cada estado', () => {
    expect(getStatusColor('pendiente')).toBe('#dc3545');
    expect(getStatusColor('en_progreso')).toBe('#ffc107');
    expect(getStatusColor('completada')).toBe('#198754');
    expect(getStatusColor('otro')).toBe('#6c757d');
  });

  test('getPriorityIcon debe retornar ícono correcto para cada prioridad', () => {
    expect(getPriorityIcon('alta')).toBe('⚠️');
    expect(getPriorityIcon('media')).toBe('⚡');
    expect(getPriorityIcon('baja')).toBe('📝');
    expect(getPriorityIcon('desconocida')).toBe('');
  });

  test('tasksToEvents convierte tareas a eventos de calendario', () => {
    const tasks = [
      {
        _id: '123',
        title: 'Tarea de prueba',
        priority: 'media',
        status: 'pendiente',
        dueDate: '2025-05-15',
        description: 'Una tarea'
      }
    ];

    const events = tasksToEvents(tasks);

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      id: '123',
      title: '⚡ Tarea de prueba',
      start: '2025-05-15',
      backgroundColor: '#dc3545',
      extendedProps: {
        description: 'Una tarea',
        status: 'pendiente',
        priority: 'media'
      }
    });
  });

  test('updateTaskDate realiza una solicitud PATCH con la nueva fecha', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    const result = await updateTaskDate('abc123', '2025-06-01');

    expect(fetch).toHaveBeenCalledWith('/api/tasks/abc123', expect.objectContaining({
      method: 'PATCH',
      headers: expect.objectContaining({
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ dueDate: '2025-06-01' })
    }));

    expect(result).toEqual({ success: true });
  });
});