<template>
  <div class="home">
    <section class="hero">
      <h2>¡Hola! Soy Alan Rodriguez</h2>
      <p>Desarrollador Full Stak</p>
      <button class="cta-button">Ver mis proyectos</button>
    </section>
    
    <section class="skills">
      <h3>Mis Habilidades</h3>
      <div class="skills-grid">
        <div class="skill-card">
          <h4>HTML/CSS</h4>
          <p>Estructura y estilos web</p>
        </div>
        <div class="skill-card">
          <h4>JavaScript</h4>
          <p>Programación interactiva</p>
        </div>
        <div class="skill-card">
          <h4>Vue.js</h4>
          <p>Framework reactivo</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 3rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 2rem;
  border-radius: 10px;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta-button {
  background-color: #e74c3c;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.cta-button:hover {
  background-color: #c0392b;
}

.skills h3 {
  text-align: center;
  margin-bottom: 2rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.skill-card {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.skill-card h4 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}
</style>