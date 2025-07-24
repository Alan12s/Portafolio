<template>
  <div id="app">
    <!-- Header con navegación responsive -->
    <header class="header">
      <div class="container">
        <!-- Logo/Nombre -->
        <div class="logo">
          <h1>Alan.</h1>
        </div>
        
        <!-- Botón hamburguesa para móvil -->
        <button 
          class="menu-toggle"
          @click="toggleMenu"
          :class="{ active: isMenuOpen }"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <!-- Menú de navegación -->
        <nav class="nav" :class="{ active: isMenuOpen }">
          <a href="#home" @click="closeMenu" class="nav-link active">Home</a>
          <a href="#services" @click="closeMenu" class="nav-link">Services</a>
          <a href="#resume" @click="closeMenu" class="nav-link">Resume</a>
          <a href="#work" @click="closeMenu" class="nav-link">Work</a>
          <a href="#contact" @click="closeMenu" class="nav-link">Contact</a>
          <button class="hire-btn" @click="scrollToContact">Hire me</button>
        </nav>
      </div>
    </header>
    
    <!-- Contenido principal -->
    <main class="main">
      <!-- Sección Hero mejorada -->
      <section id="home" class="hero">
        <div class="container">
          <div class="hero-content">
            <!-- Texto principal -->
            <div class="hero-text">
              <p class="hero-subtitle">Full Stack Developer</p>
              <h1 class="hero-title">
                Hello I'm <br>
                <span class="hero-name">Alan Rodriguez</span>
              </h1>
              <p class="hero-description">
                I'm a passionate Full Stack Developer with expertise in modern web technologies. <br>
                I specialize in creating scalable applications from frontend to backend, <br>
                delivering exceptional user experiences with clean, efficient code.
              </p>
              
              <!-- Botones de acción -->
              <div class="hero-buttons">
                <button class="download-btn">
                  <span class="btn-icon">⬇</span>
                  DOWNLOAD CV
                </button>
                <div class="social-links">
                  <a href="https://github.com/Alan12s/" class="social-btn" target="_blank" title="GitHub">
                    <span class="social-icon">🐱</span>
                  </a>
                  <a href="https://www.linkedin.com/in/" class="social-btn" target="_blank" title="LinkedIn">
                    <span class="social-icon">💼</span>
                  </a>
                  <a href="mailto:rodriguezalanm731@gmail.com" class="social-btn" title="Email">
                    <span class="social-icon">📧</span>
                  </a>
                  <a href="https://wa.me/542645263370" class="social-btn" target="_blank" title="WhatsApp">
                    <span class="social-icon">📱</span>
                  </a>
                </div>
              </div>
            </div>
            
            <!-- Imagen de perfil con círculo animado -->
            <div class="hero-image">
              <div class="profile-circle">
                <div class="profile-border"></div>
                <div class="profile-img">
                  <img src="/perfil.jpg" alt="Alan Rodriguez" class="profile-photo">
                </div>
              </div>
            </div>
          </div>
          
          <!-- Estadísticas mejoradas -->
          <div class="stats">
            <div class="stat-item">
              <div class="stat-number">3+</div>
              <div class="stat-label">
                <span class="stat-main">Years of</span>
                <span class="stat-sub">experience</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-number">25+</div>
              <div class="stat-label">
                <span class="stat-main">Projects</span>
                <span class="stat-sub">completed</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-number">14+</div>
              <div class="stat-label">
                <span class="stat-main">Technologies</span>
                <span class="stat-sub">mastered</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-number">500+</div>
              <div class="stat-label">
                <span class="stat-main">Code</span>
                <span class="stat-sub">commits</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Sección Services mejorada -->
      <section id="services" class="section services-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">My Services</h2>
            <p class="section-subtitle">Comprehensive solutions for your digital needs</p>
          </div>
          
          <div class="services-grid">
            <div class="service-card" v-for="service in services" :key="service.id">
              <div class="service-icon">
                <span>{{ service.icon }}</span>
              </div>
              <h3 class="service-title">{{ service.title }}</h3>
              <p class="service-description">{{ service.description }}</p>
              <div class="service-features">
                <ul>
                  <li v-for="feature in service.features" :key="feature">{{ feature }}</li>
                </ul>
              </div>
              <div class="service-tech">
                <span v-for="tech in service.technologies" :key="tech" class="tech-tag">
                  <span class="tech-icon" v-html="getTechIcon(tech)"></span>
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Sección Resume mejorada -->
      <section id="resume" class="section resume-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">My Resume</h2>
            <p class="section-subtitle">My professional journey and expertise</p>
          </div>
          
          <div class="resume-content">
            <!-- Experiencia -->
            <div class="resume-column">
              <h3 class="resume-column-title">
                <span class="resume-icon">💼</span>
                Experience
              </h3>
              
              <div class="timeline">
                <div class="timeline-item" v-for="exp in experience" :key="exp.id">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <div class="timeline-period">{{ exp.period }}</div>
                    <h4 class="timeline-title">{{ exp.position }}</h4>
                    <p class="timeline-company">{{ exp.company }}</p>
                    <p class="timeline-description">{{ exp.description }}</p>
                    <div class="timeline-skills">
                      <span v-for="skill in exp.skills" :key="skill" class="skill-tag">
                        <span class="tech-icon" v-html="getTechIcon(skill)"></span>
                        {{ skill }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Educación -->
            <div class="resume-column">
              <h3 class="resume-column-title">
                <span class="resume-icon">🎓</span>
                Education
              </h3>
              
              <div class="timeline">
                <div class="timeline-item" v-for="edu in education" :key="edu.id">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <div class="timeline-period">{{ edu.period }}</div>
                    <h4 class="timeline-title">{{ edu.degree }}</h4>
                    <p class="timeline-company">{{ edu.institution }}</p>
                    <p class="timeline-description">{{ edu.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Skills mejorada -->
          <div class="skills-section">
            <h3 class="skills-title">
              <span class="resume-icon">⚡</span>
              Technical Skills
            </h3>
            
            <div class="skills-grid">
              <div class="skill-category" v-for="category in skills" :key="category.name">
                <h4 class="skill-category-title">{{ category.name }}</h4>
                <div class="skill-items">
                  <div class="skill-item" v-for="skill in category.items" :key="skill.name">
                    <div class="skill-info">
                      <span class="skill-name">
                        <span class="tech-icon" v-html="getTechIcon(skill.name)"></span>
                        {{ skill.name }}
                      </span>
                      <span class="skill-level">{{ skill.level }}%</span>
                    </div>
                    <div class="skill-bar">
                      <div class="skill-progress" :style="{ width: skill.level + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Sección de proyectos -->
      <section id="work" class="section projects-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">My Projects</h2>
            <p class="section-subtitle">Here are some of my recent works</p>
          </div>
          
          <div class="projects-tree">
            <div class="main-branch"></div>
            
            <div 
              v-for="(project, index) in getFeaturedProjects()" 
              :key="project.id"
              class="project-item" 
              :data-project="project.id"
              @click="openProject(project)"
            >
              <div class="project-branch"></div>
              <div class="project-dot"></div>
              <div class="project-content">
                <h3 class="project-title">{{ project.title }}</h3>
                <span class="project-tech">{{ project.tech.join(', ') }}</span>
              </div>
              
              <!-- Tooltip sin botón X -->
              <div class="project-tooltip">
                <div class="tooltip-image">
                  <img 
                    :src="project.image" 
                    :alt="project.title"
                    @error="handleImageError"
                  />
                </div>
                <div class="tooltip-content">
                  <h4>{{ project.title }}</h4>
                  <p>{{ project.description }}</p>
                  <div class="tooltip-tech">
                    <span v-for="tech in project.tech" :key="tech">
                      <span class="tech-icon" v-html="getTechIcon(tech)"></span>
                      {{ tech }}
                    </span>
                  </div>
                  <div class="tooltip-actions">
                    <button class="view-project-btn" @click.stop="openProject(project)">
                      View Project →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="projects-footer">
            <button class="view-all-btn" @click="showAllProjects">
              <span>View All Projects</span>
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </section>
    </main>
    
    <!-- Footer con contacto -->
    <footer id="contact" class="footer">
      <div class="container">
        <div class="contact-content">
          <div class="contact-info">
            <h3>Let's work together!</h3>
            <p>Ready to bring your ideas to life? Get in touch!</p>
            
            <div class="contact-methods">
              <div class="contact-method">
                <span class="contact-icon">📧</span>
                <div class="contact-details">
                  <h4>Email</h4>
                  <a href="mailto:rodriguezalanm731@gmail.com" class="contact-link">
                    rodriguezalanm731@gmail.com
                  </a>
                </div>
              </div>
              
              <div class="contact-method">
                <span class="contact-icon">📱</span>
                <div class="contact-details">
                  <h4>WhatsApp</h4>
                  <a 
                    href="https://wa.me/542645263370?text=Hola%20Alan%2C%20me%20gustaría%20hablar%20sobre%20un%20proyecto%20contigo" 
                    target="_blank" 
                    class="contact-link"
                  >
                    +54 2645 263370
                  </a>
                </div>
              </div>
            </div>
            
            <div class="contact-actions">
              <button 
                class="contact-btn email-btn"
                @click="showContactForm = true"
              >
                📧 Send Message
              </button>
              <button 
                class="contact-btn whatsapp-btn"
                @click="sendWhatsApp"
              >
                📱 WhatsApp Me
              </button>
            </div>
          </div>
          
          <div class="footer-info">
            <p>&copy; 2025 Alan Rodriguez - Full Stack Developer</p>
          </div>
        </div>
      </div>
    </footer>

    <!-- Modal del formulario de contacto -->
    <ContactForm 
      v-if="showContactForm"
      @close="showContactForm = false"
      :recipientEmail="contactInfo.email"
    />
  </div>
</template>
<script>
import ContactForm from './components/ContactForm.vue'

export default {
  name: 'App',
  components: {
    ContactForm
  },
  data() {
    return {
      isMenuOpen: false,
      
      // Servicios mejorados
      services: [
        {
          id: 'fullstack-dev',
          icon: '🚀',
          title: 'Full Stack Development',
          description: 'End-to-end web application development from concept to deployment. I build scalable, secure, and performant applications using modern technologies.',
          features: [
            'Complete web application development',
            'API design and integration',
            'Database architecture and optimization',
            'Cloud deployment and DevOps',
            'Performance optimization',
            'Security implementation'
          ],
          technologies: ['React', 'Vue.js', 'Node.js', 'PHP', 'Python', 'MongoDB', 'MySQL']
        },
        {
          id: 'frontend-dev',
          icon: '🎨',
          title: 'Frontend Development',
          description: 'Creating stunning, responsive, and interactive user interfaces that provide exceptional user experiences across all devices.',
          features: [
            'Responsive web design',
            'Single Page Applications (SPA)',
            'Component-based architecture',
            'State management',
            'Cross-browser compatibility',
            'Performance optimization'
          ],
          technologies: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vue.js']
        },
        {
          id: 'backend-dev',
          icon: '⚙️',
          title: 'Backend Development',
          description: 'Building robust server-side applications with RESTful APIs, database management, and scalable architecture patterns.',
          features: [
            'RESTful API development',
            'Database design and optimization',
            'Authentication and authorization',
            'Server configuration',
            'Data processing and analytics',
            'Third-party integrations'
          ],
          technologies: ['Node.js', 'PHP', 'Python', 'FastAPI', 'CodeIgniter', 'MongoDB', 'MySQL']
        },
        {
          id: 'desktop-dev',
          icon: '💻',
          title: 'Desktop Applications',
          description: 'Developing cross-platform desktop applications with modern web technologies, delivering native-like performance.',
          features: [
            'Cross-platform compatibility',
            'Native OS integration',
            'Offline functionality',
            'Auto-updates',
            'System tray integration',
            'File system access'
          ],
          technologies: ['Electron', 'HTML5', 'CSS3', 'JavaScript', 'Node.js']
        },
        {
          id: 'consulting',
          icon: '🎯',
          title: 'Technical Consulting',
          description: 'Providing expert guidance on technology stack selection, architecture design, and development best practices.',
          features: [
            'Technology stack assessment',
            'Code review and optimization',
            'Architecture planning',
            'Performance audits',
            'Security assessments',
            'Team mentoring'
          ],
          technologies: ['Full Stack', 'DevOps', 'Git', 'Best Practices']
        },
        {
          id: 'maintenance',
          icon: '🔧',
          title: 'Maintenance & Support',
          description: 'Ongoing maintenance, updates, and technical support to keep your applications running smoothly and securely.',
          features: [
            'Bug fixes and troubleshooting',
            'Security updates',
            'Performance monitoring',
            'Feature enhancements',
            'Database maintenance',
            '24/7 technical support'
          ],
          technologies: ['Git', 'Monitoring Tools', 'Security Tools', 'Database Tools']
        }
      ],
      
      // Experiencia mejorada
      experience: [
        {
          id: 'exp-1',
          period: '2023 - Present',
          position: 'Full Stack Developer',
          company: 'Freelance & Contract Work',
          description: 'Developing complete web applications using modern technologies. Specializing in React, Vue.js, Node.js, and PHP backends with database integration and API development.',
          skills: ['React', 'Vue.js', 'Node.js', 'PHP', 'Python', 'MongoDB', 'MySQL', 'Git']
        },
        {
          id: 'exp-2',
          period: '2022 - 2023',
          position: 'Frontend Developer',
          company: 'Various Projects',
          description: 'Created responsive web applications with modern frameworks. Focused on user experience, performance optimization, and cross-browser compatibility.',
          skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vue.js', 'Git']
        },
        {
          id: 'exp-3',
          period: '2021 - 2022',
          position: 'Web Developer',
          company: 'Learning & Development',
          description: 'Started my professional journey learning web development fundamentals and building my first commercial projects.',
          skills: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL', 'Git']
        }
      ],
      
      // Educación mejorada
      education: [
        {
          id: 'edu-1',
          period: '2021 - Present',
          degree: 'Self-taught Full Stack Development',
          institution: 'Online Courses & Documentation',
          description: 'Comprehensive self-directed learning through official documentation, online courses, and practical projects covering frontend, backend, and database technologies.'
        },
        {
          id: 'edu-2',
          period: '2022',
          degree: 'JavaScript & Modern Web Development',
          institution: 'freeCodeCamp & MDN',
          description: 'Mastered modern JavaScript (ES6+), asynchronous programming, and web APIs through extensive practice and projects.'
        },
        {
          id: 'edu-3',
          period: '2023',
          degree: 'React & Vue.js Frameworks',
          institution: 'Official Documentation & Tutorials',
          description: 'Advanced concepts in React and Vue.js including state management, component architecture, and performance optimization.'
        },
        {
          id: 'edu-4',
          period: '2023',
          degree: 'Backend Development & APIs',
          institution: 'Node.js, PHP & Python Documentation',
          description: 'Server-side development, RESTful API design, database management, and deployment strategies.'
        }
      ],
      
      // Habilidades mejoradas con todas las tecnologías
      skills: [
        {
          name: 'Frontend Technologies',
          items: [
            { name: 'HTML5', level: 95 },
            { name: 'CSS3', level: 90 },
            { name: 'JavaScript', level: 88 },
            { name: 'React', level: 85 },
            { name: 'Vue.js', level: 82 }
          ]
        },
        {
          name: 'Backend Technologies',
          items: [
            { name: 'Node.js', level: 80 },
            { name: 'PHP', level: 85 },
            { name: 'Python', level: 75 },
            { name: 'FastAPI', level: 70 },
            { name: 'CodeIgniter', level: 80 }
          ]
        },
        {
          name: 'Databases',
          items: [
            { name: 'MySQL', level: 85 },
            { name: 'MongoDB', level: 78 }
          ]
        },
        {
          name: 'Tools & Others',
          items: [
            { name: 'Git', level: 90 },
            { name: 'Electron', level: 75 },
            { name: 'Responsive Design', level: 95 },
            { name: 'API Development', level: 85 }
          ]
        }
      ],
      
      // Proyectos con tu reloj mundial agregado
      projects: [
        {
          id: 'portfolio-terminal',
          title: 'Portfolio Estilo Terminal',
          description: 'Un portfolio interactivo con interfaz de terminal. Incluye comandos personalizados, animaciones de typing y tema dark.',
          tech: ['HTML5', 'CSS3', 'JavaScript', 'Terminal UI'],
          image: '/images/Portafolio-terminal.PNG',
          path: '/projects/portfolio-terminal/index.html',
          category: 'Frontend',
          featured: true
        },
        {
          id: 'reloj-mundial',
          title: 'Reloj Mundial',
          description: 'Aplicación web que muestra la hora actual de múltiples países y ciudades del mundo. Interfaz intuitiva con diferentes zonas horarias actualizadas en tiempo real.',
          tech: ['HTML5', 'CSS3', 'JavaScript', 'Date API', 'Responsive Design'],
          image: '/images/reloj-mundial.PNG',
          path: 'https://reloj-mundial-app.vercel.app/',
          category: 'Frontend',
          featured: true
        },
        {
          id: 'calculadora',
          title: 'Calculadora Avanzada',
          description: 'Calculadora web con funciones básicas y avanzadas. Interfaz intuitiva y diseño responsive.',
          tech: ['HTML5', 'CSS3', 'JavaScript'],
          image: '/images/calculadora.PNG',
          path: '/projects/calculadora/index.html',
          category: 'Frontend',
          featured: true
        },
        {
          id: 'weather-app',
          title: 'Weather App React',
          description: 'Aplicación del clima desarrollada en React con API integration. Muestra pronósticos en tiempo real y ubicación actual.',
          tech: ['React', 'JavaScript', 'CSS3', 'Weather API'],
          image: '/images/weather-app.PNG',
          path: '/projects/react_weather_app-main/build/index.html',
          category: 'React',
          featured: true
        },
        {
          id: 'todo-list',
          title: 'Todo List Application',
          description: 'Lista de tareas interactiva con funciones de agregar, editar y eliminar. Almacenamiento local persistente.',
          tech: ['HTML5', 'CSS3', 'JavaScript', 'Local Storage'],
          image: '/images/todo-list.PNG',
          path: '/projects/todo-list/index.html',
          category: 'Frontend',
          featured: true
        },
        {
          id: 'ecommerce',
          title: 'E-Commerce Platform',
          description: 'Plataforma de comercio electrónico completa con carrito de compras, sistema de pagos y panel de administración.',
          tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          image: '/images/ecommerce.PNG',
          path: '/projects/ecommerce/index.html',
          category: 'Full Stack',
          featured: false
        }
      ],
      
      // Datos de contacto
      contactInfo: {
        email: 'rodriguezalanm731@gmail.com',
        phone: '+542645263370',
        whatsappMessage: 'Hola Alan, me gustaría hablar sobre un proyecto contigo'
      },
      showContactForm: false
    }
  },
  methods: {
    // Método para obtener iconos de tecnologías
    getTechIcon(tech) {
      const icons = {
        'HTML5': '🌐',
        'CSS3': '🎨',
        'JavaScript': '⚡',
        'Vue.js': '💚',
        'React': '⚛️',
        'Electron': '🖥️',
        'CodeIgniter': '🔥',
        'PHP': '🐘',
        'Python': '🐍',
        'FastAPI': '🚀',
        'Git': '📦',
        'MongoDB': '🍃',
        'MySQL': '🐬',
        'Node.js': '🟢',
        'API Development': '🔗',
        'Responsive Design': '📱',
        'Terminal UI': '💻',
        'Weather API': '🌤️',
        'Local Storage': '💾',
        'Stripe': '💳',
        'Full Stack': '🎯',
        'DevOps': '⚙️',
        'Best Practices': '✅',
        'Monitoring Tools': '📊',
        'Security Tools': '🔒',
        'Database Tools': '🗃️',
        'Date API': '🕐'
      };
      return icons[tech] || '🔧';
    },
    
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    closeMenu() {
      this.isMenuOpen = false
    },
    openProject(project) {
      // Trackear cuando alguien ve un proyecto
      if (typeof gtag !== 'undefined') {
        gtag('event', 'project_view', {
          event_category: 'engagement',
          event_label: project.title,
          value: 1
        });
      }
      window.open(project.path, '_blank');
    },
    getFeaturedProjects() {
      return this.projects.filter(project => project.featured);
    },
    handleImageError(event) {
      event.target.src = '/images/placeholder.jpg';
    },
    showAllProjects() {
      console.log('Mostrar todos los proyectos');
    },
    scrollToContact() {
      // Trackear cuando alguien va a contacto
      if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_interest', {
          event_category: 'engagement',
          event_label: 'scroll_to_contact',
          value: 1
        });
      }
      document.getElementById('contact').scrollIntoView({ 
        behavior: 'smooth' 
      });
      this.closeMenu();
    },
    sendEmail() {
      window.open(`mailto:${this.contactInfo.email}`);
    },
    sendWhatsApp() {
      // Trackear cuando alguien hace clic en WhatsApp
      if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
          event_category: 'conversion',
          event_label: 'contact_attempt',
          value: 1
        });
      }
      const message = encodeURIComponent(this.contactInfo.whatsappMessage);
      window.open(`https://wa.me/${this.contactInfo.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
    },
    
    // Inicializar Google Analytics
    initGoogleAnalytics() {
      // Crear el script de Google Analytics
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-K1LXZEXCEQ';
      document.head.appendChild(script1);
      
      // Configurar Google Analytics
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-K1LXZEXCEQ');
      
      // Hacer gtag disponible globalmente
      window.gtag = gtag;
    }
  },
  mounted() {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header')) {
        this.isMenuOpen = false
      }
    });
    
    // Inicializar Google Analytics cuando el componente se monta
    this.initGoogleAnalytics();
  }
}
</script>


<style src="@/assets/css/main.css"></style>