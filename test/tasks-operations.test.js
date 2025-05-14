const Task = require('../models/task');
const mongoose = require('mongoose');

// Mock del modelo Task
jest.mock('../models/task');

// Datos de prueba
const mockTask = {
    _id: "mockTaskId",
    title: "Tarea de prueba",
    description: "Descripción de la tarea de prueba",
    status: "pendiente",
    priority: "media",
    dueDate: new Date(),
    userId: "mockUserId"
};

describe('Task operations tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: "mockTaskId" },
            user: { userId: "mockUserId" },
            body: {
                title: "Tarea de prueba",
                description: "Descripción",
                status: "pendiente",
                priority: "media",
                dueDate: new Date()
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('getTaskById returns task when found', async () => {
        // Configurar el mock para encontrar una tarea
        Task.findOne = jest.fn().mockResolvedValue(mockTask);

        // Función que estamos probando
        async function getTaskById(req, res) {
            try {
                const task = await Task.findOne({
                    _id: req.params.id,
                    userId: req.user.userId
                });
                
                if (!task) {
                    return res.status(404).json({ error: 'Tarea no encontrada' });
                }
                
                res.json(task);
            } catch (error) {
                res.status(500).json({ error: 'Error al obtener la tarea' });
            }
        }

        // Ejecutar la función
        await getTaskById(req, res);

        // Verificaciones
        expect(Task.findOne).toHaveBeenCalledWith({
            _id: "mockTaskId",
            userId: "mockUserId"
        });
        expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    test('getTaskById returns 404 when task not found', async () => {
        // Configurar el mock para no encontrar una tarea
        Task.findOne = jest.fn().mockResolvedValue(null);

        // Función que estamos probando
        async function getTaskById(req, res) {
            try {
                const task = await Task.findOne({
                    _id: req.params.id,
                    userId: req.user.userId
                });
                
                if (!task) {
                    return res.status(404).json({ error: 'Tarea no encontrada' });
                }
                
                res.json(task);
            } catch (error) {
                res.status(500).json({ error: 'Error al obtener la tarea' });
            }
        }

        // Ejecutar la función
        await getTaskById(req, res);

        // Verificaciones
        expect(Task.findOne).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Tarea no encontrada' });
    });

    test('createTask successfully creates a task', async () => {
        // Mock para el constructor y save
        const mockSave = jest.fn().mockResolvedValue(true);
        const mockTaskInstance = {
            ...req.body,
            userId: req.user.userId,
            save: mockSave
        };

        Task.mockImplementation(() => mockTaskInstance);

        // Función que estamos probando
        async function createTask(req, res) {
            try {
                const { title, description, status, priority, dueDate } = req.body;
                
                const task = new Task({
                    userId: req.user.userId,
                    title,
                    description,
                    status,
                    priority,
                    dueDate: new Date(dueDate)
                });
                
                await task.save();
                
                res.status(201).json(task);
            } catch (error) {
                res.status(500).json({ error: 'Error al crear la tarea' });
            }
        }

        // Ejecutar la función
        await createTask(req, res);

        // Verificaciones
        expect(Task).toHaveBeenCalledWith(expect.objectContaining({
            userId: "mockUserId",
            title: "Tarea de prueba"
        }));
        expect(mockSave).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockTaskInstance);
    });

    // Nueva prueba 1: updateTask actualiza correctamente una tarea
    test('updateTask successfully updates a task', async () => {
        // Datos para actualización
        const updateData = {
            title: "Tarea actualizada",
            status: "en_progreso"
        };
        req.body = updateData;

        // Tarea actualizada esperada
        const updatedTask = {
            ...mockTask,
            ...updateData
        };

        // Mock para findOneAndUpdate
        Task.findOneAndUpdate = jest.fn().mockResolvedValue(updatedTask);

        // Función que estamos probando
        async function updateTask(req, res) {
            try {
                // Crear objeto de actualización
                const updateData = {};
                
                // Solo incluir los campos que están presentes en req.body
                if (req.body.title) updateData.title = req.body.title;
                if (req.body.description) updateData.description = req.body.description;
                if (req.body.status) updateData.status = req.body.status;
                if (req.body.priority) updateData.priority = req.body.priority;
                if (req.body.dueDate) updateData.dueDate = new Date(req.body.dueDate);

                const task = await Task.findOneAndUpdate(
                    { 
                        _id: req.params.id, 
                        userId: req.user.userId 
                    },
                    updateData,
                    { new: true }
                );
                
                if (!task) {
                    return res.status(404).json({ error: 'Tarea no encontrada' });
                }

                res.json(task);
            } catch (error) {
                res.status(500).json({ error: 'Error al actualizar la tarea' });
            }
        }

        // Ejecutar la función
        await updateTask(req, res);

        // Verificaciones
        expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: "mockTaskId", userId: "mockUserId" },
            { title: "Tarea actualizada", status: "en_progreso" },
            { new: true }
        );
        expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    // Nueva prueba 2: deleteTask elimina correctamente una tarea
    test('deleteTask successfully deletes a task', async () => {
        // Mock para findOneAndDelete
        Task.findOneAndDelete = jest.fn().mockResolvedValue(mockTask);

        // Función que estamos probando
        async function deleteTask(req, res) {
            try {
                const task = await Task.findOneAndDelete({ 
                    _id: req.params.id, 
                    userId: req.user.userId 
                });
                
                if (!task) {
                    return res.status(404).json({ error: 'Tarea no encontrada' });
                }

                res.json({ message: 'Tarea eliminada correctamente' });
            } catch (error) {
                res.status(500).json({ error: 'Error al eliminar la tarea' });
            }
        }

        // Ejecutar la función
        await deleteTask(req, res);

        // Verificaciones
        expect(Task.findOneAndDelete).toHaveBeenCalledWith({
            _id: "mockTaskId",
            userId: "mockUserId"
        });
        expect(res.json).toHaveBeenCalledWith({ message: 'Tarea eliminada correctamente' });
    });
});