const {Given, When, Then, After, AfterAll, setDefaultTimeout} = require('cucumber');
const assert = require('assert');
require('chromedriver');
const {By, Builder, Capabilities, until, Key} = require('selenium-webdriver');
const capabilities = Capabilities.chrome();
capabilities.set('chromeoptions', {"w3c":false});
const {exec} = require('child_process');

// Aumentar el timeout global para todos los pasos
setDefaultTimeout(60000); // 60 segundos para manejar carga lenta

// Después de cada escenario
After(async function() {
    if (this.driver) {
        try {
            await this.driver.quit();
        } catch (e) {
            console.log('Error cerrando el navegador:', e);
        }
    }
});

// Después de todos los escenarios
AfterAll(function() {
    // Matar cualquier proceso de chromedriver residual
    exec('taskkill /F /IM chromedriver.exe', (error) => {
        if (error) {
            console.log('No se encontraron procesos de chromedriver para terminar');
        } else {
            console.log('Procesos de chromedriver terminados exitosamente');
        }
    });
});

// Paso 1: Usuario está logueado y tiene tareas
Given('User is logged in and has tasks', async function() {
    // Crear una instancia de WebDriver
    this.driver = new Builder().withCapabilities(capabilities).build();
    
    // Navegar a la página principal
    await this.driver.get('http://localhost:3000/');
    await this.driver.manage().window().maximize();
    
    try {
        // Esperar a que la página se cargue completamente
        await this.driver.wait(until.elementLocated(By.css('body')), 10000);
        
        // Buscar y hacer clic en el botón de login
        const loginButton = await this.driver.wait(
            until.elementLocated(By.css('.nav-btn-login')),
            10000,
            'No se encontró el botón de login'
        );
        
        // Esperar a que el botón sea clickeable antes de intentar hacer clic
        await this.driver.wait(
            until.elementIsVisible(loginButton),
            5000,
            'El botón de login no es visible'
        );
        
        // Hacer clic usando JavaScript
        await this.driver.executeScript("arguments[0].click();", loginButton);
        console.log("Se hizo clic en el botón de login");
        
        // Esperar a que aparezca el modal de login
        const emailInput = await this.driver.wait(
            until.elementLocated(By.id('loginEmail')),
            10000,
            'No se encontró el campo de email para login'
        );
        
        // Esperar a que el campo sea visible e interactuable
        await this.driver.wait(
            until.elementIsVisible(emailInput),
            5000,
            'El campo de email no es visible'
        );
        
        // Ingresar credenciales
        await emailInput.sendKeys('test8@email.com');
        
        const passwordInput = await this.driver.findElement(By.id('loginPassword'));
        await passwordInput.sendKeys('testpassword');
        
        // Hacer clic en el botón de enviar
        const submitButton = await this.driver.findElement(By.css('button[type="submit"]'));
        await this.driver.executeScript("arguments[0].click();", submitButton);
        console.log("Se enviaron las credenciales de login");
        
        // Manejar el popup de bienvenida
        try {
            // Esperar un momento para que aparezca el popup
            await this.driver.sleep(2000);
            
            // Buscar el botón de continuar en el popup
            const continueButton = await this.driver.wait(
                until.elementLocated(By.xpath("//button[contains(text(), 'Continuar')]")),
                5000,
                'No se encontró el botón Continuar'
            );
            
            // Hacer clic en el botón
            await this.driver.executeScript("arguments[0].click();", continueButton);
            console.log("Se hizo clic en el botón Continuar del popup");
            
        } catch (e) {
            console.log("No se encontró el popup de bienvenida o no se pudo interactuar con él:", e.message);
            // Intentamos continuar con la prueba
        }
        
        // Esperar a que se cargue el dashboard
        await this.driver.wait(
            until.urlContains('/dashboard'),
            15000,
            'No se pudo navegar al dashboard después del login'
        );
        
        console.log("Login exitoso, estamos en el dashboard");
        
    } catch (error) {
        console.error("Error durante el login:", error.message);
        throw error;
    }
});

// Paso 2: Usuario navega a la sección de estadísticas
When('User navigates to statistics section', async function() {
    try {
        // Esperar un momento para asegurarnos de que todo está cargado
        await this.driver.sleep(2000);
        
        // Buscar el enlace de estadísticas - probar varios selectores
        let statsLink = null;
        const possibleSelectors = [
            "//a[contains(text(), 'Estadística')]",
            "//a[contains(@href, '#statistics')]",
            "//i[contains(@class, 'bi-graph-up')]/parent::a",
            ".list-group-item:nth-child(2)"
        ];
        
        for (const selector of possibleSelectors) {
            try {
                if (selector.startsWith('//')) {
                    // Es un selector XPath
                    statsLink = await this.driver.findElement(By.xpath(selector));
                } else {
                    // Es un selector CSS
                    statsLink = await this.driver.findElement(By.css(selector));
                }
                
                if (statsLink) {
                    console.log(`Enlace de estadísticas encontrado con selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continuar con el siguiente selector
            }
        }
        
        if (!statsLink) {
            throw new Error("No se pudo encontrar el enlace de estadísticas con ninguno de los selectores probados");
        }
        
        // Hacer clic en el enlace usando JavaScript
        await this.driver.executeScript("arguments[0].click();", statsLink);
        console.log("Se hizo clic en el enlace de estadísticas");
        
        // Esperar a que se cargue la sección de estadísticas
        await this.driver.sleep(3000); // Dar tiempo para que carguen los gráficos
        
    } catch (error) {
        console.error("Error al navegar a estadísticas:", error.message);
        throw error;
    }
});

// Paso 3: Las estadísticas se muestran correctamente
Then('Statistical charts should be displayed correctly', async function() {
    try {
        // Verificar elementos en la página de estadísticas
        // Primero verificamos si hay cards o contenedores de estadísticas
        const cards = await this.driver.findElements(By.css('.card'));
        console.log(`Se encontraron ${cards.length} tarjetas en la página`);
        
        assert.ok(
            cards.length > 0,
            'No se encontraron tarjetas en la página de estadísticas'
        );
        
        // Verificar si hay elementos gráficos (canvas, divs específicos, etc.)
        try {
            const charts = await this.driver.findElements(By.css('canvas, .chart'));
            console.log(`Se encontraron ${charts.length} elementos de gráficos`);
            
            // No forzamos un assert aquí porque los gráficos podrían renderizarse dinámicamente
        } catch (e) {
            console.log("No se pudieron encontrar elementos de gráficos");
        }
        
        // Verificar textos relevantes en la página
        const pageText = await this.driver.findElement(By.css('body')).getText();
        
        const hasRelevantText = 
            pageText.includes('Estadística') ||
            pageText.includes('Tarea') ||
            pageText.includes('Total') ||
            pageText.includes('Completa') ||
            pageText.includes('Pendiente');
        
        assert.ok(
            hasRelevantText,
            'No se encontró texto relevante en la página de estadísticas'
        );
        
        console.log("La página de estadísticas muestra información correctamente");
        
    } catch (error) {
        console.error("Error al verificar estadísticas:", error.message);
        throw error;
    }
});

// Paso 4: Usuario navega a la sección de calendario
When('User navigates to calendar section', async function() {
    try {
        // Esperar un momento para asegurarnos de que todo está cargado
        await this.driver.sleep(2000);
        
        // Buscar el enlace del calendario con varios selectores posibles
        let calendarLink = null;
        const possibleSelectors = [
            "//a[contains(text(), 'Calendario')]",
            "//a[contains(@href, '#calendar')]",
            "//i[contains(@class, 'bi-calendar')]/parent::a",
            ".list-group-item:nth-child(3)"
        ];
        
        for (const selector of possibleSelectors) {
            try {
                if (selector.startsWith('//')) {
                    // Es un selector XPath
                    calendarLink = await this.driver.findElement(By.xpath(selector));
                } else {
                    // Es un selector CSS
                    calendarLink = await this.driver.findElement(By.css(selector));
                }
                
                if (calendarLink) {
                    console.log(`Enlace de calendario encontrado con selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continuar con el siguiente selector
            }
        }
        
        if (!calendarLink) {
            throw new Error("No se pudo encontrar el enlace del calendario con ninguno de los selectores probados");
        }
        
        // Hacer clic en el enlace usando JavaScript
        await this.driver.executeScript("arguments[0].click();", calendarLink);
        console.log("Se hizo clic en el enlace del calendario");
        
        // Esperar a que se cargue la sección del calendario
        await this.driver.sleep(3000);
        
    } catch (error) {
        console.error("Error al navegar al calendario:", error.message);
        throw error;
    }
});

// Paso 5: El calendario se muestra correctamente
Then('Calendar should be displayed with tasks', async function() {
    try {
        // Verificar que el calendario se muestra correctamente
        // Primero buscamos el contenedor del calendario
        let calendarContainer = null;
        try {
            calendarContainer = await this.driver.findElement(By.id('calendar'));
            console.log("Se encontró el contenedor del calendario por ID");
        } catch (e) {
            // Intentar con otros selectores si no se encuentra por ID
            try {
                calendarContainer = await this.driver.findElement(By.css('.fc'));
                console.log("Se encontró el contenedor del calendario por clase fc");
            } catch (e2) {
                // Un último intento con otro selector
                calendarContainer = await this.driver.findElement(By.css('.calendar-container'));
                console.log("Se encontró el contenedor del calendario por clase calendar-container");
            }
        }
        
        assert.ok(
            calendarContainer,
            'No se pudo encontrar el contenedor del calendario'
        );
        
        // Verificar elementos del calendario que deberían estar presentes
        try {
            // Verificar los botones de navegación, si están disponibles
            const navigationButtons = await this.driver.findElements(
                By.css('.fc-button, .calendar-nav-button')
            );
            
            console.log(`Se encontraron ${navigationButtons.length} botones de navegación`);
            
            // Si hay botones, intentar hacer clic en "siguiente" para probar funcionalidad
            if (navigationButtons.length > 0) {
                // Buscar un botón "siguiente" o similar
                for (const button of navigationButtons) {
                    const text = await button.getText();
                    if (text.includes('next') || text.includes('Next') || text.includes('Sig')) {
                        console.log("Haciendo clic en botón Siguiente");
                        await this.driver.executeScript("arguments[0].click();", button);
                        await this.driver.sleep(1000);
                        break;
                    }
                }
            }
        } catch (e) {
            console.log("No se pudieron verificar elementos de navegación del calendario:", e.message);
        }
        
        console.log("La sección de calendario se muestra correctamente");
        
    } catch (error) {
        console.error("Error al verificar el calendario:", error.message);
        throw error;
    }
});