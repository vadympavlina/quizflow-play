// Порядок, назви й колір плитки героїв (id мають збігатися з ключами HEROES у heroes.mjs).
export const LIST = [
  ["cat", "Кіт", "#FFE3BD"],
  ["dog", "Пес", "#F6E1C3"],
  ["bear", "Ведмідь", "#EAD3BA"],
  ["panda", "Панда", "#DCEBDD"],
  ["fox", "Лис", "#FFD8BF"],
  ["bunny", "Зайчик", "#E9E3F6"],
  ["wolf", "Вовк", "#DCE5F2"],
  ["raccoon", "Єнот", "#E7E1F0"],
  ["lion", "Лев", "#FFE8B5"],
  ["tiger", "Тигр", "#FFE2C4"],
  ["koala", "Коала", "#E1E9EF"],
  ["pig", "Свинка", "#FFD9E6"],
  ["monkey", "Мавпа", "#EBD8C0"],
  ["frog", "Жабка", "#D9F2D4"],
  ["owl", "Сова", "#EBDCC4"],
  ["penguin", "Пінгвін", "#D8E8F8"],
  ["chick", "Курча", "#FFF0B5"],
  ["unicorn", "Єдиноріг", "#F5E3FB"],
  ["dragon", "Дракон", "#D8F2CF"],
  ["monster", "Монстрик", "#E6D9FA"],
  ["alien", "Прибулець", "#D6F5D9"],
  ["robot", "Робот", "#DDE6F0"],
  ["ghost", "Привид", "#CBC5EE"],
  ["hamster", "Хом'ячок", "#FFE6CC"],
];
// Ручні підгонки розміру капелюхів для героїв із нетиповою головою (ключ: герой або герой:капелюх).
export const HAT_OV = { lion: { sc: 1.3 }, robot: { sc: 1.2 }, ghost: { sc: 1.1 } };
