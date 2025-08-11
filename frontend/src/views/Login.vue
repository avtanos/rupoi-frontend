<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <!-- Логотип -->
        <div class="logo-section">
          <v-icon size="48" color="primary" class="logo-icon">mdi-account-group</v-icon>
          <h1 class="logo-title">АИС ЕССО</h1>
          <p class="logo-subtitle">Автоматизированная информационная система</p>
        </div>

        <!-- Форма входа -->
        <div class="form-section">
          <h2 class="form-title">Вход в систему</h2>
          
          <v-alert
            type="info"
            variant="tonal"
            class="mb-4"
            border="start"
          >
            <strong>Тестовый режим</strong><br>
            Система работает без аутентификации для разработки и тестирования.
          </v-alert>

          <v-form @submit.prevent="handleLogin" class="login-form">
            <v-text-field
              v-model="form.username"
              label="Имя пользователя"
              name="username"
              prepend-icon="mdi-account"
              type="text"
              required
              :error-messages="errors.username"
              variant="outlined"
              density="comfortable"
              class="form-field"
            />

            <v-text-field
              v-model="form.password"
              label="Пароль"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
              required
              :error-messages="errors.password"
              variant="outlined"
              density="comfortable"
              class="form-field"
            />

            <v-btn
              color="primary"
              size="large"
              block
              :loading="userStore.loading"
              @click="handleLogin"
              class="login-btn"
            >
              <v-icon start>mdi-login</v-icon>
              Войти в систему
            </v-btn>
          </v-form>
          
          <v-alert
            v-if="userStore.error"
            type="error"
            variant="tonal"
            class="mt-4"
            border="start"
          >
            {{ userStore.error }}
          </v-alert>
        </div>

        <!-- Информация о системе -->
        <div class="system-info">
          <p class="version-text">Версия 1.0.0</p>
          <p class="copyright-text">© 2025 ЕССО. Все права защищены.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  username: 'test_user',
  password: 'test123'
})

const errors = reactive({
  username: '',
  password: ''
})

const validateForm = () => {
  errors.username = ''
  errors.password = ''
  
  if (!form.username) {
    errors.username = 'Введите имя пользователя'
  }
  
  if (!form.password) {
    errors.password = 'Введите пароль'
  }
  
  return !errors.username && !errors.password
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  const result = await userStore.login(form)
  
  if (result.success) {
    router.push('/')
  }
}

// Автоматический вход при загрузке страницы
onMounted(() => {
  if (!userStore.isAuthenticated) {
    handleLogin()
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #2f4b7c 0%, #3f5e94 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(30, 42, 58, 0.12);
  overflow: hidden;
}

.logo-section {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 32px 24px;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
}

.logo-icon {
  margin-bottom: 16px;
}

.logo-title {
  font-size: 24px;
  font-weight: 700;
  color: #2f4b7c;
  margin: 0 0 8px;
}

.logo-subtitle {
  font-size: 14px;
  color: #6b778c;
  margin: 0;
}

.form-section {
  padding: 32px 24px;
}

.form-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e2a3a;
  margin: 0 0 24px;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-field {
  margin-bottom: 8px;
}

.login-btn {
  margin-top: 8px;
  height: 48px;
  font-weight: 600;
}

.system-info {
  background: #f8fafc;
  padding: 16px 24px;
  text-align: center;
  border-top: 1px solid #e2e8f0;
}

.version-text {
  font-size: 12px;
  color: #6b778c;
  margin: 0 0 4px;
}

.copyright-text {
  font-size: 12px;
  color: #6b778c;
  margin: 0;
}

/* Адаптивность */
@media (max-width: 480px) {
  .login-container {
    max-width: 100%;
  }
  
  .login-card {
    border-radius: 12px;
  }
  
  .logo-section,
  .form-section {
    padding: 24px 20px;
  }
}
</style>
