const response = await fetch("https://jsonplaceholder.tycode.com/posts/1");
console.log(response);
const json = await response.json();