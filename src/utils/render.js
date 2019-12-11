export const RenderPosition = {
  BEFOREEND: `beforeend`,
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
};

export const createElement = (template) => {
  const container = document.createElement(`div`);
  container.innerHTML = template;

  return container.firstChild;
};


export const render = (node, component, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      node.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      node.append(component.getElement());
      break;
    case RenderPosition.AFTEREND:
      node.after(component.getElement());
      break;
  }
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};
