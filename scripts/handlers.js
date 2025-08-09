$(document).ready(function () {
  const menuList = $(".header-nav .menu-list");
  menuList.hide();
  const wrapperMenuImage = $(".header-nav .wrapper-menu-image");

  wrapperMenuImage.click(function () {
    $(this).toggleClass("open");
    menuList.slideToggle(300);
  });

  menuList.on("click", ".list-item", function () {
    const target = $(this).data("target")?.toLowerCase() || "";
    const $games = $(".link-game");
    menuList.slideToggle(300);
    wrapperMenuImage.toggleClass("open");

    // Oculta todos a la vez
    $games.fadeOut(200);

    // Después de 500ms, muestra los que coinciden
    setTimeout(function () {
      $games.each(function () {
        const types = ($(this).data("type") || "")
          .split(",")
          .map(t => t.trim().toLowerCase());

        if (target === "all" || types.includes(target)) {
          $(this).fadeIn(300);
        }
      });
    }, 500);
  });
});
