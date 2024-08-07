// https://deckmaster.info/sets.php
const editions = require('./data/SetList.json');
var edition
const vRegEx = /\(.*\)/
const findByCode = (set) => {
  console.log(editions.data)
  console.log(editions.data.find(({ code }) => code === set))
  return editions.data.find(({ code }) => code === set);
}
const findBySetName = (setName) => {
  console.log(setName)
  return editions.data.find(({ name }) => name === setName);
}




export const buildBasicList = (data) => {
  if (data) {
    return data.map(card => {
      return `${card.quantity} ${card.name}`;
    }).join('\n');
  }
}

export const buildTcg = (data) => {
  if (data) {
    return data.map(card => {
      return `${card.quantity} ${card.name} [${card.edition ? card.edition.productCode : ''}]`;
    }).join('\n');
  }
}

export const buildCardKingdom = (data) => {
  if (data) {
    data = data.map(card => {
      edition = card.edition.name
      if (vRegEx.test(card.name)){
        edition = card.edition.name + " Variants"
      }
      return `"${card.name}", ${card.edition ? edition : ''}, 0, ${card.quantity}`;
    });
    data.unshift('title,edition,foil,quantity')
    return data.join('\n');
  }
}

export const buildDeckbox = (data, coindition = '', language = '', foil = null) => {
  if (data) {
    data = data.map(card => {
      return `${card.quantity},"${card.name}",${card.edition ? card.edition.name : ''},${coindition},${language},${foil ? 'foil' : ''}`;
    });
    data.unshift('Count,Name,Edition,Condition,Language,Foil')
    return data.join('\n');
  }
}

export const tcgInput = (input) => {
  if (input) {
    const parsedData = [];
    let array = input.match(/[^\r\n]+/g);

    array.forEach(line => {
      if (line.match(/(\d*) (.*) \[(.*)\]/)) {
        let regexp = /(\d*) (.*) \[(.*)\]/;
        let matchAll = line.match(regexp);
        let edition = findByCode(matchAll[3]);
        parsedData.push({
          name: matchAll[2],
          edition,
          quantity: matchAll[1],
          foil: null
        });
      }
    });

    return parsedData;
  }
}

export const basicListInput = (input, set) => {
  if (input) {
    const parsedData = [];
    let array = input.match(/[^\r\n]+/g);
    array.forEach(line => {

      let count = '';
      let name = line.split(/(\s+)/).filter((e) => { return e.trim().length > 0; }).map(slice => {
        var matches = slice.match(/(\d+)/);
        if (matches) {
          count = matches[0]
          return '';
        }
        return slice;
      }).join(' ').trim();

      parsedData.push({
        name,
        edition: findByCode(set),
        quantity: count,
        foil: null
      })
    });

    return parsedData;
  }
}

export const deckBoxInput = (input) => {
  if (input) {
    const parsedData = [];
    let array = input.match(/[^\r\n]+/g);
    array.forEach(line => {
      let card = line.match(/(,|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^",\r\n]*))/g).map(elm => elm.replace(/^(,)/,""));
      console.log(card)

      parsedData.push({
        name: card[2],
        edition: findBySetName(card[3]),
        quantity: card[0],
        foil: card[7],
      })

    });

    return parsedData;
  }
}
