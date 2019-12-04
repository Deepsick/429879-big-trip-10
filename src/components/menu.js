const createTabMarkup = (menuItem) => {
  const {title, link, active} = menuItem;

  return `<a class="trip-tabs__btn  ${active ? `trip-tabs__btn--active` : ``}" href="${link}">${title}</a>`;
};

export const getMenuElement = (menuItems) => {
  const menu = menuItems.map((menuItem) => createTabMarkup(menuItem));
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${menu}
    </nav>`
  );
};
