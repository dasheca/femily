from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Создаем экземпляр драйвера Chrome
driver = webdriver.Chrome()

# Открываем веб-сайт
driver.get("http://localhost:3000")

# Находим ссылку на каталог
catalog_link = driver.find_element(By.LINK_TEXT, "КАТАЛОГ")

# Нажимаем на ссылку каталога
catalog_link.click()

# Ждем, пока загрузится страница каталога
WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CLASS_NAME, "main-container"))
)

# Получаем текущий URL страницы
current_url = driver.current_url

# Проверяем, что URL содержит путь к каталогу
assert "/service" in current_url, "Нажатие на ссылку каталога не перенаправило на страницу каталога"

# Закрываем браузер
driver.quit()
