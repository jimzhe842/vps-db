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
    wrapper.className = "outer";
    let payloadTitle = document.createElement("h5");
    h5.textContent = "Payload";
    h5.className = "payload-title";
    let ul = document.createElement("ul");
    for (prop of Object.keys(payload)) {
      let pair = document.createElement("li");
      pair.className = "inner"
      pair.innerHTML = `<h5>${prop}</h5><p>${payload[prop]}</p>`;
      ul.appendChild(pair);
    }
    wrapper.appendChild(payloadTitle);
    wrapper.appendChild(ul);
    payloadsList.appendChild(wrapper);
    console.log(true);
  });
});