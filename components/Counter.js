export default function Counter() {
  return {
    template: `
      <div class="counter-component">
        <h3>{{counter.label}}</h3>
        <p>Count is <strong>{{counter.value}}</strong></p>
        <p>Step: {{counter.step}}</p>
        <button id="incBtn">+{{counter.step}}</button>
        <button id="decBtn">-{{counter.step}}</button>
        <button id="resetBtn">Reset</button>
        <button id="stepBtn">Change Step</button>
      </div>
    `,
    init(store, bus, root) {
      root.querySelector("#incBtn").onclick = () => {
        store.counter.value += store.counter.step;
        bus.emit("counter:changed", { 
          value: store.counter.value, 
          action: "increment" 
        });
      };
      
      root.querySelector("#decBtn").onclick = () => {
        store.counter.value -= store.counter.step;
        bus.emit("counter:changed", { 
          value: store.counter.value, 
          action: "decrement" 
        });
      };
      
      root.querySelector("#resetBtn").onclick = () => {
        store.counter.value = 0;
        bus.emit("counter:changed", { 
          value: store.counter.value, 
          action: "reset" 
        });
      };
      
      root.querySelector("#stepBtn").onclick = () => {
        store.counter.step = store.counter.step === 1 ? 5 : 1;
        bus.emit("counter:step-changed", store.counter.step);
      };
    }
  };
}
