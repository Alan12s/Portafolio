class TaskManager {
            constructor() {
                this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                this.currentFilter = 'all';
                this.currentCategory = 'all';
                this.editingTaskId = null;
                
                this.init();
            }

            init() {
                this.bindEvents();
                this.renderTasks();
                this.updateStats();
                this.updateCategoryCounts();
                
                // Auto-guardar cada 30 segundos
                setInterval(() => {
                    this.saveTasks();
                }, 30000);
            }

            bindEvents() {
                // Agregar tarea
                document.getElementById('addBtn').addEventListener('click', () => this.addTask());
                document.getElementById('taskInput').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addTask();
                });

                // Filtros
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        this.currentFilter = e.target.dataset.filter;
                        this.renderTasks();
                    });
                });

                // Categorías en sidebar
                document.querySelectorAll('.category-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
                        e.currentTarget.classList.add('active');
                        this.currentCategory = e.currentTarget.dataset.category;
                        this.renderTasks();
                    });
                });

                // Búsqueda
                document.getElementById('searchInput').addEventListener('input', (e) => {
                    this.searchTasks(e.target.value);
                });

                // Modal
                document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
                document.getElementById('saveEdit').addEventListener('click', () => this.saveEditTask());

                // Acciones rápidas
                document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());
                document.getElementById('exportTasks').addEventListener('click', () => this.exportTasks());
                document.getElementById('floatingAdd').addEventListener('click', () => {
                    document.getElementById('taskInput').focus();
                });

                // Cerrar modal al hacer click fuera
                document.getElementById('editModal').addEventListener('click', (e) => {
                    if (e.target.id === 'editModal') this.closeModal();
                });
            }

            generateId() {
                return Date.now().toString(36) + Math.random().toString(36).substr(2);
            }

            addTask() {
                const taskInput = document.getElementById('taskInput');
                const prioritySelect = document.getElementById('prioritySelect');
                const categorySelect = document.getElementById('categorySelect');
                const dueDate = document.getElementById('dueDate');

                const text = taskInput.value.trim();
                if (!text) {
                    this.showNotification('Por favor ingresa una tarea válida', 'error');
                    return;
                }

                const task = {
                    id: this.generateId(),
                    text: text,
                    completed: false,
                    priority: prioritySelect.value,
                    category: categorySelect.value,
                    dueDate: dueDate.value,
                    createdAt: new Date().toISOString(),
                    completedAt: null
                };

                this.tasks.unshift(task);
                this.saveTasks();
                this.renderTasks();
                this.updateStats();
                this.updateCategoryCounts();

                // Limpiar formulario
                taskInput.value = '';
                dueDate.value = '';
                prioritySelect.value = 'low';
                categorySelect.value = 'personal';

                this.showNotification('¡Tarea agregada exitosamente!', 'success');
            }

            deleteTask(id) {
                if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
                    this.tasks = this.tasks.filter(task => task.id !== id);
                    this.saveTasks();
                    this.renderTasks();
                    this.updateStats();
                    this.updateCategoryCounts();
                    this.showNotification('Tarea eliminada', 'success');
                }
            }

            toggleTask(id) {
                const task = this.tasks.find(task => task.id === id);
                if (task) {
                    task.completed = !task.completed;
                    task.completedAt = task.completed ? new Date().toISOString() : null;
                    this.saveTasks();
                    this.renderTasks();
                    this.updateStats();
                    this.updateCategoryCounts();
                    
                    const message = task.completed ? '¡Tarea completada! 🎉' : 'Tarea marcada como pendiente';
                    this.showNotification(message, 'success');
                }
            }

            editTask(id) {
                const task = this.tasks.find(task => task.id === id);
                if (task) {
                    this.editingTaskId = id;
                    document.getElementById('editTaskInput').value = task.text;
                    document.getElementById('editPrioritySelect').value = task.priority;
                    document.getElementById('editCategorySelect').value = task.category;
                    document.getElementById('editDueDate').value = task.dueDate;
                    this.openModal();
                }
            }

            saveEditTask() {
                const task = this.tasks.find(task => task.id === this.editingTaskId);
                if (task) {
                    const newText = document.getElementById('editTaskInput').value.trim();
                    if (!newText) {
                        this.showNotification('El texto de la tarea no puede estar vacío', 'error');
                        return;
                    }

                    task.text = newText;
                    task.priority = document.getElementById('editPrioritySelect').value;
                    task.category = document.getElementById('editCategorySelect').value;
                    task.dueDate = document.getElementById('editDueDate').value;

                    this.saveTasks();
                    this.renderTasks();
                    this.updateStats();
                    this.updateCategoryCounts();
                    this.closeModal();
                    this.showNotification('Tarea actualizada exitosamente', 'success');
                }
            }

            openModal() {
                document.getElementById('editModal').classList.add('active');
            }

            closeModal() {
                document.getElementById('editModal').classList.remove('active');
                this.editingTaskId = null;
            }

            filterTasks() {
                let filteredTasks = [...this.tasks];

                // Filtrar por categoría
                if (this.currentCategory !== 'all') {
                    filteredTasks = filteredTasks.filter(task => task.category === this.currentCategory);
                }

                // Filtrar por estado
                switch (this.currentFilter) {
                    case 'pending':
                        filteredTasks = filteredTasks.filter(task => !task.completed);
                        break;
                    case 'completed':
                        filteredTasks = filteredTasks.filter(task => task.completed);
                        break;
                    case 'high':
                        filteredTasks = filteredTasks.filter(task => task.priority === 'high');
                        break;
                    case 'today':
                        const today = new Date().toISOString().split('T')[0];
                        filteredTasks = filteredTasks.filter(task => task.dueDate === today);
                        break;
                }

                return filteredTasks;
            }

            searchTasks(query) {
                const todoList = document.getElementById('todoList');
                const tasks = todoList.querySelectorAll('.todo-item');
                
                tasks.forEach(taskElement => {
                    const text = taskElement.querySelector('.todo-text').textContent.toLowerCase();
                    const matches = text.includes(query.toLowerCase());
                    taskElement.style.display = matches ? 'block' : 'none';
                });
            }

            renderTasks() {
                const todoList = document.getElementById('todoList');
                const filteredTasks = this.filterTasks();

                if (filteredTasks.length === 0) {
                    todoList.innerHTML = `
                        <div style="text-align: center; padding: 2rem; opacity: 0.7;">
                            <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                            <p>No hay tareas para mostrar</p>
                            <p style="font-size: 0.9rem; margin-top: 0.5rem;">¡Agrega una nueva tarea para comenzar!</p>
                        </div>
                    `;
                    return;
                }

                todoList.innerHTML = filteredTasks.map(task => {
                    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                    const isOverdue = dueDate && dueDate < new Date() && !task.completed;
                    const isToday = dueDate && dueDate.toDateString() === new Date().toDateString();

                    return `
                        <div class="todo-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'pulse' : ''}" data-id="${task.id}">
                            <div class="todo-header">
                                <div style="display: flex; align-items: center; flex: 1;">
                                    <input type="checkbox" ${task.completed ? 'checked' : ''} 
                                           onchange="taskManager.toggleTask('${task.id}')"
                                           style="margin-right: 0.5rem; transform: scale(1.2);">
                                    <span class="todo-text">${task.text}</span>
                                </div>
                                <span class="todo-priority priority-${task.priority}">${this.getPriorityLabel(task.priority)}</span>
                            </div>
                            
                            <div class="todo-meta">
                                <span><i class="fas fa-folder"></i> ${this.getCategoryLabel(task.category)}</span>
                                ${task.dueDate ? `
                                    <span class="${isOverdue ? 'text-danger' : isToday ? 'text-warning' : ''}">
                                        <i class="fas fa-calendar"></i> ${this.formatDate(task.dueDate)}
                                        ${isOverdue ? ' (Vencida)' : isToday ? ' (Hoy)' : ''}
                                    </span>
                                ` : ''}
                                <span><i class="fas fa-clock"></i> ${this.getTimeAgo(task.createdAt)}</span>
                            </div>
                            
                            <div class="todo-actions">
                                <button class="action-btn complete-btn" onclick="taskManager.toggleTask('${task.id}')" 
                                        title="${task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}">
                                    <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                                </button>
                                <button class="action-btn edit-btn" onclick="taskManager.editTask('${task.id}')" title="Editar tarea">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn delete-btn" onclick="taskManager.deleteTask('${task.id}')" title="Eliminar tarea">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            updateStats() {
                const total = this.tasks.length;
                const completed = this.tasks.filter(task => task.completed).length;
                const pending = total - completed;
                const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

                document.getElementById('totalTasks').textContent = total;
                document.getElementById('completedTasks').textContent = completed;
                document.getElementById('pendingTasks').textContent = pending;
                document.getElementById('progressPercentage').textContent = `${progress}%`;

                // Actualizar barra de progreso
                document.getElementById('progressFill').style.width = `${progress}%`;
                document.getElementById('progressText').textContent = `${completed} de ${total} tareas completadas`;
            }

            updateCategoryCounts() {
                const categories = ['all', 'personal', 'trabajo', 'hogar', 'salud', 'estudios'];
                
                categories.forEach(category => {
                    const count = category === 'all' 
                        ? this.tasks.length 
                        : this.tasks.filter(task => task.category === category).length;
                    
                    const element = document.getElementById(`${category}Count`);
                    if (element) {
                        element.textContent = count;
                    }
                });
            }

            clearCompleted() {
                const completedCount = this.tasks.filter(task => task.completed).length;
                if (completedCount === 0) {
                    this.showNotification('No hay tareas completadas para eliminar', 'error');
                    return;
                }

                if (confirm(`¿Estás seguro de que quieres eliminar ${completedCount} tarea(s) completada(s)?`)) {
                    this.tasks = this.tasks.filter(task => !task.completed);
                    this.saveTasks();
                    this.renderTasks();
                    this.updateStats();
                    this.updateCategoryCounts();
                    this.showNotification(`${completedCount} tareas completadas eliminadas`, 'success');
                }
            }

            exportTasks() {
                const dataStr = JSON.stringify(this.tasks, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                
                const link = document.createElement('a');
                link.href = url;
                link.download = `tareas_${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                this.showNotification('Tareas exportadas exitosamente', 'success');
            }

            saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(this.tasks));
            }

            showNotification(message, type = 'success') {
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.innerHTML = `
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                    ${message}
                `;
                
                document.body.appendChild(notification);
                
                setTimeout(() => notification.classList.add('show'), 100);
                
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => document.body.removeChild(notification), 300);
                }, 3000);
            }

            getPriorityLabel(priority) {
                const labels = {
                    low: 'Baja',
                    medium: 'Media',
                    high: 'Alta'
                };
                return labels[priority] || priority;
            }

            getCategoryLabel(category) {
                const labels = {
                    personal: 'Personal',
                    trabajo: 'Trabajo',
                    hogar: 'Hogar',
                    salud: 'Salud',
                    estudios: 'Estudios'
                };
                return labels[category] || category;
            }

            formatDate(dateStr) {
                const date = new Date(dateStr);
                return date.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }

            getTimeAgo(dateStr) {
                const date = new Date(dateStr);
                const now = new Date();
                const diffTime = Math.abs(now - date);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) return 'Ayer';
                if (diffDays < 7) return `Hace ${diffDays} días`;
                if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
                return `Hace ${Math.ceil(diffDays / 30)} meses`;
            }
        }

        // Inicializar la aplicación
        const taskManager = new TaskManager();

        // Agregar algunos efectos visuales adicionales
        document.addEventListener('DOMContentLoaded', function() {
            // Efecto de partículas de fondo
            const createParticle = () => {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.width = '4px';
                particle.style.height = '4px';
                particle.style.background = 'rgba(255, 255, 255, 0.3)';
                particle.style.borderRadius = '50%';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '-1';
                particle.style.left = Math.random() * window.innerWidth + 'px';
                particle.style.top = window.innerHeight + 'px';
                
                document.body.appendChild(particle);
                
                const animation = particle.animate([
                    { transform: 'translateY(0px)', opacity: 0.3 },
                    { transform: `translateY(-${window.innerHeight + 100}px)`, opacity: 0 }
                ], {
                    duration: Math.random() * 3000 + 2000,
                    easing: 'linear'
                });
                
                animation.onfinish = () => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                };
            };

            // Crear partículas cada 500ms
            setInterval(createParticle, 500);

            // Efecto de escritura en el título
            const title = document.querySelector('.header h1');
            const titleText = title.textContent;
            title.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < titleText.length) {
                    title.textContent += titleText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            setTimeout(typeWriter, 500);

            // Añadir efecto de hover a las tarjetas de estadísticas
            document.querySelectorAll('.stat-card').forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-10px) scale(1.05)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });

            // Configurar fecha mínima para el input de fecha (hoy)
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('dueDate').setAttribute('min', today);
            document.getElementById('editDueDate').setAttribute('min', today);

            // Mensaje de bienvenida si no hay tareas
            if (taskManager.tasks.length === 0) {
                setTimeout(() => {
                    taskManager.showNotification('¡Bienvenido a TaskMaster Pro! Agrega tu primera tarea.', 'success');
                }, 1000);
            }
        });

        // Atajos de teclado
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + Enter para agregar tarea rápida
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                taskManager.addTask();
            }
            
            // Escape para cerrar modal
            if (e.key === 'Escape') {
                taskManager.closeModal();
            }
            
            // Ctrl/Cmd + F para enfocar búsqueda
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                document.getElementById('searchInput').focus();
            }
        });

        // Guardar automáticamente antes de cerrar la página
        window.addEventListener('beforeunload', function() {
            taskManager.saveTasks();
        });

        // Funcionalidad de arrastrar y soltar (drag & drop)
        let draggedElement = null;

        document.addEventListener('dragstart', function(e) {
            if (e.target.classList.contains('todo-item')) {
                draggedElement = e.target;
                e.target.style.opacity = '0.5';
            }
        });

        document.addEventListener('dragend', function(e) {
            if (e.target.classList.contains('todo-item')) {
                e.target.style.opacity = '';
                draggedElement = null;
            }
        });

        document.addEventListener('dragover', function(e) {
            e.preventDefault();
        });

        document.addEventListener('drop', function(e) {
            e.preventDefault();
            if (draggedElement && e.target.classList.contains('todo-item')) {
                const draggedId = draggedElement.dataset.id;
                const targetId = e.target.dataset.id;
                
                if (draggedId !== targetId) {
                    const draggedIndex = taskManager.tasks.findIndex(task => task.id === draggedId);
                    const targetIndex = taskManager.tasks.findIndex(task => task.id === targetId);
                    
                    // Intercambiar posiciones
                    [taskManager.tasks[draggedIndex], taskManager.tasks[targetIndex]] = 
                    [taskManager.tasks[targetIndex], taskManager.tasks[draggedIndex]];
                    
                    taskManager.saveTasks();
                    taskManager.renderTasks();
                    taskManager.showNotification('Orden de tareas actualizado', 'success');
                }
            }
        });