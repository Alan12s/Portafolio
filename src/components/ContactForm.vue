<template>
  <div class="contact-modal-overlay" @click="closeModal">
    <div class="contact-modal" @click.stop>
      <!-- Header del modal -->
      <div class="modal-header">
        <h2>Send me a message</h2>
        <button class="close-btn" @click="closeModal" aria-label="Close modal">×</button>
      </div>
      
      <!-- Formulario -->
      <form @submit.prevent="sendMessage" class="contact-form">
        <!-- Nombre -->
        <div class="form-group">
          <label for="name">Your Name *</label>
          <input 
            type="text" 
            id="name" 
            v-model="form.name" 
            required 
            placeholder="Enter your full name"
            :class="{ 'error': errors.name }"
            autocomplete="name"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>
        
        <!-- Email -->
        <div class="form-group">
          <label for="email">Your Email *</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            required 
            placeholder="your.email@example.com"
            :class="{ 'error': errors.email }"
            autocomplete="email"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>
        
        <!-- Teléfono (opcional) -->
        <div class="form-group">
          <label for="phone">Phone Number (Optional)</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="form.phone" 
            placeholder="+54 11 1234-5678"
            autocomplete="tel"
          />
        </div>
        
        <!-- Asunto -->
        <div class="form-group">
          <label for="subject">Subject *</label>
          <div class="select-wrapper">
            <select 
              id="subject" 
              v-model="form.subject" 
              required
              :class="{ 'error': errors.subject }"
            >
              <option value="">Select a subject</option>
              <option value="New Project Inquiry">New Project Inquiry</option>
              <option value="Collaboration Opportunity">Collaboration Opportunity</option>
              <option value="General Question">General Question</option>
              <option value="Job Opportunity">Job Opportunity</option>
              <option value="Other">Other</option>
            </select>
            <div class="select-arrow">▼</div>
          </div>
          <span v-if="errors.subject" class="error-message">{{ errors.subject }}</span>
        </div>
        
        <!-- Mensaje -->
        <div class="form-group">
          <label for="message">Your Message *</label>
          <textarea 
            id="message" 
            v-model="form.message" 
            required 
            placeholder="Tell me about your project, ideas, or questions..."
            rows="5"
            :class="{ 'error': errors.message }"
            maxlength="500"
          ></textarea>
          <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
          <div class="char-counter" :class="{ 'warning': form.message.length > 450 }">
            {{ form.message.length }}/500
          </div>
        </div>
        
        <!-- Presupuesto (opcional) -->
        <div class="form-group">
          <label for="budget">Project Budget (Optional)</label>
          <div class="select-wrapper">
            <select id="budget" v-model="form.budget">
              <option value="">Select budget range</option>
              <option value="Under $1,000">Under $1,000</option>
              <option value="$1,000 - $5,000">$1,000 - $5,000</option>
              <option value="$5,000 - $10,000">$5,000 - $10,000</option>
              <option value="$10,000+">$10,000+</option>
              <option value="Let's discuss">Let's discuss</option>
            </select>
            <div class="select-arrow">▼</div>
          </div>
        </div>
        
        <!-- Checkbox de términos -->
        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="form.agreeTerms" 
              required
              :class="{ 'error': errors.agreeTerms }"
            />
            <span class="checkmark"></span>
            I agree to be contacted regarding my inquiry *
          </label>
          <span v-if="errors.agreeTerms" class="error-message">{{ errors.agreeTerms }}</span>
        </div>
        
        <!-- Notificación de envío -->
        <div v-if="showSending" class="sending-notification">
          <div class="sending-icon">
            <div class="spinner"></div>
          </div>
          <span>Sending your message...</span>
        </div>
        
        <!-- Botones -->
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="closeModal" :disabled="isSubmitting">
            Cancel
          </button>
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            <span v-if="isSubmitting">
              <div class="button-spinner"></div>
              Sending...
            </span>
            <span v-else>Send Message</span>
          </button>
        </div>
      </form>
      
      <!-- Mensaje de éxito -->
      <div v-if="showSuccess" class="success-message">
        <div class="success-icon">
          <div class="checkmark-animation">✓</div>
        </div>
        <h3>Message sent successfully!</h3>
        <p>Thanks for reaching out! I'll get back to you within 24 hours.</p>
        <button class="btn-primary" @click="closeModal">Close</button>
      </div>
      
      <!-- Mensaje de error -->
      <div v-if="showError" class="error-message-modal">
        <div class="error-icon">
          <div class="error-animation">⚠</div>
        </div>
        <h3>Error sending message</h3>
        <p>{{ errorMessage }}</p>
        <div class="error-actions">
          <button class="btn-secondary" @click="showError = false">Try Again</button>
          <button class="btn-primary" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactForm',
  props: {
    recipientEmail: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        budget: '',
        agreeTerms: false
      },
      errors: {},
      isSubmitting: false,
      showSuccess: false,
      showError: false,
      showSending: false,
      errorMessage: '',
      
      // Configuración EmailJS con tus credenciales
      emailjsConfig: {
        serviceId: 'service_8qqd4h8',
        templateId: 'template_b66fxue',
        publicKey: 'EMGN-5N_vZInjdJ-D'
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    
    validateForm() {
      this.errors = {};
      
      if (!this.form.name.trim()) {
        this.errors.name = 'Name is required';
      } else if (this.form.name.trim().length < 2) {
        this.errors.name = 'Name must be at least 2 characters';
      }
      
      if (!this.form.email.trim()) {
        this.errors.email = 'Email is required';
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Please enter a valid email address';
      }
      
      if (!this.form.subject) {
        this.errors.subject = 'Please select a subject';
      }
      
      if (!this.form.message.trim()) {
        this.errors.message = 'Message is required';
      } else if (this.form.message.trim().length < 10) {
        this.errors.message = 'Message must be at least 10 characters';
      } else if (this.form.message.length > 500) {
        this.errors.message = 'Message must be less than 500 characters';
      }
      
      if (!this.form.agreeTerms) {
        this.errors.agreeTerms = 'You must agree to be contacted';
      }
      
      return Object.keys(this.errors).length === 0;
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    
    async sendMessage() {
      if (!this.validateForm()) {
        // Scroll to first error
        this.$nextTick(() => {
          const firstError = this.$el.querySelector('.error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
        return;
      }
      
      this.isSubmitting = true;
      this.showSending = true;
      this.showError = false;
      
      try {
        // Verificar si EmailJS está disponible
        if (typeof window.emailjs === 'undefined') {
          throw new Error('EmailJS not loaded. Please check your configuration.');
        }
        
        // Preparar los datos del template
        const templateParams = {
          from_name: this.form.name,
          from_email: this.form.email,
          phone: this.form.phone || 'Not provided',
          subject: this.form.subject,
          message: this.form.message,
          budget: this.form.budget || 'Not specified',
          to_email: this.recipientEmail,
          reply_to: this.form.email
        };
        
        console.log('Sending email with params:', templateParams);
        
        // Enviar email usando EmailJS
        const response = await window.emailjs.send(
          this.emailjsConfig.serviceId,
          this.emailjsConfig.templateId,
          templateParams,
          this.emailjsConfig.publicKey
        );
        
        console.log('EmailJS response:', response);
        
        if (response.status === 200) {
          this.showSending = false;
          this.showSuccess = true;
          this.resetForm();
        } else {
          throw new Error('Failed to send email');
        }
        
      } catch (error) {
        console.error('Error sending email:', error);
        this.showSending = false;
        this.showError = true;
        this.errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    },
    
    resetForm() {
      this.form = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        budget: '',
        agreeTerms: false
      };
      this.errors = {};
    }
  },
  
  async mounted() {
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    
    // Cargar EmailJS SDK
    if (typeof window.emailjs === 'undefined') {
      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = () => {
          window.emailjs.init(this.emailjsConfig.publicKey);
          console.log('EmailJS initialized successfully');
        };
        script.onerror = () => {
          console.error('Failed to load EmailJS SDK');
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading EmailJS:', error);
      }
    } else {
      // Si ya está cargado, inicializar
      window.emailjs.init(this.emailjsConfig.publicKey);
    }
  },
  
  beforeUnmount() {
    // Restaurar scroll del body
    document.body.style.overflow = '';
  }
}
</script>

<style scoped>
/* Modal overlay */
.contact-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.contact-modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Modal header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 30px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
  color: #fff;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #a0aec0;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transform: rotate(90deg);
}

/* Formulario */
.contact-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  color: #fff;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #a0aec0;
}

.form-group input.error,
.form-group textarea.error {
  border-color: #e53e3e;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Select personalizado */
.select-wrapper {
  position: relative;
}

.select-wrapper select {
  width: 100%;
  padding: 12px 40px 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  appearance: none;
  cursor: pointer;
}

.select-wrapper select:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.select-wrapper select option {
  background: #2d3748;
  color: #fff;
  padding: 10px;
  border: none;
}

.select-wrapper select option:hover {
  background: #4a5568;
}

.select-wrapper select.error {
  border-color: #e53e3e;
  animation: shake 0.5s ease-in-out;
}

.select-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.select-wrapper select:focus + .select-arrow {
  color: #667eea;
  transform: translateY(-50%) rotate(180deg);
}

.error-message {
  color: #e53e3e;
  font-size: 0.8rem;
  margin-top: 5px;
  display: block;
  animation: fadeIn 0.3s ease-out;
}

.char-counter {
  color: #a0aec0;
  font-size: 0.8rem;
  text-align: right;
  margin-top: 5px;
  transition: color 0.3s ease;
}

.char-counter.warning {
  color: #ffa500;
}

/* Notificación de envío */
.sending-notification {
  background: linear-gradient(45deg, #48bb78, #38a169);
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  font-weight: 600;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.sending-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Checkbox personalizado */
.checkbox-group {
  margin-bottom: 30px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #a0aec0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin-right: 12px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-color: #667eea;
  transform: scale(1.05);
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  animation: checkmark 0.3s ease-out;
}

@keyframes checkmark {
  0% {
    transform: translate(-50%, -50%) scale(0);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}

.checkbox-label input[type="checkbox"].error + .checkmark {
  border-color: #e53e3e;
  animation: shake 0.5s ease-in-out;
}

/* Botones */
.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(45deg, #5a6fd8, #6a42a0);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: transparent;
  color: #a0aec0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  transform: translateY(-1px);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Mensaje de éxito */
.success-message {
  padding: 40px 30px;
  text-align: center;
  color: #fff;
  animation: fadeIn 0.5s ease-out;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #48bb78, #38a169);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2rem;
  color: white;
  animation: bounceIn 0.6s ease-out;
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.checkmark-animation {
  animation: checkmarkSuccess 0.5s ease-out 0.3s both;
}

@keyframes checkmarkSuccess {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.success-message h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #48bb78;
}

.success-message p {
  color: #a0aec0;
  margin-bottom: 30px;
  line-height: 1.6;
}

/* Mensaje de error */
.error-message-modal {
  padding: 40px 30px;
  text-align: center;
  color: #fff;
  animation: fadeIn 0.5s ease-out;
}

.error-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #e53e3e, #c53030);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2rem;
  color: white;
  animation: bounceIn 0.6s ease-out;
}

.error-animation {
  animation: errorShake 0.5s ease-out 0.3s both;
}

@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-message-modal h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #e53e3e;
}

.error-message-modal p {
  color: #a0aec0;
  margin-bottom: 30px;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

/* Responsive */
@media (max-width: 768px) {
  .contact-modal {
    margin: 10px;
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 20px 20px 15px;
  }
  
  .modal-header h2 {
    font-size: 1.5rem;
  }
  
  .contact-form {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
  
  .error-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .contact-modal-overlay {
    padding: 10px;
  }
  
  .modal-header {
    padding: 15px 15px 10px;
  }
  
  .contact-form {
    padding: 15px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .success-message,
  .error-message-modal {
    padding: 30px 15px;
  }
}

/* Scrollbar personalizada */
.contact-modal::-webkit-scrollbar {
  width: 8px;
}

.contact-modal::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.contact-modal::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.contact-modal::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>