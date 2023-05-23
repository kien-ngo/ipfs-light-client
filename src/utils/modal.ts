export const closePopup = (htmlFor: string) => {
  if (!htmlFor) return alert("Error: missing popup id");
  const _switch = document.getElementById(htmlFor) as HTMLInputElement;
  if (!_switch) return alert("Could not find popup id: " + htmlFor);
  _switch.checked = false;
};
