<script setup lang="ts">
import { computed, ref } from "vue";
import { projectData } from "../data/projectData";
import { experienceData } from "../data/experienceData";
import { serviceData } from "../data/servicesData";
import certifications from "../data/certificationsData";
import { hackathonData } from "../data/hackathonData";
import { toolIcons } from "../data/toolsData";
import portrait from "../assets/me.webp";
import cv from "../assets/drin.dlr_CV.pdf";
import PixelIcon from "./PixelIcon.vue";
const props = defineProps<{ section: string; projectSlug: string | null }>();
defineEmits<{ project: [slug: string | null] }>();
const project = computed(() =>
  projectData.find((item) => item.slug === props.projectSlug),
);
const experience = [...experienceData].reverse();
const selectedExperience = ref(0);
const activeExperience = computed(() => experience[selectedExperience.value]);
const toolsPerPage = 6;
const toolPage = ref(0);
const toolPages = computed(() =>
  Math.max(1, Math.ceil(toolIcons.length / toolsPerPage)),
);
const pagedTools = computed(() =>
  toolIcons.slice(
    toolPage.value * toolsPerPage,
    toolPage.value * toolsPerPage + toolsPerPage,
  ),
);
const selectedTool = ref(toolIcons[0]?.name);
const activeTool = computed(
  () =>
    pagedTools.value.find((tool) => tool.name === selectedTool.value) ??
    pagedTools.value[0],
);
function turnToolPage(delta: number) {
  toolPage.value += delta;
  selectedTool.value = pagedTools.value[0]?.name;
}
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
const selectedAchievement = ref(0);
const activeAchievement = computed(
  () => achievements.value[selectedAchievement.value],
);
</script>
<template>
  <section v-if="section === 'about'">
    <div class="illustrated-wrap">
      <div class="poster illustrated-panel">
        <div class="illustrated-region poster-region--title">
          <h2 id="panel-heading" tabindex="-1">Hi, I’m Aldrin.</h2>
        </div>
        <div class="illustrated-region poster-region--portrait">
          <img :src="portrait" alt="Aldrin Jay B. Delos Reyes" />
        </div>
        <div class="illustrated-region poster-region--body">
          <p>Software developer, electronics engineer, and curious tinkerer.</p>
          <p>
            At the end of 2022, I shifted my focus to software development.
            I’m a self-taught developer with a background in Electronics
            Engineering.
          </p>
          <p>
            I enjoy prototyping, tinkering, and competing in local and
            regional product and research competitions.
          </p>
        </div>
        <div class="illustrated-region poster-region--footer">
          <a :href="cv" download="Aldrin_Delos_Reyes_CV.pdf">Download CV ↗</a>
        </div>
      </div>
    </div>
  </section>
  <section v-else-if="section === 'skills'">
    <div class="illustrated-wrap">
      <div class="tool-case illustrated-panel">
        <div class="illustrated-region tool-region--title">
          <h2 id="panel-heading" tabindex="-1">Tools of the trade.</h2>
        </div>
        <button
          type="button"
          class="illustrated-region tool-region--slot"
          :class="`tool-region--slot${i + 1}`"
          v-for="(tool, i) in pagedTools"
          :key="tool.name"
          :aria-pressed="tool.name === selectedTool"
          :aria-label="tool.name"
          @click="selectedTool = tool.name"
        >
          <span
            v-if="tool.spriteKey"
            class="tech-icon"
            :class="`tech-icon--${tool.spriteKey}`"
            role="img"
            :aria-label="tool.name"
          ></span>
          <PixelIcon
            v-else
            :rows="tool.rows"
            :colors="tool.colors"
            :label="tool.name"
            :size="2"
          />
        </button>
        <aside class="illustrated-region tool-region--details" v-if="activeTool">
          <span
            v-if="activeTool.spriteKey"
            class="tech-icon"
            :class="`tech-icon--${activeTool.spriteKey}`"
            role="img"
            :aria-label="activeTool.name"
          ></span>
          <PixelIcon
            v-else
            :rows="activeTool.rows"
            :colors="activeTool.colors"
            :label="activeTool.name"
            :size="4"
          />
          <strong>{{ activeTool.name }}</strong>
        </aside>
        <div class="illustrated-region tool-region--footer">
          Page {{ toolPage + 1 }} of {{ toolPages }}
        </div>
        <button
          type="button"
          class="illustrated-region tool-region--prev"
          :disabled="toolPage === 0"
          @click="turnToolPage(-1)"
          aria-label="Previous tools"
        >
          ‹
        </button>
        <button
          type="button"
          class="illustrated-region tool-region--next"
          :disabled="toolPage === toolPages - 1"
          @click="turnToolPage(1)"
          aria-label="Next tools"
        >
          ›
        </button>
      </div>
    </div>
    <p class="section-hint">Equip the gear I reach for most often.</p>
    <h3>What I can help you build</h3>
    <div class="noticeboard">
      <article class="notice-card" v-for="item in serviceData" :key="item.title">
        <h3>{{ item.title }}</h3>
        <p>{{ item.desc }}</p>
      </article>
    </div>
  </section>
  <section v-else-if="section === 'projects'">
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
    <template v-else
      ><h2 id="panel-heading" tabindex="-1">Pick your next quest.</h2>
      <p v-if="projectSlug">
        That project could not be found. Explore another project below.
      </p>
      <p v-else>Software, interfaces, and connected hardware.</p>
      <div class="projects">
        <button
          class="cartridge"
          v-for="item in projectData"
          :key="item.slug"
          @click="$emit('project', item.slug)"
        >
          <img :src="item.img" alt="" loading="lazy" /><span
            ><strong>{{ item.title }}</strong
            ><span>{{ item.desc }}</span
            ><small>{{ item.tech.join(" · ") }} ↗</small></span
          >
        </button>
      </div></template
    >
  </section>
  <section v-else-if="section === 'experience'">
    <div class="illustrated-wrap">
      <div class="journal illustrated-panel">
        <div class="illustrated-region journal-region--title">
          <h2 id="panel-heading" tabindex="-1">The journey so far.</h2>
        </div>
        <div class="illustrated-region journal-region--entries">
          <button
            type="button"
            class="journal-entry"
            v-for="(item, index) in experience"
            :key="item.title"
            :aria-pressed="index === selectedExperience"
            @click="selectedExperience = index"
          >
            <small>{{ item.duration }}</small>
            <strong>{{ item.title }}</strong>
            <span>{{ item.company }}</span>
          </button>
        </div>
        <article
          class="illustrated-region journal-region--details"
          v-if="activeExperience"
        >
          <small>{{ activeExperience.duration }}</small>
          <h3>{{ activeExperience.title }}</h3>
          <strong>{{ activeExperience.company }}</strong>
          <p>{{ activeExperience.description }}</p>
        </article>
        <button
          type="button"
          class="illustrated-region journal-region--prev"
          :disabled="selectedExperience === 0"
          @click="selectedExperience--"
          aria-label="Previous role"
        >
          ‹
        </button>
        <button
          type="button"
          class="illustrated-region journal-region--next"
          :disabled="selectedExperience === experience.length - 1"
          @click="selectedExperience++"
          aria-label="Next role"
        >
          ›
        </button>
      </div>
    </div>
    <p class="section-hint">Pick a role, or flip pages with ‹ ›.</p>
  </section>
  <section v-else-if="section === 'achievements'">
    <h2 id="panel-heading" tabindex="-1">Always learning.</h2>
    <div class="medal-board">
      <p class="section-hint">A medal case of milestones earned so far — pick one to inspect it.</p>
      <div class="medal-layout">
        <div class="medal-grid">
          <button
            type="button"
            class="medal-pick"
            v-for="(item, index) in achievements"
            :key="item.id"
            :aria-pressed="index === selectedAchievement"
            @click="selectedAchievement = index"
          >
            <span
              class="medal-icon"
              :class="`medal-icon--${item.tier}`"
              role="img"
              :aria-label="`${item.tier} medal`"
            ></span>
            <strong>{{ item.title }}</strong>
            <small>{{ item.category }}</small>
          </button>
        </div>
        <aside class="medal-inspector" v-if="activeAchievement">
          <img
            v-if="activeAchievement.logo"
            :src="activeAchievement.logo"
            :alt="activeAchievement.title"
          />
          <small>{{ activeAchievement.category }} · {{ activeAchievement.date }}</small>
          <h3>{{ activeAchievement.title }}</h3>
          <strong>{{ activeAchievement.meta }}</strong>
          <p v-if="activeAchievement.description">{{ activeAchievement.description }}</p>
        </aside>
      </div>
    </div>
  </section>
  <section v-else>
    <h2 id="panel-heading" tabindex="-1">Let’s build something.</h2>
    <div class="illustrated-wrap">
      <div class="portal-panel illustrated-panel">
        <div class="illustrated-region portal-region--letter">
          <p>
            Have an idea for software, an interface, or connected hardware?
            I’d love to hear about it.
          </p>
          <a href="mailto:aldrinjay.delosreyes17@gmail.com"
            >Send me an email ↗</a
          >
          <p class="email">aldrinjay.delosreyes17@gmail.com</p>
          <div class="links">
            <a
              href="https://github.com/Aldrin4197"
              target="_blank"
              rel="noreferrer"
              >GitHub ↗</a
            ><a
              href="https://www.linkedin.com/in/aldrin-jay-delos-reyes-559817267/"
              target="_blank"
              rel="noreferrer"
              >LinkedIn ↗</a
            ><a
              href="https://www.facebook.com/drindlr"
              target="_blank"
              rel="noreferrer"
              >Facebook ↗</a
            >
          </div>
        </div>
        <div class="illustrated-region portal-region--address">
          <small>Find me online</small>
        </div>
      </div>
    </div>
  </section>
</template>
