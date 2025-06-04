const h = (className, ...children) => `<div class="${className}">${children.join('')}</div>`;
const text = (value) => h("text", value);

export const NPCMarkup = (rows) => {
  return (
    h("npc",
      h("main",
        h("table",
          h("title column", ...rows.map(([title, ]) => text(title + ':'))),
          h("value column", ...rows.map(([, value]) => text(value)))
        )
      )
    )
  )
};

