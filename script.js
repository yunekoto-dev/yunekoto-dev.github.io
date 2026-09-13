const out = document.getElementById("terminalOutput");
const input = document.getElementById("terminalInput");
const ghost = document.getElementById("autocompleteGhost");

const COMMANDS = [
  ["b64", "b64 [string]", "Encode to Base64 format", "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b68cff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='16 18 22 12 16 6'/><polyline points='8 6 2 12 8 18'/></svg>"],
  ["clear", "clear", "Clear the terminal screen", "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b68cff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z'/><line x1='18' y1='9' x2='12' y2='15'/><line x1='12' y1='9' x2='18' y2='15'/></svg>"],
  ["db64", "db64 [base64]", "Decode from Base64 format", "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b68cff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='11' width='18' height='11' rx='2' ry='2'/><path d='M7 11V7a5 5 0 0 1 9.9-1'/></svg>"],
  ["date", "date", "Display the current date and time", "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b68cff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg>"],
  ["echo", "echo [arg ...]", "Write arguments to the standard output.", "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b68cff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'/></svg>"],
  ["github", "github", "Open Yunekoto's GitHub profile", "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b68cff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22'/></svg>"],
  ["help", "help", "List all available commands", "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b68cff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'/><line x1='12' y1='17' x2='12.01' y2='17'/></svg>"],
  ["myip", "myip", "Return your IPv4", "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b68cff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><line x1='2' y1='12' x2='22' y2='12'/><path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/></svg>"],
  ["projects", "projects", "Display a list of my major projects.", "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b68cff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'/></svg>"],
  ["random", "random <num>", "Return a pseudo-random number between 0 and 1, or try to predict the result!", "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b68cff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='20' height='20' rx='5' ry='5'/><path d='M16 8h.01'/><path d='M8 8h.01'/><path d='M12 12h.01'/><path d='M16 16h.01'/><path d='M8 16h.01'/></svg>"],
];

const commandMap = new Map(COMMANDS.map(c => [c[0], c]));
const commandNames = COMMANDS.map(c => c[0]).sort();
const history = [];
let historyIndex = -1;

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[c]));
}

function scrollTerminal(){
  const base = out.parentElement;
  base.scrollTop = base.scrollHeight;
}

function appendLine(html = "", cls = ""){
  const line = document.createElement("div");
  line.className = `terminal-line ${cls}`;
  line.innerHTML = html;
  out.appendChild(line);
  scrollTerminal();
  return line;
}

function promptHtml(command){
  return `<span class="prompt-blue">yunekoto</span>@<span class="prompt-pink">yunekoto</span>:~$ ${escapeHtml(command)}`;
}

function appendCommand(command){
  appendLine(promptHtml(command), "terminal-command");
}

function outputText(text){
  appendLine(escapeHtml(text));
}

function outputHtml(html){
  appendLine(html);
}

function icon(name){
  const svgUrl = commandMap.get(name)?.[3];
  if(!svgUrl) return `<span class="help-icon">◇</span>`;
  return `<img class="help-icon-svg" src="${svgUrl}" alt="" />`;
}

function showHelp(){
  outputHtml(
    `<div class="help-block">
      <div class="help-version">Web bash by Yunekoto, version 1.0.0-release</div>
      <div class="help-note">These shell commands are defined internally. Type 'help' to see this list.</div>
      ${COMMANDS.map(c =>
        `<div class="help-row">${icon(c[0])}<span class="help-command">${escapeHtml(c[1])}</span><span>${escapeHtml(c[2])}</span></div>`
      ).join("")}
    </div>`
  );
}

function showInfo(){
  outputHtml(`
    <div class="info-block">
      <div><span class="prompt-blue">Yunekoto</span> — Developer · Creator · Builder</div>
      <div>Build what you wish already existed.</div>
    </div>
  `);
}

async function showProjects() {
  outputText("Fetching GitHub projects...");
  try {
    const response = await fetch("https://api.github.com/users/yunekoto-dev/repos?sort=updated&per_page=12");
    if(!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    const repos = await response.json();
    const visible = repos.filter(r => !r.fork).slice(0, 10);
    if(!visible.length) {
      outputText("No public projects found.");
      return;
    }

    const githubIconSvg = `<svg class="project-github-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`;
    const starIconSvg = `<svg class="project-stat-icon star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
    const forkIconSvg = `<svg class="project-stat-icon fork" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`;

    outputHtml(`
      <div class="projects-container">
        ${visible.map(r => `
          <div class="project-item">
            <div class="project-header">
              <div class="project-title-group">
                ${githubIconSvg}
                <a href="${escapeHtml(r.html_url)}" target="_blank" rel="noopener noreferrer" class="project-name-link">
                  ${escapeHtml(r.name)}
                </a>
              </div>
              <div class="project-stats-badge">
                [ ${starIconSvg} <span>${r.stargazers_count}</span> <span class="divider">|</span> ${forkIconSvg} <span>${r.forks_count}</span> ]
              </div>
            </div>
            <div class="project-description">
              <span class="bullet">•</span> ${escapeHtml(r.description || "No description provided.")}
            </div>
          </div>
        `).join("")}
      </div>
    `);
  } catch(err) {
    outputText(`Error: ${err.message}`);
  }
}

function updateAutocomplete(){
  const value = input.value;
  ghost.textContent = "";

  // Masquer si le champ est vide ou si l'utilisateur tape des espaces (commande + args)
  if(!value || /\s/.test(value)) return;

  const valLower = value.toLowerCase();
  const match = commandNames.find(name => name.startsWith(valLower) && name !== valLower);

  if(match){
    // Récupère exactement le texte saisi par l'utilisateur + la fin de la commande trouvée
    ghost.textContent = value + match.slice(value.length);
  }
}

function acceptAutocomplete(){
  const value = input.value.trim().toLowerCase();
  if(!value || /\s/.test(value)) return false;

  const match = commandNames.find(name => name.startsWith(value) && name !== value);
  if(!match) return false;

  input.value = match;
  updateAutocomplete();
  input.setSelectionRange(input.value.length, input.value.length);
  return true;
}

async function runCommand(event){
  if(event) event.preventDefault();

  const raw = input.value.trim();
  if(!raw){
    input.focus();
    return false;
  }

  const parts = raw.split(/\s+/);
  const command = parts.shift().toLowerCase();
  const args = parts;

  history.unshift(raw);
  historyIndex = -1;
  appendCommand(raw);

  switch(command){
    case "help":
      showHelp();
      break;

    case "myip":
      outputText("Please wait...");
      try {
        const response = await fetch("https://api.ipify.org/");
        if(!response.ok) throw new Error("Unable to retrieve your IPv4");
        outputText(await response.text());
      } catch(err) {
        outputText(`Error: ${err.message}`);
      }
      break;

    case "echo":
      outputText(args.length ? raw.slice(raw.indexOf(" ") + 1) : "");
      break;

    case "projects":
      await showProjects();
      break;

    case "b64":
      if(!args.length){ outputText("Error: Empty string"); break; }
      try {
        const text = raw.slice(raw.indexOf(" ") + 1);
        outputText(btoa(unescape(encodeURIComponent(text))));
      } catch(err) { outputText(`Error: ${err.message}`); }
      break;

    case "db64":
      if(!args.length){ outputText("Error: Empty string"); break; }
      try {
        const text = raw.slice(raw.indexOf(" ") + 1);
        outputText(decodeURIComponent(escape(atob(text))));
      } catch(err) { outputText("Error: Invalid Base64 string"); }
      break;

    case "random":
      outputText(Math.random());
      break;

    case "github":
      outputHtml(`<a href="https://github.com/yunekoto-dev" target="_blank" rel="noopener noreferrer">https://github.com/yunekoto-dev</a>`);
      break;

    case "clear":
      out.innerHTML = "";
      break;

    case "date":
      outputText(new Date().toString());
      break;

    default:
      outputText(`Command not found: ${raw}`);
      break;
  }

  input.value = "";
  updateAutocomplete();
  input.focus();
  scrollTerminal();
  return false;
}

function focusTerminal(){
  input.focus();
}

input.addEventListener("input", updateAutocomplete);

input.addEventListener("keydown", event => {
  if(event.key === "Enter"){
    event.preventDefault();
    runCommand(event);
  } else if(event.key === "Tab"){
    event.preventDefault();
    acceptAutocomplete();
  } else if(event.key === "ArrowUp"){
    event.preventDefault();
    if(history.length){
      historyIndex = Math.min(historyIndex + 1, history.length - 1);
      input.value = history[historyIndex];
      updateAutocomplete();
    }
  } else if(event.key === "ArrowDown"){
    event.preventDefault();
    if(historyIndex > 0){
      historyIndex--;
      input.value = history[historyIndex];
    } else {
      historyIndex = -1;
      input.value = "";
    }
    updateAutocomplete();
  }
});

document.addEventListener("keydown", event => {
  if(document.activeElement !== input && (event.key.length === 1 || event.key === "Backspace")){
    input.focus();
  }
});











async function loadRepos() {
  const repoContainer = document.getElementById("repos");
  const countEl = document.getElementById("repoCount");
  const followersEl = document.getElementById("followers");
  const followingEl = document.getElementById("following");
  const starsEl = document.getElementById("stars");

  if (repoContainer) {
    repoContainer.innerHTML = '<div class="loading">Fetching from GitHub API...</div>';
  }

  try {
    // 1. Récupération des infos du profil
    const userRes = await fetch("https://api.github.com/users/yunekoto-dev");
    if (!userRes.ok) throw new Error("Erreur profil GitHub");
    const userData = await userRes.json();

    if (countEl) countEl.textContent = userData.public_repos;
    if (followersEl) followersEl.textContent = userData.followers;
    if (followingEl) followingEl.textContent = userData.following;

    // 2. Récupération des dépôts public
    const reposRes = await fetch("https://api.github.com/users/yunekoto-dev/repos?sort=updated&per_page=6");
    if (!reposRes.ok) throw new Error("Erreur dépôts GitHub");
    const reposData = await reposRes.json();

    // Calcul du nombre d'étoiles totales
    const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
    if (starsEl) starsEl.textContent = totalStars;

    // 3. Affichage des dépôts dans la section
    if (repoContainer) {
      if (reposData.length === 0) {
        repoContainer.innerHTML = '<div class="loading">Aucun dépôt disponible.</div>';
        return;
      }

      repoContainer.innerHTML = reposData.map(repo => `
        <div class="repo">
          <div>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
            <p>${repo.description || "Pas de description."}</p>
          </div>
          <div class="repo-meta">
            <span>★ ${repo.stargazers_count}</span>
            <br>
            <span>${repo.language || "Texte"}</span>
          </div>
        </div>
      `).join("");
    }
  } catch (err) {
    if (repoContainer) {
      repoContainer.innerHTML = `<div class="loading">Erreur : ${err.message}</div>`;
    }
  }
}

// Charger automatiquement les données GitHub au chargement de la page
window.addEventListener("DOMContentLoaded", () => {
  loadRepos();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

window.addEventListener("load", () => input.focus({ preventScroll: true }));
