document.addEventListener('DOMContentLoaded', () => {
  let uuidElement = document.querySelector("#uuid");
  if (!uuidElement) { return }
  const socket = io("http://localhost:3000");
  // console.log("doge");
  socket.on("connection");
  socket.on("newPayload", ({uuid, payload}) => {
    console.log("new");
    if (uuidElement.textContent !== uuid) { return }
    const payloadsList = document.querySelector("#payloads-list");
    let wrapper = document.createElement("li");
    let ul = document.createElement("ul");
    for (prop of Object.keys(payload)) {
      let pair = document.createElement("li");
      pair.innerHTML = `<h5>${prop}</h5><p>${payload[prop]}</p>`;
      ul.appendChild(pair);
    }
    wrapper.appendChild(ul);
    payloadsList.appendChild(wrapper);
    console.log(true);
  });
});