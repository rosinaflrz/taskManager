from behave import given, when, then
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

@given('I am on the login page')
def step_impl(context):
    options = Options()
    options.add_argument("--start-maximized")
    service = Service(ChromeDriverManager().install())
    context.driver = webdriver.Chrome(service=service, options=options)
    context.driver.get("http://localhost:3000")

@when('I log in with valid credentials')
def step_impl(context):
    login_button = WebDriverWait(context.driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.nav-btn-login'))
    )
    login_button.click()

    email = WebDriverWait(context.driver, 10).until(
        EC.visibility_of_element_located((By.ID, 'loginEmail'))
    )
    password = context.driver.find_element(By.ID, 'loginPassword')

    email.send_keys("rosinaflrz@gmail.com")
    password.send_keys("admin")  # ← usa la correcta

    submit = context.driver.find_element(By.CSS_SELECTOR, '#loginModal button[type="submit"]')
    submit.click()

    # Esperar a que aparezca y hacer clic en el botón “Continuar” del modal de bienvenida
    continue_button = WebDriverWait(context.driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, '//button[contains(text(),"Continuar")]'))
    )
    continue_button.click()

    # Confirmar que ya estamos en el dashboard
    WebDriverWait(context.driver, 10).until(
        EC.url_contains("/dashboard")
    )

@when('I open the task creation modal')
def step_impl(context):
    create_btn = WebDriverWait(context.driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, 'button.btn.btn-primary[data-bs-target="#createTaskModal"]'))
    )
    create_btn.click()

@when('I fill in the task form with valid data')
def step_impl(context):
    WebDriverWait(context.driver, 5).until(
        EC.visibility_of_element_located((By.ID, 'taskTitle'))
    )

    context.driver.find_element(By.ID, 'taskTitle').send_keys("Prueba Selenium")
    context.driver.find_element(By.ID, 'taskDescription').send_keys("Descripción de prueba")
    context.driver.find_element(By.ID, 'taskDueDate').send_keys("2025-05-20")
    context.driver.find_element(By.ID, 'taskDueTime').send_keys("18:00")
    context.driver.find_element(By.ID, 'taskPriority').send_keys("alta")
    context.driver.find_element(By.ID, 'taskStatus').send_keys("pendiente")

@when('I submit the task form')
def step_impl(context):
    # Esperar a que el botón esté presente y visible antes de hacer clic
    submit_button = WebDriverWait(context.driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, '#createTaskModal button.btn.btn-primary'))
    )
    submit_button.click()
    time.sleep(2)

@then('I should see the task listed in the dashboard')
def step_impl(context):
    WebDriverWait(context.driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, 'task-card'))
    )
    tasks = context.driver.find_elements(By.CLASS_NAME, 'task-card')
    assert any("Prueba Selenium" in task.text for task in tasks), "Task not found in dashboard"
