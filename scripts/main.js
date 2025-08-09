const username = "Roissm90";
const favicon = "favicon.ico";
const imageDefault = "./public/joystick.png";

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/game/g, "")
    .replace(/-/g, " ")
    .split(" ")
    .filter((word) => word.trim() !== "")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Función async para comprobar si la imagen existe
async function checkImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

// Función principal asíncrona
async function renderRepos() {
  try {
    const response = await $.ajax({
      url: `https://api.github.com/users/${username}/repos?per_page=100`,
      method: "GET",
      headers: {
        Accept: "application/vnd.github.mercy-preview+json",
      },
    });

    const wrapperGames = $("#gamesWrapper .container-grid");
    const menuList = $(".header-nav .menu-list .container-grid");
    const allTopics = new Set();

    for (const repo of response) {
      if (repo.topics.includes("games")) {
        console.log("name:" + repo.name);
        console.log("topic: " + repo.topics);
        const repoURL = `https://${username}.github.io/${repo.name}/`;
        const finalRepoName = normalizeText(repo.name);
        const faviconUrl = repoURL + favicon;
        const description = repo.description;
        const dataType = repo.topics
          .filter((topic) => topic !== "games")
          .join(",");

        repo.topics.forEach((topic) => {
          if (topic !== "games") {
            allTopics.add(topic);
          }
        });

        const exists = await checkImage(faviconUrl);
        const imgSrc = exists ? faviconUrl : imageDefault;

        wrapperGames.append(`
          <a href="${repoURL}" class="link-game" data-type="${dataType}">
            <img src="${imgSrc}" class="picture" alt="${repo.name}" title="${repo.name}"/>
            <h2 class="name-game">${finalRepoName}</h2>
            <p class="description-game">${description}</p>
          </a>
        `);
      }
    }

    //generar items de menu en base a categorias
    allTopics.forEach((topic) => {
      const finalText = normalizeText(topic);
      menuList.append(
        `<li class="list-item" data-target="${topic}">${finalText}</li>`
      );
    });
  } catch (error) {
    $("#gamesWrapper").append("<p>Error al cargar los repositorios.</p>");
    console.error(error);
  }
}

// Ejecutar
renderRepos();
