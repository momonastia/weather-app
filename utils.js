const c = (el) => document.createElement(el);

const q = (el) => document.querySelector(el);

const GET = async (URL) => {
  const response = await fetch(URL);
  return await response.json();
};

export { c, q, GET };
