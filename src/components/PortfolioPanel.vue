<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { projectData } from "../data/projectData";
import { experienceData } from "../data/experienceData";
import { serviceData } from "../data/servicesData";
import certifications from "../data/certificationsData";
import { hackathonData } from "../data/hackathonData";
import { toolIcons } from "../data/toolsData";
import portrait from "../assets/me.webp";
import cv from "../assets/drin.dlr_CV.pdf";
import PngIcon from "./PngIcon.vue";
const props = defineProps<{ section: string; projectSlug: string | null }>();
defineEmits<{ project: [slug: string | null] }>();
const project = computed(() => projectData.find((item) => item.slug === props.projectSlug));
const experience = [...experienceData].reverse();
const selectedExperience = ref(0);
const activeExperience = computed(() => experience[selectedExperience.value]);
const education = [
  { date: "2023", title: "CS50x: Computer Science", org: "Harvard University’s introductory computer science course." },
  { date: "2014–2019", title: "BS Electronics Engineering", org: "Samar State University" },
  { date: "2010–2014", title: "Secondary Education", org: "Samar National School" },
];
interface Achievement {
  id: string;
  tier: "gold" | "silver" | "bronze";
  category: string;
  title: string;
  meta: string;
  date: string;
  description?: string;
  logo?: string;
}
const achievements = computed<Achievement[]>(() => [
  ...education.map(
    (item, index): Achievement => ({
      id: `edu-${index}`,
      tier: "gold",
      category: "Education",
      title: item.title,
      meta: item.org,
      date: item.date,
    }),
  ),
  ...certifications.map(
    (item, index): Achievement => ({
      id: `cert-${index}`,
      tier: "silver",
      category: "Certification",
      title: item.title,
      meta: item.organization,
      date: item.date,
      description: item.description,
      logo: item.imgSrc,
    }),
  ),
  ...hackathonData.map(
    (item, index): Achievement => ({
      id: `event-${index}`,
      tier: "bronze",
      category: "Competition",
      title: item.title,
      meta: item.location,
      date: item.date,
      description: item.description,
      logo: item.logo,
    }),
  ),
]);

const query = ref("");
const category = ref("");
const page = ref(0);
const selectedTool = ref("");
const selectedAchievement = ref("");
const collection = computed(() => props.section === "skills" ? toolIcons.map(item => ({ ...item, id: item.name, title: item.name }))
  : props.section === "achievements" ? achievements.value
  : projectData.map(item => ({ ...item, category: item.tech[0] || "Other" })));
const categories = computed(() => [...new Set(collection.value.map(item => item.category))]);
const filtered = computed(() => collection.value.filter(item =>
  (!category.value || item.category === category.value) &&
  JSON.stringify(Object.fromEntries(Object.entries(item).filter(([key]) => ["title", "description", "category", "tech", "meta", "date", "desc"].includes(key)))).toLowerCase().includes(query.value.trim().toLowerCase())));
const pageSize = computed(() => props.section === "achievements" ? 3 : 6);
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)));
const pageItems = computed(() => filtered.value.slice(page.value * pageSize.value, (page.value + 1) * pageSize.value));
const pagedTools = computed(() => toolIcons.filter(item => pageItems.value.some(row => row.id === item.name)));
const pagedAchievements = computed(() => achievements.value.filter(item => pageItems.value.some(row => row.id === item.id)));
const pagedProjects = computed(() => projectData.filter(item => pageItems.value.some(row => row.id === item.id)));
const activeTool = computed(() => pagedTools.value.find(item => item.name === selectedTool.value) || pagedTools.value[0]);
const activeAchievement = computed(() => pagedAchievements.value.find(item => item.id === selectedAchievement.value) || pagedAchievements.value[0]);
const isCollection = computed(() => ["skills", "projects", "achievements"].includes(props.section) && !project.value);
watch([query, category], () => { page.value = 0; });
watch(() => props.section, () => { query.value = ""; category.value = ""; page.value = 0; });
watch(totalPages, count => { page.value = Math.min(page.value, count - 1); });
const sender = ref("");
const message = ref("");
const mailto = computed(() => `mailto:aldrinjay.delosreyes17@gmail.com?subject=${encodeURIComponent("Hello from your portfolio")}&body=${encodeURIComponent(`${message.value}\n\n${sender.value}`)}`);
</script>
<template>
  <div class="portfolio-content" :class="`section-${section}`">
    <div v-if="isCollection" class="collection-toolbar png-frame">
      <label class="collection-search">Search {{ section === 'skills' ? 'tools' : section }}
        <input v-model="query" type="search" :placeholder="section === 'skills' ? 'Find a tool…' : 'Search the collection…'" />
      </label>
      <label>Filter
        <select v-model="category"><option value="">All categories</option><option v-for="item in categories" :key="item">{{ item }}</option></select>
      </label>
      <span class="collection-count" role="status">{{ filtered.length }} {{ filtered.length === 1 ? 'item' : 'items' }}</span>
    </div>
    <section v-if="section === 'about'" class="art-panel poster">
      <h2 id="panel-heading" tabindex="-1" class="art-region poster-title">Meet Aldrin</h2>
      <div class="art-region poster-photo"><img :src="portrait" alt="Aldrin Jay B. Delos Reyes" /></div>
      <div class="art-region poster-body">
        <h3>Aldrin Jay B.<br />Delos Reyes</h3>
        <p>Software developer, electronics engineer, and curious tinkerer.</p>
        <p>At the end of 2022, I shifted my focus to software development. I’m a self-taught developer with a background in Electronics Engineering.</p>
        <p>I enjoy prototyping, tinkering, and competing in local and regional product and research competitions.</p>
      </div>
      <a class="art-region poster-link" :href="cv" download="Aldrin_Delos_Reyes_CV.pdf">Download my CV ↗</a>
    </section>
    <section v-else-if="section === 'skills'">
      <div class="art-panel inventory">
        <h2 id="panel-heading" tabindex="-1" class="art-region inventory-title">Tools of the trade</h2>
        <button v-for="(tool, index) in pagedTools" :key="tool.name" type="button" class="art-region inventory-slot"
          :class="`inventory-slot-${index}`" :aria-pressed="activeTool?.name === tool.name" @click="selectedTool = tool.name">
          <span class="inventory-slot-art"><PngIcon :name="tool.spriteKey" :mark="tool.mark" /></span>
          <span class="inventory-slot-label">{{ tool.name }}</span>
        </button>
        <aside v-if="activeTool" class="art-region inventory-detail paper-content" aria-live="polite">
          <PngIcon :name="activeTool.spriteKey" :mark="activeTool.mark" />
          <small>{{ activeTool.category }}</small><h3>{{ activeTool.name }}</h3><p>{{ activeTool.description }}</p>
        </aside>
        <p v-else class="art-region inventory-detail paper-content">No tools found. Try another search or category.</p>
        <p class="art-region inventory-note">Select a tool to inspect</p>
      </div>
    </section>
    <section v-else-if="section === 'experience'" class="art-panel journal">
      <h2 id="panel-heading" tabindex="-1" class="art-region journal-title">Experience</h2>
      <div class="art-region journal-entries">
        <button v-for="(item, index) in experience" :key="`${item.title}-${item.company}`" class="journal-entry" type="button"
          :aria-pressed="index === selectedExperience" @click="selectedExperience = index">
          <small>{{ item.duration }}</small><strong>{{ item.title }}</strong><span>{{ item.company }}</span>
        </button>
      </div>
      <article v-if="activeExperience" class="art-region journal-detail paper-content" aria-live="polite">
        <small>{{ activeExperience.duration }}</small><h3>{{ activeExperience.title }}</h3><strong>{{ activeExperience.company }}</strong><p>{{ activeExperience.description }}</p>
      </article>
      <button type="button" class="art-region journal-prev" :disabled="selectedExperience === 0" @click="selectedExperience--" aria-label="Previous role"><span class="sr-only">Previous role</span></button>
      <button type="button" class="art-region journal-next" :disabled="selectedExperience >= experience.length - 1" @click="selectedExperience++" aria-label="Next role"><span class="sr-only">Next role</span></button>
    </section>
    <section v-else-if="section === 'achievements'" class="art-panel achievement-board">
      <h2 id="panel-heading" tabindex="-1" class="art-region achievement-title">Milestones collected</h2>
      <button v-for="(item, index) in pagedAchievements" :key="item.id" type="button" class="art-region achievement-pick"
        :class="`achievement-pick-${index}`" :aria-pressed="activeAchievement?.id === item.id" @click="selectedAchievement = item.id">
        <span class="medal-icon" :class="`medal-icon--${item.tier}`" aria-hidden="true" />
        <strong>{{ item.title }}</strong>
      </button>
      <div class="art-region achievement-caption"><small>Every step counts.</small><span>{{ filtered.length }} milestones</span></div>
      <div class="art-region achievement-page"><small>Collection</small><span>{{ page + 1 }} / {{ totalPages }}</span></div>
      <aside v-if="activeAchievement" class="art-region achievement-detail paper-content" aria-live="polite">
        <small>{{ activeAchievement.category }} · {{ activeAchievement.date }}</small><h3>{{ activeAchievement.title }}</h3><strong>{{ activeAchievement.meta }}</strong>
        <p v-if="activeAchievement.description">{{ activeAchievement.description }}</p>
        <img v-if="activeAchievement.logo" :src="activeAchievement.logo" :alt="activeAchievement.meta" class="achievement-logo" />
      </aside>
      <p v-else class="art-region achievement-detail paper-content">No milestones found. Try another search or category.</p>
    </section>
    <section v-else-if="section === 'projects'" class="project-collection png-frame">
    <template v-if="projectSlug && project"
      ><button class="text-button" @click="$emit('project', null)">
        ← All projects
      </button>
      <h2 id="panel-heading" tabindex="-1">{{ project.title }}</h2>
      <div class="project-meta">
        <span>{{ project.status }}</span
        ><span>{{ project.role }}</span
        ><span>{{ project.duration }}</span>
      </div>
      <div class="arcade-screen">
        <img
          class="project-image"
          :src="project.img"
          :alt="`${project.title} screenshot`"
        />
      </div>
      <p>{{ project.fullDescription }}</p>
      <p class="skills">{{ project.tech.join(" · ") }}</p>
      <template
        v-for="(items, title) in {
          Features: project.features,
          Challenges: project.challenges,
          Outcomes: project.outcomes,
        }"
        :key="title"
        ><template v-if="items?.length"
          ><h3>{{ title }}</h3>
          <ul>
            <li v-for="item in items" :key="item">{{ item }}</li>
          </ul></template
        ></template
      >
      <div class="links">
        <a
          v-if="project.visitLink && project.visitLink !== '#'"
          class="primary"
          :href="project.visitLink"
          target="_blank"
          rel="noreferrer"
          >Visit project ↗</a
        ><a
          v-if="project.githubLink && project.githubLink !== '#'"
          :href="project.githubLink"
          target="_blank"
          rel="noreferrer"
          >Source code ↗</a
        >
      </div></template
    >

      <template v-else>
        <h2 id="panel-heading" tabindex="-1">Project collection</h2>
        <p v-if="projectSlug">That project could not be found. Explore another project below.</p>
        <div class="project-grid">
          <button v-for="item in pagedProjects" :key="item.slug" class="project-card png-frame" @click="$emit('project', item.slug)">
            <img :src="item.img" alt="" loading="lazy" /><span><strong>{{ item.title }}</strong><small>{{ item.tech.join(' · ') }}</small><span>{{ item.desc }}</span></span>
          </button>
          <p v-if="!pagedProjects.length">No projects found. Try another search or category.</p>
        </div>
      </template>
    </section>
    <section v-else class="art-panel contact-desk">
      <div class="art-region contact-letter paper-content">
        <h2 id="panel-heading" tabindex="-1">Leave a message</h2>
        <p>Have an idea for software, an interface, or connected hardware? I’d love to hear about it.</p>
        <label>Your name<input v-model="sender" autocomplete="name" maxlength="120" /></label>
        <label>Your message<textarea v-model="message" rows="3" maxlength="4000" placeholder="Tell me what you’re thinking…" /></label>
        <a :href="mailto" class="letter-action">Open email draft ↗</a><small>Continue in your email app.</small>
      </div>
      <div class="art-region contact-address"><strong>To Aldrin</strong><a href="mailto:aldrinjay.delosreyes17@gmail.com">aldrinjay.delosreyes17@gmail.com</a></div>
    </section>
    <div v-if="isCollection" class="collection-pagination png-frame">
      <button :disabled="page === 0" @click="page--" aria-label="Previous page">← Previous</button><span role="status">Page {{ page + 1 }} of {{ totalPages }}</span><button :disabled="page >= totalPages - 1" @click="page++" aria-label="Next page">Next →</button>
    </div>
      <details v-if="section === 'skills'" class="services png-frame"><summary>What I can help you build</summary>
        <div class="service-grid"><article v-for="item in serviceData" :key="item.title"><h3>{{ item.title }}</h3><p>{{ item.desc }}</p></article></div>
      </details>
    <nav v-if="section === 'contact'" class="contact-links png-frame" aria-label="Find Aldrin online">
      <a href="https://github.com/Aldrin4197" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/aldrin-jay-delos-reyes-559817267/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://www.facebook.com/drindlr" target="_blank" rel="noreferrer">Facebook ↗</a>
    </nav>
  </div>
</template>
