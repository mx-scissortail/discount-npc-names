import * as next from './generators.js';

const sentinel = document.querySelector("#scroll-sentinel");
const list = document.querySelector("#list");

const h = (className, ...children) => `<div class="${className}">${children.join('')}</div>`;
const text = (value) => h("text", value);


let i = 0;

const observer = new IntersectionObserver(() => {
  if (i > 250) return;
  const limit = i + 10;
  for (; i < limit; i++) {
    list.insertAdjacentHTML("beforeend", genNPC());
  }

  const npcs = document.querySelectorAll(".npc");

  npcs.forEach((element) => {
    element.onclick = () => unfold(element);
  })
});

observer.observe(sentinel);

function unfold (element) {
  const [main, info] = [ ...element.children];

  if (info.classList.contains("placeholder")) {
    main.classList.add('expanded');

    const rows = [
      ["Class", next.job()],
      ...getInfo()
    ];

    info.remove();
    element.insertAdjacentHTML("beforeend",
      h("info card",
        
          h("table",
            h("title column", ...rows.map(([title, ]) => text(title + ':'))),
            h("value column", ...rows.map(([, value]) => text(value)))
          )
        )
    );
  }
}

function genNPC () {
  const rows = [
    getStat(),
    getStat(),
    getStat(),
    getStat()
  ];

  return (
    h("npc",
      h("main card",
        h("name", text(next.name())),
        h("table",
          h("title column", ...rows.map(([title, ]) => text(title + ':'))),
          h("value column", ...rows.map(([, value]) => text(value)))
        )
      ),
      h("info placeholder", text(". . . c l i c k   t o   e x p a n d . . ."))
    )
  );
}

function die (sides) {
  return Math.ceil(Math.random() * sides);
}

function choose (array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getStat () {
  let stat = next.stat();
  if (stat === "Vertical Leap") {
    return [stat, 8];
  } else if (stat === "Problems") {
    return [stat, choose([99, 0, 1])];
  } else if (die(20) === 1) {
    return [stat, choose([die(5)+"-ish", "2d6", "3d6", "4d8", "2d10", "2d6 + 2", "+" + die(5), "-" + die(5)]), "none"]; 
  }
  return [stat, die(10) + die(11) - 1];
}

function getInfo () {
  const options = [
    () => ["Status", next.status()],
    () => ["Modifier", `${choose(["+1", "+1", "+1", "+1", "+2", "-1"])} to ${next.bonus()}`],
    () => ["Affiliation", next.affiliation()],
    () => ["Signature Spell", next.spell()],
    () => ["Inventory", getInventory()]
  ];

  options.splice(Math.floor(Math.random()*options.length), 1);
  options.splice(Math.floor(Math.random()*options.length), 1);

  return options.map(x => x());
}

function getInventory () {
  let items = [next.item()];
  let chance = 0.8;
  while (Math.random() < chance) {
    items.push(next.item());
    chance = chance * chance;
  }

  return items.join(",\n");
}
