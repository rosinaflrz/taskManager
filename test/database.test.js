const mongoose = require('mongoose');
const connectDB = require('../config/database');


jest.mock('mongoose', () => ({
    connect: jest.fn(),
}));

describe('connectDB', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Mensaje de conexión exitosa', async () => {
        mongoose.connect.mockResolvedValueOnce(true);
        
        console.log = jest.fn();

        await connectDB();
        
        expect(console.log).toHaveBeenCalledWith('[+] Conexión exitosa a MongoDB');
    });

    test('Mensaje de error al conectar', async () => {
        mongoose.connect.mockRejectedValueOnce(new Error('Connection error'));

        console.error = jest.fn();
        process.exit = jest.fn();

        await connectDB();

        // Verify the error message and exit
        expect(console.error).toHaveBeenCalledWith('[-] Error al conectar a MongoDB:', expect.any(Error));
        expect(process.exit).toHaveBeenCalledWith(1);
    });
});
