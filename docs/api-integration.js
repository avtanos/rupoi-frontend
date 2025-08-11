/**
 * АИС ЕССО - API интеграция
 * Связывает frontend интерфейс с Django backend
 */

class ESSOAPI {
    constructor() {
        this.baseURL = 'http://localhost:8000/api';
        this.token = localStorage.getItem('esso_token');
        this.setupInterceptors();
    }

    // Настройка перехватчиков для авторизации
    setupInterceptors() {
        // Добавляем токен к каждому запросу
        if (this.token) {
            this.headers = {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            };
        }
    }

    // Базовый метод для HTTP запросов
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.headers,
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (response.status === 401) {
                // Токен истёк, перенаправляем на логин
                this.logout();
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Аутентификация
    async login(username, password) {
        try {
            const response = await fetch(`${this.baseURL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                this.token = data.access;
                localStorage.setItem('esso_token', this.token);
                this.setupInterceptors();
                return data;
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    logout() {
        this.token = null;
        localStorage.removeItem('esso_token');
        window.location.href = '/login.html';
    }

    // =========== ЛИЧНЫЕ ДЕЛА ===========
    
    // Получить список личных дел
    async getPersonalCases(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/personal-cases/?${queryString}`);
    }

    // Получить личное дело по ID
    async getPersonalCase(id) {
        return await this.request(`/personal-cases/${id}/`);
    }

    // Создать новое личное дело
    async createPersonalCase(data) {
        return await this.request('/personal-cases/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Обновить личное дело
    async updatePersonalCase(id, data) {
        return await this.request(`/personal-cases/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Удалить личное дело
    async deletePersonalCase(id) {
        return await this.request(`/personal-cases/${id}/`, {
            method: 'DELETE'
        });
    }

    // =========== ЗАКАЗЫ ===========
    
    // Получить список заказов
    async getOrders(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/orders/?${queryString}`);
    }

    // Получить заказ по ID
    async getOrder(id) {
        return await this.request(`/orders/${id}/`);
    }

    // Создать новый заказ
    async createOrder(data) {
        return await this.request('/orders/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Обновить заказ
    async updateOrder(id, data) {
        return await this.request(`/orders/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Удалить заказ
    async deleteOrder(id) {
        return await this.request(`/orders/${id}/`, {
            method: 'DELETE'
        });
    }

    // =========== НАКЛАДНЫЕ ===========
    
    // Получить список накладных
    async getInvoices(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/invoices/?${queryString}`);
    }

    // Получить накладную по ID
    async getInvoice(id) {
        return await this.request(`/invoices/${id}/`);
    }

    // Создать новую накладную
    async createInvoice(data) {
        return await this.request('/invoices/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Обновить накладную
    async updateInvoice(id, data) {
        return await this.request(`/invoices/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Удалить накладную
    async deleteInvoice(id) {
        return await this.request(`/invoices/${id}/`, {
            method: 'DELETE'
        });
    }

    // =========== СКЛАД ===========
    
    // Получить список позиций склада
    async getWarehouseItems(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/warehouse/items/?${queryString}`);
    }

    // Получить позицию склада по ID
    async getWarehouseItem(id) {
        return await this.request(`/warehouse/items/${id}/`);
    }

    // Создать новую позицию склада
    async createWarehouseItem(data) {
        return await this.request('/warehouse/items/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Обновить позицию склада
    async updateWarehouseItem(id, data) {
        return await this.request(`/warehouse/items/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Удалить позицию склада
    async deleteWarehouseItem(id) {
        return await this.request(`/warehouse/items/${id}/`, {
            method: 'DELETE'
        });
    }

    // =========== ВЫДАЧА ===========
    
    // Получить список выдач
    async getIssues(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/warehouse/issues/?${queryString}`);
    }

    // Получить выдачу по ID
    async getIssue(id) {
        return await this.request(`/warehouse/issues/${id}/`);
    }

    // Создать новую выдачу
    async createIssue(data) {
        return await this.request('/warehouse/issues/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Обновить выдачу
    async updateIssue(id, data) {
        return await this.request(`/warehouse/issues/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Удалить выдачу
    async deleteIssue(id) {
        return await this.request(`/warehouse/issues/${id}/`, {
            method: 'DELETE'
        });
    }

    // =========== ОТЧЕТЫ ===========
    
    // Получить статистику для дашборда
    async getDashboardStats() {
        return await this.request('/reports/dashboard/');
    }

    // Получить отчет по личным делам
    async getPersonalCasesReport(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/reports/personal-cases/?${queryString}`);
    }

    // Получить отчет по заказам
    async getOrdersReport(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/reports/orders/?${queryString}`);
    }

    // Получить отчет по складу
    async getWarehouseReport(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/reports/warehouse/?${queryString}`);
    }

    // =========== ПОЛЬЗОВАТЕЛИ ===========
    
    // Получить текущего пользователя
    async getCurrentUser() {
        return await this.request('/auth/me/');
    }

    // Обновить профиль пользователя
    async updateProfile(data) {
        return await this.request('/auth/profile/', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Сменить пароль
    async changePassword(data) {
        return await this.request('/auth/change-password/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
}

// Создаем глобальный экземпляр API
const essoAPI = new ESSOAPI();

// Утилиты для работы с данными
class DataUtils {
    // Форматирование даты
    static formatDate(dateString) {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }

    // Форматирование даты и времени
    static formatDateTime(dateString) {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU');
    }

    // Форматирование статуса
    static formatStatus(status) {
        const statusMap = {
            'active': 'Активно',
            'inactive': 'Неактивно',
            'draft': 'Черновик',
            'in_progress': 'В работе',
            'ready': 'Готово',
            'issued': 'Выдано',
            'cancelled': 'Отменено'
        };
        return statusMap[status] || status;
    }

    // Форматирование суммы
    static formatAmount(amount, currency = 'сом') {
        if (!amount) return `0 ${currency}`;
        return `${amount.toLocaleString('ru-RU')} ${currency}`;
    }

    // Валидация ПИН
    static validatePIN(pin) {
        return /^\d{14}$/.test(pin);
    }

    // Валидация email
    static validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Валидация телефона
    static validatePhone(phone) {
        return /^\+?[0-9\s\-\(\)]{10,}$/.test(phone);
    }
}

// Утилиты для UI
class UIUtils {
    // Показать уведомление
    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Показать модальное окно подтверждения
    static showConfirmDialog(message, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal">
                <h4>Подтверждение</h4>
                <div class="muted">${message}</div>
                <div class="row">
                    <button class="btn ghost" id="cancelBtn">Отмена</button>
                    <button class="btn danger" id="confirmBtn">Подтвердить</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('#cancelBtn').onclick = () => modal.remove();
        modal.querySelector('#confirmBtn').onclick = () => {
            onConfirm();
            modal.remove();
        };
    }

    // Показать индикатор загрузки
    static showLoading(element) {
        element.innerHTML = '<div class="loading">Загрузка...</div>';
    }

    // Скрыть индикатор загрузки
    static hideLoading(element) {
        const loading = element.querySelector('.loading');
        if (loading) loading.remove();
    }

    // Обновить счетчики на дашборде
    static updateDashboardCounters(stats) {
        // Обновляем карточки статистики
        const counters = document.querySelectorAll('.data-card .value');
        if (counters.length >= 4) {
            counters[0].textContent = stats.personalCases || '0';
            counters[1].textContent = stats.activeOrders || '0';
            counters[2].textContent = stats.pendingInvoices || '0';
            counters[3].textContent = stats.warehouseItems || '0';
        }
    }
}

// Экспортируем для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ESSOAPI, DataUtils, UIUtils };
}
