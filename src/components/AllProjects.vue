<!-- src/components/AllProjects.vue -->
<template>
  <div class="all-projects-modal" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>All Projects</h2>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>
      
      <!-- Filtros -->
      <div class="project-filters">
        <button 
          v-for="category in categories" 
          :key="category"
          class="filter-btn"
          :class="{ active: activeFilter === category }"
          @click="activeFilter = category"
        >
          {{ category }}
        </button>
      </div>
      
      <!-- Grid de proyectos -->
      <div class="projects-grid">
        <div 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="project-card"
          @click="openProject(project)"
        >
          <div class="project-image">
            <img 
              :src="project.image" 
              :alt="project.title"
              @error="handleImageError"
            />
            <div class="project-overlay">
              <div class="project-links">
                <button class="project-btn view-btn" @click.stop="openProject(project)">
                  👁️ View
                </button>
                <button v-if="project.github" class="project-btn github-btn" @click.stop="openGithub(project)">
                  🐱 Code
                </button>
              </div>
            </div>
          </div>
          
          <div class="project-info">
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-description">{{ project.description }}</p>
            
            <div class="project-tech">
              <span v-for="tech in project.tech.slice(0, 3)" :key="tech" class="tech-tag">
                <span class="tech-icon" v-html="getTechIcon(tech)"></span>
                {{ tech }}
              </span>
              <span v-if="project.tech.length > 3" class="tech-more">
                +{{ project.tech.length - 3 }} more
              </span>
            </div>
            
            <div class="project-category">
              <span class="category-tag">{{ project.category }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Estadísticas -->
      <div class="projects-stats">
        <div class="stat">
          <span class="stat-number">{{ allProjects.length }}</span>
          <span class="stat-label">Total Projects</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ categories.length - 1 }}</span>
          <span class="stat-label">Categories</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ uniqueTechnologies.length }}</span>
          <span class="stat-label">Technologies</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AllProjects',
  props: {
    projects: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeFilter: 'All',
      // Proyectos adicionales que no están en featured
      additionalProjects: [
        {
          id: 'blog-platform',
          title: 'Blog Platform',
          description: 'Plataforma de blog completa con sistema de comentarios, categorías y panel de administración.',
          tech: ['Vue.js', 'Node.js', 'MongoDB', 'Express'],
          image: '/images/blog-platform.PNG',
          path: '/projects/blog/index.html',
          category: 'Full Stack',
          github: 'https://github.com/Alan12s/blog-platform',
          featured: false
        },
        {
          id: 'task-manager',
          title: 'Task Manager Pro',
          description: 'Aplicación de gestión de tareas con equipos, proyectos y seguimiento de tiempo.',
          tech: ['React', 'Node.js', 'PostgreSQL', 'Socket.io'],
          image: '/images/task-manager.PNG',
          path: '/projects/task-manager/index.html',
          category: 'Full Stack',
          github: 'https://github.com/Alan12s/task-manager',
          featured: false
        },
        {
          id: 'landing-page',
          title: 'Business Landing Page',
          description: 'Landing page moderna para empresa de tecnología con animaciones y diseño responsive.',
          tech: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
          image: '/images/landing-business.PNG',
          path: '/projects/landing/index.html',
          category: 'Frontend',
          github: 'https://github.com/Alan12s/business-landing',
          featured: false
        },
        {
          id: 'inventory-system',
          title: 'Inventory Management',
          description: 'Sistema de gestión de inventario con códigos de barras, reportes y alertas de stock.',
          tech: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap'],
          image: '/images/inventory-system.PNG',
          path: '/projects/inventory/index.html',
          category: 'Backend',
          github: 'https://github.com/Alan12s/inventory-system',
          featured: false
        },
        {
          id: 'chat-app',
          title: 'Real-time Chat App',
          description: 'Aplicación de chat en tiempo real con salas, mensajes privados y notificaciones.',
          tech: ['Node.js', 'Socket.io', 'React', 'MongoDB'],
          image: '/images/chat-app.PNG',
          path: '/projects/chat/index.html',
          category: 'Full Stack',
          github: 'https://github.com/Alan12s/chat-app',
          featured: false
        },
        {
          id: 'expense-tracker',
          title: 'Expense Tracker',
          description: 'Aplicación para seguimiento de gastos personales con gráficos y categorías.',
          tech: ['Vue.js', 'Chart.js', 'Local Storage'],
          image: '/images/expense-tracker.PNG',
          path: '/projects/expenses/index.html',
          category: 'Frontend',
          github: 'https://github.com/Alan12s/expense-tracker',
          featured: false
        },
        {
          id: 'api-dashboard',
          title: 'API Analytics Dashboard',
          description: 'Dashboard para monitoreo de APIs con métricas en tiempo real y alertas.',
          tech: ['React', 'D3.js', 'Node.js', 'Redis'],
          image: '/images/api-dashboard.PNG',
          path: '/projects/api-dashboard/index.html',
          category: 'Full Stack',
          github: 'https://github.com/Alan12s/api-dashboard',
          featured: false
        },
        {
          id: 'music-player',
          title: 'Music Player Web',
          description: 'Reproductor de música web con playlists, ecualizador y modo oscuro.',
          tech: ['JavaScript', 'Web Audio API', 'CSS3'],
          image: '/images/music-player.PNG',
          path: '/projects/music-player/index.html',
          category: 'Frontend',
          github: 'https://github.com/Alan12s/music-player',
          featured: false
        }
      ]
    }
  },
  computed: {
    allProjects() {
      return [...this.projects, ...this.additionalProjects];
    },
    categories() {
      const cats = ['All', ...new Set(this.allProjects.map(p => p.category))];
      return cats;
    },
    filteredProjects() {
      if (this.activeFilter === 'All') {
        return this.allProjects;
      }
      return this.allProjects.filter(project => project.category === this.activeFilter);
    },
    uniqueTechnologies() {
      const allTech = this.allProjects.flatMap(p => p.tech);
      return [...new Set(allTech)];
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    openProject(project) {
      // Trackear visualización de proyecto
      if (typeof gtag !== 'undefined') {
        gtag('event', 'project_view', {
          event_category: 'engagement',
          event_label: project.title,
          value: 1
        });
      }
      window.open(project.path, '_blank');
    },
    openGithub(project) {
      if (project.github) {
        window.open(project.github, '_blank');
      }
    },
    handleImageError(event) {
      event.target.src = '/images/placeholder.jpg';
    },
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
        'PostgreSQL': '🐘',
        'Socket.io': '🔌',
        'Express': '🚂',
        'GSAP': '🎬',
        'Bootstrap': '🅱️',
        'Chart.js': '📊',
        'D3.js': '📈',
        'Redis': '🔴',
        'Web Audio API': '🎵',
        'Local Storage': '💾'
      };
      return icons[tech] || '🔧';
    }
  }
}
</script>

<style scoped>
.all-projects-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
}

.modal-content {
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
  border-radius: 20px;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 30px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  background: rgba(30, 30, 46, 0.95);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.modal-header h2 {
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(90deg);
}

.project-filters {
  display: flex;
  gap: 10px;
  padding: 20px 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  padding: 10px 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: #ccc;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  padding: 0 30px 30px;
}

.project-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
}

.project-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.1);
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-links {
  display: flex;
  gap: 15px;
}

.project-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.github-btn {
  background: #333;
  color: white;
}

.project-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.project-info {
  padding: 20px;
}

.project-title {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.project-description {
  color: #ccc;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 15px 0;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.tech-tag {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.tech-more {
  background: rgba(255, 255, 255, 0.1);
  color: #ccc;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
}

.tech-icon {
  font-size: 0.8rem;
}

.project-category {
  display: flex;
  justify-content: flex-end;
}

.category-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.projects-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 20px;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 5px;
}

.stat-label {
  color: #ccc;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .all-projects-modal {
    padding: 10px;
  }
  
  .modal-header {
    padding: 20px 20px 15px;
  }
  
  .modal-header h2 {
    font-size: 1.5rem;
  }
  
  .project-filters {
    padding: 15px 20px;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
    padding: 0 20px 20px;
    gap: 20px;
  }
  
  .projects-stats {
    gap: 20px;
    padding: 20px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
}

/* Scrollbar personalizada */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}
</style>